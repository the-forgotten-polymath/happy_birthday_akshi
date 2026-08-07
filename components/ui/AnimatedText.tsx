"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { gradientColor } from "@/lib/gradient";

type Props = {
  text: string;
  /** Animate each character, or each word */
  by?: "char" | "word";
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Play on mount instead of waiting for the element to scroll into view */
  immediate?: boolean;
  /**
   * Paint the text with the site gradient.
   *
   * Do NOT use the `text-gradient` CSS utility here: it relies on
   * `background-clip: text` with `color: transparent`, and the animated
   * per-character spans are composited separately, so the clipped background
   * never reaches them and the text renders invisible. This colours each
   * character individually instead.
   */
  gradient?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const child: Variants = {
  hidden: { opacity: 0, y: "0.55em", rotateX: -75, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AnimatedText({
  text,
  by = "char",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.035,
  immediate = false,
  gradient = false,
  as = "span",
}: Props) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    // No nested spans here, so the CSS utility is safe on this path.
    return (
      <Tag className={[className, gradient && "text-gradient"].filter(Boolean).join(" ")}>
        {text}
      </Tag>
    );
  }

  const words = text.split(" ");
  const animate = immediate ? { animate: "show" } : { whileInView: "show" };

  // Character offset each word starts at, so the gradient sweeps continuously
  // across the whole phrase rather than restarting on every word.
  const wordStart: number[] = [];
  let runningLength = 0;
  for (const word of words) {
    wordStart.push(runningLength);
    runningLength += word.length;
  }
  const totalChars = Math.max(1, runningLength - 1);

  const colorAt = (index: number) =>
    gradient ? { color: gradientColor(index / totalChars) } : undefined;

  return (
    <MotionTag
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      {...animate}
      viewport={immediate ? undefined : { once: true, amount: 0.4 }}
      aria-label={text}
      style={{ perspective: 800 }}
    >
      {words.map((word, w) => (
        <span
          key={`${word}-${w}`}
          className={`inline-block whitespace-nowrap ${wordClassName ?? ""}`}
          aria-hidden
        >
          {by === "char" ? (
            word.split("").map((c, i) => (
              <motion.span
                key={`${c}-${i}`}
                variants={child}
                style={colorAt(wordStart[w] + i)}
                className="inline-block will-change-transform"
              >
                {c}
              </motion.span>
            ))
          ) : (
            <motion.span
              variants={child}
              style={colorAt(wordStart[w] + word.length / 2)}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
          )}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
