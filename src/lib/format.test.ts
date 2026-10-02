import { describe, expect, it } from 'vitest';
import { initials, plural, priceFormatter, stars } from './format';

describe('priceFormatter', () => {
  it('formats USD with the dollar sign', () => {
    expect(priceFormatter('USD')(48)).toBe('$48');
  });

  it('converts and rounds to whole units with thousands separators', () => {
    expect(priceFormatter('AED')(48)).toBe('AED 176');
    expect(priceFormatter('SAR')(22)).toBe('SAR 83');
    expect(priceFormatter('EGP')(48)).toBe('E£2,304');
  });
});

describe('stars', () => {
  it('rounds to the nearest whole star', () => {
    expect(stars(4.9)).toBe('★★★★★');
    expect(stars(4)).toBe('★★★★☆');
    expect(stars(4.4)).toBe('★★★★☆');
  });

  it('clamps out-of-range ratings', () => {
    expect(stars(7)).toBe('★★★★★');
    expect(stars(-1)).toBe('☆☆☆☆☆');
  });
});

describe('plural', () => {
  it('picks the singular only for exactly one', () => {
    expect(plural(1, 'piece', 'pieces')).toBe('1 piece');
    expect(plural(0, 'piece', 'pieces')).toBe('0 pieces');
    expect(plural(3, 'piece', 'pieces')).toBe('3 pieces');
  });
});

describe('initials', () => {
  it('takes the first letter of each word', () => {
    expect(initials('Layla M.')).toBe('LM');
    expect(initials('Nadia  R.')).toBe('NR');
  });
});
