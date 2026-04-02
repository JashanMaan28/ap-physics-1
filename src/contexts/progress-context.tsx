"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

interface ProgressContextType {
  /** Get completed topic ids for a unit */
  getCompleted: (unitSlug: string) => Set<string>;
  /** Toggle a topic's completion state */
  toggleComplete: (unitSlug: string, topicId: string) => void;
  /** Get progress percentage for a unit (0-100) */
  getProgress: (unitSlug: string, totalTopics: number) => number;
  /** Get overall progress across all units */
  getOverallProgress: (unitTotals: Record<string, number>) => number;
}

const ProgressContext = createContext<ProgressContextType>({
  getCompleted: () => new Set(),
  toggleComplete: () => {},
  getProgress: () => 0,
  getOverallProgress: () => 0,
});

export const useProgress = () => useContext(ProgressContext);

const STORAGE_KEY = "ap-physics-progress";

type ProgressData = Record<string, string[]>;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressData>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setData(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const getCompleted = useCallback(
    (unitSlug: string) => new Set(data[unitSlug] ?? []),
    [data]
  );

  const toggleComplete = useCallback((unitSlug: string, topicId: string) => {
    setData((prev) => {
      const current = new Set(prev[unitSlug] ?? []);
      if (current.has(topicId)) current.delete(topicId);
      else current.add(topicId);
      return { ...prev, [unitSlug]: Array.from(current) };
    });
  }, []);

  const getProgress = useCallback(
    (unitSlug: string, totalTopics: number) => {
      if (totalTopics === 0) return 0;
      return ((data[unitSlug]?.length ?? 0) / totalTopics) * 100;
    },
    [data]
  );

  const getOverallProgress = useCallback(
    (unitTotals: Record<string, number>) => {
      let completed = 0;
      let total = 0;
      for (const [slug, count] of Object.entries(unitTotals)) {
        total += count;
        completed += data[slug]?.length ?? 0;
      }
      return total === 0 ? 0 : (completed / total) * 100;
    },
    [data]
  );

  return (
    <ProgressContext.Provider value={{ getCompleted, toggleComplete, getProgress, getOverallProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}
