"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { burst } from "@/lib/celebrate";

const HIDDEN_MESSAGE = "You're not just a year older — you're a year more legendary. 22 suits you. 💛";

/**
 * A canvas-based scratch card. The user drags their finger/mouse over a golden
 * overlay to reveal the hidden birthday message underneath. Once ~55% is
 * scratched, the whole overlay fades away.
 */
export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const scratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Draw the golden scratch surface
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#fbbf24");
    grad.addColorStop(0.4, "#f59e0b");
    grad.addColorStop(0.7, "#d97706");
    grad.addColorStop(1, "#fbbf24");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add shimmer texture
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Text on the scratch surface
    ctx.font = "bold 16px system-ui";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.textAlign = "center";
    ctx.fillText("✨ scratch me ✨", rect.width / 2, rect.height / 2);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      checkReveal();
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparent++;
      }
      const ratio = transparent / (imageData.data.length / 4);
      if (ratio > 0.55) {
        setRevealed(true);
        burst(0.5, 0.5, 100);
      }
    };

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      }
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };

    const down = () => { scratching.current = true; };
    const up = () => { scratching.current = false; };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!scratching.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      scratch(x, y);
    };

    canvas.addEventListener("mousedown", down);
    canvas.addEventListener("mouseup", up);
    canvas.addEventListener("mouseleave", up);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("touchstart", down, { passive: true });
    canvas.addEventListener("touchend", up);
    canvas.addEventListener("touchmove", move, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", down);
      canvas.removeEventListener("mouseup", up);
      canvas.removeEventListener("mouseleave", up);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("touchstart", down);
      canvas.removeEventListener("touchend", up);
      canvas.removeEventListener("touchmove", move);
    };
  }, [revealed]);

  return (
    <section className="relative z-10 px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-lg text-center">
        <Reveal direction="blur">
          <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase">a little game</p>
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] leading-tight font-black">
            scratch to reveal
          </h2>
          <p className="font-hand mt-2 text-lg text-white/50">
            use your finger or mouse
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <div
            ref={containerRef}
            className="relative mx-auto mt-10 h-48 w-full max-w-sm overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px] shadow-sun/30 sm:h-56"
          >
            {/* Hidden message underneath */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#132a42] to-[#0a1628] p-6">
              <p className="font-hand text-xl leading-relaxed text-white/90 sm:text-2xl">
                {HIDDEN_MESSAGE}
              </p>
            </div>

            {/* Scratch canvas overlay */}
            <motion.canvas
              ref={canvasRef}
              animate={revealed ? { opacity: 0, scale: 1.1 } : { opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            />

            {/* Revealed sparkle */}
            {revealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="absolute text-6xl">✨</span>
              </motion.div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
