"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "blur";

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 56 },
  down: { y: -56 },
  left: { x: 64 },
  right: { x: -64 },
  scale: {},
  blur: {},
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.75,
  once = true,
  amount = 0.25,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: offset.x ?? 0,
        y: offset.y ?? 0,
        scale: direction === "scale" ? 0.82 : 1,
        filter: direction === "blur" ? "blur(14px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
