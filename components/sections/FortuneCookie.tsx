"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { burst } from "@/lib/celebrate";

const FORTUNES = [
  "This year, something you gave up on will come back better than before.",
  "A spontaneous decision in the next 3 months will change everything.",
  "Someone is going to tell you exactly what you needed to hear — soon.",
  "The thing you're overthinking? It's going to work out. Relax.",
  "You'll laugh so hard this year that your stomach will hurt for a week.",
  "A new friendship is coming that will feel like you've known them forever.",
  "That one thing you keep putting off? Do it this month. You'll thank yourself.",
  "You're about to enter your most confident era yet.",
  "An unexpected message is going to make your whole week.",
  "22 is going to be the year you stop saying 'maybe next time.'",
  "Someone is secretly proud of you. More people than you think, actually.",
  "You'll discover a song this year that becomes the soundtrack to a core memory.",
];

/**
 * Fortune Cookie — tap a cookie to crack it open and reveal a fortune.
 * Each crack shows a new fortune. The cookie splits with a satisfying animation.
 */
export default function FortuneCookie() {
  const [cracked, setCracked] = useState(false);
  const [fortune, setFortune] = useState("");
  const [fortuneIndex, setFortuneIndex] = useState(0);
  const [crackCount, setCrackCount] = useState(0);

  const crack = () => {
    setCracked(true);
    const idx = fortuneIndex % FORTUNES.length;
    setFortune(FORTUNES[idx]);
    setFortuneIndex(idx + 1);
    setCrackCount((c) => c + 1);
    burst(0.5, 0.5, 45);
  };

  const reset = () => {
    setCracked(false);
    setFortune("");
  };

  return (
    <div className="flex flex-col items-center">
      <p className="font-hand mb-6 text-lg text-white/50">
        tap the cookie to reveal your fortune
      </p>

      <div className="relative flex h-56 w-64 items-center justify-center">
        <AnimatePresence mode="wait">
          {!cracked ? (
            /* Whole cookie */
            <motion.button
              key="whole"
              onClick={crack}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.92 }}
              className="relative cursor-pointer outline-none"
              aria-label="Crack the fortune cookie"
            >
              {/* Cookie body — shape made with CSS */}
              <div className="relative h-28 w-40">
                {/* Left half */}
                <div
                  className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500"
                  style={{ borderRadius: "50% 0 0 50% / 80% 0 0 80%" }}
                />
                {/* Right half */}
                <div
                  className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-gradient-to-bl from-amber-300 via-amber-400 to-amber-600"
                  style={{ borderRadius: "0 50% 50% 0 / 0 80% 80% 0" }}
                />
                {/* Center fold line */}
                <div className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2 bg-amber-700/30" />
                {/* Highlight */}
                <div className="absolute top-2 left-[20%] h-4 w-10 rounded-full bg-amber-200/50 blur-[2px]" />
                {/* Shadow underneath */}
                <div className="absolute -bottom-3 left-1/2 h-3 w-28 -translate-x-1/2 rounded-[50%] bg-black/20 blur-md" />
              </div>
              {/* Tap hint */}
              <motion.span
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/40"
              >
                tap to crack 🥠
              </motion.span>
            </motion.button>
          ) : (
            /* Cracked cookie */
            <motion.div
              key={`cracked-${crackCount}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Two halves flying apart */}
              <div className="relative flex items-center gap-4">
                <motion.div
                  initial={{ x: 0, rotate: 0 }}
                  animate={{ x: -20, rotate: -15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="h-14 w-14 rounded-l-full bg-gradient-to-br from-amber-300 to-amber-500"
                  style={{ borderRadius: "50% 10% 10% 50% / 80% 40% 40% 80%" }}
                />
                <motion.div
                  initial={{ x: 0, rotate: 0 }}
                  animate={{ x: 20, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="h-14 w-14 rounded-r-full bg-gradient-to-bl from-amber-300 to-amber-600"
                  style={{ borderRadius: "10% 50% 50% 10% / 40% 80% 80% 40%" }}
                />
              </div>

              {/* The fortune slip */}
              <motion.div
                initial={{ opacity: 0, y: 10, scaleY: 0.3 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[240px] rounded-md bg-amber-50 px-4 py-3 shadow-md"
              >
                <p className="text-center text-sm leading-relaxed font-medium text-amber-900 italic">
                  &ldquo;{fortune}&rdquo;
                </p>
              </motion.div>

              {/* Another cookie button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={reset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 rounded-full border border-white/20 px-4 py-2 text-xs text-white/60 hover:text-white"
              >
                crack another 🥠
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {crackCount > 0 && (
        <p className="mt-2 text-xs text-white/30">
          {crackCount} cookie{crackCount !== 1 ? "s" : ""} cracked
        </p>
      )}
    </div>
  );
}
