"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
  trail: boolean;
};

const HUES = [40, 200, 160, 30, 190, 50];

/**
 * A lightweight canvas firework display. Rockets rise, explode into a ring of
 * sparks, then fade. Pauses itself whenever `active` is false so it never
 * burns CPU off-screen.
 */
export default function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];
    let rockets: Particle[] = [];
    let raf = 0;
    const running = active;
    let sinceLaunch = 0;

    const launch = () => {
      const targetY = height * (0.18 + Math.random() * 0.32);
      const x = width * (0.12 + Math.random() * 0.76);
      const flightTime = 55 + Math.random() * 25;
      rockets.push({
        x,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(height + 10 - targetY) / flightTime,
        life: flightTime,
        maxLife: flightTime,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
        size: 2.4,
        trail: true,
      });
    };

    const explode = (r: Particle) => {
      const count = 46 + Math.floor(Math.random() * 30);
      const power = 2.6 + Math.random() * 2.2;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        const speed = power * (0.55 + Math.random() * 0.7);
        const life = 55 + Math.random() * 45;
        particles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          hue: r.hue + (Math.random() * 30 - 15),
          size: 1.4 + Math.random() * 1.8,
          trail: false,
        });
      }
    };

    const frame = () => {
      // Fade the previous frame instead of clearing — gives free light trails.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      if (running) {
        sinceLaunch++;
        const interval = 34;
        if (sinceLaunch > interval) {
          sinceLaunch = 0;
          launch();
          if (Math.random() > 0.6) setTimeout(launch, 180);
        }
      }

      rockets = rockets.filter((r) => {
        r.x += r.vx;
        r.y += r.vy;
        r.life--;
        ctx.beginPath();
        ctx.fillStyle = `hsl(${r.hue} 100% 78%)`;
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fill();
        if (r.life <= 0) {
          explode(r);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.vy += 0.028; // gravity
        p.vx *= 0.988; // drag
        p.vy *= 0.988;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue} 100% ${55 + alpha * 30}% / ${alpha})`;
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        return p.life > 0;
      });

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
