"use client";

import { createContext, useContext, useCallback } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useGuestMode, useGuestStorage } from "@/lib/synced-state";
import type { MistakeEntry } from "@/types/unit";

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

export function MistakeProvider({ children }: { children: React.ReactNode }) {
  const auth = useConvexAuth();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const guest = useGuestMode();
  const [guestMistakes, setGuestMistakes] = useGuestStorage<MistakeEntry[]>(
    GUEST_MISTAKES_KEY,
    [],
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
        setGuestMistakes((prev) => [...prev, m]);
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
    [guest, setGuestMistakes, addMutation],
  );

  const clearMistakes = useCallback(() => {
    if (guest) {
      setGuestMistakes([]);
    } else {
      clearMutation();
    }
  }, [guest, setGuestMistakes, clearMutation]);

  const getMistakesForUnit = useCallback(
    (unit: string) => mistakes.filter((m) => m.unit === unit),
    [mistakes],
  );

  return (
    <MistakeContext.Provider
      value={{ mistakes, addMistake, clearMistakes, getMistakesForUnit }}
    >
      {children}
    </MistakeContext.Provider>
  );
}
