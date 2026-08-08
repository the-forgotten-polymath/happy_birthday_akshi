"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { memories } from "@/lib/memories";

const PHOTO_OFFSETS: Record<number, {x: number, y: number}> = {
  "1": { "x": 50, "y": 0 },
  "6": { "x": 50, "y": 0 },
  "9": { "x": 50, "y": 10 },
  "13": { "x": 50, "y": 0 },
  "15": { "x": 50, "y": 0 },
  "16": { "x": 50, "y": 20 },
  "17": { "x": 85, "y": 50 },
  "18": { "x": 50, "y": 80 },
  "21": { "x": 50, "y": 0 },
  "25": { "x": 50, "y": 5 },
  "26": { "x": 50, "y": 30 },
  "28": { "x": 50, "y": 70 },
  "35": { "x": 50, "y": 0 },
  "38": { "x": 50, "y": 5 },
  "45": { "x": 50, "y": 20 },
  "46": { "x": 50, "y": 35 },
  "49": { "x": 50, "y": 70 },
  "50": { "x": 50, "y": 30 },
  "51": { "x": 50, "y": 30 },
  "53": { "x": 55, "y": 50 },
  "54": { "x": 50, "y": 15 },
  "58": { "x": 50, "y": 35 },
  "59": { "x": 70, "y": 50 },
  "60": { "x": 50, "y": 30 },
  "62": { "x": 50, "y": 50 },
  "63": { "x": 50, "y": 25 },
  "64": { "x": 50, "y": 45 }
};

export default function Gallery() {
  return (
    <section className="relative z-10 px-5 py-24 sm:px-10">
      <div className="mb-14 text-center">
        <p className="text-sun mb-3 text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-4">
          so many memories
        </p>
        <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-none font-black">
          the <span className="text-gradient italic">vault</span>
        </h2>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[150px] sm:auto-rows-[200px] gap-3 sm:gap-4 grid-flow-dense">
        {memories.map((src, i) => {
          const pattern = i % 12;
          let span = "col-span-1 row-span-1";
          if (pattern === 0) span = "col-span-2 row-span-2";
          else if (pattern === 4) span = "col-span-2 row-span-1";
          else if (pattern === 8) span = "col-span-1 row-span-2";

          const offset = PHOTO_OFFSETS[i] || { x: 50, y: 50 };

          return (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: (i % 10) * 0.1 }}
              className={`group relative overflow-hidden rounded-xl bg-white/5 p-1 shadow-lg ring-1 transition-all ring-white/10 hover:ring-white/30 ${span}`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={`Memory ${i + 1}`}
                  fill
                  style={{ objectPosition: `${offset.x}% ${offset.y}%` }}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
