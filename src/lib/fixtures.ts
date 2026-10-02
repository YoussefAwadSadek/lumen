import type { Product } from '../types';

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Test Candle',
    scent: 'Fig · cedar',
    desc: '',
    price: 10,
    oldPrice: null,
    badge: null,
    badgeType: null,
    rating: 5,
    reviewCount: 1,
    stock: 'In stock',
    stockType: 'ok',
    category: 'Jars',
    img: 'x.jpg',
    imgFit: 'cover',
    imgBg: '',
    colors: ['#111111', '#222222'],
    burn: '~1 hr',
    size: '1 g',
    ...overrides,
  };
}
