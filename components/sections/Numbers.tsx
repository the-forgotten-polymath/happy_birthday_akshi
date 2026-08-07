"use client";

import { motion, AnimatePresence } from "motion/react";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { config } from "@/lib/config";
import { useNow } from "@/lib/useNow";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  celebrating: boolean;
};

/** Time left until the next occurrence of the birthday, relative to `now`. */
function remainingUntil(iso: string, now: number): Remaining {
  const [, month, day] = iso.split("-").map(Number);
  const d = new Date(now);
  const isToday = d.getMonth() === month - 1 && d.getDate() === day;

  let target = new Date(d.getFullYear(), month - 1, day).getTime();
  if (target < now && !isToday) {
    target = new Date(d.getFullYear() + 1, month - 1, day).getTime();
  }

  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    celebrating: isToday || diff === 0,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="glass relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-2xl sm:h-28 sm:w-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-display absolute text-3xl font-black tabular-nums sm:text-5xl"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] tracking-[0.2em] text-white/40 uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Numbers() {
  const now = useNow(1000);
  const time = now === null ? null : remainingUntil(config.birthday, now);

  const daysOfFriendship =
    now === null
      ? 0
      : Math.max(
          0,
          Math.floor((now - new Date(config.friendsSince).getTime()) / 86_400_000),
        );

  return (
    <section className="relative z-10 px-5 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <Reveal direction="blur" className="text-center">
          <h2 className="font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-tight font-black">
            {time?.celebrating ? (
              <span className="text-gradient">chapter 22 starts now</span>
            ) : (
              <>
                chapter <span className="text-gradient">22</span> starts in
              </>
            )}
          </h2>
        </Reveal>

        {/* live countdown — reserves its height so nothing jumps on hydration */}
        <div className="mt-12 flex min-h-[104px] items-center justify-center gap-3 sm:min-h-[136px] sm:gap-5">
          {time &&
            (time.celebrating ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass glow-punch rounded-3xl px-8 py-8 text-center"
              >
                <span className="block text-5xl sm:text-7xl">🎂</span>
                <span className="font-hand mt-3 block text-2xl text-white/80">
                  today is the day
                </span>
              </motion.div>
            ) : (
              <>
                <Unit value={time.days} label="days" />
                <Unit value={time.hours} label="hours" />
                <Unit value={time.minutes} label="mins" />
                <Unit value={time.seconds} label="secs" />
              </>
            ))}
        </div>

        {/* counters */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { to: config.age, label: "years of being you", suffix: "" },
            { to: daysOfFriendship, label: "days since we met", suffix: "" },
            { to: 22, label: "chapters written so far", suffix: "" },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.12} direction="up">
              <div className="glass hover:border-punch/40 rounded-3xl p-7 text-center transition-colors duration-500">
                <div className="font-display text-gradient text-4xl font-black sm:text-5xl">
                  <CountUp to={stat.to} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
