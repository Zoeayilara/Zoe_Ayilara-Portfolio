import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import './footer.css';

export default function Footer({ onTerminal }) {
  const [ms, setMs] = useState(null);

  useEffect(() => {
    // Real numbers from the browser's Navigation Timing API.
    const read = () => {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.loadEventEnd > 0) setMs(Math.round(nav.loadEventEnd));
    };
    if (document.readyState === 'complete') setTimeout(read, 0);
    else window.addEventListener('load', () => setTimeout(read, 0), { once: true });
  }, []);

  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed and built by me with React and Vite.
        </p>
        <p className="mono footer-meta">
          {ms !== null && <span>This page loaded in {ms} ms.</span>}
          <button type="button" className="link" onClick={onTerminal}>
            Press ` for a terminal
          </button>
        </p>
      </div>
    </footer>
  );
}
