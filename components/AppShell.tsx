"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import Intro from "@/components/sections/Intro";

/**
 * Controls the cinematic intro → page reveal flow.
 * While the intro is playing, the page content is hidden with overflow hidden
 * to prevent background scrolling. Once the intro completes, the page fades in.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      {!ready && <Intro onComplete={handleComplete} />}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Keep children in DOM for static generation, just hidden */}
      {!ready && <div className="invisible fixed">{children}</div>}
    </>
  );
}
