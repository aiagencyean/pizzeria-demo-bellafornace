import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  cartStore,
  cartSubtotal,
  closeCart,
  deliveryFeeFor,
  isCartOpen,
  removeLine,
  setLineQuantity,
} from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import { restaurant } from '@/data/restaurant.config';

export default function CartDrawer() {
  const open = useStore(isCartOpen);
  const lines = useStore(cartStore);
  const subtotal = useStore(cartSubtotal);
  const estimatedDelivery = deliveryFeeFor(subtotal, 'delivery');
  const remainingForFreeDelivery = Math.max(0, restaurant.freeDeliveryThreshold - subtotal);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="Warenkorb schließen"
        onClick={closeCart}
        className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-[2px] animate-fade-in"
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-lifted animate-slide-in-right sm:animate-slide-in-right max-sm:bottom-0 max-sm:top-auto max-sm:h-[88vh] max-sm:max-w-full max-sm:rounded-t-2xl max-sm:animate-slide-in-bottom"
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
      >
        <div className="flex items-center justify-between border-b border-charcoal-900/10 px-5 py-4">
          <h2 className="font-display text-xl font-semibold">Dein Warenkorb</h2>
          <button
            onClick={closeCart}
            aria-label="Schließen"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-charcoal-900/5"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-4xl">🍕</p>
            <p className="text-charcoal-900/70">Dein Warenkorb ist noch leer.</p>
            <a href="/menu" onClick={closeCart} className="btn-primary">
              Zur Speisekarte
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {remainingForFreeDelivery > 0 && (
                <p className="mb-4 rounded-lg bg-basil-50 px-3 py-2 text-xs font-medium text-basil-700">
                  Noch {formatPrice(remainingForFreeDelivery)} bis zur kostenlosen Lieferung!
                </p>
              )}
              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li key={line.lineId} className="flex gap-3">
                    <img
                      src={line.image}
                      alt={line.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-charcoal-900">{line.name}</p>
                        <p className="whitespace-nowrap text-sm font-semibold text-charcoal-900">
                          {formatPrice(line.unitPrice * line.quantity)}
                        </p>
                      </div>
                      {line.size && <p className="text-xs text-charcoal-900/60">Größe: {line.size.label}</p>}
                      {line.extras.length > 0 && (
                        <p className="text-xs text-charcoal-900/60">
                          + {line.extras.map((e) => e.label).join(', ')}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-charcoal-900/15">
                          <button
                            className="flex h-7 w-7 items-center justify-center text-charcoal-900/70 hover:text-tomato-600"
                            onClick={() => setLineQuantity(line.lineId, line.quantity - 1)}
                            aria-label="Menge verringern"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-medium">{line.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center text-charcoal-900/70 hover:text-tomato-600"
                            onClick={() => setLineQuantity(line.lineId, line.quantity + 1)}
                            aria-label="Menge erhöhen"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeLine(line.lineId)}
                          aria-label={`${line.name} entfernen`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-900/40 transition-colors hover:bg-tomato-50 hover:text-tomato-600"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
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
            </div>

            <div className="border-t border-charcoal-900/10 px-5 py-4">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-charcoal-900/70">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-900/70">
                  <span>Lieferung (voraussichtlich)</span>
                  <span>{estimatedDelivery === 0 ? 'Kostenlos' : formatPrice(estimatedDelivery)}</span>
                </div>
                <div className="mt-1.5 flex justify-between border-t border-charcoal-900/10 pt-2 text-base font-semibold text-charcoal-900">
                  <span>Gesamt</span>
                  <span>{formatPrice(subtotal + estimatedDelivery)}</span>
                </div>
              </div>
              <a href="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
                Zur Kasse
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
