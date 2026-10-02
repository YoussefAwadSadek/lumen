import { describe, expect, it } from 'vitest';
import { POPULAR_COUNT, searchProducts } from './search';
import { makeProduct } from './fixtures';

const products = [
  makeProduct({ id: 'a', name: 'The Ocean Bowl', scent: 'Sea salt · white musk', category: 'Ocean' }),
  makeProduct({ id: 'b', name: 'Midnight Teacup', scent: 'Earl grey · bergamot', category: 'Café' }),
  makeProduct({ id: 'c', name: 'Violet Séance', scent: 'Lavender · smoke', category: 'Jars' }),
  makeProduct({ id: 'd', name: 'Peony Lantern', scent: 'Peony · amber', category: 'Botanical' }),
  makeProduct({ id: 'e', name: 'Coconut Shore', scent: 'Toasted coconut · vanilla', category: 'Ocean' }),
];

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe('searchProducts', () => {
  it('returns the popular picks for an empty or blank query', () => {
    expect(ids(searchProducts(products, ''))).toEqual(['a', 'b', 'c', 'd'].slice(0, POPULAR_COUNT));
    expect(ids(searchProducts(products, '   '))).toEqual(ids(searchProducts(products, '')));
  });

  it('matches name, scent and category case-insensitively', () => {
    expect(ids(searchProducts(products, 'TEACUP'))).toEqual(['b']);
    expect(ids(searchProducts(products, 'lavender'))).toEqual(['c']);
    expect(ids(searchProducts(products, 'ocean'))).toEqual(['a', 'e']);
    expect(ids(searchProducts(products, 'café'))).toEqual(['b']);
  });

  it('returns nothing when nothing matches', () => {
    expect(searchProducts(products, 'tungsten')).toEqual([]);
  });
});
