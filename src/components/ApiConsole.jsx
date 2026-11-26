import { useCallback, useEffect, useRef, useState } from 'react';
import Json, { jsonLength } from './Json';
import { useReducedMotion } from '../hooks/useReducedMotion';

const routes = [
  { id: 'zoe', path: '/v1/zoe.json', label: 'zoe' },
  { id: 'now', path: '/v1/now.json', label: 'now' },
  { id: 'projects', path: '/v1/projects.json', label: 'projects' },
];

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function ApiConsole() {
  const reduced = useReducedMotion();
  const [route, setRoute] = useState(routes[0]);
  const [state, setState] = useState({ phase: 'idle' });
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState(false);
  const raf = useRef(0);
  const reqId = useRef(0);

  const send = useCallback(
    async (r) => {
      const id = ++reqId.current;
      cancelAnimationFrame(raf.current);
      setShown(0);
      setState({ phase: 'loading' });
      const t0 = performance.now();
      try {
        const res = await fetch(`${base}${r.path}`, { cache: 'no-store' });
        const data = await res.json();
        // Hold the "sending" state long enough to be seen.
        const elapsed = performance.now() - t0;
        if (!reduced && elapsed < 280) await new Promise((ok) => setTimeout(ok, 280 - elapsed));
        if (id !== reqId.current) return;
        setState({ phase: 'done', status: res.status, ms: Math.max(1, Math.round(elapsed)), data });
      } catch (err) {
        if (id !== reqId.current) return;
        setState({ phase: 'error', message: 'Request failed. Check your connection and send it again.' });
      }
    },
    [reduced],
  );

  // Stream the response body in.
  useEffect(() => {
    if (state.phase !== 'done') return undefined;
    const total = jsonLength(state.data);
    if (reduced) {
      setShown(total);
      return undefined;
    }
    let n = 0;
    const step = () => {
      n = Math.min(total, n + 9);
      setShown(n);
      if (n < total) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [state, reduced]);

  useEffect(() => {
    const t = setTimeout(() => send(routes[0]), reduced ? 0 : 900);
    return () => clearTimeout(t);
  }, [send, reduced]);

  const pick = (r) => {
    setRoute(r);
    send(r);
  };

  const copyCurl = async () => {
    const url = `${window.location.origin}${base}${route.path}`;
    try {
      await navigator.clipboard.writeText(`curl ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  };

  const streaming = state.phase === 'done' && shown < jsonLength(state.data);

  return (
    <div className="console on-dark" role="region" aria-label="Live API console">
      <div className="console-bar">
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="console-tabs" role="tablist" aria-label="Endpoint">
          {routes.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={route.id === r.id}
              className="mono"
              onClick={() => pick(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="console-req mono">
        <span className="method method-GET">GET</span>
        <span className="console-path">{route.path}</span>
        <button type="button" className="console-send" onClick={() => send(route)}>
          Send
        </button>
      </div>

      <div className="console-meta mono" aria-live="polite">
        {state.phase === 'loading' && <span className="pending">Sending request…</span>}
        {state.phase === 'done' && (
          <>
            <span className="ok">
              {state.status} {state.status === 200 ? 'OK' : ''}
            </span>
            <span>{state.ms} ms</span>
            <span>application/json</span>
          </>
        )}
        {state.phase === 'error' && <span className="err">{state.message}</span>}
        {state.phase === 'idle' && <span className="pending">Waiting</span>}
      </div>

      <pre className="console-body mono" tabIndex={0} aria-label="Response body">
        {state.phase === 'done' ? <Json value={state.data} limit={shown} /> : ' '}
        {(streaming || state.phase === 'loading') && <span className="caret" aria-hidden="true" />}
      </pre>

      <div className="console-foot mono">
        <span>This is a real request to a file on this site.</span>
        <button type="button" onClick={copyCurl}>
          {copied ? 'Copied' : 'Copy as curl'}
        </button>
      </div>
    </div>
  );
}
