import { useState } from 'react';
import Json from './Json';
import Reveal from './Reveal';
import { featured, infera, clientWork, earlier, allTechLabels } from '../data/profile';
import './work.css';

function Architecture({ endpoint }) {
  const active = new Set(['client', 'api', ...endpoint.touches]);
  // Background jobs don't start at the client.
  if (endpoint.method === 'JOB') active.delete('client');
  return (
    <div className="arch" aria-hidden="true">
      <div className="arch-track">
        {featured.nodes.map((n) => (
          <div key={n.id} className={`arch-node ${active.has(n.id) ? 'on' : ''}`}>
            <strong>{n.label}</strong>
            <span>{n.note}</span>
          </div>
        ))}
        <span
          key={endpoint.path}
          className={`packet ${endpoint.method === 'JOB' ? 'from-api' : ''}`}
        />
      </div>
      <div className="arch-side">
        {featured.sidecars.map((s) => (
          <div key={s.id} className={`arch-chip ${active.has(s.id) ? 'on' : ''}`}>
            <strong>{s.label}</strong>
            <span>{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Featured() {
  const [i, setI] = useState(0);
  const ep = featured.endpoints[i];

  const onKey = (e) => {
    const n = featured.endpoints.length;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setI(next);
      document.getElementById(`ep-${next}`)?.focus();
    }
  };

  return (
    <article className="feature" aria-labelledby="feature-title">
      <header className="feature-head">
        <div>
          <p className="feature-kicker">
            Featured project, {featured.year}. My role: {featured.role.toLowerCase()}.
          </p>
          <h3 id="feature-title">{featured.name}</h3>
          <p className="feature-summary">{featured.summary}</p>
        </div>
        <a className="btn btn-primary" href={featured.live} target="_blank" rel="noopener noreferrer">
          Open the live app
        </a>
      </header>

      <div className="explorer">
        <div className="ep-list" role="tablist" aria-label="StudyCircle endpoints" aria-orientation="vertical" onKeyDown={onKey}>
          <p className="ep-hint">Pick a request to see how it moves through the system.</p>
          {featured.endpoints.map((e, idx) => (
            <button
              key={e.path}
              id={`ep-${idx}`}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-controls="ep-panel"
              tabIndex={i === idx ? 0 : -1}
              className="ep"
              onClick={() => setI(idx)}
            >
              <span className={`method method-${e.method}`}>{e.method}</span>
              <span className="ep-path mono">{e.path}</span>
              <span className="ep-title">{e.title}</span>
            </button>
          ))}
        </div>

        <div className="ep-panel on-dark" id="ep-panel" role="tabpanel" aria-labelledby={`ep-${i}`}>
          <Architecture endpoint={ep} />
          <div className="ep-detail" key={ep.path}>
            <h4>{ep.title}</h4>
            <p>{ep.detail}</p>
            <div className="ep-response">
              <div className="ep-response-head mono">
                <span className="ok">{ep.status || 200}</span>
                <span>Example response</span>
              </div>
              <pre className="mono">
                <Json value={ep.response} />
              </pre>
            </div>
          </div>
        </div>
      </div>

      <ul className="feature-tech" aria-label="Built with">
        {featured.tech
          .filter((t) => !['javascript', 'sql', 'git', 'postman', 'rest'].includes(t))
          .map((t) => (
            <li key={t}>{allTechLabels[t]}</li>
          ))}
      </ul>
    </article>
  );
}

export default function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 id="work-title">Work</h2>
          <p>Backend systems I’ve built and shipped, plus sites made for clients.</p>
        </Reveal>

        <Reveal>
          <Featured />
        </Reveal>

        <div className="more">
          <Reveal as="article" className="infera" aria-labelledby="infera-title">
            <p className="client-kicker">Machine learning, {infera.year}</p>
            <h3 id="infera-title">{infera.name}</h3>
            <p className="infera-summary">{infera.summary}</p>
            <dl className="metrics">
              {infera.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="feature-tech" aria-label="Built with">
              {infera.tech.map((t) => (
                <li key={t}>{allTechLabels[t]}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="client" delay={80}>
            {clientWork.map((c) => (
              <a key={c.id} className="client-card" href={c.url} target="_blank" rel="noopener noreferrer">
                <div className="client-chrome mono" aria-hidden="true">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="client-url">{c.domain}</span>
                </div>
                <div className="client-body">
                  <p className="client-kicker">Client project, {c.year}</p>
                  <h3>{c.name}</h3>
                  <p>{c.summary}</p>
                  <span className="client-visit">Visit {c.domain}</span>
                </div>
              </a>
            ))}
          </Reveal>

          <Reveal className="earlier">
            <h3>Earlier builds</h3>
            <p className="earlier-note">Frontend projects from when I was learning to work with APIs.</p>
            <ul>
              {earlier.map((p) => (
                <li key={p.id}>
                  <div>
                    <strong>{p.name}</strong>
                    <span>{p.summary}</span>
                  </div>
                  <div className="earlier-links">
                    <a className="link" href={p.live} target="_blank" rel="noopener noreferrer">
                      Live<span className="sr-only"> demo of {p.name}</span>
                    </a>
                    <a className="link" href={p.repo} target="_blank" rel="noopener noreferrer">
                      Code<span className="sr-only"> for {p.name}</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
