"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { config } from "@/lib/config";
import { useAudio } from "@/components/providers/AudioProvider";

export default function MusicToggle() {
  const { playing, togglePlay, analyser } = useAudio();
  const [nudge, setNudge] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setNudge(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Real-time mini equalizer
  useEffect(() => {
    if (!analyser || !playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let frameId: number;

    const draw = () => {
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = 3;
      const gap = 2;
      const maxBars = Math.floor(canvas.width / (barWidth + gap));
      const step = Math.floor(data.length / maxBars);

      for (let i = 0; i < maxBars; i++) {
        const value = data[i * step];
        const percent = value / 255;
        const barHeight = Math.max(2, percent * canvas.height);
        
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(
          i * (barWidth + gap),
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      }
      frameId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(frameId);
  }, [analyser, playing]);

  if (!config.musicSrc) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {nudge && !playing && (
          <motion.span
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="glass hidden rounded-full px-3 py-1.5 text-xs text-white/70 sm:block"
          >
            turn the sound on 🎵
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setNudge(false);
          togglePlay();
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label={playing ? "Pause background music" : "Play background music"}
        aria-pressed={playing}
        className="glass glow-punch flex h-14 items-center gap-3 rounded-full pl-2 pr-4 overflow-hidden relative"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
          <span className={playing ? "animate-spin-slow" : ""}>
            {playing ? "🎶" : "🔇"}
          </span>
        </div>
        
        <div className="flex flex-col items-start justify-center text-left whitespace-nowrap">
          <span className="text-xs font-bold text-white/90 leading-tight">
            {config.songTitle || "Now Playing"}
          </span>
          <span className="text-[10px] text-white/60 leading-tight">
            {config.songArtist || "Unknown Artist"}
          </span>
        </div>
        
        <div className="ml-2 h-6 w-16 opacity-70 shrink-0">
          <canvas ref={canvasRef} width={64} height={24} className="h-full w-full" />
        </div>
      </motion.button>
    </div>
  );
}
