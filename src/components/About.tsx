import { useEffect, useRef, useState } from 'react';
import { posterShell, STATS } from '../data/catalog';
import { prefersReducedMotion } from '../hooks/motion';
import { useReveal } from '../hooks/useReveal';
import { Icon } from './Icon';
import styles from './About.module.css';

const FEATURES = [
  { icon: 'volunteer_activism', title: 'Hand-poured, small batch', text: 'Gel, soy and paraffin blends, shaped without molds where it matters.', delay: 160 },
  { icon: 'palette', title: 'Your color, your scent', text: 'Every design is made to order in 38 scents and any palette you name.', delay: 220 },
  { icon: 'redeem', title: 'Gift-sealed by hand', text: 'Wrapped, ribboned and noted — ready to give the moment it arrives.', delay: 280 },
];

export function About() {
  const reveal0 = useReveal(0);
  const reveal60 = useReveal(60);
  const reveal120 = useReveal(120);

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div ref={reveal0} className={styles.posterWrap}>
          <img src={posterShell} alt="LUMEN — Whispering Shell poster" loading="lazy" width={1221} height={1600} className={styles.poster} />
        </div>
        <div className={styles.copy}>
          <div ref={reveal0} className="ak-overline">
            Our story
          </div>
          <h2 ref={reveal60} id="about-title" className={`section-title ${styles.title}`}>
            Poured after midnight.
          </h2>
          <p ref={reveal120} className={styles.lede}>
            LUMEN began as one teacup filled with wax instead of tea. Now every piece is still poured the same way — one at a time, sculpted by hand,
            sealed like a gift. No two candles leave the studio identical.
          </p>
          <div className={styles.features}>
            {FEATURES.map((f) => (
              <Feature key={f.title} {...f} />
            ))}
          </div>
          <Stats />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text, delay }: (typeof FEATURES)[number]) {
  const reveal = useReveal(delay);
  return (
    <div ref={reveal} className={styles.feature}>
      <Icon name={icon} size={22} className={styles.featureIcon} />
      <div>
        <div className={styles.featureTitle}>{title}</div>
        <div className={styles.featureText}>{text}</div>
      </div>
    </div>
  );
}

const COUNT_MS = 1300;

/** Counts each figure up from zero (ease-out) the first time the row is mostly on screen. */
function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || progress === 1) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
    // Starts once; re-running on every progress tick would restart the count.
  }, []);

  return (
    <div ref={ref} className={styles.stats}>
      {STATS.map((s) => (
        <div key={s.label}>
          <div className={styles.statValue} aria-hidden="true">
            {s.format(s.value * progress)}
          </div>
          <div className={styles.statLabel}>
            <span className="sr-only">{s.format(s.value)} </span>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
