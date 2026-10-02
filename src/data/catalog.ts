import type { CollectionDef, Filter, Product, Review, StatDef } from '../types';
import oceanBowl from '../assets/images/ocean-bowl.jpg';
import whisperingShell from '../assets/images/whispering-shell.png';
import coconutShore from '../assets/images/coconut-shore.jpg';
import teacup from '../assets/images/teacup.jpg';
import violetJar from '../assets/images/violet-jar.jpg';
import peonyJar from '../assets/images/peony-jar.jpg';

export { default as posterShell } from '../assets/images/poster-shell.jpg';
export { oceanBowl };

export const PRODUCTS: Product[] = [
  { id: 'ocean-bowl', name: 'The Ocean Bowl', scent: 'Sea salt · white musk', desc: 'A reef poured in wax — gel water, soy foam and hand-molded shells, sealed inside a glass globe. Our signature piece.', price: 48, oldPrice: 56, badge: 'Bestseller', badgeType: 'gold', rating: 4.9, reviewCount: 212, stock: 'Low stock — 3 left', stockType: 'warn', category: 'Ocean', img: oceanBowl, imgFit: 'cover', imgBg: 'var(--ak-bg-stage)', colors: ['#0f6f7c', '#12406b', '#e8e2c9'], burn: '~48 hrs', size: '1.2 kg · glass bowl' },
  { id: 'whispering-shell', name: 'Whispering Shell', scent: 'Ocean breeze · lily', desc: 'The shell from the poster — cast in tinted resin, filled with slow-burning soy. Poured to order in many colors and scents.', price: 22, oldPrice: null, badge: 'New', badgeType: 'gold', rating: 4.8, reviewCount: 96, stock: 'In stock', stockType: 'ok', category: 'Ocean', img: whisperingShell, imgFit: 'contain', imgBg: 'linear-gradient(170deg,#8d95e8 0%,#1c2a86 100%)', colors: ['#1230b8', '#0f6f7c', '#7a1fa0'], burn: '~12 hrs', size: '180 g · resin shell' },
  { id: 'coconut-shore', name: 'Coconut Shore', scent: 'Toasted coconut · vanilla', desc: 'A real coconut husk holding a shoreline — sand-textured wax, sea foam and tiny shells, split by a blue tide.', price: 34, oldPrice: null, badge: null, badgeType: null, rating: 4.7, reviewCount: 64, stock: 'Made to order', stockType: 'muted', category: 'Ocean', img: coconutShore, imgFit: 'cover', imgBg: 'var(--ak-bg-stage)', colors: ['#8a5a2b', '#e8e2c9'], burn: '~26 hrs', size: '420 g · real coconut shell' },
  { id: 'teacup', name: 'Midnight Teacup', scent: 'Earl grey · bergamot', desc: 'A cup of tea that never cools. Hand-cast resin cup and saucer, wax latte on top — tea tag included.', price: 26, oldPrice: null, badge: null, badgeType: null, rating: 4.9, reviewCount: 141, stock: 'In stock', stockType: 'ok', category: 'Café', img: teacup, imgFit: 'cover', imgBg: 'var(--ak-bg-stage)', colors: ['#12406b', '#7a1fa0', '#0f6f7c'], burn: '~15 hrs', size: '220 g · resin cup & saucer' },
  { id: 'violet-jar', name: 'Violet Séance', scent: 'Lavender · smoke', desc: 'Marbled violet wax in heavy glass — smoke curls sealed mid-swirl. No two jars marble the same way.', price: 30, oldPrice: 36, badge: '−17%', badgeType: 'crimson', rating: 4.8, reviewCount: 87, stock: 'In stock', stockType: 'ok', category: 'Jars', img: violetJar, imgFit: 'cover', imgBg: 'var(--ak-bg-stage)', colors: ['#5b21a8', '#1230b8', '#c2447e'], burn: '~32 hrs', size: '450 g · marbled glass' },
  { id: 'peony-jar', name: 'Peony Lantern', scent: 'Peony · amber', desc: 'A hand-piped peony under a bamboo lid — petals of wax on a soy base, lit from within when it burns.', price: 38, oldPrice: null, badge: null, badgeType: null, rating: 4.9, reviewCount: 58, stock: 'Low stock — 5 left', stockType: 'warn', category: 'Botanical', img: peonyJar, imgFit: 'cover', imgBg: 'var(--ak-bg-stage)', colors: ['#e0555f', '#f0a24e', '#e8e2c9'], burn: '~28 hrs', size: '380 g · bamboo-lid jar' },
];

export const FEATURED_PRODUCT_ID = 'ocean-bowl';

export const FILTERS: Filter[] = ['All', 'Ocean', 'Botanical', 'Café', 'Jars'];

export const COLLECTIONS: CollectionDef[] = [
  { name: 'Ocean Collection', cat: 'Ocean', img: coconutShore, icon: 'water' },
  { name: 'Botanical', cat: 'Botanical', img: peonyJar, icon: 'local_florist' },
  { name: 'Café', cat: 'Café', img: teacup, icon: 'local_cafe' },
  { name: 'Signature Jars', cat: 'Jars', img: violetJar, icon: 'local_fire_department' },
];

export const REVIEWS: Review[] = [
  { name: 'Layla M.', rating: 5, text: 'The Ocean Bowl sits on our table like an aquarium that smells of holidays. Guests refuse to let me burn it.', item: 'The Ocean Bowl' },
  { name: 'Omar T.', rating: 5, text: 'Ordered the teacup for my mother. She thought it was real tea. Then she lit it.', item: 'Midnight Teacup' },
  { name: 'Sara K.', rating: 4, text: 'Whispering Shell in purple — arrived sealed like a gift, burned clean and slow. Ordering two more.', item: 'Whispering Shell' },
  { name: 'Nadia R.', rating: 5, text: 'Custom scent, custom color, at my door in a week. The only brand I gift now.', item: 'Custom order' },
];

export const STATS: StatDef[] = [
  { value: 2400, label: 'Candles poured', format: (n) => Math.round(n).toLocaleString('en-US') + '+' },
  { value: 38, label: 'Scents on the shelf', format: (n) => String(Math.round(n)) },
  { value: 4.9, label: 'Average rating', format: (n) => n.toFixed(1) + '★' },
  { value: 12, label: 'Cities shipped to', format: (n) => String(Math.round(n)) },
];

/** Rising embers behind the hero — fixed seeds so the layout is stable between visits. */
export const EMBERS = [7, 18, 26, 34, 41, 50, 58, 66, 74, 82, 90, 96].map((left, i) => ({
  left,
  size: 3 + (i % 3) * 2,
  dur: (7 + (i * 1.7) % 6).toFixed(1),
  delay: ((i * 0.9) % 7).toFixed(1),
  color: i % 3 === 0 ? 'rgba(244,37,54,0.75)' : 'rgba(212,175,55,0.8)',
}));

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
