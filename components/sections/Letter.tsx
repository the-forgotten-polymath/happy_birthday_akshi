"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { burst } from "@/lib/celebrate";

export default function Letter() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    burst(0.5, 0.55, 70);
  };

  return (
    <section className="relative z-10 px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-2xl">
        <Reveal direction="blur" className="text-center">
          <p className="text-grape mb-3 text-xs tracking-[0.3em] uppercase">
            surprise #3
          </p>
          <h2 className="font-display text-[clamp(1.9rem,5.5vw,3.4rem)] leading-tight font-black">
            {config.letter.envelopeHint}
          </h2>
        </Reveal>

        <div className="relative mt-16 flex justify-center">
          <AnimatePresence mode="wait">
            {!open ? (
              /* -------------------------------------------------- envelope */
              <motion.div
                key="envelope"
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-label="Open the letter"
                  onClick={handleOpen}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpen();
                    }
                  }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="focus-visible:ring-punch focus-visible:ring-offset-ink relative mx-auto aspect-[3/2] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                >
                  {/* body */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 shadow-2xl shadow-black/50" />
                  {/* flap */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-br from-rose-200 to-amber-200"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                  {/* wax seal */}
                  <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-xl shadow-lg ring-4 ring-red-900/20">
                    💌
                  </div>
                </motion.div>
                <p className="font-hand mt-6 text-center text-xl text-white/50">
                  tap to open
                </p>
              </motion.div>
            ) : (
              /* ---------------------------------------------------- letter */
              <motion.article
                key="letter"
                initial={{ opacity: 0, y: 90, rotateX: -25, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1200 }}
                className="relative w-full rounded-2xl bg-[linear-gradient(#fffdf7,#fff8ec)] p-8 text-left shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] sm:p-12"
              >
                {/* paper texture lines */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0 31px, #6b4b2a 31px 32px)",
                  }}
                />

                <motion.p
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-hand text-3xl text-neutral-800"
                >
                  {config.letter.greeting}
                </motion.p>

                <div className="mt-6 space-y-5">
                  {config.letter.paragraphs.map((p, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + i * 0.4, duration: 0.8 }}
                      className="font-hand text-xl leading-relaxed text-neutral-700 sm:text-2xl"
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75 + config.letter.paragraphs.length * 0.4 }}
                  className="font-hand mt-8 text-2xl text-neutral-800"
                >
                  {config.letter.signoff}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.1 + config.letter.paragraphs.length * 0.4,
                    duration: 0.9,
                  }}
                  className="font-hand mt-3 text-3xl text-rose-600"
                >
                  {config.letter.signature}
                </motion.p>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
