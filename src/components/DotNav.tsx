'use client';
import { useEffect, useRef, useState } from 'react';

type Item = { label: string; href?: string; onClick?: () => void };
type Anchor = 'left' | 'right';

export default function DotNav({
  items = [
    { label: 'Home', href: '/' },
    { label: 'Back', onClick: () => history.back() },
  ],
  top = 12,
  left,              // if provided → anchor = 'left'
  right,             // if provided → anchor = 'right'
}: {
  items?: Item[];
  top?: number;
  left?: number;
  right?: number;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const anchor: Anchor = left !== undefined ? 'left' : 'right';

  const posStyle: React.CSSProperties =
    anchor === 'left'
      ? { position: 'fixed', top, left: left ?? 12, zIndex: 40 }
      : { position: 'fixed', top, right: right ?? 12, zIndex: 40 };

  return (
    <div
      ref={rootRef}
      className={`dotnav ${anchor} ${open ? 'open' : ''}`}
      style={posStyle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-label="Menu"
        className="dotnav-dot"
        onClick={() => setOpen(o => !o)}
      />
      <div className="dotnav-panel" role="menu" aria-hidden={!open}>
        {items.map((it, i) =>
          it.href ? (
            <a key={i} href={it.href} className="dotnav-item" role="menuitem">{it.label}</a>
          ) : (
            <button key={i} onClick={it.onClick} className="dotnav-item" role="menuitem">
              {it.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
