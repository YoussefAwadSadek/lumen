import { FILTERS, PRODUCTS } from '../data/catalog';
import { useReveal } from '../hooks/useReveal';
import { useStore } from '../store';
import { ProductCard } from './ProductCard';
import styles from './Shop.module.css';

export function Shop() {
  const { filter, setFilter } = useStore();
  const reveal0 = useReveal(0);
  const reveal60 = useReveal(60);
  const reveal120 = useReveal(120);
  const products = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <section id="shop" className={styles.section} aria-labelledby="shop-title">
      <div className="container">
        <div ref={reveal0} className="ak-overline">
          The collection
        </div>
        <div className={styles.head}>
          <h2 ref={reveal60} id="shop-title" className={`section-title ${styles.title}`}>
            Small fires, poured slowly.
          </h2>
          <div ref={reveal120} className={styles.filters} role="group" aria-label="Filter by collection">
            {FILTERS.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className={styles.filter + (filter === name ? ' ' + styles.filterActive : '')}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
