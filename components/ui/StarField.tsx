"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { between, makeRandom } from "@/lib/random";
import { useAudio } from "@/components/providers/AudioProvider";

const HUES = ["#ffc93c", "#ff2e88", "#38bdf8", "#2ee6a8", "#ffffff"];
const TOTAL = 90;
/** Stars beyond this index are hidden on small screens. */
const MOBILE_LIMIT = 45;

/**
 * Twinkling backdrop. Built from a seeded generator so the markup is identical
 * on the server and the client — no hydration mismatch, no layout shift.
 */
const STARS = (() => {
  const rng = makeRandom(0x5eed);
  return Array.from({ length: TOTAL }, () => {
    const size = between(rng, 1, 4);
    return {
      left: `${between(rng, 0, 100)}%`,
      top: `${between(rng, 0, 100)}%`,
      size,
      delay: `${between(rng, 0, 4)}s`,
      duration: `${between(rng, 2, 5)}s`,
      hue: HUES[Math.floor(rng() * HUES.length)],
    };
  });
})();

export default function StarField() {
  const reduced = useReducedMotion();
  const { analyser, playing } = useAudio();
  const washRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduced || !analyser || !playing) return;
    
    const data = new Uint8Array(analyser.frequencyBinCount);
    let frameId: number;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      
      // Calculate bass (average of first 5 bins)
      let bassSum = 0;
      for (let i = 0; i < 5; i++) bassSum += data[i];
      const bassAvg = bassSum / 5;
      const washOpacity = 0.5 + (bassAvg / 255) * 0.5; // Opacity 0.5 to 1.0
      
      if (washRef.current) {
        washRef.current.style.opacity = washOpacity.toString();
        washRef.current.style.transform = `scale(${1 + (bassAvg / 255) * 0.1})`;
      }

      starsRef.current.forEach((star, i) => {
        if (!star) return;
        // Make some stars react more to specific frequencies, others to bass
        const freqBin = i % Math.floor(data.length / 2);
        const val = data[freqBin];
        const scale = 1 + (val / 255) * 1.5;
        star.style.transform = `scale(${scale})`;
      });

      frameId = requestAnimationFrame(tick);
    };
    
    tick();

    return () => cancelAnimationFrame(frameId);
  }, [analyser, playing, reduced]);

  // Reset transforms when not playing
  useEffect(() => {
    if (!playing && !reduced) {
      if (washRef.current) {
        washRef.current.style.opacity = "1";
        washRef.current.style.transform = "scale(1)";
      }
      starsRef.current.forEach(star => {
        if (star) star.style.transform = "scale(1)";
      });
    }
  }, [playing, reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ambient colour wash */}
      <div 
        ref={washRef}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(ellipse_at_85%_75%,rgba(255,46,136,0.18),transparent_55%),radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,0.10),transparent_70%)] transition-opacity duration-75" 
      />

      {!reduced &&
        STARS.map((s, i) => (
          <span
            key={i}
            ref={el => {
              starsRef.current[i] = el;
            }}
            className={`animate-twinkle absolute rounded-full ${
              i >= MOBILE_LIMIT ? "hidden sm:block" : ""
            }`}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: s.hue,
              boxShadow: `0 0 ${s.size * 3}px ${s.hue}`,
              animationDelay: s.delay,
              animationDuration: s.duration,
              transition: "transform 0.05s ease-out",
            }}
          />
        ))}
    </div>
  );
}
