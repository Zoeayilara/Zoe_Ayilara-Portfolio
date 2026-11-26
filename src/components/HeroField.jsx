import { useEffect, useRef } from 'react';

// The page's blueprint dots, brought to life inside the hero.
// - Dots near the cursor lift, grow and turn cobalt.
// - Data packets run along the grid lines, leaving a short trail.
// - Clicking sends a ripple through the grid.
// Only the active dots are drawn; the static grid is the CSS background,
// so the canvas stays cheap. It pauses when off screen or in a hidden tab.

const GAP = 24;
const OFFSET = 1; // matches the CSS radial-gradient dot position
const RADIUS = 150;
const COBALT = [43, 68, 224];
const AMBER = [240, 162, 2];

export default function HeroField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    // Pointer, eased so motion feels weighted rather than glued to the mouse.
    const target = { x: -9999, y: -9999, on: false };
    const pointer = { x: -9999, y: -9999, s: 0 };
    const ripples = [];
    const packets = [];

    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnPacket = (x0, y0) => {
      const cols = Math.floor(w / GAP);
      const rows = Math.floor(h / GAP);
      const gx = x0 != null ? Math.round((x0 - OFFSET) / GAP) : Math.floor(Math.random() * cols);
      const gy = y0 != null ? Math.round((y0 - OFFSET) / GAP) : Math.floor(Math.random() * rows);
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
      packets.push({
        x: gx * GAP + OFFSET,
        y: gy * GAP + OFFSET,
        dx,
        dy,
        speed: 70 + Math.random() * 70,
        left: GAP * (2 + Math.floor(Math.random() * 6)),
        life: 1,
        trail: [],
        color: Math.random() < 0.7 ? COBALT : AMBER,
        turns: 3 + Math.floor(Math.random() * 4),
      });
    };

    const step = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // ease the pointer
      const k = 1 - Math.pow(0.0008, dt);
      pointer.x += (target.x - pointer.x) * k;
      pointer.y += (target.y - pointer.y) * k;
      pointer.s += ((target.on ? 1 : 0) - pointer.s) * k;

      ctx.clearRect(0, 0, w, h);

      // Cursor halo of dots
      if (pointer.s > 0.01) {
        const x0 = Math.floor((pointer.x - RADIUS) / GAP) - 1;
        const x1 = Math.ceil((pointer.x + RADIUS) / GAP) + 1;
        const y0 = Math.floor((pointer.y - RADIUS) / GAP) - 1;
        const y1 = Math.ceil((pointer.y + RADIUS) / GAP) + 1;
        for (let gx = x0; gx <= x1; gx++) {
          for (let gy = y0; gy <= y1; gy++) {
            const px = gx * GAP + OFFSET;
            const py = gy * GAP + OFFSET;
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d > RADIUS) continue;
            const f = (1 - d / RADIUS) ** 2 * pointer.s;
            // push dots gently away from the cursor
            const push = f * 7;
            const nx = d ? dx / d : 0;
            const ny = d ? dy / d : 0;
            const size = 1 + f * 2.6;
            ctx.fillStyle = `rgba(${COBALT[0]},${COBALT[1]},${COBALT[2]},${0.15 + f * 0.85})`;
            ctx.beginPath();
            ctx.arc(px + nx * push, py + ny * push, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Click ripples: a ring of lit dots expanding outward
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += dt;
        const radius = r.t * 520;
        const alpha = 1 - r.t / 1.1;
        if (alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        const band = 26;
        const x0 = Math.floor((r.x - radius - band) / GAP);
        const x1 = Math.ceil((r.x + radius + band) / GAP);
        const y0 = Math.max(0, Math.floor((r.y - radius - band) / GAP));
        const y1 = Math.min(Math.ceil(h / GAP), Math.ceil((r.y + radius + band) / GAP));
        for (let gx = Math.max(0, x0); gx <= x1; gx++) {
          for (let gy = y0; gy <= y1; gy++) {
            const px = gx * GAP + OFFSET;
            const py = gy * GAP + OFFSET;
            const off = Math.abs(Math.hypot(px - r.x, py - r.y) - radius);
            if (off > band) continue;
            const f = (1 - off / band) * alpha;
            ctx.fillStyle = `rgba(${COBALT[0]},${COBALT[1]},${COBALT[2]},${f})`;
            ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          }
        }
      }

      // Packets along grid lines
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const move = p.speed * dt;
        p.x += p.dx * move;
        p.y += p.dy * move;
        p.left -= move;
        p.trail.push([p.x, p.y]);
        if (p.trail.length > 22) p.trail.shift();
        if (p.left <= 0) {
          // snap to the grid and turn
          p.x = Math.round((p.x - OFFSET) / GAP) * GAP + OFFSET;
          p.y = Math.round((p.y - OFFSET) / GAP) * GAP + OFFSET;
          p.turns -= 1;
          if (p.dx) [p.dx, p.dy] = [0, Math.random() < 0.5 ? 1 : -1];
          else [p.dx, p.dy] = [Math.random() < 0.5 ? 1 : -1, 0];
          p.left = GAP * (2 + Math.floor(Math.random() * 6));
        }
        if (p.turns <= 0) p.life -= dt * 1.6;
        if (p.life <= 0 || p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          packets.splice(i, 1);
          continue;
        }
        const [cr, cg, cb] = p.color;
        if (p.trail.length > 1) {
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          for (let j = 1; j < p.trail.length; j++) {
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(j / p.trail.length) * 0.55 * p.life})`;
            ctx.beginPath();
            ctx.moveTo(p.trail[j - 1][0], p.trail[j - 1][1]);
            ctx.lineTo(p.trail[j][0], p.trail[j][1]);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // keep a few packets alive at all times
      if (packets.length < 5 && Math.random() < dt * 1.4) spawnPacket();

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (!target.on) {
        // start from the cursor instead of sliding in from far away
        if (pointer.s < 0.05) {
          pointer.x = target.x;
          pointer.y = target.y;
        }
        target.on = true;
      }
    };
    const onLeave = () => {
      target.on = false;
    };
    const onDown = (e) => {
      if (e.target.closest('a, button, input, textarea, .console')) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ripples.push({ x, y, t: 0 });
      for (let i = 0; i < 3; i++) spawnPacket(x, y);
    };

    resize();
    for (let i = 0; i < 3; i++) spawnPacket();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      start();
    });
    io.observe(host);
    const onVis = () => {
      visible = !document.hidden;
      start();
    };
    document.addEventListener('visibilitychange', onVis);
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onDown);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}
