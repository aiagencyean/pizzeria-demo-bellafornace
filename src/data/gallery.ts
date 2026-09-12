// Gallery photos — swap paths for real restaurant photography. `span`
// controls how the tile sits in the masonry-style grid (see GallerySection.astro).

export interface GalleryPhoto {
  src: string;
  alt: string;
  span?: 'tall' | 'wide';
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: '/images/gallery-interior-warm.jpg', alt: 'Gastraum bei Bella Fornace mit Holztischen', span: 'wide' },
  { src: '/images/pizza-margherita.jpg', alt: 'Frisch gebackene Margherita Pizza' },
  { src: '/images/gallery-guest-enjoying.jpg', alt: 'Gast genießt sein Essen', span: 'tall' },
  { src: '/images/pasta-bolognese.jpg', alt: 'Fusilli Bolognese' },
  { src: '/images/dessert-tiramisu.jpg', alt: 'Hausgemachtes Tiramisù' },
  { src: '/images/pizza-dough-fresh.jpg', alt: 'Handgeformter Pizzateig vor dem Backen' },
  { src: '/images/gallery-sharing-pizza.jpg', alt: 'Freunde teilen sich eine Pizza', span: 'wide' },
  { src: '/images/gallery-interior-modern.jpg', alt: 'Blick in das Restaurant', span: 'tall' },
  { src: '/images/salad-caprese.jpg', alt: 'Insalata Caprese' },
  { src: '/images/gallery-fine-plate.jpg', alt: 'Liebevoll angerichteter Teller' },
];
