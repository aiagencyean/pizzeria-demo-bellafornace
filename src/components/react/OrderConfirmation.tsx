import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { ordersStore, statusStepsFor, type OrderStatus } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { restaurant } from '@/data/restaurant.config';

// Customer-facing wording — friendlier than the kitchen's internal labels
// (see orderStatusLabels in src/lib/orders.ts).
const stepLabels: Record<OrderStatus, string> = {
  new: 'Eingegangen',
  preparing: 'In Zubereitung',
  ready: 'Abholbereit',
  out_for_delivery: 'Unterwegs',
  completed: 'Zugestellt',
};

export default function OrderConfirmation() {
  const [orderId, setOrderId] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrderId(new URLSearchParams(window.location.search).get('order') ?? '');
    setLoaded(true);
  }, []);

  // Live status: this reads the same shared order store the kitchen page
  // (/dashboard) writes to. @nanostores/persistent syncs localStorage
  // changes across browser tabs automatically, so as soon as staff ticks
  // off the next step on /dashboard in another tab, this page updates on
  // its own — no polling or refresh needed. (A production build would
  // back this with a real database + realtime channel instead of
  // localStorage, so it also works across separate devices.)
  const orders = useStore(ordersStore);
  const order = orders.find((o) => o.id === orderId);

  if (loaded && !order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-5xl">🔍</p>
        <p className="text-charcoal-900/70">Diese Bestellung konnten wir nicht finden.</p>
        <a href="/menu" className="btn-primary">Zur Speisekarte</a>
      </div>
    );
  }

  if (!order) return null;

  const steps = statusStepsFor(order.fulfilment);
  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-basil-500 text-3xl text-white shadow-lifted">
          ✓
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-charcoal-900">Bestellung bestätigt!</h1>
        <p className="mt-2 text-charcoal-900/60">Danke, {order.contact.firstName}! Deine Bestellnummer ist</p>
        <p className="mt-1 font-display text-2xl font-semibold text-tomato-600">#{order.id}</p>
        <p className="mt-3 text-sm text-charcoal-900/50">
          Geschätzte {order.fulfilment === 'delivery' ? 'Lieferzeit' : 'Abholzeit'}:{' '}
          {order.fulfilment === 'delivery'
            ? `${restaurant.estimatedDeliveryMinutes[0]}–${restaurant.estimatedDeliveryMinutes[1]} Min.`
            : `${restaurant.estimatedPickupMinutes[0]}–${restaurant.estimatedPickupMinutes[1]} Min.`}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-10 flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className={`h-px flex-1 ${i === 0 ? 'invisible' : i <= currentIndex ? 'bg-tomato-500' : 'bg-charcoal-900/15'}`} />
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i <= currentIndex ? 'bg-tomato-500 text-white' : 'bg-charcoal-900/10 text-charcoal-900/40'
                } ${i === currentIndex ? 'animate-pulse-slow' : ''}`}
              >
                {i < currentIndex ? '✓' : i + 1}
              </div>
              <div className={`h-px flex-1 ${i === steps.length - 1 ? 'invisible' : i < currentIndex ? 'bg-tomato-500' : 'bg-charcoal-900/15'}`} />
            </div>
            <p className={`mt-2 text-center text-[11px] font-medium leading-tight ${i <= currentIndex ? 'text-charcoal-900' : 'text-charcoal-900/40'}`}>
              {stepLabels[step]}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 rounded-2xl bg-white p-6 shadow-card ring-1 ring-charcoal-900/[0.04]">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">Bestellübersicht</h2>
        <ul className="mt-4 flex flex-col gap-3 border-b border-charcoal-900/10 pb-4">
          {order.items.map((line) => (
            <li key={line.lineId} className="flex justify-between gap-3 text-sm">
              <span className="text-charcoal-900/80">
                {line.quantity}× {line.name}
                {line.size ? ` (${line.size.label})` : ''}
                {line.extras.length > 0 ? ` — ${line.extras.map((e) => e.label).join(', ')}` : ''}
              </span>
              <span className="whitespace-nowrap font-medium text-charcoal-900">{formatPrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-charcoal-900/70">
            <span>Zwischensumme</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal-900/70">
            <span>Lieferung</span>
            <span>{order.deliveryFee === 0 ? 'Kostenlos' : formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-charcoal-900/10 pt-2 text-base font-semibold text-charcoal-900">
            <span>Gesamt</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-charcoal-900/10 pt-4 text-sm text-charcoal-900/70">
          <p className="font-medium text-charcoal-900">
            {order.fulfilment === 'delivery' ? 'Lieferadresse' : 'Abholadresse'}
          </p>
          {order.fulfilment === 'delivery' && order.address ? (
            <p className="mt-1">
              {order.address.street} {order.address.houseNumber}
              <br />
              {order.address.postalCode} {order.address.city}
            </p>
          ) : (
            <p className="mt-1">{restaurant.address.street}, {restaurant.address.postalCode} {restaurant.address.city}</p>
          )}
          {order.specialInstructions && <p className="mt-2 italic">„{order.specialInstructions}“</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <a href="/menu" className="btn-outline">Weiter bestellen</a>
        <a href="/" className="btn-ghost">Zur Startseite</a>
      </div>
    </div>
  );
}
