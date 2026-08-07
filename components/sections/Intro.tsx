"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { config } from "@/lib/config";

/**
 * Cinematic full-screen intro that plays once on first visit.
 * - A soft breathing glow backdrop
 * - Countdown 3 → 2 → 1 with each number exploding outward
 * - Then the name + age reveal, and the curtain lifts
 *
 * Once done, it unmounts itself entirely and never blocks scroll.
 */
export default function Intro({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState<"counting" | "reveal" | "done">("counting");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drive the countdown from an interval stored in a ref — no setState in the
  // effect body itself, just the interval callback.
  useEffect(() => {
    if (phase !== "counting") return;

    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("reveal");
          return 0;
        }
        return c - 1;
      });
    }, 900);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2400);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#06030f]"
        >
          {/* Ambient pulsing orbs */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_60%)]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-1/4 bottom-1/4 h-[45vmax] w-[45vmax] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.3),transparent_60%)]"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.25),transparent_55%)]"
            />
          </div>

          {/* Countdown numbers */}
          <AnimatePresence mode="wait">
            {phase === "counting" && count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 2.5, opacity: 0, filter: "blur(10px)" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display relative text-[clamp(8rem,30vw,20rem)] font-black text-white/90"
                style={{ textShadow: "0 0 80px rgba(56,189,248,0.5), 0 0 160px rgba(251,191,36,0.3)" }}
              >
                {count}
              </motion.span>
            )}

            {/* The big reveal */}
            {phase === "reveal" && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotateX: 90 }}
                  animate={{ scale: 1, rotateX: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 }}
                  className="text-gradient font-display text-[clamp(5rem,22vw,14rem)] leading-none font-black"
                  style={{ perspective: 1000 }}
                >
                  22
                </motion.span>
                <motion.span
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-hand text-3xl text-white/80 sm:text-4xl"
                >
                  happy birthday, {config.nickname}
                </motion.span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="from-sun via-punch to-grape mt-4 h-[2px] w-48 origin-center bg-gradient-to-r"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating particles during countdown */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/40"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                }}
                animate={{
                  y: [0, -80, 0],
                  x: [0, (i % 2 === 0 ? 20 : -20), 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Infinity,
                  delay: (i * 0.15) % 2.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
    </AnimatePresence>
  );
}
