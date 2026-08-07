"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { burstFromElement, emojiBurst, cannons } from "@/lib/celebrate";

export default function GiftBox() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    burstFromElement(boxRef.current, 130);
    setTimeout(() => {
      const r = boxRef.current?.getBoundingClientRect();
      emojiBurst(
        ["🎁", "🎈", "💖", "✨", "🎊"],
        r ? (r.left + r.width / 2) / window.innerWidth : 0.5,
        r ? (r.top + r.height / 2) / window.innerHeight : 0.5,
      );
    }, 220);
    setTimeout(() => cannons(), 500);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(config.gift.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the code is visible on screen anyway */
    }
  };

  return (
    <section className="relative z-10 overflow-hidden px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal direction="blur">
          <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase">
            surprise #1
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-tight font-black">
            {config.gift.teaser}
          </h2>
        </Reveal>

        {/* ---------------------------------------------------------- the box */}
        <div className="relative mx-auto mt-16 flex h-72 w-full max-w-sm items-end justify-center">
          <motion.div
            ref={boxRef}
            role="button"
            tabIndex={0}
            aria-label="Open the gift"
            aria-expanded={open}
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
            animate={
              open
                ? { scale: 1, rotate: 0 }
                : { rotate: [0, -2.5, 2.5, -2.5, 0], scale: [1, 1.02, 1] }
            }
            transition={
              open
                ? { duration: 0.3 }
                : { duration: 2.4, repeat: Infinity, repeatDelay: 1.4 }
            }
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-44 w-52 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-punch focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
          >
            {/* body */}
            <div className="from-punch to-grape absolute bottom-0 h-36 w-full rounded-b-xl rounded-t-sm bg-gradient-to-b shadow-[0_20px_60px_-15px] shadow-punch/50">
              {/* vertical ribbon */}
              <div className="bg-sun/90 absolute left-1/2 h-full w-8 -translate-x-1/2" />
            </div>

            {/* lid */}
            <motion.div
              animate={
                open
                  ? { y: -140, rotate: -32, x: -40, opacity: 0 }
                  : { y: 0, rotate: 0, x: 0, opacity: 1 }
              }
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
              className="absolute bottom-32 left-1/2 h-12 w-[115%] -translate-x-1/2 origin-bottom"
            >
              <div className="from-grape to-punch h-full w-full rounded-md bg-gradient-to-b shadow-lg">
                <div className="bg-sun/90 absolute left-1/2 h-full w-8 -translate-x-1/2" />
              </div>
              {/* bow */}
              <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 gap-1">
                <span className="bg-sun h-6 w-6 -rotate-12 rounded-full rounded-br-none" />
                <span className="bg-sun h-6 w-6 rotate-12 rounded-full rounded-bl-none" />
              </div>
            </motion.div>

            {/* light spilling out once opened */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 1, 0.55], scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="from-sun/70 absolute bottom-28 left-1/2 h-40 w-32 origin-bottom -translate-x-1/2 bg-gradient-to-t to-transparent blur-xl"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {!open && (
            <motion.span
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-hand absolute -right-2 top-2 text-xl text-white/70 sm:right-4"
            >
              {config.gift.hint} 👆
            </motion.span>
          )}
        </div>

        {/* ------------------------------------------------------- the reveal */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass glow-punch mx-auto mt-10 max-w-md rounded-3xl p-8"
            >
              <h3 className="font-display text-gradient text-2xl font-black sm:text-3xl">
                {config.gift.revealTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                {config.gift.revealBody}
              </p>

              <button
                onClick={copyCode}
                className="group mt-7 w-full rounded-2xl border border-dashed border-white/25 bg-white/[0.03] px-5 py-4 transition-colors hover:border-punch/60 hover:bg-punch/5"
              >
                <span className="block text-[10px] tracking-[0.25em] text-white/40 uppercase">
                  {copied ? "copied ✓" : "tap to copy your coupon"}
                </span>
                <span className="font-display mt-1 block text-lg font-black tracking-wider">
                  {config.gift.couponCode}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
