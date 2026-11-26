import { useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { onScroll, lockScroll, scrollToId } from '../motion/scroll';
import './nav.css';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];
const ids = links.map((l) => l.id);

export default function Nav({ onTerminal }) {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const barRef = useRef(null);

  useEffect(
    () =>
      onScroll((y, vh) => {
        setScrolled(y > 8);
        const max = document.documentElement.scrollHeight - vh;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }),
    [],
  );

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    lockScroll(false);
    scrollToId(id);
    history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`);
  };

  useEffect(() => {
    lockScroll(open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Zoe Ayilara, back to top" onClick={(e) => go(e, 'top')}>
          <span className="brand-mark" aria-hidden="true">
            za
          </span>
          <span className="brand-name">Zoe Ayilara</span>
        </a>

        <nav aria-label="Sections" className="nav-links" id="nav-links">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? 'true' : undefined}
              onClick={(e) => go(e, l.id)}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="nav-term-mobile"
            onClick={() => {
              setOpen(false);
              onTerminal();
            }}
          >
            Open terminal
          </button>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="term-btn mono magnetic"
            onClick={onTerminal}
            aria-label="Open terminal (shortcut: backtick)"
            title="Open terminal  ( ` )"
          >
            <span aria-hidden="true">&gt;_</span>
            <kbd aria-hidden="true">`</kbd>
          </button>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="bars" aria-hidden="true" />
          </button>
        </div>
      </div>
      <span className="nav-progress" ref={barRef} aria-hidden="true" />
    </header>
  );
}
