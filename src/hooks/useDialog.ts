import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for an overlay panel: moves focus into it on open, keeps Tab
 * inside it, and hands focus back to whatever opened it on close.
 */
export function useDialog<T extends HTMLElement>(initialFocus?: RefObject<HTMLElement | null>) {
  const panelRef = useRef<T>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    (initialFocus?.current ?? panel?.querySelector<HTMLElement>(FOCUSABLE))?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
    // Runs once per open — the overlay unmounts when it closes.
  }, []);

  return panelRef;
}
