import { useEffect, useRef } from 'react';
import ApiConsole from './ApiConsole';
import HeroField from './HeroField';
import Decode from './Decode';
import { profile } from '../data/profile';
import { onScroll, clamp } from '../motion/scroll';
import './hero.css';

export default function Hero() {
  const copyRef = useRef(null);
  const consoleRef = useRef(null);

  // As you scroll away, the copy drifts up and fades and the console
  // tilts back slightly, so the hero hands off to the page instead of
  // just scrolling out.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    return onScroll((y, vh) => {
      const p = clamp(y / (vh * 0.9));
      if (p >= 1 && copyRef.current?.dataset.done) return;
      if (copyRef.current) {
        copyRef.current.style.transform = `translate3d(0, ${p * -60}px, 0)`;
        copyRef.current.style.opacity = String(1 - p * 0.85);
        copyRef.current.dataset.done = p >= 1 ? '1' : '';
      }
      if (consoleRef.current && window.innerWidth > 960) {
        consoleRef.current.style.transform = `perspective(1200px) translate3d(0, ${p * -30}px, 0) rotateX(${p * 8}deg) scale(${1 - p * 0.04})`;
      }
    });
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <HeroField />
      <div className="wrap hero-grid">
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-status">
            <span className="pulse" aria-hidden="true" />
            Available for backend and freelance work
          </p>
          <h1 id="hero-name" className="hero-name">
            <span className="line">
              <Decode text="Zoe" delay={150} />
            </span>
            <span className="line">
              <Decode text="Ayilara" delay={260} />
              <span className="name-caret" aria-hidden="true" />
            </span>
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-cta">
            <a className="btn btn-primary magnetic" href="#work">
              See my work
            </a>
            <a className="btn btn-ghost magnetic" href="#contact">
              Get in touch
            </a>
          </div>
          <p className="hero-hint">Move your cursor over the grid. Click it, too.</p>
        </div>
        <div className="hero-console" ref={consoleRef}>
          <ApiConsole />
        </div>
      </div>
    </section>
  );
}
