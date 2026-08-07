"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="from-sun via-punch to-sky fixed top-0 left-0 z-50 h-[3px] w-full origin-left bg-gradient-to-r"
    />
  );
}
