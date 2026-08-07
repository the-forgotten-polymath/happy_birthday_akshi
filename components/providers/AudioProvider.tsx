"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { config } from "@/lib/config";

interface AudioContextState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyser: AnalyserNode | null;
  playing: boolean;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextState | null>(null);

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export default function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize Web Audio API on first interaction
  const initAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const newAnalyser = ctx.createAnalyser();
      newAnalyser.fftSize = 256; // Good size for frequency bars / beat detection
      newAnalyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(newAnalyser);
      newAnalyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      sourceRef.current = source;
      setAnalyser(newAnalyser);
    }
  };

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;

    initAudioContext();

    // Ensure audio context is running (it might be suspended due to autoplay policies)
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        el.volume = 0.45;
        await el.play();
        setPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
        setPlaying(false);
      }
    }
  };

  // Sync state if audio ends
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    
    const handleEnded = () => setPlaying(false);
    const handlePause = () => setPlaying(false);
    const handlePlay = () => setPlaying(true);
    
    el.addEventListener("ended", handleEnded);
    el.addEventListener("pause", handlePause);
    el.addEventListener("play", handlePlay);
    
    return () => {
      el.removeEventListener("ended", handleEnded);
      el.removeEventListener("pause", handlePause);
      el.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ audioRef, analyser, playing, togglePlay }}>
      {config.musicSrc && (
        <audio 
          ref={audioRef} 
          src={config.musicSrc} 
          crossOrigin="anonymous" 
          loop 
          preload="none" 
        />
      )}
      {children}
    </AudioContext.Provider>
  );
}
