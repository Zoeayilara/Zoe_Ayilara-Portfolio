import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import Json from './Json';
import { profile } from '../data/profile';
import { onScroll, clamp } from '../motion/scroll';
import './contact.css';

const empty = { name: '', email: '', message: '' };
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact({ prefill }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ phase: 'idle' });
  const [trap, setTrap] = useState('');
  const startedAt = useRef(Date.now());
  const messageRef = useRef(null);
  const sectionRef = useRef(null);

  // The dark section starts as an inset, rounded panel and opens to full
  // width as it reaches the top of the screen.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    return onScroll((y, vh) => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const p = clamp((vh - top) / (vh * 0.85));
      const inset = (1 - p) * Math.min(48, window.innerWidth * 0.04);
      const radius = (1 - p) * 36;
      el.style.clipPath = `inset(0 ${inset}px 0 ${inset}px round ${radius}px ${radius}px 0 0)`;
    });
  }, []);

  // The terminal can prefill the message (try `sudo hire zoe`).
  useEffect(() => {
    if (!prefill) return;
    setForm((f) => ({ ...f, message: prefill.text }));
    setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 600);
  }, [prefill]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (status.phase === 'sent' || status.phase === 'error') setStatus({ phase: 'idle' });
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Add your name so I know who’s writing.';
    if (!emailOk(form.email)) er.email = 'Enter an email address I can reply to.';
    if (form.message.trim().length < 10) er.message = 'Write at least a sentence about what you need.';
    setErrors(er);
    return !Object.keys(er).length;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status.phase === 'sending') return;
    if (!validate()) return;
    setStatus({ phase: 'sending' });
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company: trap, startedAt: startedAt.current }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ phase: 'sent', code: res.status });
        setForm(empty);
        startedAt.current = Date.now();
        return;
      }
      if (res.status === 400 && body.fields) setErrors(body.fields);
      setStatus({
        phase: 'error',
        code: res.status,
        message: res.status === 400 ? 'Fix the fields marked above and send again.' : body.error,
      });
    } catch {
      setStatus({ phase: 'error', code: 0 });
    }
  };

  const payload = {
    from: form.name || null,
    reply_to: form.email || null,
    message: form.message ? (form.message.length > 90 ? `${form.message.slice(0, 90)}…` : form.message) : null,
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title" ref={sectionRef}>
      <div className="wrap">
        <Reveal className="contact-head">
          <h2 id="contact-title">Have something that needs a backend?</h2>
          <p>
            Tell me what you’re building. I usually reply within a day. You can also email{' '}
            <a className="link strong" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
        </Reveal>

        <div className="contact-grid">
          <Reveal as="form" className="form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="f-name">Name</label>
              <input
                id="f-name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={onChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'e-name' : undefined}
              />
              {errors.name && <p className="err-msg" id="e-name">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={onChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'e-email' : undefined}
              />
              {errors.email && <p className="err-msg" id="e-email">{errors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="f-message">What do you need built?</label>
              <textarea
                id="f-message"
                name="message"
                rows={5}
                ref={messageRef}
                value={form.message}
                onChange={onChange}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'e-message' : undefined}
              />
              {errors.message && <p className="err-msg" id="e-message">{errors.message}</p>}
            </div>
            <div className="trap" aria-hidden="true">
              <label htmlFor="f-company">Company</label>
              <input id="f-company" name="company" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>
            <div className="form-foot">
              <button className="btn btn-primary magnetic" type="submit" disabled={status.phase === 'sending'}>
                {status.phase === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className="form-status" role="status">
                {status.phase === 'sent' && <span className="sent">Message sent. I’ll reply to you by email.</span>}
                {status.phase === 'error' && (
                  <span className="failed">
                    {status.message || 'The message didn’t send. Check your connection and try again.'}{' '}
                    {status.code !== 400 && (
                      <>
                        Or email{' '}
                        <a className="link" href={`mailto:${profile.email}`}>
                          {profile.email}
                        </a>
                        .
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
          </Reveal>

          <Reveal className={`payload on-dark is-${status.phase}`} delay={100} aria-hidden="true">
            <div className="payload-head mono">
              <span className="method method-POST">POST</span>
              <span>/contact</span>
              <span className={`payload-state ${status.phase}`}>
                {status.phase === 'sent'
                  ? '202 Accepted'
                  : status.phase === 'error'
                    ? `${status.code || 'Network'} error`
                    : status.phase === 'sending'
                      ? 'sending…'
                      : 'draft'}
              </span>
            </div>
            <div className="payload-body">
              <pre className="mono" key={status.phase === 'sent' ? 'sent' : 'draft'}>
                {status.phase === 'sent' ? <Json value={{ ok: true, status: 'delivered', reply: 'by email' }} /> : <Json value={payload} />}
              </pre>
              <span className="payload-packet" aria-hidden="true" />
            </div>
            <p className="payload-note">This is the request your message becomes. It updates as you type.</p>
          </Reveal>
        </div>

        <div className="contact-links">
          <a className="link" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="link" href={profile.resume} target="_blank" rel="noopener noreferrer">
            Résumé (PDF)
          </a>
          <a className="link" href={`mailto:${profile.email}`}>
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
