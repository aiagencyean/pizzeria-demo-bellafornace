import type { MenuItem } from '@/data/menu';
import { formatPrice } from '@/lib/format';
import { addToCart } from '@/lib/cart';

interface Props {
  item: MenuItem;
  onOpen: (item: MenuItem) => void;
}

const badgeStyles: Record<NonNullable<MenuItem['badge']>, string> = {
  Bestseller: 'bg-tomato-500 text-white',
  Neu: 'bg-basil-500 text-white',
  Vegetarisch: 'bg-basil-50 text-basil-700',
  Scharf: 'bg-charcoal-900 text-white',
};

export default function MenuItemCard({ item, onOpen }: Props) {
  const needsCustomization = Boolean(item.sizes && item.sizes.length > 0);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (needsCustomization) {
      onOpen(item);
      return;
    }
    addToCart({
      itemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      quantity: 1,
      extras: [],
    });
  };

  return (
    <button
      onClick={() => onOpen(item)}
      className="group flex items-stretch gap-3 rounded-xl2 bg-white p-3 text-left shadow-card ring-1 ring-charcoal-900/[0.04] transition-shadow hover:shadow-lifted sm:flex-col sm:items-stretch sm:gap-0 sm:overflow-hidden sm:p-0"
    >
      {/*
        Mobile: small square thumbnail in a compact row (name, price, add
        button only — ingredients are one tap away in the product modal).
        Desktop/tablet (sm: and up): unchanged full-width image card.
      */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
        />
        {item.badge && (
          <span
            className={`absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px] ${badgeStyles[item.badge]}`}
          >
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 sm:gap-1.5 sm:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal-900 sm:text-lg">{item.name}</h3>
        <p className="hidden text-sm text-charcoal-900/60 sm:line-clamp-2 sm:block sm:flex-1">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-1 sm:mt-3 sm:pt-0">
          <span className="font-display text-base font-semibold text-charcoal-900 sm:text-lg">
            {item.sizes ? 'ab ' : ''}
            {formatPrice(item.price)}
          </span>
          <span
            onClick={quickAdd}
            role="button"
            aria-label={`${item.name} in den Warenkorb`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-cream-50 transition-transform hover:bg-tomato-500 active:scale-90 sm:h-9 sm:w-9"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
