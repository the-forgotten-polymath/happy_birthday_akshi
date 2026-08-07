"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { config } from "@/lib/config";

/**
 * A Spotify-inspired floating music bar at the bottom of the screen.
 * Shows waveform visualization when playing. Auto-hides when not in use.
 */
export default function MusicPlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!playing) setVisible(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [playing]);

  const initAudio = () => {
    const el = audioRef.current;
    if (!el || ctxRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(el);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const w = canvas.width;
    const h = canvas.height;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, w, h);

      const barCount = 24;
      const barW = w / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * data.length);
        const value = data[dataIndex] / 255;
        const barH = Math.max(3, value * h * 0.85);

        const gradient = ctx.createLinearGradient(0, h, 0, h - barH);
        gradient.addColorStop(0, "rgba(251, 191, 36, 0.9)");
        gradient.addColorStop(0.5, "rgba(14, 165, 233, 0.8)");
        gradient.addColorStop(1, "rgba(52, 211, 153, 0.6)");

        const x = i * (barW + 2);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, h - barH, barW, barH, 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const stopWaveform = () => {
    cancelAnimationFrame(frameRef.current);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (playing) {
      el.pause();
      setPlaying(false);
      stopWaveform();
      return;
    }

    try {
      initAudio();
      if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();
      el.volume = 0.5;
      await el.play();
      setPlaying(true);
      drawWaveform();
    } catch {
      setPlaying(false);
    }
  };

  // Track progress
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const update = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    };
    el.addEventListener("timeupdate", update);
    return () => el.removeEventListener("timeupdate", update);
  }, []);

  // Cleanup
  useEffect(() => () => { cancelAnimationFrame(frameRef.current); void ctxRef.current?.close(); }, []);

  if (!config.musicSrc) return null;

  return (
    <>
      <audio ref={audioRef} src={config.musicSrc} loop preload="none" crossOrigin="anonymous" />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2"
          >
            <div className="glass glow-punch relative overflow-hidden rounded-2xl px-4 py-3">
              {/* Progress bar */}
              <div className="bg-punch/30 absolute inset-x-0 bottom-0 h-[2px]">
                <motion.div
                  className="from-sun via-punch to-grape h-full origin-left bg-gradient-to-r"
                  style={{ scaleX: progress }}
                />
              </div>

              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <motion.button
                  onClick={toggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={playing ? "Pause" : "Play"}
                  className="from-sun to-sky flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg"
                >
                  {playing ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="1" y="1" width="4" height="12" rx="1" />
                      <rect x="9" y="1" width="4" height="12" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M2 1.5l10 5.5-10 5.5V1.5z" />
                    </svg>
                  )}
                </motion.button>

                {/* Waveform / info */}
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-medium text-white/80">
                      {config.songTitle || "Birthday Anthem"}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {config.songArtist || ""}
                    </span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={240}
                    height={28}
                    className="h-7 w-full"
                  />
                  {!playing && (
                    <div className="flex h-7 items-end gap-[2px]">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className="from-sun/40 to-sky/40 w-full rounded-sm bg-gradient-to-t"
                          style={{ height: `${20 + Math.sin(i * 0.8) * 40}%` }}
                          animate={{ height: ["20%", `${30 + Math.sin(i) * 45}%`, "20%"] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => setVisible(false)}
                  className="shrink-0 text-white/30 transition-colors hover:text-white/60"
                  aria-label="Hide player"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-show button when hidden */}
      {!visible && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setVisible(true)}
          className="glass fixed right-4 bottom-4 z-50 flex h-11 w-11 items-center justify-center rounded-full text-lg"
          aria-label="Show music player"
        >
          🎵
        </motion.button>
      )}
    </>
  );
}
