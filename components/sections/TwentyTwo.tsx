"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { config } from "@/lib/config";
import { gradientColor } from "@/lib/gradient";

const items = config.twentyTwo;

/**
 * A dedicated "22" section — twenty-two rapid-fire things about her
 * that scroll past a giant sticky number. The number fills its stroke
 * as you progress through the list.
 */
export default function TwentyTwo() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Drives the stroke fill on the big "22"
  const rawDash = useTransform(scrollYProgress, [0, 0.95], [0, 1]);
  const dash = useSpring(rawDash, { stiffness: 60, damping: 20 });

  // The number slowly rotates and scales up
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[260vh] py-12 sm:py-20"
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center justify-center overflow-hidden px-5">
        {/* Giant "22" watermark — positioned behind the cards */}
        <motion.div
          style={{ rotate, scale }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 400 200"
            className="h-auto w-[80vw] max-w-[700px] opacity-[0.08]"
          >
            <motion.text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fontSize="200"
              fontWeight="900"
              fontFamily="var(--font-display), ui-serif"
              fill="none"
              stroke="url(#grad22)"
              strokeWidth="2"
              style={{ pathLength: dash }}
            >
              22
            </motion.text>
            <defs>
              <linearGradient id="grad22" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffc93c" />
                <stop offset="40%" stopColor="#ff2e88" />
                <stop offset="70%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Foreground content */}
        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <Reveal direction="blur" className="mb-12 text-center sm:mb-16">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <span className="text-gradient font-display text-[clamp(4rem,18vw,12rem)] leading-none font-black">
                22
              </span>
            </motion.div>
            <h2 className="font-display mt-4 text-[clamp(1.4rem,4vw,2.6rem)] font-bold text-white/90">
              things about you at twenty-two
            </h2>
            <p className="font-hand mt-2 text-lg text-white/50 sm:text-xl">
              one for every year, because you deserve the count
            </p>
          </Reveal>

          {/* The 22 cards — masonry-style grid */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <Reveal
                key={i}
                direction="up"
                delay={(i % 4) * 0.06}
                amount={0.3}
                className="mb-4 break-inside-avoid"
              >
                <div className="glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
                  {/* number badge */}
                  <span
                    className="font-display absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black"
                    style={{
                      background: gradientColor(i / 21),
                      color: i > 10 ? "#fff" : "#1a0a2e",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/75">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
