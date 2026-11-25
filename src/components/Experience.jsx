import { useInView } from '../hooks/useInView';
import Reveal from './Reveal';
import { experience } from '../data/profile';
import './experience.css';

export default function Experience() {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 id="exp-title">Experience</h2>
          <p>Newest first, written the way I’d write a commit log.</p>
        </Reveal>

        <ol ref={ref} className={`log ${inView ? 'is-in' : ''}`}>
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
    </section>
  );
}
