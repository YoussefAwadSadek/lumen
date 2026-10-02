import { useReveal } from '../hooks/useReveal';
import { stars } from '../lib/format';
import { useStore } from '../store';
import type { Product } from '../types';
import { Icon } from './Icon';
import styles from './ProductCard.module.css';

export function ProductCard({ product: p }: { product: Product }) {
  const { formatPrice, showBadges, wish, toggleWish, openQuickView, addToCart } = useStore();
  const reveal = useReveal(0);
  const wished = !!wish[p.id];

  return (
    <article ref={reveal} className={`surface ${styles.card}`}>
      <div className={styles.media} style={{ background: p.imgBg }}>
        <img src={p.img} alt={p.name} loading="lazy" className={styles.image} style={{ objectFit: p.imgFit }} />
        {p.badge && showBadges && (
          <span className={`${styles.badge} ${p.badgeType === 'crimson' ? styles.badgeCrimson : styles.badgeGold}`}>{p.badge}</span>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
            aria-pressed={wished}
            onClick={() => toggleWish(p)}
            className={`glass-btn ${styles.action}` + (wished ? ' ' + styles.wished : '')}
          >
            <Icon name="favorite" size={20} filled={wished} />
          </button>
          <button
            type="button"
            aria-label={`Quick view: ${p.name}`}
            title="Quick view"
            onClick={() => openQuickView(p)}
            className={`glass-btn ${styles.action}`}
          >
            <Icon name="visibility" size={20} />
          </button>
        </div>
        {p.stockType !== 'ok' && (
          <span className={styles.stock + (p.stockType === 'warn' ? ' ' + styles.stockWarn : '')}>{p.stock}</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.category}>{p.category}</div>
        <h3 className={styles.name}>{p.name}</h3>
        <div className={styles.scent}>{p.scent}</div>
        <div className={styles.rating}>
          <span aria-hidden="true" className={styles.stars}>
            {stars(p.rating)}
          </span>
          <span className={styles.ratingText}>
            <span className="sr-only">Rated </span>
            {p.rating.toFixed(1)} · {p.reviewCount} reviews
          </span>
        </div>
        <div className={styles.prices}>
          <span className={styles.price}>{formatPrice(p.price)}</span>
          {p.oldPrice !== null && (
            <span className={styles.oldPrice}>
              <span className="sr-only">was </span>
              {formatPrice(p.oldPrice)}
            </span>
          )}
        </div>
        <button type="button" onClick={() => addToCart(p)} className={`btn btn-gold ${styles.add}`}>
          <Icon name="add_shopping_cart" size={19} />
          Add to cart
        </button>
      </div>
    </article>
  );
}
