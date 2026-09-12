import { useStore } from '@nanostores/react';
import { cartCount, openCart } from '@/lib/cart';

export default function CartButton() {
  const count = useStore(cartCount);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Warenkorb öffnen, ${count} Artikel`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-900 transition-colors hover:bg-charcoal-900/5"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path
          d="M3 4h2l1.6 10.6a2 2 0 0 0 2 1.7h8.8a2 2 0 0 0 2-1.6L21 8H6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-tomato-500 px-1 text-[10px] font-bold leading-none text-white animate-fade-in">
          {count}
        </span>
      )}
    </button>
  );
}
