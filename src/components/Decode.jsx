import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Text that "decodes" in: each letter cycles through code glyphs before
// settling, left to right. Screen readers get the plain text.
const GLYPHS = '01{}[]<>/\\=+*#$&%?;:';

export default function Decode({ text, delay = 0, perChar = 70, cycles = 7 }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(reduced ? Infinity : -1);

  useEffect(() => {
    if (reduced) {
      setTick(Infinity);
      return undefined;
    }
    let id;
    const t = setTimeout(() => {
      let n = 0;
      id = setInterval(() => {
        n += 1;
        setTick(n);
        if (n > text.length * 2 + cycles) clearInterval(id);
      }, perChar / 2);
    }, delay);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, [reduced, text, delay, perChar, cycles]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="decode">
        {[...text].map((ch, i) => {
          const settleAt = i * 2 + cycles;
          if (tick >= settleAt || ch === ' ') return <span key={i}>{ch}</span>;
          const g = tick < i * 2 ? '' : GLYPHS[(tick * 7 + i * 13) % GLYPHS.length];
          // The real letter holds the width so nothing shifts while glyphs cycle.
          return (
            <span key={i} className="decode-glyph">
              <span className="decode-ghost">{ch}</span>
              <span className="decode-g">{g}</span>
            </span>
          );
        })}
      </span>
    </>
  );
}
