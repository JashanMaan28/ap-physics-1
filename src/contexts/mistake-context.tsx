"use client";

import { createContext, useContext, useCallback, useState, useSyncExternalStore } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { isGuestMode } from "@/lib/guest";
import type { MistakeEntry } from "@/types/unit";

function subscribeGuest(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
const getGuestSnapshot = () => isGuestMode();
const getGuestServer = () => false;

const GUEST_MISTAKES_KEY = "ap-physics-guest-mistakes";

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

function loadGuestMistakes(): MistakeEntry[] {
  try {
    const raw = localStorage.getItem(GUEST_MISTAKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestMistakes(data: MistakeEntry[]) {
  try {
    localStorage.setItem(GUEST_MISTAKES_KEY, JSON.stringify(data));
  } catch { /* storage full — silently ignore */ }
}

export function MistakeProvider({ children }: { children: React.ReactNode }) {
  const auth = useConvexAuth();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const guest = useSyncExternalStore(subscribeGuest, getGuestSnapshot, getGuestServer);
  const [guestMistakes, setGuestMistakes] = useState<MistakeEntry[]>(() =>
    typeof window !== "undefined" && isGuestMode() ? loadGuestMistakes() : []
  );

  const mistakesData = useQuery(api.mistakes.getAll, isAuthenticated ? {} : "skip");
  const addMutation = useMutation(api.mistakes.add);
  const clearMutation = useMutation(api.mistakes.clear);

  const mistakes: MistakeEntry[] = guest
    ? guestMistakes
    : (mistakesData ?? []).map((m) => ({
        unit: m.unit,
        topic: m.topic,
        question: m.question,
        yourAnswer: m.yourAnswer,
        correctAnswer: m.correctAnswer,
        timestamp: m.timestamp,
      }));

  const addMistake = useCallback(
    (m: MistakeEntry) => {
      if (guest) {
        setGuestMistakes((prev) => {
          const next = [...prev, m];
          saveGuestMistakes(next);
          return next;
        });
      } else {
        addMutation({
          unit: m.unit,
          topic: m.topic,
          question: m.question,
          yourAnswer: m.yourAnswer,
          correctAnswer: m.correctAnswer,
          timestamp: m.timestamp,
        });
      }
    },
    [guest, addMutation]
  );

  const clearMistakes = useCallback(() => {
    if (guest) {
      setGuestMistakes([]);
      saveGuestMistakes([]);
    } else {
      clearMutation();
    }
  }, [guest, clearMutation]);

  const getMistakesForUnit = useCallback(
    (unit: string) => mistakes.filter((m) => m.unit === unit),
    [mistakes]
  );

  return (
    <MistakeContext.Provider
      value={{ mistakes, addMistake, clearMistakes, getMistakesForUnit }}
    >
      {children}
    </MistakeContext.Provider>
  );
}
