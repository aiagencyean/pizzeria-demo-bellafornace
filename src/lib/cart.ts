import { persistentAtom } from '@nanostores/persistent';
import { atom, computed } from 'nanostores';
import type { ExtraOption, SizeOption } from '@/data/menu';
import { restaurant } from '@/data/restaurant.config';

export interface CartLine {
  lineId: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  size?: SizeOption;
  extras: ExtraOption[];
  notes?: string;
}

export interface AddToCartInput {
  itemId: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  size?: SizeOption;
  extras: ExtraOption[];
  notes?: string;
}

// Persisted to localStorage under this key, encoded as JSON. Survives
// reloads and navigation between /menu, /checkout, etc. — this is a
// client-only demo cart, not a server-backed one.
export const cartStore = persistentAtom<CartLine[]>('bella-fornace:cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

function buildLineId(input: AddToCartInput): string {
  const extrasKey = input.extras
    .map((e) => e.id)
    .sort()
    .join(',');
  return [input.itemId, input.size?.id ?? 'default', extrasKey, input.notes ?? ''].join('::');
}

function unitPriceFor(input: AddToCartInput): number {
  const sizeDelta = input.size?.priceDelta ?? 0;
  const extrasDelta = input.extras.reduce((sum, e) => sum + e.priceDelta, 0);
  return input.basePrice + sizeDelta + extrasDelta;
}

export function addToCart(input: AddToCartInput) {
  const lineId = buildLineId(input);
  const unitPrice = unitPriceFor(input);
  const lines = cartStore.get();
  const existing = lines.find((l) => l.lineId === lineId);

  if (existing) {
    cartStore.set(
      lines.map((l) => (l.lineId === lineId ? { ...l, quantity: l.quantity + input.quantity } : l))
    );
    return;
  }

  cartStore.set([
    ...lines,
    {
      lineId,
      itemId: input.itemId,
      name: input.name,
      image: input.image,
      unitPrice,
      quantity: input.quantity,
      size: input.size,
      extras: input.extras,
      notes: input.notes,
    },
  ]);
}

export function setLineQuantity(lineId: string, quantity: number) {
  if (quantity <= 0) {
    removeLine(lineId);
    return;
  }
  cartStore.set(cartStore.get().map((l) => (l.lineId === lineId ? { ...l, quantity } : l)));
}

export function removeLine(lineId: string) {
  cartStore.set(cartStore.get().filter((l) => l.lineId !== lineId));
}

export function clearCart() {
  cartStore.set([]);
}

export const cartCount = computed(cartStore, (lines) => lines.reduce((sum, l) => sum + l.quantity, 0));

export const cartSubtotal = computed(cartStore, (lines) =>
  lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
);

// Whether the cart drawer/bottom-sheet is open — shared across the header
// cart button and the drawer component, which live in different islands.
export const isCartOpen = atom(false);
export const openCart = () => isCartOpen.set(true);
export const closeCart = () => isCartOpen.set(false);

export function deliveryFeeFor(subtotal: number, fulfilment: 'delivery' | 'pickup'): number {
  if (fulfilment === 'pickup') return 0;
  if (subtotal >= restaurant.freeDeliveryThreshold) return 0;
  return restaurant.deliveryFee;
}
