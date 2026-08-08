"use client";

import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Procedurally generated Pixel Art Pets with blinking & 2D wandering!
 */

const WATER = [
  [
    "       bb       ",
    "      b11b      ",
    "     b1111b     ",
    "    b111111b    ",
    "   b13311111b   ",
    "  b1131111111b  ",
    "  b1111111111b  ",
    " b111e111e1111b ",
    " b111311131111b ",
    " b111111111111b ",
    " b11p11111p111b ",
    "  b1111111111b  ",
    "  b1111111111b  ",
    "   bbbbbbbbbb   ",
    "    bb    bb    ",
  ],
  [
    "       bb       ",
    "      b11b      ",
    "     b1111b     ",
    "    b111111b    ",
    "   b13311111b   ",
    "  b1131111111b  ",
    "  b1111111111b  ",
    " b111e111e1111b ",
    " b111311131111b ",
    " b111111111111b ",
    " b11p11111p111b ",
    "  b1111111111b  ",
    "  b1111111111b  ",
    "   bbbbbbbbbb   ",
    "   bb      bb   ",
  ]
];

const PLANT = [
  [
    "       bb       ",
    "      bggb      ",
    "       bgb      ",
    "    bbbbgbbbb   ",
    "   bwwwwwwwwb   ",
    "  bwwbbbbbbwwb  ",
    "  bwb111111bwb  ",
    " bwwb1e11e1bwwb ",
    " bwwb131131bwwb ",
    " bwwb111111bwwb ",
    " bwwbp1111pbwwb ",
    "  bwwbbbbbbwwb  ",
    "  bwwwwwwwwwwb  ",
    "   bbbbbbbbbb   ",
    "    bb    bb    ",
  ],
  [
    "       bb       ",
    "      bggb      ",
    "       bgb      ",
    "    bbbbgbbbb   ",
    "   bwwwwwwwwb   ",
    "  bwwbbbbbbwwb  ",
    "  bwb111111bwb  ",
    " bwwb1e11e1bwwb ",
    " bwwb131131bwwb ",
    " bwwb111111bwwb ",
    " bwwbp1111pbwwb ",
    "  bwwbbbbbbwwb  ",
    "  bwwwwwwwwwwb  ",
    "   bbbbbbbbbb   ",
    "   bb      bb   ",
  ]
];

const FIRE = [
  [
    "      bb        ",
    "     b11b       ",
    "    b1111b      ",
    "   b112211b     ",
    "  b11222211b    ",
    " b1122222211b   ",
    " b122e222e211b  ",
    "b1122322232211b ",
    "b1122222222211b ",
    "b112p222p2211b  ",
    " b11222222211b  ",
    "  b111221111b   ",
    "   bb1111bb     ",
    "     bbbb       ",
    "                ",
  ],
  [
    "       bb       ",
    "      b11b      ",
    "     b1111b     ",
    "    b112211b    ",
    "   b11222211b   ",
    "  b1122222211b  ",
    "  b122e222e211b ",
    " b1122322232211b",
    " b1122222222211b",
    " b112p222p2211b ",
    "  b11222222211b ",
    "   b111221111b  ",
    "    bb1111bb    ",
    "      bbbb      ",
    "                ",
  ]
];

const ROBOT = [
  [
    "      bbbb      ",
    "     b7777b     ",
    "   bbb7777bbb   ",
    "  b444bbbb444b  ",
    "  b4b444444b4b  ",
    "  b4b444444b4b  ",
    "  b4b4e44e4b4b  ",
    "  b4b434434b4b  ",
    "  b4b444444b4b  ",
    "  b44bbbbbb44b  ",
    "   bb444444bb   ",
    "     b4444b     ",
    "    bb4444bb    ",
    "      bbbb      ",
    "     bb  bb     ",
  ],
  [
    "      bbbb      ",
    "     b7777b     ",
    "   bbb7777bbb   ",
    "  b444bbbb444b  ",
    "  b4b444444b4b  ",
    "  b4b444444b4b  ",
    "  b4b4e44e4b4b  ",
    "  b4b434434b4b  ",
    "  b4b444444b4b  ",
    "  b44bbbbbb44b  ",
    "   bb444444bb   ",
    "     b4444b     ",
    "    bb4444bb    ",
    "      bbbb      ",
    "    bb    bb    ",
  ]
];

const GHOST = [
  [
    "      bbbb      ",
    "    bb8888bb    ",
    "   b88888888b   ",
    "  b8888888888b  ",
    " b888888888888b ",
    " b888888888888b ",
    " b888e8888e888b ",
    " b888388883888b ",
    " b888888888888b ",
    " b88p888888p88b ",
    " b888888888888b ",
    " b888b8888b888b ",
    " b88b b88b b88b ",
    "  bb   bb   bb  ",
    "                ",
  ],
  [
    "      bbbb      ",
    "    bb8888bb    ",
    "   b88888888b   ",
    "  b8888888888b  ",
    " b888888888888b ",
    " b888888888888b ",
    " b888e8888e888b ",
    " b888388883888b ",
    " b888888888888b ",
    " b88p888888p88b ",
    " b888888888888b ",
    "  b88b8888b88b  ",
    "   bb b88b bb   ",
    "       bb       ",
    "                ",
  ]
];

