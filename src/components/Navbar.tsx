import type { RefObject } from 'react';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Navbar.module.css';

export const NAV_LINKS = [
  { href: '#shop', label: 'Shop' },
  { href: '#collections', label: 'Collections' },
  { href: '#about', label: 'Our story' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

interface NavbarProps {
  scrolled: boolean;
  progressRef: RefObject<HTMLDivElement | null>;
}

export function Navbar({ scrolled, progressRef }: NavbarProps) {
  const { cartCount, openSearch, openDrawer, openMenu } = useStore();

  return (
    <>
      <div ref={progressRef} className={styles.progress} aria-hidden="true" />
      <nav className={styles.nav + (scrolled ? ' ' + styles.scrolled : '')} aria-label="Main">
        <div className={styles.inner}>
          <a href="#top" className={styles.logo}>
            <Icon name="local_fire_department" size={26} className={`${styles.flame} anim-flicker`} />
            <span className={styles.wordmark}>LUMEN</span>
          </a>
          <div className={styles.links}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" aria-label="Search" onClick={openSearch} className={styles.iconBtn}>
              <Icon name="search" size={22} />
            </button>
            <button
              type="button"
              aria-label={cartCount > 0 ? `Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Open cart'}
              onClick={openDrawer}
              className={styles.iconBtn}
            >
              <Icon name="shopping_bag" size={22} />
              {cartCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </button>
            <button type="button" aria-label="Menu" onClick={openMenu} className={`${styles.iconBtn} ${styles.menuBtn}`}>
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
