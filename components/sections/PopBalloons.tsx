"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { burst } from "@/lib/celebrate";

const MESSAGES = [
  "you're incredible",
  "22 looks good on you",
  "main character energy",
  "your laugh > everything",
  "proud of you always",
  "certified legend",
  "the world is better with you",
  "you make everything fun",
  "your vibe is unmatched",
  "stay exactly as you are",
  "you're someone's reason to smile",
  "the best is yet to come",
  "you deserve the world",
  "everyone's favourite human",
  "built different, honestly",
  "the kindest soul I know",
  "22 reasons to celebrate",
  "you glow without trying",
  "unstoppable this year",
  "they broke the mould after you",
  "my favourite notification",
  "chapter 22: your era",
];

const BALLOON_COLORS = [
  ["#0ea5e9", "#7dd3fc"],
  ["#f59e0b", "#fcd34d"],
  ["#34d399", "#a7f3d0"],
  ["#f97316", "#fed7aa"],
  ["#38bdf8", "#bae6fd"],
  ["#fbbf24", "#fef3c7"],
];

type Balloon = {
  id: number;
  x: number;
  message: string;
  colors: string[];
  speed: number;
  size: number;
  wobble: number;
};

type Popped = {
  id: number;
  x: number;
  y: number;
  message: string;
};

const TOTAL = 22;
const GAME_DURATION = 30; // seconds

export default function PopBalloons() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [popped, setPopped] = useState<Popped[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [missed, setMissed] = useState(0);
  const nextId = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgIndex = useRef(0);

  const cleanup = useCallback(() => {
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    if (gameTimer.current) clearInterval(gameTimer.current);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startGame = () => {
    cleanup();
    setBalloons([]);
    setPopped([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    nextId.current = 0;
    msgIndex.current = 0;

    // Spawn balloons at intervals
    spawnTimer.current = setInterval(() => {
      setBalloons((prev) => {
        // Remove balloons that have floated off screen
        const active = prev.filter((b) => true); // They self-remove via animation end
        if (active.length > 8) return active; // Don't overcrowd

        const id = nextId.current++;
        const colorSet = BALLOON_COLORS[id % BALLOON_COLORS.length];
        const msg = MESSAGES[msgIndex.current % MESSAGES.length];
        msgIndex.current++;

        return [
          ...active,
          {
            id,
            x: 10 + Math.random() * 75,
            message: msg,
            colors: colorSet,
            speed: 4 + Math.random() * 3,
            size: 50 + Math.random() * 20,
            wobble: (Math.random() - 0.5) * 30,
          },
        ];
      });
    }, 1100);

    // Countdown timer
    gameTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          cleanup();
          setGameState("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const popBalloon = (balloon: Balloon, e: React.MouseEvent | React.TouchEvent) => {
    // Get position for the popped message display
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const container = (e.currentTarget as HTMLElement).closest("[data-arena]");
    const arenaRect = container?.getBoundingClientRect();
    const relX = rect.left - (arenaRect?.left || 0) + rect.width / 2;
    const relY = rect.top - (arenaRect?.top || 0);

    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    setPopped((prev) => [...prev.slice(-5), { id: balloon.id, x: relX, y: relY, message: balloon.message }]);
    setScore((s) => s + 1);
    burst(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight,
      20,
    );

    // Clear popped message after a bit
    setTimeout(() => {
      setPopped((prev) => prev.filter((p) => p.id !== balloon.id));
    }, 1800);
  };

  const removeBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    if (gameState === "playing") setMissed((m) => m + 1);
  };

  return (
    <div className="flex flex-col items-center">
      {gameState === "idle" && (
        <div className="text-center">
          <p className="font-hand mb-4 text-lg text-white/50">
            pop balloons to reveal compliments — catch as many as you can!
          </p>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="from-sun to-mint rounded-full bg-gradient-to-r px-8 py-3 text-sm font-bold text-white shadow-lg"
          >
            START GAME 🎈
          </motion.button>
        </div>
      )}

      {gameState !== "idle" && (
        <>
          {/* Score bar */}
          <div className="mb-3 flex w-full items-center justify-between rounded-xl bg-white/[0.05] px-4 py-2 text-sm">
            <span className="text-white/60">
              popped: <strong className="text-sun">{score}</strong>
            </span>
            <span className={`font-display text-lg font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-white"}`}>
              {timeLeft}s
            </span>
            <span className="text-white/60">
              missed: <strong className="text-white/40">{missed}</strong>
            </span>
          </div>

          {/* Game arena */}
          <div
            data-arena
            className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0a1628]/60 to-[#0a1628]/30 sm:h-[380px]"
          >
            {/* Floating balloons */}
            <AnimatePresence>
              {balloons.map((b) => (
                <motion.button
                  key={b.id}
                  initial={{ y: "110%", x: 0, opacity: 1 }}
                  animate={{
                    y: "-120%",
                    x: [0, b.wobble, -b.wobble * 0.6, 0],
                  }}
                  transition={{
                    y: { duration: b.speed, ease: "linear" },
                    x: { duration: b.speed * 0.7, repeat: Infinity, ease: "easeInOut" },
                  }}
                  onAnimationComplete={() => removeBalloon(b.id)}
                  onClick={(e) => popBalloon(b, e)}
                  className="absolute cursor-pointer outline-none"
                  style={{ left: `${b.x}%`, bottom: 0 }}
                  whileTap={{ scale: 0.5, opacity: 0 }}
                >
                  <div
                    className="relative rounded-[50%]"
                    style={{
                      width: b.size,
                      height: b.size * 1.2,
                      background: `radial-gradient(circle at 30% 25%, ${b.colors[1]}, ${b.colors[0]} 60%)`,
                      boxShadow: `0 0 20px -4px ${b.colors[0]}88`,
                    }}
                  >
                    {/* Highlight */}
                    <span
                      className="absolute rounded-full bg-white/50 blur-[1px]"
                      style={{ width: b.size * 0.15, height: b.size * 0.2, left: "24%", top: "16%" }}
                    />
                    {/* Knot */}
                    <span
                      className="absolute bottom-[-4px] left-1/2 -translate-x-1/2"
                      style={{
                        width: 6,
                        height: 5,
                        background: b.colors[0],
                        clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                      }}
                    />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Popped message reveals */}
            <AnimatePresence>
              {popped.map((p) => (
                <motion.div
                  key={`msg-${p.id}`}
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -30 }}
                  exit={{ opacity: 0, y: -60, scale: 0.7 }}
                  transition={{ duration: 1.2 }}
                  className="pointer-events-none absolute"
                  style={{ left: p.x - 60, top: p.y }}
                >
                  <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-800 shadow-md">
                    {p.message}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Game over */}
      {gameState === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4"
        >
          <span className="text-3xl">
            {score >= 18 ? "🏆" : score >= 12 ? "🎉" : score >= 6 ? "👏" : "😅"}
          </span>
          <div className="flex-1 text-left">
            <p className="font-display text-base font-bold">
              {score} / {score + missed} popped!
            </p>
            <p className="text-xs text-white/50">
              {score >= 18 ? "incredible reflexes! 🔥" : score >= 12 ? "nice going! 🌟" : score >= 6 ? "not bad!" : "they were fast huh? 😂"}
            </p>
          </div>
          <motion.button
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs text-white/70 hover:text-white"
          >
            again 🎈
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