const PALETTES: Record<string, Record<string, string>> = {
  fire: {
    b: "#27272a", 1: "#ea580c", 2: "#fcd34d", e: "#18181b", 3: "#ffffff", p: "#f43f5e",
  },
  plant: {
    b: "#27272a", g: "#65a30d", w: "#fef3c7", 1: "#fde68a", e: "#18181b", 3: "#ffffff", p: "#f43f5e",
  },
  water: {
    b: "#1e3a8a", 1: "#38bdf8", 3: "#ffffff", e: "#0f172a", p: "#ec4899",
  },
  robot: {
    b: "#0f172a", 4: "#94a3b8", 7: "#475569", e: "#1e293b", 3: "#38bdf8",
  },
  ghost: {
    b: "#334155", 8: "#f1f5f9", e: "#0f172a", 3: "#ffffff", p: "#fbcfe8",
  }
};

type PetProps = {
  frames: string[][];
  palette: Record<string, string>;
  skinColorChar: string;
  size?: number;
};

function PixelPet({ frames, palette, skinColorChar, size = 4 }: PetProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Animation for walking
  useEffect(() => {
    const t = setInterval(() => {
      setFrameIdx((i) => (i + 1) % frames.length);
    }, 200);
    return () => clearInterval(t);
  }, [frames.length]);

  // Animation for blinking
  useEffect(() => {
    const blinkCycle = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration
      
      // Schedule next blink
      setTimeout(blinkCycle, Math.random() * 4000 + 2000);
    };
    const t = setTimeout(blinkCycle, Math.random() * 3000);
    return () => clearTimeout(t);
  }, []);

  const frame = frames[frameIdx];

  return (
    <div style={{ width: frame[0].length * size, height: frame.length * size }} className="relative drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      {frame.map((row, y) =>
        row.split("").map((char, x) => {
          if (char === " ") return null;
          
          let finalChar = char;
          // Blink logic: shift eyes down by replacing 'e' with skin, and '3' with 'e'
          if (isBlinking) {
            if (char === 'e') finalChar = skinColorChar;
            if (char === '3') finalChar = 'e';
          }

          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * size,
                top: y * size,
                width: size,
                height: size,
                backgroundColor: palette[finalChar],
              }}
            />
          );
        })
      )}
    </div>
  );
}

type WandererProps = {
  children: React.ReactNode;
  bounceSpeed: number;
};

function Wanderer({ children, bounceSpeed }: WandererProps) {
  const controls = useAnimation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentX = Math.random() * 80 + 10;
    let currentY = Math.random() * 80 + 10;
    
    // Set initial position instantly
    controls.set({ left: `${currentX}vw`, top: `${currentY}vh` });

    const move = async () => {
      if (!isMounted) return;
      const nextX = Math.random() * 80 + 10;
      const nextY = Math.random() * 80 + 10;
      
      const dx = nextX - currentX;
      const dy = nextY - currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = distance * 0.15; // Speed multiplier
      
      setIsFlipped(nextX < currentX);
      setIsMoving(true);
      
      if (!isMounted) return;
      try {
        await controls.start({
          left: `${nextX}vw`,
          top: `${nextY}vh`,
          transition: { duration, ease: "linear" }
        });
      } catch (e) {
        // Safely ignore aborts if unmounted
      }

      if (!isMounted) return;
      setIsMoving(false);
      currentX = nextX;
      currentY = nextY;
      
      // Wait before moving again
      timeoutId = setTimeout(move, Math.random() * 3000 + 1500);
    };

    timeoutId = setTimeout(move, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controls.stop();
    };
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="absolute pointer-events-none"
    >
      <motion.div
        animate={{ 
          y: isMoving ? [0, -6, 0] : 0, 
          scaleX: isFlipped ? -1 : 1
        }}
        transition={{
          y: { duration: bounceSpeed, repeat: isMoving ? Infinity : 0, ease: "easeInOut" },
          scaleX: { duration: 0.2 }
        }}
        className="origin-bottom"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function SVGPets() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <Wanderer bounceSpeed={0.3}>
        <PixelPet frames={WATER} palette={PALETTES.water} skinColorChar="1" size={4.5} />
      </Wanderer>
      
      <Wanderer bounceSpeed={0.28}>
        <PixelPet frames={FIRE} palette={PALETTES.fire} skinColorChar="2" size={4.5} />
      </Wanderer>

      <Wanderer bounceSpeed={0.4}>
        <PixelPet frames={PLANT} palette={PALETTES.plant} skinColorChar="1" size={4.5} />
      </Wanderer>

      <Wanderer bounceSpeed={0.35}>
        <PixelPet frames={ROBOT} palette={PALETTES.robot} skinColorChar="4" size={4.5} />
      </Wanderer>

      <Wanderer bounceSpeed={0.32}>
        <PixelPet frames={GHOST} palette={PALETTES.ghost} skinColorChar="8" size={4.5} />
      </Wanderer>
    </div>
  );
}
