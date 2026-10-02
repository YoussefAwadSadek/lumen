import { describe, expect, it } from 'vitest';
import { addToCart, cartCount, cartKey, cartRows, cartSubtotal, changeQty, MAX_LINE_QTY, parseStoredCart } from './cart';
import { makeProduct } from './fixtures';

const bowl = makeProduct({ id: 'bowl', price: 48, colors: ['#0f6f7c', '#12406b'] });
const cup = makeProduct({ id: 'cup', price: 26, colors: ['#12406b'] });
const catalog = [bowl, cup];

describe('addToCart', () => {
  it('adds one of the default color when no color or quantity is given', () => {
    expect(addToCart({}, bowl)).toEqual({ 'bowl|#0f6f7c': { id: 'bowl', color: '#0f6f7c', qty: 1 } });
  });

  it('keeps each color as its own line and merges repeats', () => {
    let cart = addToCart({}, bowl, '#12406b', 2);
    cart = addToCart(cart, bowl, '#12406b', 3);
    cart = addToCart(cart, bowl);
    expect(cart[cartKey('bowl', '#12406b')].qty).toBe(5);
    expect(cart[cartKey('bowl', '#0f6f7c')].qty).toBe(1);
  });

  it('caps a line at the maximum quantity', () => {
    const cart = addToCart({}, cup, undefined, MAX_LINE_QTY + 5);
    expect(cart['cup|#12406b'].qty).toBe(MAX_LINE_QTY);
  });

  it('does not mutate the previous cart', () => {
    const before = addToCart({}, cup);
    addToCart(before, cup);
    expect(before['cup|#12406b'].qty).toBe(1);
  });
});

describe('changeQty', () => {
  const cart = addToCart({}, bowl, undefined, 2);
  const key = 'bowl|#0f6f7c';

  it('increments and decrements a line', () => {
    expect(changeQty(cart, key, 1)[key].qty).toBe(3);
    expect(changeQty(cart, key, -1)[key].qty).toBe(1);
  });

  it('removes a line that reaches zero', () => {
    expect(changeQty(cart, key, -2)).toEqual({});
  });

  it('ignores unknown lines', () => {
    expect(changeQty(cart, 'nope|#000', 1)).toBe(cart);
  });
});

describe('totals', () => {
  it('counts items and sums the subtotal in USD', () => {
    let cart = addToCart({}, bowl, undefined, 2);
    cart = addToCart(cart, cup);
    const rows = cartRows(cart, catalog);
    expect(cartCount(rows)).toBe(3);
    expect(cartSubtotal(rows)).toBe(48 * 2 + 26);
  });

  it('skips lines whose product left the catalog', () => {
    const cart = addToCart(addToCart({}, bowl), cup);
    expect(cartRows(cart, [cup]).map((r) => r.product.id)).toEqual(['cup']);
  });
});

describe('parseStoredCart', () => {
  it('returns an empty cart for missing or broken data', () => {
    expect(parseStoredCart(null, catalog)).toEqual({});
    expect(parseStoredCart('{not json', catalog)).toEqual({});
    expect(parseStoredCart('[1,2]', catalog)).toEqual({});
    expect(parseStoredCart('"cart"', catalog)).toEqual({});
  });

  it('round-trips a valid cart', () => {
    const cart = addToCart(addToCart({}, bowl, '#12406b', 2), cup);
    expect(parseStoredCart(JSON.stringify(cart), catalog)).toEqual(cart);
  });

  it('drops malformed lines and unknown products', () => {
    const raw = JSON.stringify({
      a: { id: 'bowl', color: '#0f6f7c', qty: 2 },
      b: { id: 'gone', color: '#000', qty: 1 },
      c: { id: 'cup', color: '#12406b', qty: 0 },
      d: { id: 'cup', color: '#12406b', qty: 1.5 },
      e: { id: 'cup', qty: 1 },
      f: null,
    });
    expect(parseStoredCart(raw, catalog)).toEqual({ 'bowl|#0f6f7c': { id: 'bowl', color: '#0f6f7c', qty: 2 } });
  });
});
