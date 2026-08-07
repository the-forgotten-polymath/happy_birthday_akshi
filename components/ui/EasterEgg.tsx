"use client";

import { useSecretCode } from "@/lib/useSecretCode";
import { cannons, rain } from "@/lib/celebrate";
import { useCallback } from "react";

export default function EasterEgg() {
  const triggerExplosion = useCallback(() => {
    cannons();
    // Start continuous rain
    const stopRain = rain(3000);
    // Stop it after 15 seconds
    setTimeout(stopRain, 15000);
  }, []);

  useSecretCode(triggerExplosion);

  return null;
}
