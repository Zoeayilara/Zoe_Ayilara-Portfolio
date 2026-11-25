import Reveal from './Reveal';
import zoe from '../assets/zoe.webp';
import { profile } from '../data/profile';
import './about.css';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <Reveal className="portrait">
          <div className="portrait-frame">
            <img src={zoe} alt="Portrait of Zoe Ayilara" width="375" height="666" loading="lazy" decoding="async" />
          </div>
          <p className="portrait-cap mono">
            <span>7.63° N, 4.18° E</span>
            <span>Iwo, Osun</span>
          </p>
        </Reveal>

        <Reveal className="about-copy" delay={80}>
          <h2 id="about-title">About</h2>
          <p className="lede">
            I’m Zoe, a final-year Computer Science student at {profile.school}, and the person
            on a team who ends up owning the API.
          </p>
          <p>
            I like the work most people skip: designing the schema before anyone writes a screen,
            making the dashboard load in one request instead of four, catching the routing bug that
            made an endpoint silently unreachable. When a free-tier database started running out of
            compute hours, I traced it to our own reminder job and fixed the interval.
          </p>
          <p>
            Outside of client work I run the hardware unit for NACOS at Bowen, and I’ve spent time
            teaching classmates OOP and graph theory, which is mostly how I learned to explain a
            system in plain words.
          </p>
          <dl className="facts">
            <div>
              <dt>Based in</dt>
              <dd>Nigeria, working remotely</dd>
            </div>
            <div>
              <dt>Best fit</dt>
              <dd>Backend, APIs, databases, integrations</dd>
            </div>
            <div>
              <dt>Also do</dt>
              <dd>React frontends, ML features</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
