"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config, type Reason } from "@/lib/config";

function TiltCard({ reason, index }: { reason: Reason; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  // Spotlight that follows the pointer across the card
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}% ${my}%, rgba(255,46,136,0.18), transparent 65%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 16);
    rx.set((0.5 - py) * 16);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <Reveal direction="scale" delay={(index % 3) * 0.1} amount={0.3}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        className="glass group relative h-full overflow-hidden rounded-3xl p-7 will-change-transform sm:p-8"
      >
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0"
        />
        <div className="relative">
          <motion.span
            whileHover={{ rotate: [0, -14, 14, 0], scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-4xl"
          >
            {reason.emoji}
          </motion.span>
          <h3 className="font-display mt-5 text-xl leading-snug font-bold sm:text-2xl">
            {reason.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {reason.description}
          </p>
        </div>
        {/* bottom accent line that draws in on hover */}
        <span className="from-sun via-punch to-grape absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100" />
      </motion.div>
    </Reveal>
  );
}

export default function Reasons() {
  return (
    <section className="relative z-10 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="blur" className="mb-16 text-center">
          <p className="text-mint mb-3 text-xs tracking-[0.3em] uppercase">
            a short list, non-exhaustive
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none font-black">
            {config.reasonsTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient italic">
              {config.reasonsTitle.split(" ").slice(-1)}
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {config.reasons.map((r, i) => (
            <TiltCard key={r.title} reason={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
