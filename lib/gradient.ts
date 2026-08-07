/**
 * The site's signature gradient, expressed as discrete RGB stops.
 *
 * Used to colour text per-character. CSS `background-clip: text` can't be used
 * for animated text: the glyphs live in child spans that get promoted to their
 * own compositing layers (`will-change`, `transform`, `filter`), and an
 * ancestor's clipped background is never painted through those. Interpolating a
 * solid colour per character survives any transform.
 */
const STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [251, 191, 36],  // sun (warm gold)
  [245, 158, 11],  // amber
  [14, 165, 233],  // sky blue
  [52, 211, 153],  // mint green
];

/** Colour at position `t` (0 → 1) along the gradient. */
export function gradientColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  const scaled = clamped * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const from = STOPS[i];
  const to = STOPS[i + 1];
  const mix = (a: number, b: number) => Math.round(a + (b - a) * f);
  return `rgb(${mix(from[0], to[0])}, ${mix(from[1], to[1])}, ${mix(from[2], to[2])})`;
}
