import { useStore } from '@nanostores/react';
import { cartCount, cartSubtotal, openCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';

// Persistent bottom action bar, phone-only (see sm:hidden in the wrapper
// this is mounted from). Keeps "order now" one thumb-tap away at all
// times without needing the header's CTA, which is hidden on small
// screens to keep the header itself uncluttered.
export default function MobileOrderBar() {
  const count = useStore(cartCount);
  const subtotal = useStore(cartSubtotal);

  if (count === 0) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal-900/10 bg-cream-50/95 p-3 backdrop-blur-md sm:hidden">
        <a href="/menu" className="btn-primary flex w-full text-base">
          Jetzt bestellen
        </a>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal-900/10 bg-cream-50/95 p-3 backdrop-blur-md sm:hidden">
      <button onClick={openCart} className="btn-primary flex w-full items-center justify-between text-base">
        <span>
          {count} {count === 1 ? 'Artikel' : 'Artikel'} · {formatPrice(subtotal)}
        </span>
        <span>Warenkorb ansehen →</span>
      </button>
    </div>
  );
}
