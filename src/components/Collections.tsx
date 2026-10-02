import { COLLECTIONS, PRODUCTS } from '../data/catalog';
import { useReveal } from '../hooks/useReveal';
import { plural } from '../lib/format';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Collections.module.css';

export function Collections() {
  const { setFilter, scrollToSection } = useStore();
  const reveal0 = useReveal(0);
  const reveal60 = useReveal(60);

  return (
    <section id="collections" className={styles.section} aria-labelledby="collections-title">
      <div className="container">
        <div ref={reveal0} className="ak-overline">
          Collections
        </div>
        <h2 ref={reveal60} id="collections-title" className={`section-title ${styles.title}`}>
          Choose your ritual.
        </h2>
        <div className={styles.grid}>
          {COLLECTIONS.map((c) => {
            const count = PRODUCTS.filter((p) => p.category === c.cat).length;
            return (
              <button
                key={c.cat}
                ref={reveal0}
                type="button"
                className={styles.card}
                onClick={() => {
                  setFilter(c.cat);
                  scrollToSection('shop');
                }}
              >
                <img src={c.img} alt="" aria-hidden="true" loading="lazy" className={styles.image} />
                <span aria-hidden="true" className={styles.shade} />
                <span className={styles.content}>
                  <Icon name={c.icon} size={21} className={styles.icon} />
                  <span className={styles.name}>{c.name}</span>
                  <span className={styles.count}>
                    {plural(count, 'piece', 'pieces')}
                    <Icon name="arrow_forward" size={15} className={styles.arrow} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
