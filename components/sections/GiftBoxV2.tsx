"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { burstFromElement, emojiBurst, cannons, rain } from "@/lib/celebrate";

/**
 * 3D rotating gift cube that explodes open on click.
 * The whole cube spins slowly, inviting interaction.
 * On click: faces fly apart, light beams burst out, confetti everywhere.
 */
export default function GiftBoxV2() {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    burstFromElement(boxRef.current, 150);
    setTimeout(() => emojiBurst(["🎁", "✨", "💖", "🎈", "🎊"], 0.5, 0.45), 200);
    setTimeout(() => cannons(), 400);
    setTimeout(() => rain(2000), 600);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(config.gift.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* visible on screen anyway */ }
  };

  return (
    <section className="relative z-10 overflow-hidden px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal direction="blur">
          <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase">
            a surprise for you
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-tight font-black">
            {config.gift.teaser}
          </h2>
        </Reveal>

        {/* 3D Gift Cube */}
        <div className="relative mx-auto mt-16 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="cube"
                ref={boxRef}
                onClick={handleOpen}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
                role="button"
                tabIndex={0}
                aria-label="Open the gift"
                className="relative h-48 w-48 cursor-pointer outline-none sm:h-56 sm:w-56"
                style={{ perspective: 600, transformStyle: "preserve-3d" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotateY: [0, 360], rotateX: [0, 10, 0, -10, 0] }}
                  transition={{ rotateY: { duration: 12, repeat: Infinity, ease: "linear" }, rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                  className="relative h-full w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front face */}
                  <Face className="from-punch to-grape bg-gradient-to-br" style={{ transform: "translateZ(96px)" }}>
                    <span className="text-5xl">🎁</span>
                  </Face>
                  {/* Back */}
                  <Face className="from-grape to-sky bg-gradient-to-br" style={{ transform: "rotateY(180deg) translateZ(96px)" }}>
                    <span className="text-4xl">✨</span>
                  </Face>
                  {/* Left */}
                  <Face className="from-sun to-punch bg-gradient-to-br" style={{ transform: "rotateY(-90deg) translateZ(96px)" }}>
                    <span className="text-4xl">💝</span>
                  </Face>
                  {/* Right */}
                  <Face className="from-mint to-sky bg-gradient-to-br" style={{ transform: "rotateY(90deg) translateZ(96px)" }}>
                    <span className="text-4xl">🎊</span>
                  </Face>
                  {/* Top */}
                  <Face className="from-sun via-punch to-grape bg-gradient-to-br" style={{ transform: "rotateX(90deg) translateZ(96px)" }}>
                    <span className="text-3xl">🎀</span>
                  </Face>
                  {/* Bottom */}
                  <Face className="from-grape to-punch bg-gradient-to-br opacity-80" style={{ transform: "rotateX(-90deg) translateZ(96px)" }}>
                    <span className="text-3xl">💫</span>
                  </Face>
                </motion.div>

                {/* Glow underneath */}
                <div className="absolute -bottom-6 left-1/2 h-4 w-40 -translate-x-1/2 rounded-[50%] bg-punch/30 blur-xl" />
              </motion.div>
            ) : (
              /* ---- Exploded state: faces fly outward ---- */
              <motion.div
                key="exploded"
                initial={{ scale: 1 }}
                animate={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute"
                style={{ perspective: 600, transformStyle: "preserve-3d" }}
              >
                {[
                  { x: -180, y: -150, r: -45 },
                  { x: 160, y: -130, r: 60 },
                  { x: -200, y: 80, r: -30 },
                  { x: 180, y: 100, r: 50 },
                  { x: -50, y: -200, r: -70 },
                  { x: 60, y: 180, r: 40 },
                ].map((dir, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{
                      x: dir.x,
                      y: dir.y,
                      rotate: dir.r,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                    className="from-punch/50 to-grape/50 absolute h-24 w-24 rounded-xl bg-gradient-to-br"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Light burst on open */}
          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="from-sun/60 via-punch/40 absolute h-32 w-32 rounded-full bg-gradient-radial to-transparent blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Tap hint */}
          {!opened && (
            <motion.span
              animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-hand absolute -bottom-4 text-xl text-white/60"
            >
              {config.gift.hint} 👆
            </motion.span>
          )}
        </div>

        {/* Reveal card */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass glow-punch mx-auto mt-10 max-w-md rounded-3xl p-8"
            >
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="font-display text-gradient text-2xl font-black sm:text-3xl"
              >
                {config.gift.revealTitle}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base"
              >
                {config.gift.revealBody}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                onClick={copyCode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group mt-7 w-full rounded-2xl border border-dashed border-white/25 bg-white/[0.03] px-5 py-4 transition-colors hover:border-punch/60 hover:bg-punch/5"
              >
                <span className="block text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  {copied ? "copied ✓" : "tap to copy your coupon"}
                </span>
                <span className="font-display mt-1 block text-lg font-black tracking-wider">
                  {config.gift.couponCode}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Face({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute flex h-full w-full items-center justify-center rounded-2xl border border-white/10 ${className}`}
      style={{ ...style, backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  );
}
