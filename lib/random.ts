/**
 * A tiny seeded PRNG (mulberry32).
 *
 * Decorative scatter (stars, balloons) needs to look random but must be
 * *deterministic* so the server and client render identical markup — and so
 * it stays pure enough for the React Compiler. Same seed, same layout, every
 * time.
 */
export function makeRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random float in [min, max) from a seeded generator. */
export function between(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}
