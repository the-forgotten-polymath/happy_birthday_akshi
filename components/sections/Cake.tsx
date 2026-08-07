"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { cannons, rain, burst } from "@/lib/celebrate";
import { between, makeRandom } from "@/lib/random";

const CANDLE_COUNT = 5;

/* -------------------------------------------------------------------------- */
/*  Decoration, generated once from a seeded PRNG so it's varied but stable    */
/* -------------------------------------------------------------------------- */

type Sprinkle = { left: string; top: string; rotate: number; color: string };

const SPRINKLE_COLORS = ["#ffc93c", "#2ee6a8", "#38bdf8", "#ffe9a3", "#ffffff"];
/** Matches the frosting gradient's bottom stop (rose-100) so drips blend in. */
const FROSTING_EDGE = "#ffe4e6";

function makeSprinkles(count: number, seed: number): Sprinkle[] {
  const rng = makeRandom(seed);
  return Array.from({ length: count }, () => ({
    left: `${between(rng, 8, 92)}%`,
    top: `${between(rng, 22, 82)}%`,
    rotate: between(rng, -70, 70),
    color: SPRINKLE_COLORS[Math.floor(rng() * SPRINKLE_COLORS.length)],
  }));
}

const TOP_SPRINKLES = makeSprinkles(11, 0x5eed);
const BOTTOM_SPRINKLES = makeSprinkles(18, 0xba11);

/**
 * The scalloped icing edge under a frosting layer.
 *
 * One repeating half-ellipse rather than hand-placed circles: sizing the tile
 * as `100 / count` percent means the scallops always divide evenly into the
 * tier width, so the edge stays continuous at any width with no clipped blob
 * at the end.
 *
 * `top-full` anchors it to the frosting's own bottom edge — which only works
 * because the frosting element is itself positioned. `z-10` lifts it above the
 * cake body, a later sibling in the DOM.
 */
