"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import { cannons, emojiBurst } from "@/lib/celebrate";

const PRIZES = [
  { label: "Movie of Your Choice", emoji: "🎬" },
  { label: "Food of Your Choice", emoji: "🍜" },
  { label: "Non-Veg Feast", emoji: "🍗" },
  { label: "Coffee of your Choice", emoji: "☕" },
  { label: "One Free Fight Win", emoji: "🥊" },
  { label: "FGC position of your choice", emoji: "😈" },
];

const ITEM_HEIGHT = 100; // Height of each emoji slot in pixels (h-[100px])

function Reel({ items, position, delay }: { items: string[], position: number, delay: number }) {
  return (
    <div className="w-[72px] sm:w-[88px] h-[100px] bg-gradient-to-b from-[#b0b8c4] via-[#f8fafc] to-[#b0b8c4] rounded flex-1 overflow-hidden relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] flex justify-center border border-[#94a3b8]">
      {/* Inner shadow overlay for 3D cylinder effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10" />
      
      <motion.div 
        className="flex flex-col items-center absolute top-0 left-0 w-full"
        animate={{ y: -(position * ITEM_HEIGHT) }}
        transition={{ duration: 3.5 + delay, ease: [0.15, 0.85, 0.25, 1] }}
      >
        {items.map((emoji, i) => (
          <div key={i} className="h-[100px] w-full flex items-center justify-center text-5xl sm:text-6xl border-b border-black/5">
            {emoji}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultEmoji, setResultEmoji] = useState<string>("");
  
  const [reel1, setReel1] = useState<string[]>(() => Array(10).fill("").map(() => PRIZES[Math.floor(Math.random() * PRIZES.length)].emoji));
  const [reel2, setReel2] = useState<string[]>(() => Array(10).fill("").map(() => PRIZES[Math.floor(Math.random() * PRIZES.length)].emoji));
  const [reel3, setReel3] = useState<string[]>(() => Array(10).fill("").map(() => PRIZES[Math.floor(Math.random() * PRIZES.length)].emoji));
  
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(0);
  const [position3, setPosition3] = useState(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const winningPrize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    const targetEmoji = winningPrize.emoji;

    const generateSpins = (prevItems: string[], spinCount: number) => {
      const newItems = [...prevItems];
      for(let i = 0; i < spinCount; i++) {
        newItems.push(PRIZES[Math.floor(Math.random() * PRIZES.length)].emoji);
      }
      newItems.push(targetEmoji);
      newItems.push(PRIZES[0].emoji); 
      newItems.push(PRIZES[1].emoji); 
      return newItems;
    };

    const newR1 = generateSpins(reel1, 20);
    const newR2 = generateSpins(reel2, 30);
    const newR3 = generateSpins(reel3, 40);

    setReel1(newR1);
    setReel2(newR2);
    setReel3(newR3);

    setTimeout(() => {
      setPosition1(newR1.length - 3);
      setPosition2(newR2.length - 3);
      setPosition3(newR3.length - 3);
    }, 50);

    setTimeout(() => {
      setResult(winningPrize.label);
      setResultEmoji(targetEmoji);
      setSpinning(false);
      cannons();
      emojiBurst([targetEmoji, "🎉", "🎊", "💫", "⭐"], 0.5, 0.45);
    }, 5600); 
  };

  return (
    <section className="relative z-10 px-5 py-24 sm:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal direction="blur">
          <p className="font-hand text-mint mb-3 text-xl tracking-[0.1em]">machine</p>
          <h2 className="text-[clamp(1rem,4vw,1.5rem)] italic text-white/70">
            jackpot guarantees a prize - no backing out
          </h2>
        </Reveal>

        <Reveal direction="scale" delay={0.15}>
          <div className="relative mx-auto mt-20 mb-14 w-[320px] sm:w-[380px]">
            {/* The red alarm light on top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-[#e7eaef] rounded-t-2xl z-0 flex items-end justify-center pb-1">
               <div className="w-16 h-8 bg-gradient-to-b from-[#ff6b6b] to-[#c92a2a] rounded-t-xl border border-[#ff8787] shadow-[0_0_20px_rgba(255,107,107,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3)] relative overflow-hidden">
                 <motion.div 
                   animate={spinning ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                   transition={{ repeat: Infinity, duration: 0.5 }}
                   className="absolute inset-0 bg-[#ffc9c9] blur-md"
                 />
                 <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/60 rounded-full blur-[1px]" />
               </div>
            </div>
            
            {/* Main soft metallic body */}
            <div className="relative z-10 bg-gradient-to-b from-[#f8f9fa] via-[#e9ecef] to-[#dee2e6] rounded-[36px] p-6 sm:p-7 shadow-[0_25px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.6),inset_0_4px_15px_rgba(255,255,255,1),inset_0_-8px_15px_rgba(0,0,0,0.1)] border-b-[8px] border-[#ced4da] flex flex-col gap-6">
              
              {/* Yellow Jackpot marquee */}
              <div className="w-[90%] mx-auto h-12 bg-gradient-to-b from-[#ffe066] to-[#fcc419] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(200,100,0,0.4),0_2px_5px_rgba(0,0,0,0.1)] border border-[#fab005] flex items-center justify-center">
                 <div className="text-[#102a43] text-[13px] font-black tracking-[0.3em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">JACKPOT</div>
              </div>

              {/* Inner dark window border */}
              <div className="bg-gradient-to-b from-[#102a43] to-[#243b53] p-4 sm:p-5 rounded-2xl shadow-[inset_0_10px_20px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.8)]">
                
                {/* The 3 reels container */}
                <div className="flex justify-between gap-3 h-[100px] overflow-hidden relative">
                  
                  {/* Red laser line */}
                  <div className="absolute top-1/2 left-[-10px] right-[-10px] h-[2px] bg-[#ff4a4a] -translate-y-1/2 z-20 pointer-events-none shadow-[0_0_8px_3px_rgba(255,74,74,0.6)] opacity-90" />

                  {/* Reels */}
                  <Reel items={reel1} position={position1} delay={0} />
                  <Reel items={reel2} position={position2} delay={0.8} />
                  <Reel items={reel3} position={position3} delay={1.8} />
                  
                </div>
              </div>
              
              {/* Bottom details: circular button & coin slot */}
              <div className="flex justify-between items-center px-2 mt-1">
                 <div className="h-7 w-7 rounded-full bg-[#486581] shadow-[inset_0_3px_6px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.8)]" />
                 <div className="h-3 w-28 bg-[#486581] rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            {/* Handle on the right */}
            <div className="absolute top-1/2 -right-8 sm:-right-9 w-12 sm:w-12 h-40 -translate-y-1/2 z-0 flex items-center">
               {/* Base mounted to machine */}
               <div className="absolute left-0 w-8 h-16 bg-gradient-to-r from-[#94a3b8] to-[#64748b] rounded-r-lg shadow-[inset_-2px_0_5px_rgba(0,0,0,0.3)]" />
               {/* Stick and Ball */}
               <motion.div 
                  className="absolute left-4 w-5 h-32 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] origin-bottom rounded-t-full shadow-[inset_-2px_0_5px_rgba(0,0,0,0.2)] border border-[#94a3b8]"
                  style={{ bottom: "50%", rotateX: 0 }}
                  animate={spinning ? { rotateX: 180, scaleY: 0.5, y: 10 } : { rotateX: 0, scaleY: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, mass: 1.5 }}
               >
                  {/* Red Ball */}
                  <div className="absolute -top-6 -left-[14px] w-12 h-12 bg-gradient-to-br from-[#ff6b6b] via-[#e03131] to-[#c92a2a] rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.4),inset_-3px_-3px_10px_rgba(0,0,0,0.5),inset_3px_3px_5px_rgba(255,255,255,0.6)]" />
               </motion.div>
            </div>
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
          {spinning ? "spinning..." : result ? "spin again!" : "PULL THE LEVER 🎰"}
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
            <p className="mt-2 text-xs tracking-widest text-white/40 uppercase">jackpot!</p>
            <p className="font-display mt-1 text-xl font-bold text-white">{result}</p>
            <p className="font-hand mt-2 text-sm text-white/50">no take-backs 😌</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
