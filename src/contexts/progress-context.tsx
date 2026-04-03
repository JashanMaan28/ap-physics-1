"use client";

import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const progressData = useQuery(api.progress.getAll);
  const toggleMutation = useMutation(api.progress.toggleComplete);

  const dataMap: Record<string, string[]> = {};
  if (progressData) {
    for (const row of progressData) {
      dataMap[row.unitSlug] = row.completedTopics;
    }
  }

  const getCompleted = useCallback(
    (unitSlug: string) => new Set(dataMap[unitSlug] ?? []),
    [progressData]
  );

  const toggleComplete = useCallback(
    (unitSlug: string, topicId: string) => {
      toggleMutation({ unitSlug, topicId });
    },
    [toggleMutation]
  );

  const getProgress = useCallback(
    (unitSlug: string, totalTopics: number) => {
      if (totalTopics === 0) return 0;
      return ((dataMap[unitSlug]?.length ?? 0) / totalTopics) * 100;
    },
    [progressData]
  );

  const getOverallProgress = useCallback(
    (unitTotals: Record<string, number>) => {
      let completed = 0;
      let total = 0;
      for (const [slug, count] of Object.entries(unitTotals)) {
        total += count;
        completed += dataMap[slug]?.length ?? 0;
      }
      return total === 0 ? 0 : (completed / total) * 100;
    },
    [progressData]
  );

  return (
    <ProgressContext.Provider
      value={{ getCompleted, toggleComplete, getProgress, getOverallProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
