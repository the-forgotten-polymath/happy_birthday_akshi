"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { between, makeRandom } from "@/lib/random";

const COLORS = [
  ["#f59e0b", "#fcd34d"],   // gold
  ["#0ea5e9", "#7dd3fc"],   // sky blue
  ["#34d399", "#a7f3d0"],   // mint
  ["#f97316", "#fed7aa"],   // orange
  ["#38bdf8", "#bae6fd"],   // lighter blue
];

const MASK =
  "linear-gradient(to bottom, transparent 0%, #000 14%, #000 90%, transparent 100%)";

export type BalloonsProps = {
  /** How many balloons to float */
  count?: number;
  /** Launch them all at once rather than drifting in staggered (used by the finale) */
  released?: boolean;
  /** Changes the scatter pattern without changing the count */
  seed?: number;
  className?: string;
};

type Spec = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  colors: string[];
  drift: number;
  /** How far the string bows sideways, in px */
  curve: number;
  /** Desyncs the sway so the strings don't move in lockstep */
  swayDelay: number;
};

function Balloon({ spec }: { spec: Spec }) {
  const { left, size, duration, delay, colors, drift, curve, swayDelay } = spec;
  const [popped, setPopped] = useState(false);

  const stringHeight = size * 1.7;
  const mid = size / 2;
  // Knot sits this far below the body; the string picks up exactly there.
  const knotDrop = size * 0.055;

  if (popped) return null;

  return (
    <motion.div
      // `items-center` is what keeps the string under the knot — the previous
      // `mx-auto` + inline `marginLeft` combination fought each other and
      // pinned the string to the left edge.
      className="absolute bottom-0 flex flex-col items-center cursor-pointer pointer-events-auto"
      style={{ left: `${left}%`, width: size }}
      // Starts below the container, so it rises into view on its own and needs
      // no opacity fade — the container's mask takes care of both edges.
      initial={{ y: "20vh" }}
      animate={{
        y: "-115vh",
        x: [0, drift, -drift * 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
        x: { duration: duration / 2.5, repeat: Infinity, ease: "easeInOut" },
      }}
      onPointerDown={(e) => {
        setPopped(true);
        const rect = e.currentTarget.getBoundingClientRect();
        import("@/lib/celebrate").then(({ burst }) => {
          burst(
            (rect.left + rect.width / 2) / window.innerWidth,
            (rect.top + rect.height / 2) / window.innerHeight,
            30
          );
        });
      }}
    >
      {/* body */}
      <div
        className="relative rounded-[50%]"
        style={{
          width: size,
          height: size * 1.2,
          background: `radial-gradient(circle at 32% 28%, ${colors[1]}, ${colors[0]} 62%, ${colors[0]})`,
          boxShadow: `0 0 28px -6px ${colors[0]}aa`,
        }}
      >
        {/* highlight */}
        <span
          className="absolute rounded-full bg-white/50 blur-[2px]"
          style={{ width: size * 0.16, height: size * 0.22, left: "26%", top: "18%" }}
        />
        {/* knot — tapers downward, so the string reads as tied on */}
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -knotDrop,
            width: size * 0.14,
            height: size * 0.11,
            background: colors[0],
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
      </div>

      {/* string — a bowed SVG curve rather than a 1px div, so it hangs like
          thread instead of looking like a scratch on the screen */}
      <div
        className="animate-sway origin-top"
        style={{ marginTop: knotDrop, animationDelay: `${swayDelay}s` }}
      >
        <svg
          width={size}
          height={stringHeight}
          viewBox={`0 0 ${size} ${stringHeight}`}
          fill="none"
        >
          <path
            d={`M ${mid} 0 C ${mid + curve} ${stringHeight * 0.34}, ${mid - curve} ${
              stringHeight * 0.68
            }, ${mid + curve * 0.4} ${stringHeight}`}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Balloons({
  count = 9,
  released = false,
  seed = 1,
  className,
}: BalloonsProps) {
  const reduced = useReducedMotion();

  const balloons = useMemo<Spec[]>(() => {
    const rng = makeRandom(seed * 7919 + count);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: (i / count) * 96 + between(rng, 0, 5),
      size: between(rng, 42, 88),
      duration: released ? between(rng, 6, 10) : between(rng, 15, 27),
      delay: released ? between(rng, 0, 0.7) : between(rng, 0, 12),
      colors: COLORS[i % COLORS.length],
      drift: between(rng, 18, 52),
      curve: between(rng, 5, 14) * (rng() > 0.5 ? 1 : -1),
      swayDelay: between(rng, 0, 4),
    }));
  }, [count, released, seed]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      style={{
        // Balloons rise past the edges of their section, where `overflow-hidden`
        // would otherwise slice them flat. Fading both edges lets them drift in
        // and dissolve away at any balloon size or viewport height.
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      {balloons.map((b) => (
        <Balloon key={b.id} spec={b} />
      ))}
    </div>
  );
}
