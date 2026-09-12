// ═══════════════════════════════════════════════════════════════════════
// RESTAURANT CONFIG — the single file to edit when reskinning this
// template for a new restaurant. Name, logo, address, hours, delivery
// rules, social links and SEO copy all live here. Menu items live in
// `menu.ts`, reviews in `reviews.ts`, gallery photos in `gallery.ts`.
// ═══════════════════════════════════════════════════════════════════════

export const restaurant = {
  // ── Brand ────────────────────────────────────────────────────────────
  name: 'Bella Fornace',
  tagline: 'Authentic Italian Pizza.',
  logoText: 'Bella Fornace', // swap <Logo /> for an <img> once a real mark exists
  logoImage: null as string | null, // e.g. '/images/logo.svg' — takes over from logoText when set
  founded: 2013,
  story: {
    heading: 'Made like Italy.',
    body: "Bella Fornace opened in 2013 with one goal: pizza the way our nonna made it in Naples. We proof our dough for 48 hours, import our tomatoes from San Marzano, and slice our mozzarella fresh every morning. Everything else is just fire and patience.",
    highlights: [
      { label: '48H Dough', detail: 'Slow cold-proofed for a light, digestible crust.' },
      { label: 'San Marzano Tomatoes', detail: 'DOP tomatoes imported for a naturally sweet sauce.' },
      { label: 'Fresh Mozzarella', detail: 'Sliced daily, never pre-shredded.' },
      { label: 'Wood-Fired Oven', detail: 'Baked at 450°C for 90 seconds, just like Napoli.' },
    ],
  },

  // ── Contact & location ──────────────────────────────────────────────
  phone: '+49 221 1234567',
  phoneDisplay: '0221 123 4567',
  email: 'ciao@bellafornace.example',
  address: {
    street: 'Weyerstraße 12',
    postalCode: '50676',
    city: 'Köln',
    country: 'DE',
    countryLabel: 'Deutschland',
  },
  // Plain-text coordinates for the map placeholder / future Google Maps or
  // Mapbox embed. Replace with the restaurant's real lat/lng.
  mapCoordinates: { lat: 50.9295, lng: 6.9531 },
  googleMapsUrl: 'https://maps.google.com/?q=Weyerstra%C3%9Fe+12+50676+K%C3%B6ln',

  // ── Opening hours (24h, per weekday) ────────────────────────────────
  hours: [
    { day: 'Montag', open: '11:00', close: '22:00' },
    { day: 'Dienstag', open: '11:00', close: '22:00' },
    { day: 'Mittwoch', open: '11:00', close: '22:00' },
    { day: 'Donnerstag', open: '11:00', close: '22:00' },
    { day: 'Freitag', open: '11:00', close: '23:00' },
    { day: 'Samstag', open: '12:00', close: '23:00' },
    { day: 'Sonntag', open: '12:00', close: '22:00' },
  ],

  // ── Ordering ─────────────────────────────────────────────────────────
  currency: '€',
  minOrder: 12,
  deliveryFee: 2.9,
  freeDeliveryThreshold: 25,
  estimatedDeliveryMinutes: [35, 45] as [number, number],
  estimatedPickupMinutes: [15, 20] as [number, number],
  // Postal codes the restaurant currently delivers to. Wire this up to a
  // real delivery-zone service later — for the demo it's a static allowlist.
  deliveryPostalCodes: ['50667', '50668', '50670', '50672', '50674', '50676', '50677', '50678'],

  // ── Trust signals shown near the top of the homepage ────────────────
  rating: { value: 4.8, count: 612 },

  // ── Social ───────────────────────────────────────────────────────────
  social: {
    instagram: 'https://instagram.com/bellafornace.example',
    facebook: 'https://facebook.com/bellafornace.example',
  },

  // ── SEO / structured data ───────────────────────────────────────────
  seo: {
    siteTitle: 'Bella Fornace — Authentic Italian Pizza in Köln',
    description:
      'Handmade Neapolitan-style pizza, fresh pasta and Italian classics in Köln. 48h dough, San Marzano tomatoes, wood-fired oven. Order online for delivery or pickup.',
    ogImage: '/images/hero-margherita.jpg',
    locale: 'de_DE',
  },
} as const;

export type Restaurant = typeof restaurant;
