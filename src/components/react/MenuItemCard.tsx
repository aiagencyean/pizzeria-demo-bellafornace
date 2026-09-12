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
      className="group flex flex-col overflow-hidden rounded-xl2 bg-white text-left shadow-card ring-1 ring-charcoal-900/[0.04] transition-shadow hover:shadow-lifted"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {item.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyles[item.badge]}`}>
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">{item.name}</h3>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-charcoal-900/60">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-charcoal-900">
            {item.sizes ? 'ab ' : ''}
            {formatPrice(item.price)}
          </span>
          <span
            onClick={quickAdd}
            role="button"
            aria-label={`${item.name} in den Warenkorb`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-cream-50 transition-transform hover:bg-tomato-500 active:scale-90"
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
