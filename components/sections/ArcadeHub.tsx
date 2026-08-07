"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import WishJar from "@/components/sections/WishJar";
import FortuneCookie from "@/components/sections/FortuneCookie";
import ConstellationDrawer from "@/components/sections/ConstellationDrawer";
import PopBalloons from "@/components/sections/PopBalloons";
import MemoryGame from "@/components/sections/MemoryGame";
import ScratchCard from "@/components/sections/ScratchCard";
import SpinWheel from "@/components/sections/SpinWheel";
import PhotoPuzzle from "@/components/sections/PhotoPuzzle";

type Game = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  gradient: string;
};

const GAMES: Game[] = [
  { id: "pop", title: "Pop the Balloons", emoji: "🎈", tagline: "Tap fast before they escape", gradient: "from-rose-500 to-orange-400" },
  { id: "spin", title: "Spin the Wheel", emoji: "🎰", tagline: "Win a real reward", gradient: "from-amber-400 to-orange-500" },
  { id: "memory", title: "Memory Match", emoji: "🧠", tagline: "Find all the pairs", gradient: "from-emerald-400 to-teal-500" },
  { id: "fortune", title: "Fortune Cookie", emoji: "🥠", tagline: "Crack open your future", gradient: "from-orange-400 to-amber-500" },
  { id: "constellation", title: "Star Maker", emoji: "✨", tagline: "Draw a constellation", gradient: "from-indigo-400 to-purple-500" },
  { id: "wishjar", title: "Wish Jar", emoji: "🫙", tagline: "Seal your wishes", gradient: "from-violet-400 to-fuchsia-500" },
  { id: "scratch", title: "Scratch Card", emoji: "🪙", tagline: "Reveal the hidden message", gradient: "from-yellow-400 to-amber-500" },
  { id: "puzzle", title: "Photo Puzzle", emoji: "🧩", tagline: "Slide tiles to solve", gradient: "from-sky-400 to-blue-500" },
];

function GameCard({ game, onSelect }: { game: Game; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d1b2a]/80 p-6 text-center shadow-xl backdrop-blur-xl outline-none"
    >
      {/* Gradient orb behind the emoji */}
      <div className={`absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-[60%] rounded-full bg-gradient-to-br ${game.gradient} opacity-25 blur-2xl transition-all duration-500 group-hover:opacity-50 group-hover:blur-3xl group-hover:scale-125`} />

      {/* Emoji */}
      <motion.span
        className="relative mb-3 text-[2.8rem] drop-shadow-lg sm:text-[3.2rem]"
        whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.5 }}
      >
        {game.emoji}
      </motion.span>

      {/* Title */}
      <h3 className="font-display relative text-[15px] leading-tight font-bold text-white sm:text-base">
        {game.title}
      </h3>

      {/* Tagline */}
      <p className="relative mt-1.5 text-[11px] text-white/40 sm:text-xs">
        {game.tagline}
      </p>

      {/* Bottom accent line that draws on hover */}
      <div className={`absolute inset-x-6 bottom-4 h-[2px] origin-left scale-x-0 rounded bg-gradient-to-r ${game.gradient} transition-transform duration-500 group-hover:scale-x-100`} />
    </motion.button>
  );
}

export default function ArcadeHub() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const renderGame = () => {
    // Games are rendered inside the arcade container which already provides
    // padding and structure. We wrap them in a div that strips their section-level
    // padding by targeting only the inner content.
    const wrap = (node: React.ReactNode) => (
      <div className="[&>section]:px-0 [&>section]:py-0 [&>section>div]:max-w-none">
        {node}
      </div>
    );
    switch (activeGame) {
      case "pop": return <PopBalloons />;
      case "spin": return wrap(<SpinWheel />);
      case "memory": return wrap(<MemoryGame />);
      case "fortune": return <FortuneCookie />;
      case "constellation": return <ConstellationDrawer />;
      case "wishjar": return <WishJar />;
      case "scratch": return wrap(<ScratchCard />);
      case "puzzle": return wrap(<PhotoPuzzle />);
      default: return null;
    }
  };

  const activeGameData = GAMES.find((g) => g.id === activeGame);

  return (
    <section className="relative z-10 px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <Reveal direction="blur" className="mb-14 text-center">
          <h2 className="font-display text-[clamp(2.2rem,7vw,4rem)] leading-none font-black">
            the birthday <span className="text-gradient italic">arcade</span>
          </h2>
          <p className="font-hand mt-4 text-xl text-white/45">
            8 games, all for you
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {activeGame === null ? (
            /* ─────── Clean Grid ─────── */
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
            >
              {GAMES.map((game, i) => (
                <Reveal key={game.id} direction="up" delay={i * 0.04} amount={0.15}>
                  <GameCard game={game} onSelect={() => setActiveGame(game.id)} />
                </Reveal>
              ))}
            </motion.div>
          ) : (
            /* ─────── Active Game ─────── */
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 flex items-center gap-4">
                <motion.button
                  onClick={() => setActiveGame(null)}
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/70 backdrop-blur-md hover:text-white"
                >
                  ←
                </motion.button>
                <span className="text-2xl">{activeGameData?.emoji}</span>
                <h3 className="font-display text-xl font-bold">{activeGameData?.title}</h3>
              </div>

              <div className="relative rounded-3xl border border-white/[0.06] bg-[#0d1b2a]/70 p-5 backdrop-blur-xl sm:p-8">
                <div className="mx-auto max-w-md">
                  {renderGame()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
