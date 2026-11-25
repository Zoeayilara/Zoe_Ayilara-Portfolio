import ApiConsole from './ApiConsole';
import { profile } from '../data/profile';
import './hero.css';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-status">
            <span className="pulse" aria-hidden="true" />
            Available for backend and freelance work
          </p>
          <h1 id="hero-name" className="hero-name">
            <span className="line">
              <span>Zoe</span>
            </span>
            <span className="line">
              <span>
                Ayilara<span className="name-caret" aria-hidden="true" />
              </span>
            </span>
          </h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#work">
              See my work
            </a>
            <a className="btn btn-ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>
        <div className="hero-console">
          <ApiConsole />
        </div>
      </div>
    </section>
  );
}
