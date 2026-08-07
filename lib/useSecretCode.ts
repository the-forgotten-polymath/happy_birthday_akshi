import { useEffect, useRef } from "react";
import { config } from "@/lib/config";

export function useSecretCode(onTrigger: () => void) {
  const bufferRef = useRef("");

  useEffect(() => {
    if (!config.secretCode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ignore modifier keys
      if (e.key.length > 1) return;

      const char = e.key.toLowerCase();
      bufferRef.current = (bufferRef.current + char).slice(-config.secretCode.length);
      
      if (bufferRef.current === config.secretCode.toLowerCase()) {
        onTrigger();
        bufferRef.current = ""; // Reset after trigger
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTrigger]);
}
