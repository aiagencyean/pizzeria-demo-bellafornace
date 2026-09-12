import { restaurant } from '@/data/restaurant.config';

const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(value: number): string {
  if (restaurant.currency === '€') return formatter.format(value);
  return `${restaurant.currency}${value.toFixed(2)}`;
}
