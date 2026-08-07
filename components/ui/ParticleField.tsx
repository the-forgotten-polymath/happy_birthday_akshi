"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

/**
 * GPU-accelerated 2D canvas particle system.
 *
 * Particles drift upward slowly and react to scroll velocity — scrolling
 * fast causes them to scatter outward, giving a sense of speed. When
 * idle they reform into a gentle ambient drift.
 *
 * Replaces the old DOM-based StarField. 200+ particles at 60fps, zero
 * layout thrash.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollVel = useRef(0);
  const prevScroll = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    scrollVel.current = latest - prevScroll.current;
    prevScroll.current = latest;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(251, 191, 36, ",   // warm gold
      "rgba(245, 158, 11, ",   // amber
      "rgba(56, 189, 248, ",   // sky blue
      "rgba(52, 211, 153, ",   // mint
      "rgba(255, 255, 255, ",  // white
      "rgba(14, 165, 233, ",   // deeper blue
    ];

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      color: string;
      phase: number;
      speed: number;
    };

    const COUNT = w < 640 ? 80 : 160;
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.1),
      size: Math.random() * 2 + 0.5,
      baseSize: Math.random() * 2 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
    }));

    let frame = 0;
    let time = 0;

    const tick = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Dampen scroll velocity over time
      const vel = scrollVel.current;
      scrollVel.current *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient drift
        p.x += p.vx + Math.sin(time + p.phase) * 0.15;
        p.y += p.vy;

        // Scroll reaction: particles scatter sideways and speed up vertically
        p.x += (Math.random() - 0.5) * Math.abs(vel) * 0.02;
        p.y -= vel * 0.015;

        // Pulsing size
        p.size = p.baseSize + Math.sin(time * 2 + p.phase) * 0.4;

        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Opacity pulses
        const alpha = 0.3 + Math.sin(time * p.speed * 60 + p.phase) * 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.3, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha.toFixed(2) + ")";
        ctx.fill();

        // Glow for larger particles
        if (p.baseSize > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.15).toFixed(3) + ")";
          ctx.fill();
        }
      }

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