function Drips({ count, height = 11 }: { count: number; height?: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-full z-10"
      style={{
        height,
        backgroundImage: `radial-gradient(ellipse 50% ${height}px at 50% 0, ${FROSTING_EDGE} 0 99%, transparent 100%)`,
        backgroundSize: `${100 / count}% 100%`,
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

function Sprinkles({ specs }: { specs: Sprinkle[] }) {
  return (
    <>
      {specs.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute h-[3px] w-[9px] rounded-full opacity-90"
          style={{
            left: s.left,
            top: s.top,
            background: s.color,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}

/** A row of piped cream pearls along the base of a tier. */
function Pearls({ count }: { count: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-2 bottom-[5px] flex items-center justify-between"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="block h-[7px] w-[7px] rounded-full bg-rose-50/85 shadow-[0_0_3px_rgba(255,255,255,0.5)]"
        />
      ))}
    </div>
  );
}

/** Soft vertical highlight so the tiers read as cylinders, not flat rectangles. */
function Gloss() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[6%] w-[22%] bg-gradient-to-r from-white/25 to-transparent blur-[6px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[16%] bg-gradient-to-l from-black/25 to-transparent"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** A single candle. Flame turns into a puff of smoke when blown out. */
function Candle({ lit, onClick, index }: { lit: boolean; onClick: () => void; index: number }) {
  // Classic striped birthday candle wax
  const [light, dark] =
    index % 2 === 0 ? ["#fce7f3", "#ec4899"] : ["#e0f2fe", "#0ea5e9"];

  return (
    <button
      onClick={onClick}
      aria-label={lit ? `Blow out candle ${index + 1}` : `Candle ${index + 1} is out`}
      className="group focus-visible:ring-punch focus-visible:ring-offset-ink relative flex cursor-pointer flex-col items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {/* flame / smoke */}
      <div className="relative h-[22px] w-4">
        <AnimatePresence mode="wait">
          {lit ? (
            <motion.span
              key="flame"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="absolute bottom-0 left-1/2 h-[19px] w-[14px] -translate-x-1/2"
            >
              {/* the flicker lives on this wrapper so it can't fight the
                  teardrop's own rotation */}
              <span className="animate-flicker relative block h-full w-full origin-bottom">
                {/* teardrop: a square with three round corners, rotated so the
                    sharp corner points up */}
                <span
                  className="absolute bottom-[1px] left-1/2 block h-[13px] w-[13px] bg-gradient-to-tl from-orange-600 via-amber-400 to-yellow-100 shadow-[0_0_20px_6px] shadow-amber-400/50"
                  style={{
                    borderRadius: "0 50% 50% 50%",
                    transform: "translateX(-50%) rotate(45deg)",
                  }}
                />
                {/* hot core */}
                <span className="absolute bottom-[2px] left-1/2 block h-[8px] w-[4px] -translate-x-1/2 rounded-full bg-amber-50/90 blur-[1px]" />
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="smoke"
              initial={{ opacity: 0.9, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -26, scale: 1.9 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/40 blur-[3px]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* wick */}
      <span className="block h-[5px] w-[2px] rounded-full bg-stone-500" />

      {/* wax */}
      <span
        className="block h-[52px] w-[11px] rounded-t-[4px] transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          backgroundImage: `repeating-linear-gradient(38deg, ${light} 0 5px, ${dark} 5px 10px)`,
          boxShadow: "inset -3px 0 5px rgba(0,0,0,0.22), inset 2px 0 3px rgba(255,255,255,0.5)",
        }}
      />
    </button>
  );
}

export default function Cake() {
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLE_COUNT).fill(true));
  const [micState, setMicState] = useState<"idle" | "listening" | "denied">("idle");
  const [blowing, setBlowing] = useState(false);

  const litCount = lit.filter(Boolean).length;
  const allOut = litCount === 0;
  const cleanupRef = useRef<(() => void) | null>(null);
  // Derived rather than stored, so blowing out the last candle implicitly
  // ends the listening state without a setState inside an effect.
  const listening = micState === "listening" && !allOut;

  const extinguish = useCallback((i: number) => {
    setLit((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, []);

  /** Blow out one still-lit candle, left to right. */
  const extinguishNext = useCallback(() => {
    setLit((prev) => {
      const i = prev.findIndex(Boolean);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, []);

  // Celebrate once the last flame goes out
  useEffect(() => {
    if (!allOut) return;
    cannons();
    const stop = rain(2600);
    // Release the microphone the moment the last flame is out.
    cleanupRef.current?.();
    return stop;
  }, [allOut]);

  // Tear down the mic when leaving the page
  useEffect(() => () => cleanupRef.current?.(), []);

  const startMic = async () => {
    if (listening || allOut) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Request settings that favour breath detection
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      // Use time-domain data (waveform amplitude) instead of frequency data.
      // Blowing into a mic produces sustained broadband amplitude, not
      // frequency spikes — time domain catches this much more reliably.
      const data = new Uint8Array(analyser.fftSize);
      let frame = 0;
      let loudFrames = 0;

      const tick = () => {
        analyser.getByteTimeDomainData(data);

        // Compute RMS (root mean square) of the waveform — this is the most
        // reliable measure of "how loud is it right now" regardless of
        // frequency content.
        let sumSq = 0;
        for (let i = 0; i < data.length; i++) {
          const normalized = (data[i] - 128) / 128; // centre around 0
          sumSq += normalized * normalized;
        }
        const rms = Math.sqrt(sumSq / data.length);

        // rms ranges from 0 (silence) to ~1 (clipping).
        // Typical blowing registers 0.05–0.3 on most laptop/phone mics.
        const isLoud = rms > 0.04;
        const isBlowing = rms > 0.07;

        setBlowing(isLoud);
        if (isBlowing) {
          loudFrames++;
          // Every 3 loud frames (~50ms each at 60fps) = one candle out
          if (loudFrames % 3 === 0) extinguishNext();
        } else {
          // Reset only after a brief silence so stuttery breath still works
          if (loudFrames > 0) loudFrames = Math.max(0, loudFrames - 1);
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);

      cleanupRef.current = () => {
        cancelAnimationFrame(frame);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        setBlowing(false);
        cleanupRef.current = null;
      };
      setMicState("listening");
    } catch {
      setMicState("denied");
    }
  };

  const relight = () => {
    setLit(Array(CANDLE_COUNT).fill(true));
    burst(0.5, 0.6, 40);
  };

  return (
    <section className="relative z-10 px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal direction="blur">
          <p className="text-punch mb-3 text-xs tracking-[0.3em] uppercase">
            surprise #2
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-tight font-black">
            {allOut ? config.cake.afterTitle : config.cake.title}
          </h2>
          <p className="font-hand mt-3 text-xl text-white/60">
            {allOut ? config.cake.afterBody : config.cake.hint}
          </p>
        </Reveal>

        {/* ------------------------------------------------------------- cake */}
        <Reveal direction="up" delay={0.15}>
          <motion.div
            animate={blowing ? { rotate: [-1, 1, -1] } : { rotate: 0 }}
            transition={{ duration: 0.25, repeat: blowing ? Infinity : 0 }}
            className="relative mx-auto mt-14 w-full max-w-[320px]"
          >
            {/* halo from the flames — brightens with each candle still lit */}
            <AnimatePresence>
              {litCount > 0 && (
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 + litCount * 0.08 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-12 left-1/2 h-44 w-64 -translate-x-1/2 rounded-full bg-amber-400/50 blur-3xl"
                />
              )}
            </AnimatePresence>

            {/* candles — sunk slightly into the frosting */}
            <div className="relative z-20 -mb-[6px] flex items-end justify-center gap-[14px]">
              {lit.map((isLit, i) => (
                <Candle key={i} lit={isLit} index={i} onClick={() => extinguish(i)} />
              ))}
            </div>

            {/* ---------------------------------------------------- top tier */}
            <div className="relative z-10 mx-auto w-[58%]">
              {/* frosting (positioned, so the drips anchor to *its* edge) */}
              <div className="relative h-[22px] rounded-t-[14px] bg-gradient-to-b from-white via-rose-50 to-rose-100">
                <Drips count={9} height={10} />
              </div>
              {/* body */}
              <div className="relative h-[74px] overflow-hidden bg-gradient-to-b from-fuchsia-500 via-purple-600 to-purple-700">
                <Gloss />
                <Sprinkles specs={TOP_SPRINKLES} />
                <Pearls count={8} />
              </div>
            </div>

            {/* ------------------------------------------------- bottom tier */}
            <div className="relative mx-auto w-[92%]">
              <div className="relative h-[22px] rounded-t-[10px] bg-gradient-to-b from-white via-rose-50 to-rose-100">
                <Drips count={14} height={11} />
              </div>
              <div className="relative h-[98px] overflow-hidden rounded-b-[10px] bg-gradient-to-b from-fuchsia-600 via-purple-700 to-purple-900">
                <Gloss />
                <Sprinkles specs={BOTTOM_SPRINKLES} />
                <Pearls count={13} />
              </div>
            </div>

            {/* cake board + contact shadow */}
            <div className="relative">
              <div className="mx-auto h-[7px] w-full rounded-t-[3px] bg-gradient-to-b from-white/45 to-white/20" />
              <div className="mx-auto h-[5px] w-[96%] rounded-b-[6px] bg-black/35" />
              <div
                aria-hidden
                className="mx-auto mt-1.5 h-2.5 w-[64%] rounded-[50%] bg-black/55 blur-md"
              />
            </div>
          </motion.div>
        </Reveal>

        {/* ---------------------------------------------------------- controls */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {!allOut && (
            <motion.button
              onClick={startMic}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={listening}
              className="glass rounded-full px-6 py-3 text-sm text-white/80 disabled:opacity-60"
            >
              {listening
                ? blowing
                  ? "keep going… 💨"
                  : "listening — blow at your mic 🎤"
                : "let me actually blow them out 🎤"}
            </motion.button>
          )}

          {!allOut && (
            <motion.button
              onClick={extinguishNext}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-punch/90 hover:bg-punch rounded-full px-6 py-3 text-sm font-medium text-white"
            >
              blow one out 💨
            </motion.button>
          )}

          {allOut && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={relight}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="glass rounded-full px-6 py-3 text-sm text-white/70"
            >
              light them again 🕯️
            </motion.button>
          )}
        </div>

        {micState === "denied" && (
          <p className="mt-4 text-xs text-white/40">
            No mic access — no problem, just tap the candles instead.
          </p>
        )}
      </div>
    </section>
  );
}
