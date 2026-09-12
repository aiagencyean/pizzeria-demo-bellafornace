import { useEffect, useMemo, useState } from 'react';
import type { ExtraOption, MenuItem, SizeOption } from '@/data/menu';
import { addToCart, openCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

export default function ProductModal({ item, onClose }: Props) {
  const [size, setSize] = useState<SizeOption | undefined>(item.sizes?.[0]);
  const [extraIds, setExtraIds] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const selectedExtras: ExtraOption[] = useMemo(
    () => (item.extras ?? []).filter((e) => extraIds.has(e.id)),
    [item.extras, extraIds]
  );

  const unitPrice = useMemo(() => {
    const sizeDelta = size?.priceDelta ?? 0;
    const extrasDelta = selectedExtras.reduce((sum, e) => sum + e.priceDelta, 0);
    return item.price + sizeDelta + extrasDelta;
  }, [item.price, size, selectedExtras]);

  const toggleExtra = (id: string) => {
    setExtraIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    addToCart({
      itemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      quantity,
      size,
      extras: selectedExtras,
    });
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-4">
      <button
        aria-label="Schließen"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-[2px] animate-fade-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-cream-50 shadow-lifted animate-slide-in-bottom sm:rounded-2xl sm:animate-slide-up"
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal-900 shadow-card hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overflow-y-auto">
          <img src={item.image} alt={item.name} className="h-56 w-full object-cover sm:h-72" />

          <div className="px-6 py-6 sm:px-8">
            {item.badge && (
              <span className="mb-2 inline-block rounded-full bg-tomato-50 px-3 py-1 text-xs font-semibold text-tomato-600">
                {item.badge}
              </span>
            )}
            <h2 className="font-display text-2xl font-semibold text-charcoal-900">{item.name}</h2>
            <p className="mt-1.5 text-sm text-charcoal-900/60">{item.description}</p>

            {item.sizes && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-charcoal-900">Größe</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {item.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s)}
                      className={`rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors ${
                        size?.id === s.id
                          ? 'border-tomato-500 bg-tomato-50 text-tomato-600'
                          : 'border-charcoal-900/15 text-charcoal-900/70 hover:border-charcoal-900/30'
                      }`}
                    >
                      <span className="block">{s.label}</span>
                      {s.priceDelta > 0 && <span className="block text-xs opacity-70">+{formatPrice(s.priceDelta)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.extras && item.extras.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-charcoal-900">Extras</p>
                <div className="mt-3 flex flex-col divide-y divide-charcoal-900/[0.06] rounded-xl border border-charcoal-900/10">
                  {item.extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={extraIds.has(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                          className="h-4 w-4 rounded border-charcoal-900/30 text-tomato-500 focus:ring-tomato-500"
                        />
                        {extra.label}
                      </span>
                      <span className="text-charcoal-900/50">+{formatPrice(extra.priceDelta)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-charcoal-900/10 bg-cream-50 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3 rounded-full border border-charcoal-900/15 px-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Menge verringern"
              className="flex h-9 w-9 items-center justify-center text-lg text-charcoal-900/70 hover:text-tomato-600"
            >
              −
            </button>
            <span className="w-4 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Menge erhöhen"
              className="flex h-9 w-9 items-center justify-center text-lg text-charcoal-900/70 hover:text-tomato-600"
            >
              +
            </button>
          </div>
          <button onClick={handleAdd} className="btn-primary flex-1 text-base">
            In den Warenkorb · {formatPrice(unitPrice * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
