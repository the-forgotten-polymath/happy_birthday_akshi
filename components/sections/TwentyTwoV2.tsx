"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { gradientColor } from "@/lib/gradient";
import { burst } from "@/lib/celebrate";

const items = config.twentyTwo;

/**
 * 3D flip cards. Each card starts face-down with just a number.
 * Click/tap to flip and reveal the text. Cards that have been flipped
 * stay face-up with a glow.
 */
function FlipCard({ index, text }: { index: number; text: string }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const flip = () => {
    if (flipped) return;
    setFlipped(true);
    burst(
      cardRef.current
        ? (cardRef.current.getBoundingClientRect().left + 60) / window.innerWidth
        : 0.5,
      cardRef.current
        ? (cardRef.current.getBoundingClientRect().top + 60) / window.innerHeight
        : 0.5,
      30,
    );
  };

  return (
    <Reveal direction="scale" delay={(index % 6) * 0.05} amount={0.2}>
      <motion.div
        ref={cardRef}
        onClick={flip}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && flip()}
        role="button"
        tabIndex={0}
        aria-label={flipped ? text : `Card ${index + 1} — tap to reveal`}
        className="group relative h-[140px] w-full cursor-pointer outline-none [perspective:600px] sm:h-[160px]"
        whileHover={{ scale: flipped ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 14 }}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          {/* Front — just the number */}
          <div className="glass absolute inset-0 flex items-center justify-center rounded-2xl [backface-visibility:hidden]">
            <span
              className="font-display text-5xl font-black sm:text-6xl"
              style={{ color: gradientColor(index / 21) }}
            >
              {index + 1}
            </span>
            <motion.span
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-3 text-[10px] tracking-wider text-white/30"
            >
              tap me
            </motion.span>
          </div>

          {/* Back — the content */}
          <div
            className="absolute inset-0 flex flex-col justify-center rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              background: `linear-gradient(135deg, ${gradientColor(index / 21)}15, ${gradientColor(index / 21)}05)`,
              border: `1px solid ${gradientColor(index / 21)}30`,
              boxShadow: flipped ? `0 0 30px -10px ${gradientColor(index / 21)}40` : undefined,
            }}
          >
            <span
              className="font-display absolute top-3 right-4 text-sm font-bold opacity-50"
              style={{ color: gradientColor(index / 21) }}
            >
              #{index + 1}
            </span>
            <p className="text-sm leading-relaxed text-white/80">{text}</p>
          </div>
        </motion.div>
      </motion.div>
    </Reveal>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative h-20 w-20">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-gradient absolute inset-0 flex items-center justify-center text-lg font-black">
        {Math.round(progress * 22)}/22
      </span>
    </div>
  );
}

export default function TwentyTwoV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end end"],
  });
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const progress = useSpring(rawProgress, { stiffness: 60, damping: 20 });

  // Count flipped cards for the progress ring
  const [flippedCount, setFlippedCount] = useState(0);

  return (
    <section ref={sectionRef} className="relative z-10 px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal direction="blur" className="mb-16 flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateZ: -10 }}
            whileInView={{ scale: 1, opacity: 1, rotateZ: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
          >
            <span
              className="text-gradient font-display text-[clamp(5rem,20vw,13rem)] leading-none font-black"
              style={{
                textShadow: "0 0 80px rgba(251,191,36,0.3), 0 0 160px rgba(56,189,248,0.15)",
              }}
            >
              22
            </span>
          </motion.div>
          <h2 className="font-display text-[clamp(1.5rem,4.5vw,2.8rem)] font-bold text-white/90">
            things about you — one for every year
          </h2>
          <p className="font-hand text-xl text-white/45">
            tap each card to reveal
          </p>
          <ProgressRing progress={flippedCount / 22} />
        </Reveal>

        {/* Card grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {items.map((text, i) => (
            <div key={i} onClick={() => setFlippedCount((c) => Math.min(22, c + 1))}>
              <FlipCard index={i} text={text} />
            </div>
          ))}
        </div>

        {/* Completion message */}
        <AnimatePresence>
          {flippedCount >= 22 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-12 text-center"
            >
              <span className="font-hand text-2xl text-white/70">
                that&apos;s all 22 — and honestly, I could write 22 more. 💛
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
