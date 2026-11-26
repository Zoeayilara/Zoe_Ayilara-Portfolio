// One scroll loop for the whole site. Lenis smooths wheel scrolling on
// desktop; everything scroll-linked subscribes here and runs in a single
// requestAnimationFrame, so there's never more than one scroll handler.
import Lenis from 'lenis';

const subs = new Set();
let lenis = null;
let frame = 0;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function flush() {
  frame = 0;
  const y = window.scrollY;
  const vh = window.innerHeight;
  subs.forEach((fn) => fn(y, vh));
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

let started = false;
export function initScroll() {
  if (started) return;
  started = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  if (!reduced()) {
    lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: true });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  schedule();
}

export function onScroll(fn) {
  subs.add(fn);
  fn(window.scrollY, window.innerHeight);
  return () => subs.delete(fn);
}

export function scrollToId(id) {
  const el = id === 'top' ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) lenis.scrollTo(el);
  else if (el === 0) window.scrollTo({ top: 0 });
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
}

export function lockScroll(locked) {
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

// 0 when the element's top hits the bottom of the viewport, 1 when its
// bottom leaves the top. Callers clamp or remap as they need.
export function progressOf(el, y, vh) {
  const r = el.getBoundingClientRect();
  const top = r.top + y;
  return (y + vh - top) / (r.height + vh);
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
