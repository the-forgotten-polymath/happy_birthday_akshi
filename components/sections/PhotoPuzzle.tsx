"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { cannons, rain } from "@/lib/celebrate";

const GRID = 3; // 3×3 grid = 8 tiles + 1 empty
const TOTAL = GRID * GRID;
const IMAGE = "/photos/puzzle.jpg"; // Put any photo here

type Tile = number; // 0 = empty, 1-8 = tiles

/** Check if the puzzle is solved (tiles are in order 1,2,...,8,0). */
function isSolved(tiles: Tile[]): boolean {
  for (let i = 0; i < TOTAL - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[TOTAL - 1] === 0;
}

/** Generate a solvable shuffle. A random permutation is solvable if the
 *  number of inversions is even (for odd grid sizes). */
function generatePuzzle(): Tile[] {
  const solved = Array.from({ length: TOTAL }, (_, i) => (i + 1) % TOTAL) as Tile[];
  // Shuffle until we get a solvable non-trivial configuration
  for (let attempt = 0; attempt < 200; attempt++) {
    const arr = [...solved];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Count inversions (ignoring empty tile 0)
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
      }
    }
    if (inversions % 2 === 0 && !isSolved(arr)) return arr;
  }
  // Fallback — just swap two adjacent non-zero tiles from solved state
  const fallback = [...solved];
  [fallback[0], fallback[1]] = [fallback[1], fallback[0]];
  return fallback;
}

export default function PhotoPuzzle() {
  const [tiles, setTiles] = useState<Tile[]>(() => generatePuzzle());
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const emptyIndex = tiles.indexOf(0);

  const canMove = useCallback(
    (index: number) => {
      const row = Math.floor(index / GRID);
      const col = index % GRID;
      const emptyRow = Math.floor(emptyIndex / GRID);
      const emptyCol = emptyIndex % GRID;
      return (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      );
    },
    [emptyIndex],
  );

  const moveTile = useCallback(
    (index: number) => {
      if (solved || !canMove(index)) return;
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (isSolved(newTiles)) {
        setSolved(true);
        setTimeout(() => { cannons(); rain(2000); }, 300);
      }
    },
    [tiles, emptyIndex, canMove, solved],
  );

  const reset = () => {
    setTiles(generatePuzzle());
    setMoves(0);
    setSolved(false);
  };

  // Tile background positions — each tile shows a piece of the photo
  const tileStyle = (tile: Tile) => {
    if (tile === 0) return {};
    const tileIndex = tile - 1;
    const row = Math.floor(tileIndex / GRID);
    const col = tileIndex % GRID;
    return {
      backgroundImage: `url(${IMAGE})`,
      backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
      backgroundPosition: `${(col / (GRID - 1)) * 100}% ${(row / (GRID - 1)) * 100}%`,
    };
  };

  return (
    <section className="relative z-10 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-md text-center">
        <Reveal direction="blur">
          <p className="text-sky mb-3 text-xs tracking-[0.3em] uppercase">solve it</p>
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight font-black">
            photo puzzle
          </h2>
          <p className="font-hand mt-2 text-lg text-white/50">
            {solved ? "you did it! 🎉" : "slide the tiles to reveal the picture"}
          </p>
        </Reveal>

        {/* Stats */}
        <div className="mx-auto mt-6 flex max-w-xs items-center justify-between text-sm text-white/60">
          <span>moves: <strong className="text-white">{moves}</strong></span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/50 transition-colors hover:border-sun/50 hover:text-sun"
          >
            {showPreview ? "hide hint" : "show hint 👀"}
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/50 transition-colors hover:border-sun/50 hover:text-sun"
          >
            new puzzle
          </button>
        </div>

        {/* Preview image (hint) */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div
                className="mx-auto aspect-square w-32 rounded-xl border border-white/10 bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url(${IMAGE})` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <div className="relative mx-auto mt-8 aspect-square w-full max-w-[320px] sm:max-w-[360px]">
          <div className="glass absolute inset-0 rounded-2xl" />
          <div className="relative grid h-full w-full grid-cols-3 grid-rows-3 gap-1 p-2">
            {tiles.map((tile, index) => (
              <motion.button
                key={`tile-${tile}`}
                onClick={() => moveTile(index)}
                disabled={tile === 0 || solved}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`relative flex items-center justify-center rounded-lg text-lg font-bold ${
                  tile === 0
                    ? "bg-transparent"
                    : canMove(index) && !solved
                      ? "cursor-pointer shadow-lg ring-1 ring-white/20 transition-shadow hover:ring-sun/50 hover:shadow-sun/20"
                      : "shadow-md ring-1 ring-white/10"
                } ${solved && tile !== 0 ? "ring-mint/40" : ""}`}
                style={tile === 0 ? {} : tileStyle(tile)}
              >
                {/* Tile number overlay (fades out when solved to show clean image) */}
                {tile !== 0 && !solved && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 text-xl font-black text-white/70">
                    {tile}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Solved overlay */}
          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-end rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent p-6"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass rounded-2xl px-6 py-4 text-center"
                >
                  <span className="text-3xl">🏆</span>
                  <p className="font-display mt-1 text-sm font-bold">Solved in {moves} moves!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-xs text-white/30">
          💡 tip: place <code className="text-white/50">/photos/puzzle.jpg</code> in public folder for a real photo
        </p>
      </div>
    </section>
  );
}
