# LUMEN — showcase site

One-page storefront for LUMEN hand-poured candles.

React 19 + TypeScript + Vite, plain CSS (design tokens + CSS Modules). No backend.

## Commands

```bash
npm install       # once
npm run dev       # local dev server at http://localhost:5173
npm test          # unit tests (cart, prices, search)
npm run build     # type-check + production build into dist/
npm run preview   # serve the built dist/ locally
```

`dist/` is a static site — upload it to any host (Netlify, Vercel, GitHub Pages, cPanel…).
Asset paths are relative, so it also works from a sub-folder.

## Where things live

| What | File |
| --- | --- |
| Products, collections, reviews, stats | `src/data/catalog.ts` |
| Currency (USD / AED / SAR / EGP), badges on/off, hero float on/off | `src/config.ts` |
| Colors, type, spacing, shadows (design tokens) | `src/styles/tokens.css` |
| Page sections and overlays | `src/components/` |
| Cart, wishlist, filter, overlays, toasts | `src/store.tsx` |
| Product photos | `src/assets/images/` |

Prices are stored in USD and converted for display. The cart is saved in the browser (`localStorage`).

Icons come from Google's Material Symbols, subset to the glyphs the site uses — when you use a new
icon name, add it to the `icon_names` list in `index.html`.

## Before going live

As in the design, these are front-end only and just show a confirmation toast:

- Contact form (`src/components/Contact.tsx`) — needs a form endpoint.
- Newsletter signup (`src/components/Footer.tsx`) — needs a mailing-list provider.
- "Order via WhatsApp" and "Checkout" — need the real WhatsApp number / checkout flow.
- Instagram / TikTok / Pinterest, Privacy, Terms — need real links.
