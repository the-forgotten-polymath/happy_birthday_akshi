"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { config } from "@/lib/config";

const PARAGRAPH = `Twenty-two chapters in and you're still the most interesting person in any room. This is your year, ${config.nickname}. I can feel it.`;

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-transform">
      {children}
    </motion.span>
  );
}

export default function ScrollText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 25%"],
  });

  const words = PARAGRAPH.split(" ");

  return (
    <section className="relative z-10 px-5 py-32 sm:py-44">
      <p
        ref={ref}
        className="font-display mx-auto max-w-4xl text-center text-[clamp(1.6rem,4.6vw,3.2rem)] leading-[1.25] font-bold"
      >
        {words.map((word, i) => (
          // The literal space between words keeps the text selectable and
          // readable by assistive tech, and lets lines wrap normally.
          <Fragment key={`${word}-${i}`}>
            <Word
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            >
              {word}
            </Word>{" "}
          </Fragment>
        ))}
      </p>
    </section>
  );
}
