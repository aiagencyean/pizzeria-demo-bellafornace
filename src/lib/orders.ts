import { persistentAtom } from '@nanostores/persistent';
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

// ── Demo "database" ──────────────────────────────────────────────────
// This is a client-side, localStorage-backed store standing in for a real
// backend/database. It lets the /dashboard page demonstrate the restaurant
// order-management flow without provisioning infrastructure. Swap this
// module for real API calls (e.g. to /api/orders backed by a database)
// when connecting the template to production systems.

const ordersStore = persistentAtom<Order[]>('bella-fornace:orders', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

const orderCounter = persistentAtom<number>('bella-fornace:order-counter', 1048, {
  encode: String,
  decode: Number,
});

export function nextOrderNumber(): string {
  const next = orderCounter.get() + 1;
  orderCounter.set(next);
  return String(next);
}

export function saveOrder(order: Order) {
  ordersStore.set([order, ...ordersStore.get()]);
}

export function getOrders(): Order[] {
  return ordersStore.get();
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.get().find((o) => o.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  ordersStore.set(ordersStore.get().map((o) => (o.id === id ? { ...o, status } : o)));
}

export { ordersStore };
