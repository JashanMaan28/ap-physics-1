"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/components/effects/toast";
import { setEgg, getEggState } from "@/lib/easter-eggs";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [gravityFlip, setGravityFlip] = useState(false);
  const [chalkboard, setChalkboard] = useState(() => {
    if (typeof window === "undefined") return false;
    return getEggState().chalkboardUnlocked ?? false;
  });

  // Restore dark-matter on mount
  useEffect(() => {
    if (getEggState().darkMatterUnlocked) {
      document.documentElement.classList.add("dark-matter");
    }
  }, []);

  // Apply chalkboard class
  useEffect(() => {
    document.documentElement.classList.toggle("chalkboard", chalkboard);
  }, [chalkboard]);

  // ── Konami code detector ──
  const konamiBuffer = useRef<string[]>([]);

  // ── "9.8" typed digit detector ──
  const digitBuffer = useRef<string[]>([]);

  // ── Title rapid-click ──
  const titleClicks = useRef<number[]>([]);

  // ── Dark matter: 3x theme toggle in 2s ──
  const themeToggles = useRef<number[]>([]);
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (theme !== prevTheme.current) {
      prevTheme.current = theme;
      const now = Date.now();
      themeToggles.current.push(now);
      themeToggles.current = themeToggles.current.filter((t) => now - t < 2000);
      if (themeToggles.current.length >= 3) {
        themeToggles.current = [];
        const state = getEggState();
        if (!state.darkMatterUnlocked) {
          setEgg("darkMatterUnlocked", true);
          document.documentElement.classList.add("dark-matter");
          toast("Dark Matter theme unlocked!", "🌌", 4000);
        } else {
          // Toggle it off
          setEgg("darkMatterUnlocked", false);
          document.documentElement.classList.remove("dark-matter");
          toast("Dark Matter theme disabled", "💡", 3000);
        }
      }
    }
  }, [theme, toast]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Konami code
      konamiBuffer.current.push(e.key);
      if (konamiBuffer.current.length > KONAMI.length) konamiBuffer.current.shift();
      if (konamiBuffer.current.length === KONAMI.length && konamiBuffer.current.every((k, i) => k === KONAMI[i])) {
        konamiBuffer.current = [];
        setGravityFlip(true);
        setEgg("konamiUnlocked", true);
        toast("Gravity reversed! F = -mg", "🔄", 4000);
        setTimeout(() => setGravityFlip(false), 3000);
      }

      // "9.8" typed
      if (/^\d$/.test(e.key) || e.key === ".") {
        digitBuffer.current.push(e.key);
        if (digitBuffer.current.length > 3) digitBuffer.current.shift();
        if (digitBuffer.current.join("") === "9.8") {
          digitBuffer.current = [];
          // Trigger falling animation
          document.documentElement.classList.add("gravity-drop");
          toast("g = 9.8 m/s² — Everything falls!", "🍎", 3000);
          setTimeout(() => document.documentElement.classList.remove("gravity-drop"), 2000);
        }
      } else if (e.key.length === 1) {
        digitBuffer.current = [];
      }
    },
    [toast]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Title click handler (exposed via data attribute) ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-title-egg]")) return;
      const now = Date.now();
      titleClicks.current.push(now);
      titleClicks.current = titleClicks.current.filter((t) => now - t < 2000);
      if (titleClicks.current.length >= 5) {
        titleClicks.current = [];
        const next = !chalkboard;
        setChalkboard(next);
        setEgg("chalkboardUnlocked", next);
        toast(
          next ? "Chalkboard mode activated!" : "Chalkboard mode deactivated",
          next ? "🖊️" : "✨",
          3000
        );
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [chalkboard, toast]);

  return (
    <div className={gravityFlip ? "gravity-flip" : ""}>
      {children}
    </div>
  );
}
