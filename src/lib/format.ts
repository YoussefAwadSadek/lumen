import type { CurrencyCode } from '../types';

const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  AED: { symbol: 'AED ', rate: 3.67 },
  SAR: { symbol: 'SAR ', rate: 3.75 },
  EGP: { symbol: 'E£', rate: 48 },
};

/** Returns a formatter that converts a USD amount to `currency` and rounds to whole units. */
export function priceFormatter(currency: CurrencyCode): (usd: number) => string {
  const c = CURRENCIES[currency] ?? CURRENCIES.USD;
  return (usd) => c.symbol + Math.round(usd * c.rate).toLocaleString('en-US');
}

/** Five-star string, rounded to the nearest whole star: 4.4 → ★★★★☆. */
export function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export function plural(n: number, one: string, many: string): string {
  return n + ' ' + (n === 1 ? one : many);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('');
}
