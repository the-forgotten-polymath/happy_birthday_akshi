"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Counts from 0 up to `to` the first time it scrolls into view.
 * Writes straight to the DOM node so React doesn't re-render 60x a second.
 */
export default function CountUp({
  to,
  duration = 2,
  className,
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  const value = useMotionValue(0);
  const spring = useSpring(value, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      if (ref.current) ref.current.textContent = to.toLocaleString() + suffix;
      return;
    }
    value.set(to);
  }, [inView, to, value, reduced, suffix]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      }
    });
    return unsub;
  }, [spring, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
