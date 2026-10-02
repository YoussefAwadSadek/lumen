import { useRef, useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { useDialog } from '../hooks/useDialog';
import { plural } from '../lib/format';
import { searchProducts } from '../lib/search';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './SearchOverlay.module.css';

export function SearchOverlay() {
  const { closeSearch, openQuickView, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useDialog<HTMLDivElement>(inputRef);
  const results = searchProducts(PRODUCTS, query);

  return (
    <div className={`scrim ${styles.scrim}`} onClick={closeSearch}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Search the collection" className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.bar} anim-fade-up`}>
          <Icon name="search" size={24} className={styles.barIcon} />
          <input
            ref={inputRef}
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candles, scents, collections…"
            aria-label="Search"
            aria-controls="search-results"
            className={styles.input}
          />
          <button type="button" aria-label="Close search" onClick={closeSearch} className={styles.close}>
            <Icon name="close" />
          </button>
        </div>
        <div className={styles.count} aria-live="polite">
          {query.trim() ? plural(results.length, 'match', 'matches') : 'Popular right now'}
        </div>
        <div id="search-results" className={styles.results}>
          {results.map((p) => (
            <button key={p.id} type="button" onClick={() => openQuickView(p)} className={styles.result}>
              <img src={p.img} alt="" loading="lazy" className={styles.thumb} />
              <span className={styles.text}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.meta}>
                  {p.category} · {p.scent}
                </span>
              </span>
              <span className={styles.price}>{formatPrice(p.price)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
