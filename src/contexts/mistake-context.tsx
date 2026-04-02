"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { MistakeEntry } from "@/types/unit";

interface MistakeContextType {
  mistakes: MistakeEntry[];
  addMistake: (m: MistakeEntry) => void;
  clearMistakes: () => void;
  getMistakesForUnit: (unit: string) => MistakeEntry[];
}

const MistakeContext = createContext<MistakeContextType>({
  mistakes: [],
  addMistake: () => {},
  clearMistakes: () => {},
  getMistakesForUnit: () => [],
});

export const useMistakes = () => useContext(MistakeContext);

const STORAGE_KEY = "ap-physics-mistakes";

export function MistakeProvider({ children }: { children: React.ReactNode }) {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMistakes(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
    } catch {}
  }, [mistakes]);

  const addMistake = useCallback((m: MistakeEntry) => {
    setMistakes((prev) => [...prev, m]);
  }, []);

  const clearMistakes = useCallback(() => {
    setMistakes([]);
  }, []);

  const getMistakesForUnit = useCallback(
    (unit: string) => mistakes.filter((m) => m.unit === unit),
    [mistakes]
  );

  return (
    <MistakeContext.Provider value={{ mistakes, addMistake, clearMistakes, getMistakesForUnit }}>
      {children}
    </MistakeContext.Provider>
  );
}
