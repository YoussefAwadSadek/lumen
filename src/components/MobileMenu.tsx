import { useDialog } from '../hooks/useDialog';
import { useStore } from '../store';
import { Icon } from './Icon';
import { NAV_LINKS } from './Navbar';
import styles from './MobileMenu.module.css';

export function MobileMenu() {
  const { closeMenu } = useStore();
  const panelRef = useDialog<HTMLDivElement>();

  return (
    <div className={`scrim ${styles.scrim}`} onClick={closeMenu}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`${styles.panel} anim-slide-in-left`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <span className={styles.wordmark}>LUMEN</span>
          <button type="button" aria-label="Close menu" onClick={closeMenu} className="close-btn">
            <Icon name="close" />
          </button>
        </div>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMenu} className={styles.link}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
