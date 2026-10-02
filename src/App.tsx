import { useEffect } from 'react';
import { About } from './components/About';
import { BackToTop } from './components/BackToTop';
import { CartDrawer } from './components/CartDrawer';
import { Collections } from './components/Collections';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MobileMenu } from './components/MobileMenu';
import { Navbar } from './components/Navbar';
import { QuickView } from './components/QuickView';
import { Reviews } from './components/Reviews';
import { SearchOverlay } from './components/SearchOverlay';
import { Shop } from './components/Shop';
import { Toasts } from './components/Toasts';
import { useScrolled } from './hooks/useScrolled';
import { useStore } from './store';

export function App() {
  const { searchOpen, drawerOpen, menuOpen, quickView, closeTopOverlay } = useStore();
  const { scrolled, progressRef } = useScrolled(40);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeTopOverlay()) e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeTopOverlay]);

  return (
    <>
      <a href="#shop" className="skip-link">
        Skip to the collection
      </a>
      <Navbar scrolled={scrolled} progressRef={progressRef} />
      <Hero />
      <main>
        <Shop />
        <Collections />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />

      {menuOpen && <MobileMenu />}
      {searchOpen && <SearchOverlay />}
      {drawerOpen && <CartDrawer />}
      {quickView && <QuickView key={quickView.id} target={quickView} />}

      <Toasts />
      <BackToTop visible={scrolled} />
    </>
  );
}
