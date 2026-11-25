import { useEffect, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Zoe Ayilara, back to top">
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
              onClick={() => setOpen(false)}
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
            className="term-btn mono"
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
    </header>
  );
}
