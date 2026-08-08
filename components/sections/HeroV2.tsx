"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import AnimatedText from "@/components/ui/AnimatedText";
import { config } from "@/lib/config";
import { cannons, rain } from "@/lib/celebrate";
import { useEffect } from "react";

/**
 * Cinematic hero with a massive 3D "22" that recedes on scroll.
 * The name flies through the number, parallax layers create depth.
 */
export default function HeroV2() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y22 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scale22 = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const opacity22 = useTransform(scrollYProgress, [0, 0.6], [0.12, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 25]);

  const yName = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t1 = setTimeout(() => cannons(), 300);
    let stop: (() => void) | undefined;
    const t2 = setTimeout(() => { stop = rain(3000); }, 800);
    return () => { clearTimeout(t1); clearTimeout(t2); stop?.(); };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[110svh] items-center justify-center overflow-hidden px-5"
      style={{ perspective: 1200 }}
    >
      {/* The massive "22" — background layer */}
      <motion.div
        style={{ y: y22, scale: scale22, opacity: opacity22, rotateX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-display text-[clamp(20rem,50vw,45rem)] leading-none font-black text-transparent select-none"
          style={{
            WebkitTextStroke: "2px rgba(56,189,248,0.2)",
            textShadow: "0 0 120px rgba(56,189,248,0.25), 0 0 240px rgba(251,191,36,0.1)",
          }}
        >
          22
        </span>
      </motion.div>

      {/* Rings that orbit the 22 */}
      <motion.div
        style={{ y: y22, scale: scale22, rotateX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute h-[60vmin] w-[60vmin] rounded-full border border-white/[0.06]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute h-[80vmin] w-[80vmin] rounded-full border border-dashed border-white/[0.04]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute h-[100vmin] w-[100vmin] rounded-full border border-white/[0.03]"
        >
          {/* Orbiting dot */}
          <span className="bg-sun absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px] shadow-sun/60" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: yName, opacity: opacityContent }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        {/* Pill */}
        <motion.p
          initial={{ opacity: 0, y: -24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs tracking-[0.2em] text-white/70 uppercase"
        >
          <span className="bg-sun inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
          {config.hero.kicker}
        </motion.p>

        {/* Main heading */}
        <h1 className="font-display flex flex-col items-center leading-[0.85] font-black tracking-tight">
          {config.hero.greetingWords.map((word, i) => (
            <AnimatedText
              key={word}
              as="div"
              text={word}
              immediate
              delay={0.2 + i * 0.3}
              stagger={0.04}
              className="block text-[clamp(3.2rem,13vw,10rem)] text-white/95"
            />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: 1.2,
              delay: 1,
              type: "spring",
              stiffness: 80,
              damping: 12,
            }}
            className="mt-4 block"
            style={{ perspective: 800 }}
          >
            <span
              className="text-gradient inline-block text-[clamp(3.8rem,17vw,13rem)] italic"
              style={{
                textShadow: "0 0 60px rgba(251,191,36,0.35), 0 0 120px rgba(56,189,248,0.2)",
              }}
            >
              {config.name}
            </span>
          </motion.div>
        </h1>

        <motion.p
          style={{ y: ySubtitle }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg"
        >
          {config.hero.subtitle}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase">
            {config.hero.scrollCue}
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <span className="from-sun to-sky h-10 w-[1px] bg-gradient-to-b" />
            <span className="bg-sun h-2 w-2 rounded-full shadow-[0_0_8px] shadow-sun/50" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
