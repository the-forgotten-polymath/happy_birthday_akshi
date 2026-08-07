"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { burst } from "@/lib/celebrate";

const NAMES = [
  "Ursa Akshita",
  "The Birthday Queen",
  "Constellation 22",
  "Stellaris Magna",
  "The Golden Year",
  "Nova Akshi",
  "The Wish Maker",
  "Corona Jubilee",
  "The Bright One",
  "Astra Twenty-Two",
];

type Star = { x: number; y: number; id: number };

const MAX_STARS = 7;

/**
 * Constellation Drawer — tap on a dark sky to place stars.
 * After 5+ stars, lines connect them and a constellation name is revealed.
 */
export default function ConstellationDrawer() {
  const [stars, setStars] = useState<Star[]>([]);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");

  const placeStar = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (connected || stars.length >= MAX_STARS) return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newStar: Star = { x, y, id: Date.now() };
      const newStars = [...stars, newStar];
      setStars(newStars);

      // Auto-connect at 5+ stars
      if (newStars.length >= 5) {
        setTimeout(() => {
          setConnected(true);
          setName(NAMES[Math.floor(Math.random() * NAMES.length)]);
          burst(0.5, 0.5, 60);
        }, 600);
      }
    },
    [stars, connected],
  );

  const reset = () => {
    setStars([]);
    setConnected(false);
    setName("");
  };

  return (
    <div className="flex flex-col items-center">
      <p className="font-hand mb-4 text-lg text-white/50">
        {connected
          ? "your constellation is born ✨"
          : `tap the sky to place stars (${stars.length}/${MAX_STARS})`}
      </p>

      {/* Sky canvas */}
      <div
        onClick={placeStar}
        className="relative mx-auto h-72 w-full max-w-md cursor-crosshair overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a0e1a] via-[#0f1629] to-[#0a1628] sm:h-80"
      >
        {/* Ambient stars in background */}
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={`bg-${i}`}
            className="animate-twinkle absolute h-[1px] w-[1px] rounded-full bg-white/40"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 67) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}

        {/* Connecting lines */}
        <AnimatePresence>
          {connected && stars.length >= 2 && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 h-full w-full"
            >
              {stars.map((star, i) => {
                if (i === 0) return null;
                const prev = stars[i - 1];
                return (
                  <motion.line
                    key={`line-${i}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={star.x}
                    y2={star.y}
                    stroke="rgba(251,191,36,0.5)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  />
                );
              })}
              {/* Close the shape: last to first */}
              <motion.line
                x1={stars[stars.length - 1].x}
                y1={stars[stars.length - 1].y}
                x2={stars[0].x}
                y2={stars[0].y}
                stroke="rgba(251,191,36,0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: stars.length * 0.15 + 0.5, duration: 0.6 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Placed stars */}
        {stars.map((star, i) => (
          <motion.div
            key={star.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.8, 1],
              opacity: 1,
            }}
            className="absolute"
            style={{ left: star.x - 6, top: star.y - 6 }}
          >
            {/* Star glow */}
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-amber-300/60 blur-[4px]" />
            {/* Star core */}
            <motion.div
              animate={
                connected
                  ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }
                  : {}
              }
              transition={
                connected
                  ? { duration: 2, repeat: Infinity, delay: i * 0.2 }
                  : {}
              }
              className="relative h-3 w-3 rounded-full bg-amber-200 shadow-[0_0_8px_2px] shadow-amber-300/60"
            />
          </motion.div>
        ))}

        {/* Constellation name */}
        <AnimatePresence>
          {connected && name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute inset-x-0 bottom-4 text-center"
            >
              <span className="font-display inline-block rounded-full bg-black/50 px-4 py-1.5 text-sm font-bold text-amber-200 backdrop-blur-sm">
                ⭐ {name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap guide (when empty) */}
        {stars.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-sm text-white/30"
            >
              tap anywhere to place a star
            </motion.span>
          </div>
        )}
      </div>

      {/* Reset */}
      {connected && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={reset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs text-white/50 hover:text-white"
        >
          draw another constellation
        </motion.button>
      )}
    </div>
  );
}
