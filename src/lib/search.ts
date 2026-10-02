import type { Product } from '../types';

export const POPULAR_COUNT = 4;

/** Case-insensitive match on name, scent and category. An empty query returns the popular picks. */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products.slice(0, POPULAR_COUNT);
  return products.filter((p) => (p.name + ' ' + p.scent + ' ' + p.category).toLowerCase().includes(q));
}
