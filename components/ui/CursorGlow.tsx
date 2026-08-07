"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A soft light that trails the pointer.
 *
 * Visibility is handled entirely in CSS (`pointer-fine`, `motion-reduce`) so
 * there's no state to sync and nothing to flash on first paint.
 */
export default function CursorGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.6 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-30 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 mix-blend-screen blur-[90px] motion-reduce:hidden pointer-fine:md:block"
    >
      <div className="from-punch via-grape h-full w-full rounded-full bg-gradient-to-br to-transparent" />
    </motion.div>
  );
}
