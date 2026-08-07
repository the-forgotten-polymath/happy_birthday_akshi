import confetti from "canvas-confetti";

const PALETTE = ["#f59e0b", "#0ea5e9", "#fbbf24", "#34d399", "#38bdf8", "#ffffff"];

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A single burst from a point on screen (0-1 coordinates). */
export function burst(x = 0.5, y = 0.5, particles = 90) {
  if (reduced()) return;
  confetti({
    particleCount: particles,
    spread: 78,
    startVelocity: 42,
    origin: { x, y },
    colors: PALETTE,
    scalar: 1.05,
    disableForReducedMotion: true,
  });
}

/** Two cannons firing inward from the bottom corners. */
export function cannons() {
  if (reduced()) return;
  const shared = {
    particleCount: 70,
    spread: 62,
    startVelocity: 58,
    colors: PALETTE,
    disableForReducedMotion: true,
  };
  confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.95 } });
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.95 } });
}

/** A slow drift of confetti from the top, lasting `ms`. */
export function rain(ms = 2600) {
  if (reduced()) return () => {};
  const end = Date.now() + ms;
  let raf = 0;

  const tick = () => {
    confetti({
      particleCount: 3,
      startVelocity: 0,
      ticks: 320,
      gravity: 0.45,
      spread: 360,
      origin: { x: Math.random(), y: -0.05 },
      colors: PALETTE,
      scalar: Math.random() * 0.6 + 0.7,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** Emoji-shaped confetti, used for the gift reveal. */
export function emojiBurst(emojis: string[], x = 0.5, y = 0.5) {
  if (reduced()) return;
  const shapes = emojis.map((e) => confetti.shapeFromText({ text: e, scalar: 2.4 }));
  confetti({
    particleCount: 34,
    spread: 100,
    startVelocity: 40,
    origin: { x, y },
    shapes,
    scalar: 2.4,
    disableForReducedMotion: true,
  });
}

/** Fires from the centre of a DOM element. */
export function burstFromElement(el: HTMLElement | null, particles = 110) {
  if (!el) return burst(0.5, 0.5, particles);
  const r = el.getBoundingClientRect();
  burst(
    (r.left + r.width / 2) / window.innerWidth,
    (r.top + r.height / 2) / window.innerHeight,
    particles,
  );
}
