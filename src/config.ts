import type { CurrencyCode } from './types';

/** Store-wide switches (the tweakable props of the original design). */
export const STORE_CONFIG: {
  currency: CurrencyCode;
  showBadges: boolean;
  heroFloat: boolean;
} = {
  currency: 'USD',
  showBadges: true,
  heroFloat: true,
};
