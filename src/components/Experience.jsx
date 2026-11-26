import { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { onScroll } from '../motion/scroll';
import Reveal from './Reveal';
import { experience } from '../data/profile';
import './experience.css';

export default function Experience() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const fillRef = useRef(null);
  const trackRef = useRef(null);

  // The rail draws itself as you scroll, lighting each commit as it passes.
  useEffect(() => {
    const list = ref.current;
    if (!list) return undefined;
    const dots = [...list.querySelectorAll('.commit-dot')];
    return onScroll((y, vh) => {
      const r = list.getBoundingClientRect();
      const first = dots[0].getBoundingClientRect();
      const lastDot = dots[dots.length - 1].getBoundingClientRect();
      const start = first.top + first.height / 2 - r.top;
      const end = lastDot.top + lastDot.height / 2 - r.top;
      const reach = Math.max(start, Math.min(end, vh * 0.62 - r.top));
      if (trackRef.current) {
        trackRef.current.style.top = `${start}px`;
        trackRef.current.style.height = `${end - start}px`;
      }
      if (fillRef.current) {
        fillRef.current.style.top = `${start}px`;
        fillRef.current.style.height = `${end - start}px`;
        fillRef.current.style.transform = `scaleY(${end > start ? (reach - start) / (end - start) : 0})`;
      }
      dots.forEach((d) => {
        const dr = d.getBoundingClientRect();
        d.parentElement.parentElement.classList.toggle('lit', dr.top + dr.height / 2 - r.top <= reach + 1);
      });
    });
  }, [ref]);

  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 id="exp-title">Experience</h2>
          <p>Newest first, written the way I’d write a commit log.</p>
        </Reveal>

        <div className="log" ref={ref}>
          <span className="log-track" ref={trackRef} aria-hidden="true" />
          <span className="log-fill" ref={fillRef} aria-hidden="true" />
          <ol className={`log-list ${inView ? 'is-in' : ''}`}>
          {experience.map((e, i) => (
            <li key={e.hash} className="commit" style={{ '--i': i }}>
              <div className="commit-rail" aria-hidden="true">
                <span className="commit-dot" />
              </div>
              <div className="commit-meta mono">
                <span className="hash">{e.hash}</span>
                <span className="when">{e.when}</span>
              </div>
              <div className="commit-body">
                <h3>
                  {e.title}
                  {e.org && <span className="org"> at {e.org}</span>}
                </h3>
                {e.team && <p className="team">{e.team}</p>}
                <ul>
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li className="commit commit-root" style={{ '--i': experience.length }}>
            <div className="commit-rail" aria-hidden="true">
              <span className="commit-dot" />
            </div>
            <div className="commit-meta mono">
              <span className="hash">0000001</span>
              <span className="when">2023</span>
            </div>
            <div className="commit-body">
              <h3>
                Initial commit<span className="org"> at Bowen University</span>
              </h3>
              <p className="team">Started a B.Sc. in Computer Science. Now in final year.</p>
            </div>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
