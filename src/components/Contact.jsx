import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Reveal from './Reveal';
import Json from './Json';
import { profile } from '../data/profile';
import './contact.css';

const EMAILJS = {
  service: 'service_iqpwvd9',
  template: 'template_n3uvekm',
  publicKey: 'gpj2xcnbtdA4fc1Jz',
};

const empty = { name: '', email: '', message: '' };
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact({ prefill }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ phase: 'idle' });
  const messageRef = useRef(null);

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
      await emailjs.send(
        EMAILJS.service,
        EMAILJS.template,
        {
          from_name: form.name,
          to_name: profile.name,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        EMAILJS.publicKey,
      );
      setStatus({ phase: 'sent' });
      setForm(empty);
    } catch {
      setStatus({ phase: 'error' });
    }
  };

  const payload = {
    from: form.name || null,
    reply_to: form.email || null,
    message: form.message ? (form.message.length > 90 ? `${form.message.slice(0, 90)}…` : form.message) : null,
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
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
            <div className="form-foot">
              <button className="btn btn-primary" type="submit" disabled={status.phase === 'sending'}>
                {status.phase === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className="form-status" role="status">
                {status.phase === 'sent' && <span className="sent">Message sent. I’ll reply to you by email.</span>}
                {status.phase === 'error' && (
                  <span className="failed">
                    The message didn’t send. Try again, or email me directly at {profile.email}.
                  </span>
                )}
              </p>
            </div>
          </Reveal>

          <Reveal className="payload on-dark" delay={100} aria-hidden="true">
            <div className="payload-head mono">
              <span className="method method-POST">POST</span>
              <span>/contact</span>
              <span className={`payload-state ${status.phase}`}>
                {status.phase === 'sent' ? '202 Accepted' : status.phase === 'error' ? '502 Retry' : 'draft'}
              </span>
            </div>
            <pre className="mono">
              <Json value={payload} />
            </pre>
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
