import { useEffect, useRef, useState } from 'react';
import Json from './Json';
import { profile, featured, infera, clientWork, earlier, stack } from '../data/profile';
import { lockScroll, scrollToId } from '../motion/scroll';
import './terminal.css';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const openables = {
  studycircle: featured.live,
  author: clientWork[0].url,
  github: profile.github,
  resume: profile.resume,
  ...Object.fromEntries(earlier.map((p) => [p.id, p.live])),
};
const sections = ['work', 'experience', 'stack', 'about', 'contact'];
const commandNames = [
  'help', 'whoami', 'ls', 'cat', 'open', 'cd', 'curl', 'history', 'date', 'contact', 'clear', 'exit', 'sudo', 'coffee',
];

const help = [
  ['whoami', 'who you’re talking to'],
  ['ls', 'list projects'],
  ['cat <about|stack|now>', 'print a file'],
  ['open <name>', 'open a project, github or resume'],
  ['cd <section>', 'jump to a section of the page'],
  ['curl /v1/zoe.json', 'make a real request'],
  ['contact', 'write me a message'],
  ['history, date, clear, exit', ''],
];

function Out({ children, tone }) {
  return <div className={`t-line ${tone || ''}`}>{children}</div>;
}

export default function Terminal({ open, onClose, onHire }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const lastFocus = useRef(null);

  const print = (...nodes) => setLines((l) => [...l, ...nodes.map((n, i) => ({ id: `${Date.now()}-${l.length}-${i}`, n }))]);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      lockScroll(true);
      if (!lines.length) {
        print(
          <Out tone="dim">zoe-os 1.0. Type <b>help</b> to see what you can do, or press Esc to close.</Out>,
        );
      }
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      lockScroll(false);
      lastFocus.current?.focus?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const goto = (id) => {
    onClose();
    setTimeout(() => scrollToId(id), 120);
  };

  const run = async (raw) => {
    const cmd = raw.trim();
    print(
      <Out>
        <span className="t-prompt">guest@zoe:~$</span> {cmd}
      </Out>,
    );
    if (!cmd) return;
    setHist((h) => [...h, cmd]);
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ').toLowerCase();

    switch (name.toLowerCase()) {
      case 'help':
        print(
          <div className="t-help">
            {help.map(([c, d]) => (
              <div key={c}>
                <span className="t-cmd">{c}</span>
                <span className="t-dim">{d}</span>
              </div>
            ))}
          </div>,
        );
        break;
      case 'whoami':
        print(<Out>{profile.name}. {profile.role} in {profile.location}. {profile.tagline}</Out>);
        break;
      case 'ls':
        print(
          <div className="t-ls">
            {[featured.name, infera.name, clientWork[0].name, ...earlier.map((p) => p.name)].map((n) => (
              <span key={n}>{n.toLowerCase().replace(/\s+/g, '-')}/</span>
            ))}
          </div>,
        );
        break;
      case 'cat':
        if (arg === 'about' || arg === 'about.txt') {
          print(<Out>{profile.intro}</Out>);
        } else if (arg === 'stack' || arg === 'stack.txt') {
          stack.forEach((g) => print(<Out><span className="t-cmd">{g.group}:</span> {g.items.map((i) => i.label).join(', ')}</Out>));
        } else if (arg === 'now' || arg === 'now.txt') {
          print(<Out>Final year at Bowen. Open to backend contracts, freelance projects and internships.</Out>);
        } else {
          print(<Out tone="err">cat: {arg || '(nothing)'}: No such file. Try about, stack or now.</Out>);
        }
        break;
      case 'open': {
        const key = Object.keys(openables).find((k) => arg && k.startsWith(arg));
        if (key) {
          window.open(openables[key], '_blank', 'noopener');
          print(<Out tone="ok">Opening {key} in a new tab.</Out>);
        } else {
          print(<Out tone="err">open: say which one: {Object.keys(openables).join(', ')}</Out>);
        }
        break;
      }
      case 'cd': {
        const target = sections.find((s) => arg && s.startsWith(arg.replace(/^\.?\/?/, '')));
        if (target) goto(target);
        else if (arg === '..' || arg === '~' || arg === '') goto('top');
        else print(<Out tone="err">cd: no such section. Try: {sections.join(', ')}</Out>);
        break;
      }
      case 'curl': {
        const path = (args[0] || '/v1/zoe.json').replace(/^https?:\/\/[^/]+/, '').replace(base, '');
        try {
          const t0 = performance.now();
          const res = await fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, { cache: 'no-store' });
          if (!res.ok) throw new Error(String(res.status));
          const data = await res.json();
          print(
            <Out tone="dim">HTTP {res.status} in {Math.round(performance.now() - t0)} ms</Out>,
            <pre className="t-json">
              <Json value={data} />
            </pre>,
          );
        } catch (e) {
          print(<Out tone="err">curl: {path} returned {e.message === 'Failed to fetch' ? 'no response' : e.message}. Try /v1/zoe.json, /v1/now.json or /v1/projects.json</Out>);
        }
        break;
      }
      case 'history':
        print(...[...hist, cmd].map((h, i) => <Out key={i} tone="dim">{String(i + 1).padStart(3, ' ')}  {h}</Out>));
        break;
      case 'date':
        print(<Out>{new Date().toString()}</Out>);
        break;
      case 'contact':
      case 'email':
        goto('contact');
        break;
      case 'sudo':
        if (/^hire\s+zoe/.test(arg)) {
          print(<Out tone="ok">Permission granted. Opening a message with the hard part already written.</Out>);
          setTimeout(() => {
            onClose();
            onHire();
          }, 700);
        } else {
          print(<Out tone="err">guest is not in the sudoers file. This incident will be reported. (Try: sudo hire zoe)</Out>);
        }
        break;
      case 'coffee':
      case 'brew':
        print(<Out tone="warn">418 I’m a teapot. Fine, tea it is.</Out>);
        break;
      case 'rm':
        print(<Out tone="warn">Nice try. This site is deployed from git, it would come right back.</Out>);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'exit':
      case 'quit':
        onClose();
        break;
      default:
        print(<Out tone="err">{name}: command not found. Type help.</Out>);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
      setInput('');
      setCursor(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!hist.length) return;
      const c = cursor === -1 ? hist.length - 1 : Math.max(0, cursor - 1);
      setCursor(c);
      setInput(hist[c]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor === -1) return;
      const c = cursor + 1;
      if (c >= hist.length) {
        setCursor(-1);
        setInput('');
      } else {
        setCursor(c);
        setInput(hist[c]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.split(' ');
      if (parts.length === 1) {
        const m = commandNames.filter((c) => c.startsWith(parts[0]));
        if (m.length === 1) setInput(`${m[0]} `);
        else if (m.length > 1) print(<Out tone="dim">{m.join('  ')}</Out>);
      } else {
        const pool = parts[0] === 'cd' ? sections : parts[0] === 'open' ? Object.keys(openables) : parts[0] === 'cat' ? ['about', 'stack', 'now'] : [];
        const m = pool.filter((c) => c.startsWith(parts[1] || ''));
        if (m.length === 1) setInput(`${parts[0]} ${m[0]}`);
        else if (m.length > 1) print(<Out tone="dim">{m.join('  ')}</Out>);
      }
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  if (!open) return null;

  return (
    <div className="t-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="t-window on-dark" role="dialog" aria-modal="true" aria-label="Terminal">
        <div className="t-bar mono">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>guest@zoe: ~</span>
          <button type="button" onClick={onClose} className="t-close">
            Close<span className="sr-only"> terminal</span>
          </button>
        </div>
        <div className="t-body mono" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          <div aria-live="polite">
            {lines.map((l) => (
              <div key={l.id}>{l.n}</div>
            ))}
          </div>
          <div className="t-input-row">
            <label htmlFor="t-input" className="t-prompt">
              guest@zoe:~$
            </label>
            <input
              id="t-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
