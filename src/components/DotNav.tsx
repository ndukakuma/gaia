'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Item = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  subtle?: boolean;
};
type Anchor = 'left' | 'right';

export default function DotNav({
  items = [
    { label: 'Home', href: '/' },
    { label: 'Back', onClick: () => history.back() },
  ],
  top = 12,
  left,
  right,
  header,
  footer,
}: {
  items?: Item[];
  top?: number;
  left?: number;
  right?: number;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const closeOnClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', closeOnClick);
    return () => document.removeEventListener('click', closeOnClick);
  }, []);

  const anchor: Anchor = left !== undefined ? 'left' : 'right';

  const posStyle: CSSProperties =
    anchor === 'left'
      ? { position: 'fixed', top, left: left ?? 12, zIndex: 120 }
      : { position: 'fixed', top, right: right ?? 12, zIndex: 120 };

  return (
    <div
      ref={rootRef}
      className={`dotnav ${anchor} ${open ? 'open' : ''}`}
      style={posStyle}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-label="Menu"
        className="dotnav-dot"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      />
      <div
        className="dotnav-panel"
        role="menu"
        aria-hidden={!open}
      >
        {header ? <div className="dotnav-header">{header}</div> : null}
        <div className="dotnav-items">
          {items.map((it, i) =>
            it.href ? (
              <a
                key={i}
                href={it.href}
                className={`dotnav-item${it.subtle ? ' subtle' : ''}`}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {it.icon ? <span className="dotnav-icon">{it.icon}</span> : null}
                <span>{it.label}</span>
              </a>
            ) : (
              <button
                key={i}
                onClick={() => {
                  it.onClick?.();
                  setOpen(false);
                }}
                className={`dotnav-item${it.subtle ? ' subtle' : ''}`}
                role="menuitem"
              >
                {it.icon ? <span className="dotnav-icon">{it.icon}</span> : null}
                <span>{it.label}</span>
              </button>
            )
          )}
        </div>
        {footer ? <div className="dotnav-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
