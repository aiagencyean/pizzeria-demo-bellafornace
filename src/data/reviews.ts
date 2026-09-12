// DEMO reviews for template purposes — replace with real, permission-cleared
// customer reviews (or pull them live from Google Business Profile) before
// launch. Do not present these placeholder names/quotes as genuine.

export interface Review {
  name: string;
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    name: 'Lena K.',
    rating: 5,
    text: 'Beste Pizza in Köln, ganz klar. Der Teig ist unglaublich luftig und die Lieferung war schneller als angegeben.',
  },
  {
    name: 'Marco T.',
    rating: 5,
    text: 'Fühlt sich an wie Urlaub in Neapel. Die Burrata-Pizza ist mein neues Lieblingsessen.',
  },
  {
    name: 'Sophie W.',
    rating: 4,
    text: 'Sehr gutes Essen, freundlicher Service. Die Tagliatelle Alfredo waren cremig und perfekt gewürzt.',
  },
];
