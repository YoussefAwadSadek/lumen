import { REVIEWS } from '../data/catalog';
import { useReveal } from '../hooks/useReveal';
import { initials, stars } from '../lib/format';
import { Icon } from './Icon';
import styles from './Reviews.module.css';

export function Reviews() {
  const reveal0 = useReveal(0);
  const reveal60 = useReveal(60);

  return (
    <section id="reviews" className={styles.section} aria-labelledby="reviews-title">
      <div className="container">
        <div ref={reveal0} className="ak-overline">
          Reviews
        </div>
        <h2 ref={reveal60} id="reviews-title" className={`section-title ${styles.title}`}>
          Kept lit, never burned.
        </h2>
        <div className={styles.grid}>
          {REVIEWS.map((r) => (
            <figure key={r.name} ref={reveal0} className={`surface ${styles.card}`}>
              <div className={styles.author}>
                <span aria-hidden="true" className={styles.avatar}>
                  {initials(r.name)}
                </span>
                <div>
                  <div className={styles.name}>{r.name}</div>
                  <div className={styles.verified}>
                    <Icon name="verified" size={15} className={styles.verifiedIcon} />
                    Verified purchase
                  </div>
                </div>
              </div>
              <div role="img" aria-label={`${r.rating} out of 5 stars`} className={styles.stars}>
                {stars(r.rating)}
              </div>
              <blockquote className={styles.quote}>{r.text}</blockquote>
              <figcaption className={styles.item}>{r.item}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
