import { useMemo, useState } from 'react';
import { categoryLabels, getItemsByCategory, type MenuCategory, type MenuItem } from '@/data/menu';
import MenuItemCard from '@/components/react/MenuItemCard';
import ProductModal from '@/components/react/ProductModal';

const categories = Object.keys(categoryLabels) as MenuCategory[];

interface Props {
  initialCategory?: MenuCategory;
}

export default function MenuApp({ initialCategory = 'pizza' }: Props) {
  const [active, setActive] = useState<MenuCategory>(initialCategory);
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const items = useMemo(() => getItemsByCategory(active), [active]);

  return (
    <div>
      {/*
        Mobile: plain, non-sticky pill row (a second sticky bar stacked
        under the header felt heavy on small screens). Desktop/tablet
        (sm: and up) keep the original sticky, floating-pill treatment
        unchanged.
      */}
      <div className="-mx-5 overflow-x-auto px-5 py-3 sm:sticky sm:top-[72px] sm:z-30 sm:mx-0 sm:rounded-full sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="flex gap-2 sm:flex-wrap sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                active === cat
                  ? 'bg-tomato-500 text-white shadow-card'
                  : 'bg-white text-charcoal-900/70 ring-1 ring-charcoal-900/10 hover:text-charcoal-900'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onOpen={setOpenItem} />
        ))}
      </div>

      {openItem && <ProductModal item={openItem} onClose={() => setOpenItem(null)} />}
    </div>
  );
}
