import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import { stack, featured, infera, clientWork, earlier, experience } from '../data/profile';
import './stack.css';

// Every place a technology shows up, built from the same data the
// rest of the page uses.
function useUsage() {
  return useMemo(() => {
    const map = {};
    const add = (ids, label) =>
      ids.forEach((id) => {
        (map[id] ||= []).push(label);
      });
    add(featured.tech, featured.name);
    add(infera.tech, infera.name);
    clientWork.forEach((c) => add(c.tech, c.name));
    earlier.forEach((p) => add(p.tech, p.name));
    experience.forEach((e) => add(e.tech, `${e.title}, ${e.org}`));
    Object.keys(map).forEach((k) => {
      map[k] = [...new Set(map[k])];
    });
    return map;
  }, []);
}

export default function Stack() {
  const usage = useUsage();
  const [selected, setSelected] = useState('express');
  const label = stack.flatMap((g) => g.items).find((i) => i.id === selected)?.label;
  const used = usage[selected] || [];

  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 id="stack-title">Stack</h2>
          <p>Pick any tool to see where I’ve used it on this page.</p>
        </Reveal>

        <div className="stack">
          <Reveal className="stack-groups stagger">
            {stack.map((g) => (
              <div key={g.group} className="stack-group" role="group" aria-label={g.group}>
                <h3>{g.group}</h3>
                <div className="chips">
                  {g.items.map((it, idx) => (
                    <button
                      style={{ '--i': idx }}
                      key={it.id}
                      type="button"
                      className="chip"
                      aria-pressed={selected === it.id}
                      onClick={() => setSelected(it.id)}
                    >
                      {it.label}
                      {usage[it.id] && <span className="count" aria-hidden="true">{usage[it.id].length}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="usage on-dark" delay={100}>
            <div className="usage-q mono">
              <span className="prompt">$</span> grep -r &quot;{label}&quot; ./zoe
            </div>
            <div className="usage-a mono" aria-live="polite" key={selected}>
              {used.length ? (
                <>
                  {used.map((u) => (
                    <div key={u} className="hit">
                      <span className="file">{u}</span>
                    </div>
                  ))}
                  <div className="sum">
                    {used.length} {used.length === 1 ? 'match' : 'matches'}
                  </div>
                </>
              ) : (
                <div className="none">
                  Not in a project on this page yet. Ask me about where I’ve used {label}.
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
