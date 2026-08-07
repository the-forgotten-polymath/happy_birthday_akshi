"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { config, type Photo } from "@/lib/config";

/** Breathing room left at the end of the track, in px. */
const END_PAD = 48;

function Polaroid({ photo, index }: { photo: Photo; index: number }) {
  return (
    <motion.figure
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      style={{ rotate: photo.tilt }}
      className="group relative w-[68vw] shrink-0 cursor-pointer rounded-sm bg-white p-3 pb-14 shadow-2xl shadow-black/60 sm:w-[42vw] lg:w-[26vw]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 42vw, 26vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br ${photo.gradient}`}
          >
            <span className="text-5xl drop-shadow-lg sm:text-6xl">{photo.emoji}</span>
            <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] tracking-widest text-white/90 uppercase">
              add photo {index + 1}
            </span>
          </div>
        )}
        {/* glossy sheen on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <figcaption className="font-hand absolute bottom-3 left-0 w-full px-4 text-center text-lg text-neutral-800">
        {photo.caption}
      </figcaption>
    </motion.figure>
  );
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef });

  /**
   * How far the track has to travel, measured rather than guessed. Held in a
   * MotionValue (not state) so re-measuring on resize costs no React render.
   */
  const distance = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      distance.set(Math.max(0, track.scrollWidth - window.innerWidth + END_PAD));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  const rawX = useTransform<number, number>(
    [scrollYProgress, distance],
    ([progress, dist]) => -progress * dist,
  );
  const x = useSpring(rawX, { stiffness: 90, damping: 26, restDelta: 0.5 });
  const headingX = useTransform(scrollYProgress, [0, 1], [0, -140]);

  if (reduced) {
    return (
      <section className="relative z-10 px-5 py-24">
        <h2 className="font-display mb-14 text-center text-4xl font-black">
          the <span className="text-gradient italic">receipts</span>
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {config.photos.map((p, i) => (
            <Polaroid key={p.caption} photo={p} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative z-10 h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div style={{ x: headingX }} className="mb-10 px-5 sm:px-12">
          <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase">
            evidence of a good time
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none font-black">
            the <span className="text-gradient italic">receipts</span>
          </h2>
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-8 pl-5 sm:gap-14 sm:pl-12"
        >
          {config.photos.map((p, i) => (
            <Polaroid key={p.caption} photo={p} index={i} />
          ))}

          {/* tail card */}
          <div className="glass flex w-[62vw] shrink-0 flex-col items-center justify-center gap-4 rounded-3xl p-10 text-center sm:w-[34vw] lg:w-[22vw]">
            <span className="text-4xl">➕</span>
            <p className="font-hand text-2xl text-white/80">
              plenty of room for this year&apos;s
            </p>
          </div>
        </motion.div>

        <p className="mt-10 px-5 text-[10px] tracking-[0.25em] text-white/30 uppercase sm:px-12">
          keep scrolling →
        </p>
      </div>
    </section>
  );
}
