import { useCallback } from 'react';
import { prefersReducedMotion } from './motion';

const DURATION_MS = 700;

/** Elements that have already been measured — they are never hidden twice. */
const seen = new WeakSet<HTMLElement>();
/** Elements hidden below the fold, waiting to scroll into view. */
const pending = new WeakSet<HTMLElement>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    },
    { threshold: 0.12 },
  );
  return observer;
}

function reveal(el: HTMLElement) {
  observer?.unobserve(el);
  pending.delete(el);
  el.style.opacity = '1';
  el.style.transform = 'none';
  // Once the entrance has played, drop the inline styles so the element's own CSS
  // (hover lifts, transitions) is back in charge.
  const delay = parseFloat(el.style.transitionDelay) || 0;
  window.setTimeout(() => {
    for (const prop of ['opacity', 'transform', 'transition', 'transition-delay']) el.style.removeProperty(prop);
  }, delay + DURATION_MS + 50);
}

function register(el: HTMLElement, delay: number) {
  if (seen.has(el)) {
    if (pending.has(el)) getObserver().observe(el);
    return;
  }
  seen.add(el);
  if (prefersReducedMotion()) return;
  // Only content that starts below the fold fades up; what's already on screen stays put.
  if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;
  pending.add(el);
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity ${DURATION_MS}ms var(--ak-ease-cinematic), transform ${DURATION_MS}ms var(--ak-ease-cinematic)`;
  el.style.transitionDelay = delay + 'ms';
  getObserver().observe(el);
}

/**
 * Fade-up-on-scroll. Returns a ref callback; `delay` (ms) staggers siblings.
 * The same callback can be attached to several elements.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(delay = 0) {
  return useCallback(
    (el: T | null) => {
      if (!el) return;
      register(el, delay);
      return () => observer?.unobserve(el);
    },
    [delay],
  );
}
