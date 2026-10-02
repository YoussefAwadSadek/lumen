export type Category = 'Ocean' | 'Botanical' | 'Café' | 'Jars';
export type Filter = 'All' | Category;
export type CurrencyCode = 'USD' | 'AED' | 'SAR' | 'EGP';

export interface Product {
  id: string;
  name: string;
  scent: string;
  desc: string;
  /** Prices are stored in USD and converted for display. */
  price: number;
  oldPrice: number | null;
  badge: string | null;
  badgeType: 'gold' | 'crimson' | null;
  rating: number;
  reviewCount: number;
  stock: string;
  /** `ok` hides the stock pill on cards, `warn` shows it in amber, `muted` in grey. */
  stockType: 'ok' | 'warn' | 'muted';
  category: Category;
  img: string;
  imgFit: 'cover' | 'contain';
  imgBg: string;
  /** First color is the default pour. */
  colors: string[];
  burn: string;
  size: string;
}

export interface CollectionDef {
  name: string;
  cat: Category;
  img: string;
  icon: string;
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  item: string;
}

export interface StatDef {
  value: number;
  label: string;
  format: (n: number) => string;
}

export interface CartLine {
  id: string;
  color: string;
  qty: number;
}

/** Keyed by `productId|color`, so each pour color is its own line. */
export type Cart = Record<string, CartLine>;
