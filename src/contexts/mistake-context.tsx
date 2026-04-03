"use client";

import { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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

export function MistakeProvider({ children }: { children: React.ReactNode }) {
  const mistakesData = useQuery(api.mistakes.getAll);
  const addMutation = useMutation(api.mistakes.add);
  const clearMutation = useMutation(api.mistakes.clear);

  const mistakes: MistakeEntry[] = (mistakesData ?? []).map((m) => ({
    unit: m.unit,
    topic: m.topic,
    question: m.question,
    yourAnswer: m.yourAnswer,
    correctAnswer: m.correctAnswer,
    timestamp: m.timestamp,
  }));

  const addMistake = useCallback(
    (m: MistakeEntry) => {
      addMutation({
        unit: m.unit,
        topic: m.topic,
        question: m.question,
        yourAnswer: m.yourAnswer,
        correctAnswer: m.correctAnswer,
        timestamp: m.timestamp,
      });
    },
    [addMutation]
  );

  const clearMistakes = useCallback(() => {
    clearMutation();
  }, [clearMutation]);

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
