"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import AnimatedText from "@/components/ui/AnimatedText";
import Balloons from "@/components/ui/Balloons";
import { config } from "@/lib/config";
import { cannons, rain } from "@/lib/celebrate";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The whole hero sinks back and dissolves as you scroll past it.
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);

  useEffect(() => {
    const t1 = setTimeout(() => cannons(), 900);
    let stop: (() => void) | undefined;
    const t2 = setTimeout(() => {
      stop = rain(3200);
    }, 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      stop?.();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5"
    >
      <Balloons count={10} />

      <motion.div
        style={{ y, scale, opacity, filter: blur }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        {/* date pill */}
        <motion.p
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass mb-8 inline-block rounded-full px-5 py-2 text-xs tracking-[0.28em] text-white/70 uppercase"
        >
          {config.hero.kicker}
        </motion.p>

        {/* Happy Birthday */}
        <h1 className="font-display leading-[0.86] font-black tracking-tight">
          {config.hero.greetingWords.map((word, i) => (
            <AnimatedText
              key={word}
              as="div"
              text={word}
              immediate
              delay={0.35 + i * 0.35}
              stagger={0.045}
              className="block text-[clamp(2.9rem,12vw,9rem)] text-white/95"
            />
          ))}

          {/* the name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{
              duration: 1.15,
              delay: 1.15,
              type: "spring",
              stiffness: 90,
              damping: 12,
            }}
            className="mt-3 block"
          >
            <span className="text-gradient block text-[clamp(3.4rem,16vw,12rem)] italic">
              {config.name}
            </span>
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.75 }}
          className="mx-auto mt-9 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {config.hero.subtitle}
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
          {config.hero.scrollCue}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2"
        >
          <motion.span
            animate={{ opacity: [1, 0.2, 1], y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-punch h-1.5 w-1.5 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
