import type { CSSProperties } from 'react';

interface IconProps {
  /** Material Symbols ligature name, e.g. `shopping_bag`. Must be listed in index.html's icon subset. */
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Decorative Material Symbols glyph — hidden from screen readers; label the control instead. */
export function Icon({ name, size, filled, className, style }: IconProps) {
  return (
    <span
      className={'material-symbols-outlined' + (className ? ' ' + className : '')}
      aria-hidden="true"
      style={{ fontSize: size, fontVariationSettings: filled === undefined ? undefined : `'FILL' ${filled ? 1 : 0}`, ...style }}
    >
      {name}
    </span>
  );
}
