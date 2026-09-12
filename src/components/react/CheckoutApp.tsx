import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { addToCart, cartStore, cartSubtotal, clearCart, deliveryFeeFor, removeLine, setLineQuantity } from '@/lib/cart';
import { nextOrderNumber, saveOrder, type DeliveryAddress, type Fulfilment, type Order, type PaymentMethod } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { restaurant } from '@/data/restaurant.config';
import { getItemById, getItemsByCategory, type MenuCategory } from '@/data/menu';

// Categories we gently suggest at checkout when the customer hasn't added
// anything from them yet — e.g. nudge a drink if the cart has none.
const upsellCategories: MenuCategory[] = ['drinks', 'desserts'];

const emptyAddress: DeliveryAddress = {
  firstName: '',
  lastName: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: restaurant.address.city,
  addressExtra: '',
};

export default function CheckoutApp() {
  const lines = useStore(cartStore);
  const subtotal = useStore(cartSubtotal);

  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery');
  const [address, setAddress] = useState<DeliveryAddress>(emptyAddress);
  const [email, setEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = deliveryFeeFor(subtotal, fulfilment);
  const total = subtotal + deliveryFee;
  const belowMinimum = fulfilment === 'delivery' && subtotal < restaurant.minOrder;
  const outsideDeliveryArea =
    fulfilment === 'delivery' &&
    address.postalCode.length >= 4 &&
    !restaurant.deliveryPostalCodes.includes(address.postalCode.trim());

  // Gently suggest items from categories the customer hasn't touched yet
  // (e.g. no drink in the cart) — only shown here at checkout, not in the
  // cart drawer itself.
  const suggestions = useMemo(() => {
    const cartCategories = new Set(lines.map((l) => getItemById(l.itemId)?.category));
    return upsellCategories
      .filter((cat) => !cartCategories.has(cat))
      .flatMap((cat) => getItemsByCategory(cat));
  }, [lines]);

  const field = (key: keyof DeliveryAddress, value: string) => setAddress((a) => ({ ...a, [key]: value }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!address.firstName.trim()) next.firstName = 'Pflichtfeld';
    if (!address.lastName.trim()) next.lastName = 'Pflichtfeld';
    if (!/^[+0-9 ()/-]{6,}$/.test(address.phone.trim())) next.phone = 'Gültige Telefonnummer angeben';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Gültige E-Mail angeben';
    if (fulfilment === 'delivery') {
      if (!address.street.trim()) next.street = 'Pflichtfeld';
      if (!address.houseNumber.trim()) next.houseNumber = 'Pflichtfeld';
      if (!/^\d{4,5}$/.test(address.postalCode.trim())) next.postalCode = 'Gültige PLZ angeben';
      if (!address.city.trim()) next.city = 'Pflichtfeld';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (lines.length === 0) return;
    if (!validate()) return;
    if (belowMinimum || outsideDeliveryArea) return;

    setSubmitting(true);
    const id = nextOrderNumber();
    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      status: 'new',
      fulfilment,
      paymentMethod,
      contact: { firstName: address.firstName, lastName: address.lastName, phone: address.phone, email },
      address: fulfilment === 'delivery' ? address : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      items: lines,
      subtotal,
      deliveryFee,
      total,
    };

    saveOrder(order);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch {
      // Order is already saved locally; email notification is best-effort
      // for this demo and shouldn't block the customer's confirmation.
    }

    clearCart();
    window.location.href = `/order-confirmed?order=${id}`;
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-5xl">🧺</p>
        <p className="text-charcoal-900/70">Dein Warenkorb ist leer.</p>
        <a href="/menu" className="btn-primary">Zur Speisekarte</a>
      </div>
    );
  }

  return (
    <div className="grid gap-10 pb-28 lg:grid-cols-[1fr_380px] lg:pb-0">
      <div className="flex flex-col gap-10">
        {suggestions.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-charcoal-900">Noch etwas dazu?</h2>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="flex w-40 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-charcoal-900/[0.04]"
                >
                  <img src={item.image} alt={item.name} className="h-24 w-full object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <p className="text-sm font-medium text-charcoal-900">{item.name}</p>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-sm font-semibold text-charcoal-900">{formatPrice(item.price)}</span>
                      <button
                        onClick={() =>
                          addToCart({
                            itemId: item.id,
                            name: item.name,
                            image: item.image,
                            basePrice: item.price,
                            quantity: 1,
                            extras: [],
                          })
                        }
                        aria-label={`${item.name} hinzufügen`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-900 text-cream-50 transition-transform hover:bg-tomato-500 active:scale-90"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fulfilment */}
        <section>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">Lieferung oder Abholung?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(['delivery', 'pickup'] as Fulfilment[]).map((option) => (
              <button
                key={option}
                onClick={() => setFulfilment(option)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  fulfilment === option
                    ? 'border-tomato-500 bg-tomato-50'
                    : 'border-charcoal-900/15 hover:border-charcoal-900/30'
                }`}
              >
                <span className="block font-semibold text-charcoal-900">
                  {option === 'delivery' ? 'Lieferung' : 'Abholung'}
                </span>
                <span className="mt-0.5 block text-xs text-charcoal-900/50">
                  {option === 'delivery'
                    ? `Ø ${restaurant.estimatedDeliveryMinutes[0]}–${restaurant.estimatedDeliveryMinutes[1]} Min.`
                    : `Ø ${restaurant.estimatedPickupMinutes[0]}–${restaurant.estimatedPickupMinutes[1]} Min.`}
                </span>
              </button>
            ))}
          </div>

          {fulfilment === 'pickup' && (
            <div className="mt-4 rounded-xl bg-cream-100 p-4 text-sm text-charcoal-900/70">
              <p className="font-medium text-charcoal-900">Abholadresse</p>
              <p className="mt-1">{restaurant.address.street}, {restaurant.address.postalCode} {restaurant.address.city}</p>
            </div>
          )}
        </section>

        {/* Contact + address */}
        <section>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">
            {fulfilment === 'delivery' ? 'Lieferadresse' : 'Kontaktdaten'}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <TextField label="Vorname" value={address.firstName} onChange={(v) => field('firstName', v)} error={errors.firstName} />
            <TextField label="Nachname" value={address.lastName} onChange={(v) => field('lastName', v)} error={errors.lastName} />
            <TextField label="Telefon" value={address.phone} onChange={(v) => field('phone', v)} error={errors.phone} type="tel" />
            <TextField label="E-Mail" value={email} onChange={setEmail} error={errors.email} type="email" />

            {fulfilment === 'delivery' && (
              <>
                <TextField label="Straße" value={address.street} onChange={(v) => field('street', v)} error={errors.street} className="col-span-2 sm:col-span-1" />
                <TextField label="Hausnummer" value={address.houseNumber} onChange={(v) => field('houseNumber', v)} error={errors.houseNumber} />
                <TextField label="Postleitzahl" value={address.postalCode} onChange={(v) => field('postalCode', v)} error={errors.postalCode} />
                <TextField label="Stadt" value={address.city} onChange={(v) => field('city', v)} error={errors.city} />
                <TextField
                  label="Adresszusatz (optional)"
                  value={address.addressExtra ?? ''}
                  onChange={(v) => field('addressExtra', v)}
                  className="col-span-2"
                />
              </>
            )}
          </div>

          {outsideDeliveryArea && (
            <p className="mt-3 text-sm font-medium text-tomato-600">
              Diese Postleitzahl liegt außerhalb unseres Liefergebiets. Bitte wähle „Abholung“ oder eine andere Adresse.
            </p>
          )}

          <label className="mt-5 block text-sm font-medium text-charcoal-900">
            Anmerkungen (optional)
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder='z. B. "Bitte zweimal klingeln."'
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-charcoal-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-tomato-500"
            />
          </label>
        </section>

        {/* Payment */}
        <section>
          <h2 className="font-display text-xl font-semibold text-charcoal-900">Zahlungsart</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {([
              { id: 'cash', label: 'Barzahlung', hint: 'Bei Lieferung/Abholung' },
              { id: 'card', label: 'Karte', hint: 'Demo — keine echte Zahlung' },
              { id: 'paypal', label: 'PayPal', hint: 'Demo — keine echte Zahlung' },
            ] as { id: PaymentMethod; label: string; hint: string }[]).map((option) => (
              <button
                key={option.id}
                onClick={() => setPaymentMethod(option.id)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  paymentMethod === option.id
                    ? 'border-tomato-500 bg-tomato-50'
                    : 'border-charcoal-900/15 hover:border-charcoal-900/30'
                }`}
              >
                <span className="block font-semibold text-charcoal-900">{option.label}</span>
                <span className="mt-0.5 block text-xs text-charcoal-900/50">{option.hint}</span>
              </button>
            ))}
          </div>
          {paymentMethod !== 'cash' && (
            <p className="mt-3 text-xs text-charcoal-900/50">
              Dies ist eine Demo-Zahlung. Es wird keine echte Transaktion ausgeführt. In Produktion würde hier ein
              echter Anbieter wie Stripe angebunden.
            </p>
          )}
        </section>
      </div>

      {/* Order summary */}
      <aside className="h-fit rounded-2xl bg-white p-6 shadow-card ring-1 ring-charcoal-900/[0.04] lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">Deine Bestellung</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {lines.map((line) => (
            <li key={line.lineId} className="flex gap-3">
              <img src={line.image} alt={line.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-charcoal-900">
                    {line.quantity}× {line.name}
                  </p>
                  <p className="text-sm font-medium text-charcoal-900">{formatPrice(line.unitPrice * line.quantity)}</p>
                </div>
                {line.size && <p className="text-xs text-charcoal-900/50">{line.size.label}</p>}
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <button className="text-charcoal-900/50 hover:text-tomato-600" onClick={() => setLineQuantity(line.lineId, line.quantity - 1)}>
                    −
                  </button>
                  <button className="text-charcoal-900/50 hover:text-tomato-600" onClick={() => setLineQuantity(line.lineId, line.quantity + 1)}>
                    +
                  </button>
                  <button
                    onClick={() => removeLine(line.lineId)}
                    aria-label={`${line.name} entfernen`}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-charcoal-900/40 transition-colors hover:bg-tomato-50 hover:text-tomato-600"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path
                        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 7h12ZM10 11v6M14 11v6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-1.5 border-t border-charcoal-900/10 pt-4 text-sm">
          <div className="flex justify-between text-charcoal-900/70">
            <span>Zwischensumme</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-charcoal-900/70">
            <span>Lieferung</span>
            <span>{deliveryFee === 0 ? 'Kostenlos' : formatPrice(deliveryFee)}</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-charcoal-900/10 pt-2 text-base font-semibold text-charcoal-900">
            <span>Gesamt</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {belowMinimum && (
          <p className="mt-3 text-xs font-medium text-tomato-600">
            Mindestbestellwert für Lieferung: {formatPrice(restaurant.minOrder)}.
          </p>
        )}

        <button
          onClick={placeOrder}
          disabled={submitting || belowMinimum || outsideDeliveryArea}
          className="btn-primary mt-5 hidden w-full text-base lg:flex"
        >
          {submitting ? 'Wird gesendet…' : 'Jetzt bestellen'}
        </button>
      </aside>

      {/* Mobile sticky order bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal-900/10 bg-cream-50/95 p-4 backdrop-blur-md lg:hidden">
        <button
          onClick={placeOrder}
          disabled={submitting || belowMinimum || outsideDeliveryArea}
          className="btn-primary w-full text-base"
        >
          {submitting ? 'Wird gesendet…' : `Jetzt bestellen · ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  className = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-charcoal-900 ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-tomato-500 ${
          error ? 'border-tomato-500' : 'border-charcoal-900/15'
        }`}
      />
      {error && <span className="mt-1 block text-xs font-medium text-tomato-600">{error}</span>}
    </label>
  );
}
