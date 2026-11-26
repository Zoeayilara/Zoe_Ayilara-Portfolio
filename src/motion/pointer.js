// Pointer effects that only make sense with a mouse.
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cards with .spot get --mx/--my so CSS can draw a light that follows
// the cursor. One delegated listener for the whole page.
let spotOn = false;
export function initSpotlight() {
  if (!fine() || spotOn) return;
  spotOn = true;
  let raf = 0;
  let last = null;
  document.addEventListener(
    'pointermove',
    (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const card = last.target.closest?.('.spot');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${last.clientX - r.left}px`);
        card.style.setProperty('--my', `${last.clientY - r.top}px`);
      });
    },
    { passive: true },
  );
}

// Elements with .magnetic lean toward the cursor and spring back.
let magOn = false;
export function initMagnetic() {
  if (!fine() || reduced() || magOn) return;
  magOn = true;
  const strength = 0.28;
  const max = 10;
  document.addEventListener(
    'pointermove',
    (e) => {
      const el = e.target.closest?.('.magnetic');
      document.querySelectorAll('.magnetic.is-pulled').forEach((m) => {
        if (m !== el) {
          m.classList.remove('is-pulled');
          m.style.transform = '';
        }
      });
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      el.classList.add('is-pulled');
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    },
    { passive: true },
  );
}
