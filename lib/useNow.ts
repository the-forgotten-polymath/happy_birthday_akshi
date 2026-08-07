"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads the wall clock as an external store.
 *
 * `useSyncExternalStore` is the right tool here: the clock is genuinely an
 * external mutating source. It also gives us a distinct server snapshot
 * (`null`), so nothing time-dependent is ever server-rendered and there's no
 * hydration mismatch — and no `setState` inside an effect.
 *
 * Returns `null` on the server / first render, then a timestamp quantised to
 * `intervalMs` so the snapshot stays referentially stable between ticks.
 */
export function useNow(intervalMs = 1000): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, intervalMs);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    () => null,
  );
}
