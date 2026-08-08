"use client";

import { motion } from "motion/react";
import { config } from "@/lib/config";
import Reveal from "@/components/ui/Reveal";
import { useState, useEffect } from "react";

export default function Mixtape() {
  const { mixtape, name } = config;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    
    // We might mount while already playing, so assume playing true initially if 
    // it was already started. But relying on event broadcasts is safer.
    // The player will broadcast AUDIO_PAUSED / AUDIO_PLAYING when it mounts or changes.
    window.addEventListener("AUDIO_PLAYING", onPlay);
    window.addEventListener("AUDIO_PAUSED", onPause);
    
    // Ping for initial state (MusicPlayerBar will re-broadcast on state change anyway)
    return () => {
      window.removeEventListener("AUDIO_PLAYING", onPlay);
      window.removeEventListener("AUDIO_PAUSED", onPause);
    };
  }, []);

  const toggle = () => {
    window.dispatchEvent(new CustomEvent("TOGGLE_AUDIO"));
  };

  return (
    <section className="relative z-10 px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-2xl flex flex-col items-center">
        <Reveal direction="blur" className="mb-14 text-center">
          <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase">
            {mixtape.subtitle}
          </p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none font-black">
            <span className="text-gradient italic">{mixtape.title}</span>
          </h2>
        </Reveal>

        {/* Cassette Graphic */}
        <Reveal direction="up" amount={0.2}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={toggle}
            className="relative w-full max-w-[320px] aspect-[1.6/1] bg-white/10 rounded-xl border-4 border-white/20 p-4 shadow-2xl backdrop-blur-md mb-12 mx-auto flex flex-col justify-between cursor-pointer"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            
            {/* Label area */}
            <div className="relative w-full h-[60%] bg-[#ff9e7a] rounded-t flex flex-col items-center justify-center border-b-[3px] border-white/20 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }} />
              <h3 className="font-hand text-3xl text-ink font-bold z-10 -rotate-2 tracking-wider bg-white/70 px-4 py-1 rounded shadow-sm">
                {name}&apos;s Mix
              </h3>
              <div className="absolute bottom-1 left-3 text-[10px] text-ink/70 font-mono font-bold tracking-widest">A SIDE</div>
              <div className="absolute bottom-1 right-3 text-[10px] text-ink/70 font-mono font-bold tracking-widest">NR [  ]</div>
            </div>

            {/* Reels Area */}
            <div className="relative w-full h-[40%] flex justify-center items-center gap-10 sm:gap-14 mt-1">
              {/* Center glass cutout */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-10 bg-black/40 rounded-full flex justify-between items-center px-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                 <div className="w-1 h-full bg-white/10" />
                 <div className="w-1 h-full bg-white/10" />
                 <div className="w-1 h-full bg-white/10" />
              </div>

              {/* Left Reel */}
              <motion.div 
                animate={playing ? { rotate: 360 } : { rotate: 0 }}
                transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              >
                <div className="w-3 h-3 bg-black/50 rounded-full" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 rotate-90" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 rotate-45" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 -rotate-45" />
              </motion.div>

              {/* Right Reel */}
              <motion.div 
                animate={playing ? { rotate: 360 } : { rotate: 0 }}
                transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : {}}
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border-4 border-white/30 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              >
                <div className="w-3 h-3 bg-black/50 rounded-full" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 rotate-90" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 rotate-45" />
                <div className="absolute w-10 sm:w-12 h-1 bg-white/30 -rotate-45" />
              </motion.div>
            </div>

            {/* Bottom trapezoid base */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 h-6 sm:h-8 bg-white/10 backdrop-blur-md rounded-t-lg border-t-2 border-white/20" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }}>
               <div className="flex justify-between px-10 pt-1.5 sm:pt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/40 shadow-inner" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/40 shadow-inner" />
               </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Tracklist */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {mixtape.tracks.map((track, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1} amount={0.2}>
              <motion.div 
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={toggle}
                className="group flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:border-sun/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-white/30 font-mono text-sm w-4 flex justify-center">
                    {playing ? (
                      <span className="text-sun">▶</span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div>
                    <h4 className={`font-semibold transition-colors ${playing ? 'text-sun' : 'text-white group-hover:text-sun'}`}>{track.title}</h4>
                    <p className="text-white/50 text-xs mt-0.5">{track.artist}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Equalizer */}
                  <div className={`flex items-end gap-[3px] h-4 w-6 overflow-hidden transition-opacity ${playing ? 'opacity-100' : 'opacity-30 group-hover:opacity-50'}`}>
                    {[...Array(4)].map((_, idx) => (
                      <motion.div
                        key={idx}
                        className="w-1 bg-sun rounded-t-sm origin-bottom"
                        animate={playing ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                        transition={playing ? { repeat: Infinity, duration: 0.5 + idx * 0.1, ease: "linear" } : {}}
                      />
                    ))}
                  </div>
                  <span className="text-white/40 font-mono text-xs">{track.time}</span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
