import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { STORE_CONFIG } from './config';
import { PRODUCTS } from './data/catalog';
import { prefersReducedMotion } from './hooks/motion';
import * as cartLib from './lib/cart';
import { priceFormatter } from './lib/format';
import type { Cart, Filter, Product } from './types';

export interface Toast {
  id: number;
  msg: string;
  icon: string;
}

export interface QuickViewTarget {
  id: string;
  color: string;
}

interface Store {
  formatPrice: (usd: number) => string;
  showBadges: boolean;
  heroFloat: boolean;

  cartRows: cartLib.CartRow[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, color?: string, qty?: number) => void;
  changeQty: (key: string, delta: number) => void;

  wish: Record<string, boolean>;
  toggleWish: (product: Product) => void;

  filter: Filter;
  setFilter: (filter: Filter) => void;

  searchOpen: boolean;
  drawerOpen: boolean;
  menuOpen: boolean;
  quickView: QuickViewTarget | null;
  openSearch: () => void;
  closeSearch: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  openQuickView: (product: Product, color?: string) => void;
  /** Closes the viewer; `thenOpenCart` slides the cart in (used by "Buy now"). */
  closeQuickView: (thenOpenCart?: boolean) => void;
  /** Closes the top-most overlay. Returns false if nothing was open. */
  closeTopOverlay: () => boolean;

  toasts: Toast[];
  toast: (msg: string, icon?: string) => void;

  scrollToSection: (id: string) => void;
  scrollToTop: () => void;
}

const StoreContext = createContext<Store | null>(null);

const TOAST_MS = 3200;
/** Matches the sections' scroll-margin, so a section lands just below the fixed nav. */
const NAV_OFFSET = 70;

function loadCart(): Cart {
  try {
    return cartLib.parseStoredCart(localStorage.getItem(cartLib.CART_STORAGE_KEY), PRODUCTS);
  } catch {
    return {};
  }
}

function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(loadCart);
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<Filter>('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState<QuickViewTarget | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef(new Set<number>());
  const nextToastId = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(cartLib.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Private mode or storage full — the cart still works for this visit.
    }
  }, [cart]);

  const anyOverlayOpen = searchOpen || drawerOpen || menuOpen || quickView !== null;
  useEffect(() => {
    document.body.style.overflow = anyOverlayOpen ? 'hidden' : '';
  }, [anyOverlayOpen]);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const toast = useCallback((msg: string, icon = 'check_circle') => {
    const id = nextToastId.current++;
    setToasts((list) => [...list, { id, msg, icon }]);
    const timer = window.setTimeout(() => {
      toastTimers.current.delete(timer);
      setToasts((list) => list.filter((t) => t.id !== id));
    }, TOAST_MS);
    toastTimers.current.add(timer);
  }, []);

  const addToCart = useCallback(
    (product: Product, color?: string, qty?: number) => {
      setCart((c) => cartLib.addToCart(c, product, color, qty));
      toast('Added — ' + product.name, 'check_circle');
    },
    [toast],
  );

  const changeQty = useCallback((key: string, delta: number) => {
    setCart((c) => cartLib.changeQty(c, key, delta));
  }, []);

  const toggleWish = useCallback(
    (product: Product) => {
      const kept = !wish[product.id];
      setWish((w) => ({ ...w, [product.id]: kept }));
      toast(kept ? 'Kept — ' + product.name : 'Removed from wishlist', kept ? 'favorite' : 'heart_minus');
    },
    [wish, toast],
  );

  const scrollToSection = useCallback((id: string) => {
    // Wait a frame: when an overlay closes in the same click, its scroll lock has to be released
    // first, or the browser cancels the smooth scroll.
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: scrollBehavior() });
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }, []);

  const openQuickView = useCallback((product: Product, color = product.colors[0]) => {
    setSearchOpen(false);
    setQuickView({ id: product.id, color });
  }, []);

  const closeQuickView = useCallback((thenOpenCart = false) => {
    setQuickView(null);
    if (thenOpenCart) setDrawerOpen(true);
  }, []);

  const closeTopOverlay = useCallback(() => {
    if (quickView) setQuickView(null);
    else if (searchOpen) setSearchOpen(false);
    else if (drawerOpen) setDrawerOpen(false);
    else if (menuOpen) setMenuOpen(false);
    else return false;
    return true;
  }, [quickView, searchOpen, drawerOpen, menuOpen]);

  const cartRows = useMemo(() => cartLib.cartRows(cart, PRODUCTS), [cart]);

  const value = useMemo<Store>(
    () => ({
      formatPrice: priceFormatter(STORE_CONFIG.currency),
      showBadges: STORE_CONFIG.showBadges,
      heroFloat: STORE_CONFIG.heroFloat,
      cartRows,
      cartCount: cartLib.cartCount(cartRows),
      subtotal: cartLib.cartSubtotal(cartRows),
      addToCart,
      changeQty,
      wish,
      toggleWish,
      filter,
      setFilter,
      searchOpen,
      drawerOpen,
      menuOpen,
      quickView,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      openMenu: () => setMenuOpen(true),
      closeMenu: () => setMenuOpen(false),
      openQuickView,
      closeQuickView,
      closeTopOverlay,
      toasts,
      toast,
      scrollToSection,
      scrollToTop,
    }),
    [cartRows, addToCart, changeQty, wish, toggleWish, filter, searchOpen, drawerOpen, menuOpen, quickView, openQuickView, closeQuickView, closeTopOverlay, toasts, toast, scrollToSection, scrollToTop],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
