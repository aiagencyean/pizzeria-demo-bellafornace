// ═══════════════════════════════════════════════════════════════════════
// MENU DATA — every dish, price and image lives here. Components read
// from this file; nothing menu-related is hardcoded in the UI. Replace
// items, prices and `image` paths (pointing into /public/images) to
// re-skin the menu for a different restaurant.
// ═══════════════════════════════════════════════════════════════════════

export type MenuCategory = 'pizza' | 'pasta' | 'salads' | 'sides' | 'drinks' | 'desserts';

export interface SizeOption {
  id: string;
  label: string;
  /** Added to the item's base price when this size is selected. */
  priceDelta: number;
}

export interface ExtraOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: 'Bestseller' | 'Neu' | 'Vegetarisch' | 'Scharf';
  sizes?: SizeOption[];
  extras?: ExtraOption[];
}

export const categoryLabels: Record<MenuCategory, string> = {
  pizza: 'Pizza',
  pasta: 'Pasta',
  salads: 'Insalate',
  sides: 'Beilagen',
  drinks: 'Getränke',
  desserts: 'Dolci',
};

const pizzaSizes: SizeOption[] = [
  { id: '26', label: '26 cm', priceDelta: 0 },
  { id: '30', label: '30 cm', priceDelta: 2.5 },
  { id: '32', label: '32 cm', priceDelta: 4.5 },
];

const pizzaExtras: ExtraOption[] = [
  { id: 'extra-cheese', label: 'Extra Käse', priceDelta: 1.5 },
  { id: 'salami', label: 'Salami', priceDelta: 1.8 },
  { id: 'mushrooms', label: 'Champignons', priceDelta: 1.5 },
  { id: 'olives', label: 'Oliven', priceDelta: 1.2 },
  { id: 'jalapenos', label: 'Jalapeños', priceDelta: 1.2 },
  { id: 'burrata', label: 'Burrata', priceDelta: 2.5 },
  { id: 'basil', label: 'Frisches Basilikum', priceDelta: 0.8 },
];

