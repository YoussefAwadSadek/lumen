import { useDialog } from '../hooks/useDialog';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { cartRows, cartCount, subtotal, changeQty, formatPrice, closeDrawer, scrollToSection, toast } = useStore();
  const panelRef = useDialog<HTMLElement>();

  const browse = () => {
    closeDrawer();
    scrollToSection('shop');
  };

  return (
    <div className={`scrim ${styles.scrim}`} onClick={closeDrawer}>
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`${styles.drawer} anim-slide-in-right`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <h2 id="cart-title" className={styles.title}>
            Your order <span className={styles.titleCount}>· {cartCount === 1 ? '1 item' : `${cartCount} items`}</span>
          </h2>
          <button type="button" aria-label="Close cart" onClick={closeDrawer} className="close-btn">
            <Icon name="close" />
          </button>
        </div>

        <div className={styles.body}>
          {cartRows.length === 0 && (
            <div className={styles.empty}>
              <Icon name="shopping_bag" size={44} className={styles.emptyIcon} />
              <div className={styles.emptyText}>The bag is empty. Begin with a small fire.</div>
              <button type="button" onClick={browse} className={`btn btn-outline ${styles.browse}`}>
                Browse the collection
              </button>
            </div>
          )}
          {cartRows.map(({ key, product, color, qty }) => (
            <div key={key} className={styles.line}>
              <img src={product.img} alt={product.name} loading="lazy" className={styles.thumb} />
              <div className={styles.lineMain}>
                <div className={styles.lineTitle}>
                  <span className={styles.lineName}>{product.name}</span>
                  <span aria-hidden="true" className={styles.dot} style={{ background: color }} />
                </div>
                <div className={styles.unit}>{formatPrice(product.price)} each</div>
                <div className={styles.stepper}>
                  <button type="button" aria-label={`Decrease quantity of ${product.name}`} onClick={() => changeQty(key, -1)} className={styles.step}>
                    <Icon name="remove" size={16} />
                  </button>
                  <span className={styles.qty}>{qty}</span>
                  <button type="button" aria-label={`Increase quantity of ${product.name}`} onClick={() => changeQty(key, 1)} className={styles.step}>
                    <Icon name="add" size={16} />
                  </button>
                </div>
              </div>
              <div className={styles.lineEnd}>
                <span className={styles.lineTotal}>{formatPrice(product.price * qty)}</span>
                <button type="button" aria-label={`Remove ${product.name}`} onClick={() => changeQty(key, -qty)} className={styles.remove}>
                  <Icon name="delete" size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cartRows.length > 0 && (
          <div className={styles.foot}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotal}>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.shipNote}>Poured, cured and shipped within 5 days.</div>
            {/* Front-end only, as in the design — orders currently go through WhatsApp. */}
            <button
              type="button"
              onClick={() => toast('Prototype checkout — orders go through WhatsApp for now.', 'lock')}
              className={`btn btn-crimson ${styles.checkout}`}
            >
              <Icon name="lock" size={20} />
              Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
