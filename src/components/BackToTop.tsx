import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './BackToTop.module.css';

export function BackToTop({ visible }: { visible: boolean }) {
  const { scrollToTop } = useStore();
  if (!visible) return null;
  return (
    <button type="button" aria-label="Back to top" onClick={scrollToTop} className={styles.button}>
      <Icon name="arrow_upward" />
    </button>
  );
}
