"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { burst, cannons } from "@/lib/celebrate";
import { makeRandom } from "@/lib/random";

const EMOJIS = ["🎂", "🎈", "🎁", "💛", "✨", "🥳", "🎵", "🌟"];
const PAIR_COUNT = 8; // 16 cards total (4×4 grid)

type Card = { id: number; emoji: string; matched: boolean };

function shuffle(arr: Card[], seed: number): Card[] {
  const rng = makeRandom(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoryGame() {
  const [gameSeed, setGameSeed] = useState(1);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const cards = useMemo<Card[]>(() => {
    const pairs = EMOJIS.slice(0, PAIR_COUNT).flatMap((emoji, i) => [
      { id: i * 2, emoji, matched: false },
      { id: i * 2 + 1, emoji, matched: false },
    ]);
    return shuffle(pairs, gameSeed);
  }, [gameSeed]);

  const handleFlip = useCallback(
    (index: number) => {
      if (won) return;
      if (flipped.length >= 2) return;
      if (flipped.includes(index)) return;
      if (matched.has(index)) return;

      const next = [...flipped, index];
      setFlipped(next);

      if (next.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = next;
        if (cards[a].emoji === cards[b].emoji) {
          // Match!
          setTimeout(() => {
            const newMatched = new Set(matched);
            newMatched.add(a);
            newMatched.add(b);
            setMatched(newMatched);
            setFlipped([]);
            burst(0.5, 0.5, 40);

            if (newMatched.size === cards.length) {
              setWon(true);
              setTimeout(() => cannons(), 300);
            }
          }, 500);
        } else {
          // No match — flip back
          setTimeout(() => setFlipped([]), 900);
        }
      }
    },
    [flipped, matched, cards, won],
  );

  const reset = () => {
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setWon(false);
    setGameSeed((s) => s + 1);
  };

  return (
    <section className="relative z-10 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-md text-center">
        <Reveal direction="blur">
          <p className="text-sky mb-3 text-xs tracking-[0.3em] uppercase">test your memory</p>
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight font-black">
            birthday match
          </h2>
          <p className="font-hand mt-2 text-lg text-white/50">
            find all pairs — how fast can you go?
          </p>
        </Reveal>

        {/* Stats bar */}
        <div className="mx-auto mb-4 flex w-full max-w-[340px] items-center justify-between rounded-xl bg-white/[0.05] px-4 py-2 text-sm text-white/60">
          <span>moves: <strong className="text-white">{moves}</strong></span>
          <span>matched: <strong className="text-white">{matched.size / 2}/{PAIR_COUNT}</strong></span>
          <button
            onClick={reset}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/50 transition-colors hover:border-sun/50 hover:text-sun"
          >
            reset
          </button>
        </div>

        {/* Grid */}
        <div className="mx-auto grid w-full max-w-[300px] grid-cols-4 gap-2 sm:max-w-[340px] sm:gap-2.5">
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.has(i);
            const isMatched = matched.has(i);

            return (
              <motion.button
                key={`${gameSeed}-${card.id}`}
                onClick={() => handleFlip(i)}
                whileHover={isFlipped ? {} : { scale: 1.05 }}
                whileTap={isFlipped ? {} : { scale: 0.93 }}
                disabled={isFlipped || won}
                className="relative aspect-square w-full outline-none [perspective:400px]"
                aria-label={isFlipped ? card.emoji : "Hidden card"}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  {/* Back (face-down) */}
                  <div className="glass absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 [backface-visibility:hidden]">
                    <span className="text-xl text-white/20">?</span>
                  </div>

                  {/* Front (face-up) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                      isMatched
                        ? "border-2 border-mint/50 bg-mint/10 shadow-[0_0_20px_-5px] shadow-mint/30"
                        : "glass border border-sun/30"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{card.emoji}</span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Win message */}
        {won && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass glow-punch mx-auto mt-8 max-w-xs rounded-2xl px-6 py-5"
          >
            <span className="block text-3xl">🏆</span>
            <p className="font-display mt-2 text-lg font-bold">you did it!</p>
            <p className="mt-1 text-sm text-white/60">
              {moves <= 12 ? "Impressive memory! 🧠" : moves <= 18 ? "Well played! 🎉" : "Got there in the end! 😂"}
            </p>
            <p className="mt-1 text-xs text-white/40">{moves} moves</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
