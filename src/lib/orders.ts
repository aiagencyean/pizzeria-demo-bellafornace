import { atom } from 'nanostores';
import type { CartLine } from '@/lib/cart';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'Neu',
  preparing: 'In Zubereitung',
  ready: 'Fertig',
  out_for_delivery: 'Unterwegs',
  completed: 'Abgeschlossen',
};

export type Fulfilment = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'card' | 'paypal';

// The sequence of statuses an order actually moves through depends on
// fulfilment type: a delivery order never sits in "ready" (that's for
// pickup), a pickup order never goes "out for delivery". Both the kitchen
// board (/dashboard) and the customer's live status page (/order-confirmed)
// use this so they always show the same steps for a given order.
export const deliveryStatusSteps: OrderStatus[] = ['new', 'preparing', 'out_for_delivery', 'completed'];
export const pickupStatusSteps: OrderStatus[] = ['new', 'preparing', 'ready', 'completed'];

export function statusStepsFor(fulfilment: Fulfilment): OrderStatus[] {
  return fulfilment === 'delivery' ? deliveryStatusSteps : pickupStatusSteps;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  addressExtra?: string;
}

export interface Order {
  id: string; // human-facing order number, e.g. "1048"
  createdAt: string; // ISO timestamp
  status: OrderStatus;
  fulfilment: Fulfilment;
  paymentMethod: PaymentMethod;
  contact: { firstName: string; lastName: string; phone: string; email: string };
  address?: DeliveryAddress;
  specialInstructions?: string;
  items: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/** Everything needed to create an order — the server assigns id/createdAt/status. */
export type NewOrderInput = Omit<Order, 'id' | 'createdAt' | 'status'>;

// ── Shared "database" ────────────────────────────────────────────────
// Orders live in Vercel Blob storage (see src/pages/api/orders.ts), so the
// customer's phone and the restaurant's kitchen screen see the same data
// even on different devices/networks. This client-side store is just a
// local cache kept fresh by polling — it's what the UI actually reads
// reactively via useStore().

export const ordersStore = atom<Order[]>([]);

async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/orders', { cache: 'no-store' });
    if (!res.ok) return ordersStore.get();
    const data = await res.json();
    return data.orders ?? [];
  } catch {
    return ordersStore.get();
  }
}

/**
 * Starts polling /api/orders so the dashboard and the customer's live
 * status page pick up changes made from any other device. Call from a
 * useEffect and use the returned function to stop polling on unmount.
 */
export function startOrderPolling(intervalMs = 3000): () => void {
  let cancelled = false;
  const tick = async () => {
    const orders = await fetchOrders();
    if (!cancelled) ordersStore.set(orders);
  };
  tick();
  const id = window.setInterval(tick, intervalMs);
  return () => {
    cancelled = true;
    window.clearInterval(id);
  };
}

export interface CreateOrderResult {
  order: Order;
  demoMode: boolean;
  sent: boolean;
}

/** Creates the order server-side (id assigned there) and returns it. */
export async function createOrder(input: NewOrderInput): Promise<CreateOrderResult> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Bestellung konnte nicht übermittelt werden.');
  const data = await res.json();
  ordersStore.set([data.order, ...ordersStore.get()]);
  return data;
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.get().find((o) => o.id === id);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  // Optimistic local update so the tap feels instant; polling reconciles
  // it (and propagates it to other devices) shortly after.
  ordersStore.set(ordersStore.get().map((o) => (o.id === id ? { ...o, status } : o)));
  try {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  } catch {
    // Best-effort — the next successful poll will reflect the real state.
  }
}
