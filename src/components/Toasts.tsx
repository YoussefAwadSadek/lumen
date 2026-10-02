import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Toasts.module.css';

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className={styles.stack} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} anim-fade-up`}>
          <Icon name={t.icon} size={20} className={styles.icon} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
