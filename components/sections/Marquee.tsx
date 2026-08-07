"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";
import { config } from "@/lib/config";

/** Keeps a value looping inside [min, max). */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function Row({ baseVelocity, words, hideStars }: { baseVelocity: number; words: readonly string[]; hideStars?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Scrolling fast speeds the strip up; scrolling up reverses it.
  const velocityFactor = useTransform(smooth, [0, 1200], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    move += direction.current * move * factor;
    baseX.set(baseX.get() + move);
  });

  // Four copies so the loop never shows a gap.
  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex flex-nowrap whitespace-nowrap">
            {words.map((w) => (
              <span key={`${copy}-${w}`} className="mr-8 flex items-center gap-8">
                <span>{w}</span>
                {!hideStars && <span className="text-punch text-[0.4em] opacity-80">✦</span>}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section className="border-y border-white/5 py-8">
        <p className="font-display text-center text-2xl text-white/50 italic tracking-wide">
          {config.marquee.join(" · ")}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-hidden
      className="relative z-10 border-y border-white/5 bg-white/[0.01] py-3 select-none"
    >
      <div className="font-display text-[clamp(1.5rem,4vw,3.5rem)] leading-tight font-bold tracking-normal opacity-90">
        <div className="text-white/[0.15]">
          <Row baseVelocity={1.5} words={config.marquee} />
        </div>
        <div className="text-gradient mt-1">
          <Row baseVelocity={-2} words={config.marquee} hideStars />
        </div>
        <div className="mt-1 text-white/[0.15]">
          <Row baseVelocity={1} words={config.marquee} />
        </div>
      </div>
    </section>
  );
}
