import type { Cart, Product } from '../types';

export const CART_STORAGE_KEY = 'lumen-cart-v1';
export const MAX_LINE_QTY = 99;

export function cartKey(productId: string, color: string): string {
  return productId + '|' + color;
}

export function addToCart(cart: Cart, product: Product, color = product.colors[0], qty = 1): Cart {
  const key = cartKey(product.id, color);
  const current = cart[key]?.qty ?? 0;
  return { ...cart, [key]: { id: product.id, color, qty: Math.min(MAX_LINE_QTY, current + qty) } };
}

/** Adds `delta` to a line; a line that drops to zero is removed. */
export function changeQty(cart: Cart, key: string, delta: number): Cart {
  const line = cart[key];
  if (!line) return cart;
  const qty = Math.min(MAX_LINE_QTY, line.qty + delta);
  const next = { ...cart };
  if (qty <= 0) delete next[key];
  else next[key] = { ...line, qty };
  return next;
}

export interface CartRow {
  key: string;
  product: Product;
  color: string;
  qty: number;
}

/** Cart lines joined with their products, skipping anything no longer in the catalog. */
export function cartRows(cart: Cart, products: Product[]): CartRow[] {
  const rows: CartRow[] = [];
  for (const [key, line] of Object.entries(cart)) {
    const product = products.find((p) => p.id === line.id);
    if (product) rows.push({ key, product, color: line.color, qty: line.qty });
  }
  return rows;
}

export function cartCount(rows: CartRow[]): number {
  return rows.reduce((sum, r) => sum + r.qty, 0);
}

/** Subtotal in USD. */
export function cartSubtotal(rows: CartRow[]): number {
  return rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);
}

/** Parses a stored cart, dropping malformed lines and products that no longer exist. */
export function parseStoredCart(raw: string | null, products: Product[]): Cart {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const cart: Cart = {};
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const { id, color, qty } = value as Record<string, unknown>;
    if (typeof id !== 'string' || typeof color !== 'string' || typeof qty !== 'number') continue;
    if (!Number.isInteger(qty) || qty < 1) continue;
    if (!products.some((p) => p.id === id)) continue;
    const key = cartKey(id, color);
    cart[key] = { id, color, qty: Math.min(MAX_LINE_QTY, (cart[key]?.qty ?? 0) + qty) };
  }
  return cart;
}
