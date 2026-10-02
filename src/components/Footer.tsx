import type { FormEvent } from 'react';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Footer.module.css';

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { href: '#shop', label: 'All candles' },
      { href: '#collections', label: 'Collections' },
      { href: '#reviews', label: 'Reviews' },
    ],
  },
  {
    heading: 'Studio',
    links: [
      { href: '#about', label: 'Our story' },
      { href: '#contact', label: 'Contact' },
      { href: '#contact', label: 'Custom orders' },
    ],
  },
];

export function Footer() {
  const { toast } = useStore();

  // Front-end only, as in the design — connect a mailing-list provider before launch.
  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    toast("You're on the list. First to know when we pour.", 'local_fire_department');
  };
  const soon = () => toast('Coming soon.', 'hourglass_empty');

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Icon name="local_fire_department" size={22} className={styles.flame} />
              <span className={styles.wordmark}>LUMEN</span>
            </div>
            <p className={styles.tagline}>Hand-poured sculptural candles. Made to order, sealed like a secret.</p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.heading} className={styles.col} aria-label={col.heading}>
              <h2 className={styles.heading}>{col.heading}</h2>
              <div className={styles.links}>
                {col.links.map((l) => (
                  <a key={l.label} href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}
          <div className={styles.newsletter}>
            <h2 className={styles.heading} id="newsletter-title">
              First to know
            </h2>
            <form onSubmit={onSubscribe} className={styles.subscribe} aria-labelledby="newsletter-title">
              <input
                name="newsletter"
                type="email"
                required
                placeholder="Your email"
                aria-label="Email for newsletter"
                autoComplete="email"
                className={`field ${styles.email}`}
              />
              <button type="submit" aria-label="Subscribe" className={styles.go}>
                <Icon name="arrow_forward" size={20} />
              </button>
            </form>
            <p className={styles.note}>New pours, seasonal scents. One letter a month, no more.</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.copyright}>© 2026 LUMEN — hand-poured candles. All rights reserved.</div>
          <div className={styles.legal}>
            <button type="button" onClick={soon} className={styles.legalLink}>
              Privacy
            </button>
            <button type="button" onClick={soon} className={styles.legalLink}>
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
