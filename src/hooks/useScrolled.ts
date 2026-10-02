import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether the page has scrolled past `threshold` px, and keeps an optional
 * progress bar's width in sync with the scroll position without re-rendering.
 */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return { scrolled, progressRef };
}
