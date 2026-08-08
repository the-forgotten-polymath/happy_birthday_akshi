"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { cannons, emojiBurst } from "@/lib/celebrate";

const SEGMENTS = [
  { label: "Movie night - your pick", emoji: "🎬", color: "#0c4a6e", colorLight: "#0ea5e9" },
  { label: "Breakfast in bed", emoji: "🥞", color: "#78350f", colorLight: "#f59e0b" },
  { label: "One wish granted", emoji: "✨", color: "#064e3b", colorLight: "#34d399" },
  { label: "A full day together", emoji: "💛", color: "#1e3a5f", colorLight: "#38bdf8" },
  { label: "Dessert of your choice", emoji: "🍰", color: "#713f12", colorLight: "#fbbf24" },
  { label: "No arguments for 24hrs", emoji: "😇", color: "#0c4a6e", colorLight: "#0ea5e9" },
  { label: "Late night drive", emoji: "🚗", color: "#78350f", colorLight: "#f59e0b" },
  { label: "Surprise plan by me", emoji: "🎁", color: "#064e3b", colorLight: "#34d399" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultEmoji, setResultEmoji] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = (5 + Math.random() * 3) * 360;
    const landingAngle = Math.random() * 360;
    const totalRotation = rotation + extraSpins + landingAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedAngle = totalRotation % 360;
      const pointerAngle = (360 - normalizedAngle) % 360;
      const segIndex = Math.floor(pointerAngle / SEGMENT_ANGLE);
      const landed = SEGMENTS[segIndex % SEGMENTS.length];
      setResult(landed.label);
      setResultEmoji(landed.emoji);
      setSpinning(false);
      cannons();
      emojiBurst(["🎉", "🎊", "🥳", "💫", "⭐"], 0.5, 0.45);
    }, 4800);
  };

  return (
    <section className="relative z-10 px-5 py-24 sm:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal direction="blur">
          <p className="text-mint mb-3 text-xs tracking-[0.3em] uppercase">spin your luck</p>
          <h2 className="font-display text-[clamp(2rem,6vw,3.6rem)] leading-tight font-black">
            birthday wheel of fortune
          </h2>
          <p className="font-hand mt-2 text-xl text-white/50">
            whatever it lands on, I owe you - no backing out
          </p>
        </Reveal>

        <Reveal direction="scale" delay={0.15}>
          <div className="relative mx-auto mt-14 aspect-square w-full max-w-[420px] sm:max-w-[480px]">
            {/* Outer decorative ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.3),0_0_60px_-20px_rgba(251,191,36,0.3)]" />

            {/* Tick marks around the edge */}
            <div className="absolute inset-2 rounded-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute top-0 left-1/2 h-2 w-[2px] origin-bottom -translate-x-1/2 bg-white/20"
                  style={{
                    transform: `translateX(-50%) rotate(${i * (360 / 32)}deg)`,
                    transformOrigin: `50% ${(480 / 2 - 8) / 2}px`,
                    height: i % 4 === 0 ? 8 : 4,
                    opacity: i % 4 === 0 ? 0.4 : 0.15,
                  }}
                />
              ))}
            </div>

            {/* Pointer — bigger and more visible */}
            <div className="absolute top-0 left-1/2 z-30 -translate-x-1/2 -translate-y-2">
              <div className="relative">
                <div className="h-0 w-0 border-x-[16px] border-t-[36px] border-x-transparent border-t-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
                <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            {/* Wheel */}
            <motion.div
              ref={wheelRef}
              animate={{ rotate: rotation }}
              transition={{ duration: 4.6, ease: [0.15, 0.85, 0.25, 1] }}
              className="relative h-full w-full"
              style={{ transformOrigin: "center center" }}
            >
              <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-2xl">
                {SEGMENTS.map((seg, i) => {
                  const startAngle = i * SEGMENT_ANGLE;
                  const endAngle = startAngle + SEGMENT_ANGLE;
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  const radius = 190;
                  const x1 = 200 + radius * Math.cos(startRad);
                  const y1 = 200 + radius * Math.sin(startRad);
                  const x2 = 200 + radius * Math.cos(endRad);
                  const y2 = 200 + radius * Math.sin(endRad);
                  const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                  const midRad = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
                  const emojiX = 200 + 80 * Math.cos(midRad);
                  const emojiY = 200 + 80 * Math.sin(midRad);
                  const labelX = 200 + 130 * Math.cos(midRad);
                  const labelY = 200 + 130 * Math.sin(midRad);
                  const textRotate = (startAngle + endAngle) / 2;

                  return (
                    <g key={i}>
                      {/* Segment fill */}
                      <path
                        d={`M200,200 L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`}
                        fill={i % 2 === 0 ? seg.color : seg.colorLight}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                      />
                      {/* Emoji near center */}
                      <text
                        x={emojiX}
                        y={emojiY}
                        fontSize="22"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotate}, ${emojiX}, ${emojiY})`}
                      >
                        {seg.emoji}
                      </text>
                      {/* Label text */}
                      <text
                        x={labelX}
                        y={labelY}
                        fill="white"
                        fontSize="11"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotate}, ${labelX}, ${labelY})`}
                      >
                        {seg.label.length > 18
                          ? seg.label.split(" ").reduce(
                              (acc: string[][], word) => {
                                const last = acc[acc.length - 1];
                                if (last.join(" ").length + word.length < 14) {
                                  last.push(word);
                                } else {
                                  acc.push([word]);
                                }
                                return acc;
                              },
                              [[]] as string[][],
                            ).map((line, li, arr) => (
                              <tspan
                                key={li}
                                x={labelX}
                                dy={li === 0 ? `${-(arr.length - 1) * 0.55}em` : "1.15em"}
                              >
                                {line.join(" ")}
                              </tspan>
                            ))
                          : seg.label}
                      </text>
                    </g>
                  );
                })}

                {/* Centre hub */}
                <circle cx="200" cy="200" r="32" fill="#0a1628" stroke="rgba(251,191,36,0.4)" strokeWidth="3" />
                <circle cx="200" cy="200" r="26" fill="#132a42" />
                <text x="200" y="202" fill="white" fontSize="20" textAnchor="middle" dominantBaseline="middle">
                  🎂
                </text>
              </svg>
            </motion.div>
          </div>
        </Reveal>

        {/* Spin button */}
        <motion.button
          onClick={spin}
          disabled={spinning}
          whileHover={spinning ? {} : { scale: 1.06 }}
          whileTap={spinning ? {} : { scale: 0.94 }}
          className="from-sun to-sky mt-10 rounded-full bg-gradient-to-r px-10 py-4 text-base font-bold text-white shadow-lg shadow-sun/30 transition-opacity disabled:opacity-50"
        >
          {spinning ? "spinning..." : result ? "spin again!" : "SPIN THE WHEEL 🎰"}
        </motion.button>

        {/* Result */}
        {result && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 14 }}
            className="glass glow-punch mx-auto mt-8 max-w-sm rounded-2xl px-7 py-5"
          >
            <span className="block text-4xl">{resultEmoji}</span>
            <p className="mt-2 text-xs tracking-widest text-white/40 uppercase">you won</p>
            <p className="font-display mt-1 text-xl font-bold text-white">{result}</p>
            <p className="font-hand mt-2 text-sm text-white/50">no take-backs 😌</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
