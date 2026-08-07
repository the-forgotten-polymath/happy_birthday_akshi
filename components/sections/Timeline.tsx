"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config, type TimelineEvent } from "@/lib/config";

function Item({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const left = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-6 md:gap-10 ${
        left ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* card */}
      <div className={`flex-1 pl-16 md:pl-0 ${left ? "md:text-right" : "md:text-left"}`}>
        <Reveal direction={left ? "right" : "left"} amount={0.4}>
          <div className="glass hover:border-punch/40 group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8">
            <div className="from-punch/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="font-display text-gradient text-sm font-black tracking-[0.2em]">
              {event.year}
            </span>
            <h3 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
              {event.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
              {event.description}
            </p>
          </div>
        </Reveal>
      </div>

      {/* dot on the spine */}
      <motion.div
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
        className="absolute left-0 z-10 md:left-1/2 md:-translate-x-1/2"
      >
        <div className="bg-ink-soft ring-punch/50 shadow-punch/40 flex h-12 w-12 items-center justify-center rounded-full text-xl ring-2 shadow-[0_0_30px]">
          {event.emoji}
        </div>
      </motion.div>

      <div className="hidden flex-1 md:block" />
    </div>
  );
}

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative z-10 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal direction="blur" className="mb-20 text-center">
          <p className="text-punch mb-3 text-xs tracking-[0.3em] uppercase">
            the story so far
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none font-black">
            us, <span className="text-gradient italic">in chapters</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative">
          {/* spine track */}
          <div className="absolute top-0 left-6 h-full w-px -translate-x-1/2 bg-white/10 md:left-1/2" />
          {/* spine fill */}
          <motion.div
            style={{ scaleY }}
            className="from-sun via-punch to-grape absolute top-0 left-6 h-full w-px origin-top -translate-x-1/2 bg-gradient-to-b md:left-1/2"
          />
          {/* travelling glow */}
          <motion.div
            style={{ top: glowY }}
            className="bg-punch absolute left-6 h-3 w-3 -translate-x-1/2 rounded-full shadow-[0_0_24px_8px] shadow-punch/60 md:left-1/2"
          />

          <div className="flex flex-col gap-16 sm:gap-24">
            {config.timeline.map((event, i) => (
              <Item key={`${event.year}-${i}`} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