export const menuItems: MenuItem[] = [
  // ── PIZZA ──────────────────────────────────────────────────────────
  {
    id: 'pizza-margherita',
    category: 'pizza',
    name: 'Margherita',
    description: 'San-Marzano-Tomaten, Fior di Latte, frisches Basilikum, Olivenöl',
    price: 10.9,
    image: '/images/pizza-margherita.jpg',
    badge: 'Bestseller',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-pepperoni',
    category: 'pizza',
    name: 'Pepperoni',
    description: 'Tomatensauce, Mozzarella, scharfe Salami',
    price: 13.9,
    image: '/images/pizza-pepperoni.jpg',
    badge: 'Bestseller',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-diavola',
    category: 'pizza',
    name: 'Diavola',
    description: 'Tomatensauce, Mozzarella, Nduja, Chili, Honig',
    price: 14.5,
    image: '/images/pizza-diavola.jpg',
    badge: 'Scharf',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-funghi',
    category: 'pizza',
    name: 'Funghi',
    description: 'Tomatensauce, Mozzarella, Champignons, Rucola, Parmesan',
    price: 12.9,
    image: '/images/pizza-funghi.jpg',
    badge: 'Vegetarisch',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-vegetariana',
    category: 'pizza',
    name: 'Vegetariana',
    description: 'Tomatensauce, Mozzarella, Paprika, Mais, schwarze Oliven, Zwiebeln',
    price: 12.5,
    image: '/images/pizza-vegetariana.jpg',
    badge: 'Vegetarisch',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-quattro-formaggi',
    category: 'pizza',
    name: 'Quattro Formaggi',
    description: 'Mozzarella, Gorgonzola, Parmesan, Provolone, ohne Tomatensauce',
    price: 14.2,
    image: '/images/pizza-quattro-formaggi.jpg',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-capricciosa',
    category: 'pizza',
    name: 'Capricciosa',
    description: 'Tomatensauce, Mozzarella, Schinken, Champignons, Artischocken, Oliven',
    price: 14.9,
    image: '/images/pizza-capricciosa.jpg',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-pollo-bbq',
    category: 'pizza',
    name: 'Pollo BBQ',
    description: 'BBQ-Sauce, Mozzarella, gegrilltes Hähnchen, rote Zwiebeln, Koriander',
    price: 14.5,
    image: '/images/pizza-pollo-bbq.jpg',
    badge: 'Neu',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-burrata',
    category: 'pizza',
    name: 'Burrata e Pomodorini',
    description: 'Tomatensauce, Mozzarella, cremige Burrata, Kirschtomaten, Basilikum',
    price: 15.9,
    image: '/images/pizza-burrata.jpg',
    badge: 'Neu',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-rucola-crudo',
    category: 'pizza',
    name: 'Rucola e Crudo',
    description: 'Tomatensauce, Mozzarella, Parmaschinken, Rucola, Parmesanspäne',
    price: 15.5,
    image: '/images/pizza-rucola-crudo.jpg',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },
  {
    id: 'pizza-primavera',
    category: 'pizza',
    name: 'Primavera',
    description: 'Tomatensauce, Mozzarella, gegrilltes Hähnchen, buntes Gemüse',
    price: 13.9,
    image: '/images/pizza-primavera.jpg',
    sizes: pizzaSizes,
    extras: pizzaExtras,
  },

  // ── PASTA ──────────────────────────────────────────────────────────
  {
    id: 'pasta-pomodoro',
    category: 'pasta',
    name: 'Penne al Pomodoro',
    description: 'Penne, San-Marzano-Tomatensauce, frisches Basilikum, Parmesan',
    price: 10.5,
    image: '/images/pasta-pomodoro.jpg',
    badge: 'Vegetarisch',
    extras: [
      { id: 'parmesan', label: 'Extra Parmesan', priceDelta: 1.2 },
      { id: 'burrata-pasta', label: 'Burrata', priceDelta: 2.5 },
    ],
  },
  {
    id: 'pasta-bolognese',
    category: 'pasta',
    name: 'Fusilli Bolognese',
    description: 'Fusilli, hausgemachte Rinder-Ragù, Parmesan',
    price: 12.9,
    image: '/images/pasta-bolognese.jpg',
    badge: 'Bestseller',
    extras: [{ id: 'parmesan', label: 'Extra Parmesan', priceDelta: 1.2 }],
  },
  {
    id: 'pasta-alfredo',
    category: 'pasta',
    name: 'Tagliatelle Alfredo',
    description: 'Tagliatelle, Sahne-Parmesan-Sauce, Hähnchen, schwarzer Pfeffer',
    price: 13.5,
    image: '/images/pasta-alfredo.jpg',
    extras: [{ id: 'parmesan', label: 'Extra Parmesan', priceDelta: 1.2 }],
  },

  // ── SALADS ─────────────────────────────────────────────────────────
  {
    id: 'salad-caprese',
    category: 'salads',
    name: 'Caprese',
    description: 'Ochsenherztomaten, Büffelmozzarella, Basilikum, Olivenöl',
    price: 9.9,
    image: '/images/salad-caprese.jpg',
    badge: 'Vegetarisch',
  },
  {
    id: 'salad-mista',
    category: 'salads',
    name: 'Insalata Mista',
    description: 'Gemischter Blattsalat, Kirschtomaten, Gurke, Karotten, Hausdressing',
    price: 7.9,
    image: '/images/salad-mista.jpg',
    badge: 'Vegetarisch',
    extras: [{ id: 'chicken', label: 'Gegrilltes Hähnchen', priceDelta: 3.0 }],
  },

  // ── SIDES ──────────────────────────────────────────────────────────
  {
    id: 'side-garlic-bread',
    category: 'sides',
    name: 'Pane all’Aglio',
    description: 'Hausgebackenes Brot, Knoblauchbutter, Petersilie',
    price: 5.5,
    image: '/images/side-bread.jpg',
    badge: 'Vegetarisch',
  },

  // ── DRINKS ─────────────────────────────────────────────────────────
  {
    id: 'drink-wine-red',
    category: 'drinks',
    name: 'Hausrotwein (0,2l)',
    description: 'Italienischer Rotwein, trocken',
    price: 5.5,
    image: '/images/drink-wine.jpg',
  },
  {
    id: 'drink-beer',
    category: 'drinks',
    name: 'Bier vom Fass (0,3l)',
    description: 'Kölsch, frisch gezapft',
    price: 3.9,
    image: '/images/drink-beer.jpg',
  },

  // ── DESSERTS ───────────────────────────────────────────────────────
  {
    id: 'dessert-tiramisu',
    category: 'desserts',
    name: 'Tiramisù',
    description: 'Mascarpone, Espresso, Kakao, Löffelbiskuit — hausgemacht',
    price: 6.5,
    image: '/images/dessert-tiramisu.jpg',
    badge: 'Bestseller',
  },
];

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}
