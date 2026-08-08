"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { burst } from "@/lib/celebrate";
import { between, makeRandom } from "@/lib/random";

const NOTE_COLORS = [
  "bg-amber-100",
  "bg-sky-100",
  "bg-emerald-100",
  "bg-rose-100",
  "bg-violet-100",
  "bg-orange-100",
];

type Note = {
  id: number;
  text: string;
  x: number;
  y: number;
  rotate: number;
  color: string;
  delay: number;
};

/**
 * Wish Jar — type wishes that appear as mini folded paper notes inside a jar.
 * After adding wishes, seal the jar with a cork. Tap the sealed jar to shake.
 */
export default function WishJar() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [sealed, setSealed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const nextId = useRef(0);

  const addWish = useCallback(() => {
    const text = input.trim();
    if (!text || sealed) return;

    const id = nextId.current++;
    const rng = makeRandom(id * 47 + text.length);

    setNotes((prev) => [
      ...prev,
      {
        id,
        text,
        x: between(rng, 10, 72),
        y: between(rng, 15, 70),
        rotate: between(rng, -18, 18),
        color: NOTE_COLORS[id % NOTE_COLORS.length],
        delay: between(rng, 0, 0.4),
      },
    ]);
    setInput("");
    burst(0.5, 0.6, 20);
  }, [input, sealed]);

  const sealJar = () => {
    if (notes.length < 1) return;
    setSealed(true);
    burst(0.5, 0.4, 50);
  };

  const shakeJar = () => {
    if (!sealed || shaking) return;
    setShaking(true);
    setTimeout(() => setShaking(false), 1200);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="font-hand mb-4 text-lg text-white/50">
        {sealed
          ? "sealed! tap the jar to shake your wishes around"
          : "write wishes and drop them in the jar"}
      </p>

      {/* The jar */}
      <motion.div
        onClick={shakeJar}
        animate={
          shaking
            ? { rotate: [-3, 3, -2, 2, -1, 0], x: [-5, 5, -3, 3, 0] }
            : { rotate: 0, x: 0 }
        }
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`relative mx-auto h-80 w-56 sm:h-96 sm:w-64 ${sealed ? "cursor-pointer" : ""}`}
      >
        {/* Glass jar body */}
        <div className="absolute inset-x-0 bottom-0 h-[85%] overflow-hidden rounded-b-[2rem] rounded-t-xl border-x border-b border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-[inset_0_0_30px_rgba(255,255,255,0.04)]">
          {/* Top shoulder borders (left and right) */}
          <div className="absolute top-0 left-0 h-[1px] w-[20%] bg-white/15" />
          <div className="absolute top-0 right-0 h-[1px] w-[20%] bg-white/15" />

          {/* Glass highlight */}
          <div className="absolute top-4 left-3 h-[60%] w-2.5 rounded-full bg-white/10 blur-[2px]" />

          {/* Mini notes inside */}
          <AnimatePresence>
            {notes.map((n) => (
              <motion.div
                key={n.id}
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: shaking ? [0, -12, 8, -5, 0] : [0, -4, 0],
                  x: shaking ? [0, 6, -4, 3, 0] : 0,
                  rotate: shaking
                    ? [n.rotate, n.rotate + 10, n.rotate - 8, n.rotate]
                    : n.rotate,
                }}
                transition={{
                  scale: { duration: 0.4, delay: n.delay },
                  y: {
                    duration: shaking ? 1.2 : 3.5,
                    repeat: shaking ? 0 : Infinity,
                    ease: "easeInOut",
                  },
                  x: { duration: 1.2 },
                  rotate: { duration: shaking ? 1.2 : 0 },
                }}
                className="absolute"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                }}
              >
                {/* Folded paper note */}
                <div
                  className={`relative w-[70px] rounded-sm px-1.5 py-1 shadow-md sm:w-[80px] ${n.color}`}
                  style={{ transform: `rotate(${n.rotate}deg)` }}
                >
                  {/* Fold corner */}
                  <div className="absolute top-0 right-0 h-3 w-3 bg-gradient-to-bl from-black/10 to-transparent" />
                  <p className="line-clamp-3 text-[8px] leading-tight font-medium text-neutral-700 sm:text-[9px]">
                    {n.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-hand text-base text-white/20">drop wishes here</span>
            </div>
          )}
        </div>

        {/* Jar rim */}
        <div className="absolute inset-x-[20%] top-[7%] h-[8%] rounded-t-md border border-white/15 border-b-0 bg-white/[0.06]" />

        {/* Cork */}
        <AnimatePresence>
          {sealed && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-x-[12%] top-[6%] h-[7%] rounded-md bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 shadow-md"
            >
              <div className="absolute inset-x-2 top-1 h-[2px] rounded bg-amber-500/50" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Input */}
      {!sealed && (
        <div className="mx-auto mt-6 flex w-full max-w-xs gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWish()}
            placeholder="write a wish..."
            maxLength={50}
            className="glass flex-1 rounded-full px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-sun/40"
          />
          <motion.button
            onClick={addWish}
            disabled={!input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-sun/90 hover:bg-sun flex h-11 w-11 items-center justify-center rounded-full text-lg text-white shadow-md disabled:opacity-40"
          >
            +
          </motion.button>
        </div>
      )}

      {/* Seal button */}
      {!sealed && notes.length >= 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={sealJar}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="glass mt-3 rounded-full px-5 py-2 text-sm text-white/70 hover:text-white"
        >
          seal the jar 🪄 ({notes.length} wish{notes.length !== 1 ? "es" : ""})
        </motion.button>
      )}

      {sealed && (
        <p className="font-hand mt-4 text-sm text-white/40">
          {notes.length} wish{notes.length !== 1 ? "es" : ""} locked in ✨
        </p>
      )}
    </div>
  );
}
