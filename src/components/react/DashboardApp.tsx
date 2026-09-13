import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { ordersStore, orderStatusLabels, startOrderPolling, statusStepsFor, updateOrderStatus, type Order, type OrderStatus } from '@/lib/orders';
import { formatPrice } from '@/lib/format';

const columns: OrderStatus[] = ['new', 'preparing', 'ready', 'out_for_delivery', 'completed'];

export default function DashboardApp() {
  const orders = useStore(ordersStore);
  const [loaded, setLoaded] = useState(false);

  // Orders live in shared Blob storage now (not localStorage), so this
  // polls for changes made from any device — a customer's phone included.
  useEffect(() => {
    setLoaded(false);
    const stop = startOrderPolling();
    const markLoaded = setTimeout(() => setLoaded(true), 400);
    return () => {
      stop();
      clearTimeout(markLoaded);
    };
  }, []);

  if (loaded && orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-4xl">🧾</p>
        <p className="text-charcoal-900/60">Noch keine Bestellungen. Sobald ein Kunde bestellt, erscheint sie hier.</p>
        <a href="/menu" className="btn-outline">Testbestellung aufgeben</a>
      </div>
    );
  }

  if (!loaded) return null;

  return (
    <div className="grid grid-cols-1 gap-5 overflow-x-auto pb-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-4">
      {columns.map((status) => {
        const columnOrders = orders.filter((o) => o.status === status);
        return (
          <div key={status} className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-charcoal-900">{orderStatusLabels[status]}</h2>
              <span className="rounded-full bg-charcoal-900/10 px-2 py-0.5 text-xs font-medium text-charcoal-900/60">
                {columnOrders.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {columnOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {columnOrders.length === 0 && (
                <div className="rounded-xl border border-dashed border-charcoal-900/15 py-6 text-center text-xs text-charcoal-900/30">
                  Keine Bestellungen
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const time = new Date(order.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-xl2 bg-white p-4 shadow-card ring-1 ring-charcoal-900/[0.04]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold text-charcoal-900">#{order.id}</p>
          <p className="text-xs text-charcoal-900/50">{time} Uhr · {order.fulfilment === 'delivery' ? 'Lieferung' : 'Abholung'}</p>
        </div>
        <span className="whitespace-nowrap text-sm font-semibold text-charcoal-900">{formatPrice(order.total)}</span>
      </div>

      <p className="mt-3 text-sm font-medium text-charcoal-900">
        {order.contact.firstName} {order.contact.lastName}
      </p>
      <p className="text-xs text-charcoal-900/50">{order.contact.phone}</p>
      {order.address && (
        <p className="mt-1 text-xs text-charcoal-900/50">
          {order.address.street} {order.address.houseNumber}, {order.address.postalCode} {order.address.city}
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-1 border-t border-charcoal-900/10 pt-3 text-xs text-charcoal-900/70">
        {order.items.map((item) => (
          <li key={item.lineId}>
            {item.quantity}× {item.name}
            {item.size ? ` (${item.size.label})` : ''}
            {item.extras.length > 0 ? ` — ${item.extras.map((e) => e.label).join(', ')}` : ''}
          </li>
        ))}
      </ul>

      {order.specialInstructions && (
        <p className="mt-2 rounded-lg bg-cream-100 px-2.5 py-1.5 text-xs italic text-charcoal-900/70">
          „{order.specialInstructions}“
        </p>
      )}

      <StatusChecklist order={order} />
    </div>
  );
}

// Tap-to-tick progress control: staff tap the next step to advance the
// order (or tap backwards to correct a mistake). Only shows the steps that
// actually apply to this order's fulfilment type (delivery vs. pickup) —
// the same sequence the customer sees live on their confirmation page.
function StatusChecklist({ order }: { order: Order }) {
  const steps = statusStepsFor(order.fulfilment);
  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="mt-3 flex items-center justify-between border-t border-charcoal-900/10 pt-3">
      {steps.map((step, i) => (
        <button
          key={step}
          onClick={() => updateOrderStatus(order.id, step)}
          className="group flex flex-1 flex-col items-center gap-1.5"
          aria-label={`Als „${orderStatusLabels[step]}“ markieren`}
          aria-pressed={i === currentIndex}
        >
          <div className="flex w-full items-center">
            <div className={`h-px flex-1 ${i === 0 ? 'invisible' : i <= currentIndex ? 'bg-tomato-500' : 'bg-charcoal-900/15'}`} />
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= currentIndex
                  ? 'bg-tomato-500 text-white'
                  : 'bg-charcoal-900/10 text-charcoal-900/40 group-hover:bg-charcoal-900/20'
              }`}
            >
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <div className={`h-px flex-1 ${i === steps.length - 1 ? 'invisible' : i < currentIndex ? 'bg-tomato-500' : 'bg-charcoal-900/15'}`} />
          </div>
          <p className={`text-center text-[10px] font-medium leading-tight ${i <= currentIndex ? 'text-charcoal-900' : 'text-charcoal-900/40'}`}>
            {orderStatusLabels[step]}
          </p>
        </button>
      ))}
    </div>
  );
}
