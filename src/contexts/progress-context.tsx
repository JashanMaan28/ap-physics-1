"use client";

import { createContext, useContext, useCallback, useState, useSyncExternalStore } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isGuestMode } from "@/lib/guest";

function subscribeGuest(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const getGuestSnapshot = () => isGuestMode();
const getGuestServer = () => false;

const GUEST_PROGRESS_KEY = "ap-physics-guest-progress";

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

function loadGuestProgress(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(GUEST_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGuestProgress(data: Record<string, string[]>) {
  try {
    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(data));
  } catch { /* storage full — silently ignore */ }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const auth = useConvexAuth();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const guest = useSyncExternalStore(subscribeGuest, getGuestSnapshot, getGuestServer);
  const [guestData, setGuestData] = useState<Record<string, string[]>>(() =>
    typeof window !== "undefined" && isGuestMode() ? loadGuestProgress() : {}
  );

  // Convex queries/mutations (skipped for guests)
  const progressData = useQuery(api.progress.getAll, isAuthenticated ? {} : "skip");
  const toggleMutation = useMutation(api.progress.toggleComplete);

  // Build data map from either source
  const dataMap: Record<string, string[]> = {};
  if (guest) {
    Object.assign(dataMap, guestData);
  } else if (progressData) {
    for (const row of progressData) {
      dataMap[row.unitSlug] = row.completedTopics;
    }
  }

  const getCompleted = useCallback(
    (unitSlug: string) => new Set(dataMap[unitSlug] ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guest ? guestData : progressData]
  );

  const toggleComplete = useCallback(
    (unitSlug: string, topicId: string) => {
      if (guest) {
        setGuestData((prev) => {
          const topics = prev[unitSlug] ?? [];
          const next = topics.includes(topicId)
            ? topics.filter((t) => t !== topicId)
            : [...topics, topicId];
          const updated = { ...prev, [unitSlug]: next };
          saveGuestProgress(updated);
          return updated;
        });
      } else {
        toggleMutation({ unitSlug, topicId });
      }
    },
    [guest, toggleMutation]
  );

  const getProgress = useCallback(
    (unitSlug: string, totalTopics: number) => {
      if (totalTopics === 0) return 0;
      return ((dataMap[unitSlug]?.length ?? 0) / totalTopics) * 100;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guest ? guestData : progressData]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guest ? guestData : progressData]
  );

  return (
    <ProgressContext.Provider
      value={{ getCompleted, toggleComplete, getProgress, getOverallProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
