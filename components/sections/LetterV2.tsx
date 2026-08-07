"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { burst } from "@/lib/celebrate";

/**
 * Typewriter letter — the text types itself out character by character
 * with a blinking cursor. Much more emotional than displaying everything
 * at once. The envelope opens with a 3D fold animation.
 */
export default function LetterV2() {
  const [open, setOpen] = useState(false);
  const [typedIndex, setTypedIndex] = useState(0);
  const [currentPara, setCurrentPara] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3, once: true });

  const fullText = [
    config.letter.greeting,
    "",
    ...config.letter.paragraphs,
    "",
    config.letter.signoff,
    config.letter.signature,
  ].join("\n\n");

  // Typewriter effect
  useEffect(() => {
    if (!open) return;
    if (typedIndex >= fullText.length) return;

    const char = fullText[typedIndex];
    // Pause slightly at punctuation for natural rhythm
    const delay = char === "." || char === "," || char === "—" ? 80 : char === "\n" ? 120 : 28;

    const t = setTimeout(() => setTypedIndex((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [open, typedIndex, fullText]);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    burst(0.5, 0.5, 60);
  };

  return (
    <section className="relative z-10 px-5 py-28 sm:py-36">
      <div ref={containerRef} className="mx-auto max-w-2xl">
        <Reveal direction="blur" className="text-center">
          <p className="text-grape mb-3 text-xs tracking-[0.3em] uppercase">
            the last surprise
          </p>
          <h2 className="font-display text-[clamp(1.9rem,5.5vw,3.4rem)] leading-tight font-black">
            {config.letter.envelopeHint}
          </h2>
        </Reveal>

        <div className="relative mt-16 flex justify-center" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait">
            {!open ? (
              /* -------------------------------------------------- envelope */
              <motion.div
                key="envelope"
                exit={{ rotateX: -90, opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.button
                  aria-label="Open the letter"
                  onClick={handleOpen}
                  animate={{
                    y: [0, -12, 0],
                    rotateZ: [0, -1, 0, 1, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05, rotateZ: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="focus-visible:ring-punch focus-visible:ring-offset-ink relative mx-auto block aspect-[3/2] w-full cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
                >
                  {/* Envelope body */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 shadow-[0_30px_80px_-20px] shadow-black/50" />
                  {/* Paper peeking out */}
                  <motion.div
                    animate={{ y: [-2, -8, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-[12%] top-[8%] h-[40%] rounded-t-md bg-white shadow-sm"
                  >
                    <div className="flex h-full flex-col justify-center px-4">
                      <span className="font-hand block text-sm text-neutral-400">Dear {config.nickname}...</span>
                      <span className="mt-1 block h-[2px] w-3/4 rounded bg-neutral-200" />
                      <span className="mt-1 block h-[2px] w-1/2 rounded bg-neutral-200" />
                    </div>
                  </motion.div>
                  {/* Flap */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-rose-100 to-amber-100"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", borderRadius: "12px 12px 0 0" }}
                  />
                  {/* Wax seal */}
                  <div className="absolute top-[45%] left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-2xl shadow-lg ring-4 ring-red-900/20">
                    💌
                  </div>
                </motion.button>
                <motion.p
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-hand mt-6 text-center text-xl text-white/50"
                >
                  tap to open
                </motion.p>
              </motion.div>
            ) : (
              /* ---------------------------------------------------- letter */
              <motion.article
                key="letter"
                initial={{ opacity: 0, y: 60, rotateX: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full rounded-2xl bg-[linear-gradient(#fffdf7,#fff8ec)] p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] sm:p-12"
              >
                {/* Paper lines */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0 31px, #6b4b2a 31px 32px)",
                  }}
                />

                {/* Left margin line */}
                <div className="pointer-events-none absolute top-0 bottom-0 left-16 w-[1px] bg-rose-200/40 sm:left-20" />

                {/* Typewriter text */}
                <div className="font-hand relative min-h-[300px] whitespace-pre-wrap text-xl leading-[2] text-neutral-700 sm:text-2xl">
                  {fullText.slice(0, typedIndex)}
                  {typedIndex < fullText.length && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-[1px] inline-block h-[1.1em] w-[2px] translate-y-[0.1em] bg-neutral-800"
                    />
                  )}
                </div>

                {/* Signature style when complete */}
                <AnimatePresence>
                  {typedIndex >= fullText.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 flex items-center gap-3"
                    >
                      <span className="from-punch to-grape h-[1px] flex-1 bg-gradient-to-r" />
                      <span className="text-sm text-neutral-400">with love</span>
                      <span className="from-grape to-sky h-[1px] flex-1 bg-gradient-to-r" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
