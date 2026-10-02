import { useEffect, useRef, type MouseEvent } from 'react';
import { EMBERS, FEATURED_PRODUCT_ID, findProduct, oceanBowl } from '../data/catalog';
import { prefersReducedMotion } from '../hooks/motion';
import { useStore } from '../store';
import { Icon } from './Icon';
import styles from './Hero.module.css';

export function Hero() {
  const { formatPrice, heroFloat, openQuickView } = useStore();
  const featured = findProduct(FEATURED_PRODUCT_ID)!;
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ nx: 0, ny: 0 });
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Pointer parallax: the product tilts toward the cursor and the crimson bloom drifts with it.
  const onMouseMove = (e: MouseEvent) => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;
    const r = hero.getBoundingClientRect();
    pointer.current = { nx: (e.clientX - r.left) / r.width - 0.5, ny: (e.clientY - r.top) / r.height - 0.5 };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const { nx, ny } = pointer.current;
      if (tiltRef.current) tiltRef.current.style.transform = `perspective(900px) rotateX(${-ny * 7}deg) rotateY(${nx * 9}deg)`;
      if (bloomRef.current) bloomRef.current.style.transform = `translate(${nx * 46}px,${ny * 34}px)`;
    });
  };

  const onMouseLeave = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    if (bloomRef.current) bloomRef.current.style.transform = 'translate(0,0)';
  };

  return (
    <header id="top" ref={heroRef} className={styles.hero} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <div ref={bloomRef} className={styles.bloom} aria-hidden="true" />
      {EMBERS.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={styles.ember}
          style={{ left: p.left + '%', width: p.size, height: p.size, background: p.color, animation: `akEmber ${p.dur}s linear ${p.delay}s infinite` }}
        />
      ))}

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={`ak-overline ${styles.overline}`}>Hand-poured · Small batch · Made to order</div>
          <h1 className={styles.title}>
            The dark was made
            <br />
            for <em className="ak-gold-text">candlelight.</em>
          </h1>
          <p className={styles.lede}>Sculpted candles in glass, shell and coconut husk — poured by hand, in your color, in your scent.</p>
          <div className={styles.ctas}>
            <a href="#shop" className={`btn btn-gold ${styles.ctaPrimary}`}>
              Shop the collection
              <Icon name="arrow_forward" size={19} />
            </a>
            <a href="#about" className={`btn btn-outline ${styles.ctaSecondary}`}>
              Our story
            </a>
          </div>
          <div className={styles.facts}>
            <div>
              <div className={styles.factValue}>
                4.9<span className={styles.factStar}>★</span>
              </div>
              <div className={styles.factLabel}>from 650+ reviews</div>
            </div>
            <div>
              <div className={styles.factValue}>38</div>
              <div className={styles.factLabel}>scents to choose</div>
            </div>
            <div>
              <div className={styles.factValue}>5 days</div>
              <div className={styles.factLabel}>poured &amp; shipped</div>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.float} style={{ animation: heroFloat ? 'akFloat 7s ease-in-out infinite' : 'none' }}>
            <div ref={tiltRef} className={styles.tilt}>
              <img src={oceanBowl} alt="The Ocean Bowl — hand-poured aquarium candle" className={styles.image} fetchPriority="high" />
              <img src={oceanBowl} alt="" aria-hidden="true" className={styles.reflection} />
              <button type="button" className={styles.feature} onClick={() => openQuickView(featured)}>
                <span className={styles.featureText}>
                  <span className={styles.featureName}>{featured.name}</span>
                  <span className={styles.featurePrice}>{formatPrice(featured.price)}</span>
                </span>
                <span className={styles.featureView}>
                  <Icon name="view_in_ar" size={18} />
                  View
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>SCROLL</span>
        <span className={`${styles.scrollLine} anim-scroll-hint`} />
      </div>
    </header>
  );
}
