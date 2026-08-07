"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import Fireworks from "@/components/ui/Fireworks";
import Balloons from "@/components/ui/Balloons";
import AnimatedText from "@/components/ui/AnimatedText";
import { config } from "@/lib/config";
import { cannons, rain, emojiBurst } from "@/lib/celebrate";

export default function Finale() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [released, setReleased] = useState(0);
  const fired = useRef(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Scroll drives the zoom only. Opacity used to be scroll-linked too, which
  // left the whole block sitting at 0 whenever the page couldn't scroll far
  // enough past the section — this is the last section, so that was often.
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  // Auto-celebrate the first time the finale comes into view
  useEffect(() => {
    if (!inView || fired.current) return;
    fired.current = true;
    cannons();
    const stop = rain(3600);
    setReleased((n) => n + 1);
    return stop;
  }, [inView]);

  const again = () => {
    cannons();
    rain(2400);
    emojiBurst(["🎉", "🥳", "🎂", "💖", "🎈"], 0.5, 0.5);
    setReleased((n) => n + 1);
  };

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24"
    >
      <Fireworks active={inView} />
      {/* Re-mounting on each bump relaunches the whole bunch, with a fresh scatter */}
      <Balloons key={released} count={14} seed={released + 1} released />

      <motion.div
        style={{ scale }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <h2 className="font-display leading-[0.85] font-black">
          <AnimatedText
            as="div"
            text={config.finale.title}
            stagger={0.04}
            gradient
            className="block text-[clamp(2.6rem,13vw,9rem)]"
          />
          <span className="mt-4 block text-[clamp(2rem,9vw,6rem)] text-white/95 italic">
            {config.name}
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="font-hand mt-8 text-2xl text-white/70 sm:text-3xl"
        >
          {config.finale.subtitle}
        </motion.p>

        <motion.button
          onClick={again}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, type: "spring", stiffness: 180, damping: 14 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          className="from-punch to-grape shadow-punch/40 mt-12 rounded-full bg-gradient-to-r px-9 py-4 text-base font-semibold text-white shadow-[0_18px_50px_-12px]"
        >
          {config.finale.buttonLabel}
        </motion.button>

        <p className="mt-14 text-xs tracking-[0.25em] text-white/25 uppercase">
          made with far too much css, entirely for you
        </p>
      </motion.div>
    </section>
  );
}
