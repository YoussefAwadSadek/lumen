import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { findProduct } from '../data/catalog';
import { prefersReducedMotion } from '../hooks/motion';
import { useDialog } from '../hooks/useDialog';
import { stars } from '../lib/format';
import { useStore, type QuickViewTarget } from '../store';
import { Icon } from './Icon';
import styles from './QuickView.module.css';

const MAX_TILT_Y = 34;
const MAX_TILT_X = 16;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.4;
const ZOOM_STEP = 0.25;
const MAX_QTY = 9;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Product quick view with a drag-to-tilt, scroll-to-zoom "3D" viewer. */
export function QuickView({ target }: { target: QuickViewTarget }) {
  const { addToCart, closeQuickView, formatPrice, showBadges, toast } = useStore();
  const product = findProduct(target.id);
  const [color, setColor] = useState(target.color);
  const [qty, setQty] = useState(1);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());

  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useDialog<HTMLDivElement>(closeRef);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  // The viewer transform lives in refs and is written straight to the DOM — no re-render per frame.
  const view = useRef({ rx: 0, ry: 0, zoom: 1 });
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
  const autoRef = useRef(auto);

  const paint = useCallback(() => {
    const { rx, ry, zoom } = view.current;
    if (tiltRef.current) tiltRef.current.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;
    if (zoomRef.current) zoomRef.current.style.transform = `scale(${zoom})`;
    if (sheenRef.current) sheenRef.current.style.backgroundPosition = `${50 - ry * 1.8}% 50%`;
  }, []);

  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  // Auto-rotate: a slow sway around Y while the tilt on X settles back to level.
  useEffect(() => {
    let raf = requestAnimationFrame(function loop(t) {
      if (autoRef.current && !drag.current) {
        view.current.ry = 16 * Math.sin(t / 1600);
        view.current.rx *= 0.95;
        paint();
      }
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [paint]);

  // Wheel zoom needs a non-passive listener so the page behind doesn't scroll.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * stage.clientHeight : e.deltaY;
      view.current.zoom = clamp(view.current.zoom - px * 0.0016, MIN_ZOOM, MAX_ZOOM);
      paint();
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [paint]);

  if (!product) return null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, rx: view.current.rx, ry: view.current.ry };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    view.current.ry = clamp(d.ry + (e.clientX - d.x) * 0.22, -MAX_TILT_Y, MAX_TILT_Y);
    view.current.rx = clamp(d.rx + (e.clientY - d.y) * 0.14, -MAX_TILT_X, MAX_TILT_X);
    paint();
  };
  const endDrag = () => {
    drag.current = null;
  };

  const zoomBy = (delta: number) => {
    view.current.zoom = clamp(view.current.zoom + delta, MIN_ZOOM, MAX_ZOOM);
    paint();
  };
  const resetView = () => {
    view.current = { rx: 0, ry: 0, zoom: 1 };
    paint();
    toast('View reset.', 'restart_alt');
  };

  const p = product;
  return (
    <div className={`scrim ${styles.scrim}`} onClick={() => closeQuickView()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        className={`${styles.panel} anim-fade-up-slow`}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" aria-label="Close" onClick={() => closeQuickView()} className={`glass-btn ${styles.close}`}>
          <Icon name="close" />
        </button>

        <div
          ref={stageRef}
          className={styles.stage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div ref={tiltRef} className={styles.tilt}>
            <div ref={zoomRef} className={styles.zoom}>
              <img src={p.img} alt={p.name} draggable={false} className={styles.image} />
              <div ref={sheenRef} aria-hidden="true" className={styles.sheen} />
            </div>
          </div>
          <div aria-hidden="true" className={styles.hint}>
            <span className={styles.hintPill}>
              <Icon name="3d_rotation" size={16} />
              Drag to tilt · scroll to zoom
            </span>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              aria-label={auto ? 'Pause auto-rotate' : 'Start auto-rotate'}
              aria-pressed={auto}
              title="Auto-rotate"
              onClick={() => setAuto(!auto)}
              className={`glass-btn ${styles.control}` + (auto ? ' ' + styles.controlOn : '')}
            >
              <Icon name={auto ? 'pause' : 'play_arrow'} size={20} />
            </button>
            <button type="button" aria-label="Reset view" title="Reset view" onClick={resetView} className={`glass-btn ${styles.control}`}>
              <Icon name="restart_alt" size={20} />
            </button>
            <button type="button" aria-label="Zoom in" title="Zoom in" onClick={() => zoomBy(ZOOM_STEP)} className={`glass-btn ${styles.control}`}>
              <Icon name="add" size={20} />
            </button>
            <button type="button" aria-label="Zoom out" title="Zoom out" onClick={() => zoomBy(-ZOOM_STEP)} className={`glass-btn ${styles.control}`}>
              <Icon name="remove" size={20} />
            </button>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.overline}>{p.category} collection</div>
          <h3 id="qv-title" className={styles.name}>
            {p.name}
          </h3>
          <div className={styles.rating}>
            <span aria-hidden="true" className={styles.stars}>
              {stars(p.rating)}
            </span>
            <span className={styles.ratingText}>
              <span className="sr-only">Rated </span>
              {p.rating.toFixed(1)} · {p.reviewCount} reviews
            </span>
          </div>
          <p className={styles.desc}>{p.desc}</p>
          <div className={styles.prices}>
            <span className={styles.price}>{formatPrice(p.price)}</span>
            {p.oldPrice !== null && (
              <span className={styles.oldPrice}>
                <span className="sr-only">was </span>
                {formatPrice(p.oldPrice)}
              </span>
            )}
            {p.badge && showBadges && (
              <span className={`${styles.badge} ${p.badgeType === 'crimson' ? styles.badgeCrimson : styles.badgeGold}`}>{p.badge}</span>
            )}
          </div>
          <div className={styles.stock + (p.stockType === 'warn' ? ' ' + styles.stockWarn : '')}>{p.stock}</div>

          <div className={styles.colors}>
            <div className={styles.colorsLabel} id="qv-colors">
              Color — poured to order
            </div>
            <div className={styles.swatches} role="group" aria-labelledby="qv-colors">
              {p.colors.map((hex, i) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={`Color ${i + 1} of ${p.colors.length}`}
                  aria-pressed={color === hex}
                  onClick={() => setColor(hex)}
                  className={styles.swatch + (color === hex ? ' ' + styles.swatchOn : '')}
                  style={{ background: hex }}
                />
              ))}
            </div>
          </div>

          <div className={styles.specs}>
            <div className={styles.spec}>
              <Icon name="timer" size={19} className={styles.specIcon} />
              <span className={styles.specText}>{p.burn} burn</span>
            </div>
            <div className={styles.spec}>
              <Icon name="straighten" size={19} className={styles.specIcon} />
              <span className={styles.specText}>{p.size}</span>
            </div>
          </div>

          <div className={styles.buy}>
            <div className={styles.stepper}>
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className={styles.step}>
                <Icon name="remove" size={18} />
              </button>
              <span className={styles.qty} aria-live="polite">
                {qty}
              </span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className={styles.step}>
                <Icon name="add" size={18} />
              </button>
            </div>
            <button type="button" onClick={() => addToCart(p, color, qty)} className={`btn btn-gold ${styles.addBtn}`}>
              <Icon name="add_shopping_cart" size={19} />
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(p, color, qty);
                closeQuickView(true);
              }}
              className={`btn btn-crimson ${styles.buyBtn}`}
            >
              Buy now
            </button>
          </div>
          <div className={styles.shipping}>
            <Icon name="local_shipping" size={17} className={styles.shippingIcon} />
            <span className={styles.shippingText}>Made to order · ships in 5 days · fragile-wrapped by hand</span>
          </div>
        </div>
      </div>
    </div>
  );
}
