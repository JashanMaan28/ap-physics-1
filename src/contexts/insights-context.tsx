"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { isGuestMode } from "@/lib/guest";
import type { ExamRunRecord, PredictionRecord } from "@/types/insights";

const GUEST_PREDICTIONS_KEY = "ap-physics-guest-predictions";
const GUEST_EXAM_RUNS_KEY = "ap-physics-guest-exam-runs";

function subscribeGuest(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

const getGuestSnapshot = () => isGuestMode();
const getGuestServerSnapshot = () => false;

function loadGuestState<T>(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [] as T[];
  }
}

function saveGuestState<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures for guest mode.
  }
}

interface CreatePredictionInput {
  simId: string;
  unitSlug: string;
  topicKey: string;
  promptKind: string;
  predictedNumber?: number;
  predictedChoice?: string;
  rationale: string;
  confidence: PredictionRecord["confidence"];
  createdAt: number;
}

interface ResolvePredictionInput {
  predictionId: string;
  actualNumber?: number;
  actualChoice?: string;
  outcome: PredictionRecord["outcome"];
  score: number;
  resolvedAt: number;
}

interface RecordExamRunInput {
  modeKind: ExamRunRecord["modeKind"];
  durationSec: number;
  questionCount: number;
  correctCount: number;
  accuracy: number;
  unitAccuracy: Record<string, number>;
  topicMisses: Record<string, number>;
  startedAt: number;
  completedAt: number;
}

interface InsightsContextValue {
  predictions: PredictionRecord[];
  examRuns: ExamRunRecord[];
  createPrediction: (input: CreatePredictionInput) => Promise<PredictionRecord | null>;
  resolvePrediction: (input: ResolvePredictionInput) => Promise<PredictionRecord | null>;
  recordExamRun: (input: RecordExamRunInput) => Promise<ExamRunRecord | null>;
}

const InsightsContext = createContext<InsightsContextValue>({
  predictions: [],
  examRuns: [],
  createPrediction: async () => null,
  resolvePrediction: async () => null,
  recordExamRun: async () => null,
});

function normalizePredictionRecord(record: {
  _id?: string;
  id?: string;
  simId: string;
  unitSlug: string;
  topicKey: string;
  predictedNumber?: number;
  predictedChoice?: string;
  actualNumber?: number;
  actualChoice?: string;
  rationale: string;
  confidence: string;
  outcome: string;
  score: number;
  createdAt: number;
  resolvedAt: number | null;
}) {
  return {
    id: record.id ?? record._id ?? "",
    simId: record.simId,
    unitSlug: record.unitSlug,
    topicKey: record.topicKey,
    predictedNumber: record.predictedNumber,
    predictedChoice: record.predictedChoice,
    actualNumber: record.actualNumber,
    actualChoice: record.actualChoice,
    rationale: record.rationale,
    confidence: record.confidence as PredictionRecord["confidence"],
    outcome: record.outcome as PredictionRecord["outcome"],
    score: record.score,
    createdAt: record.createdAt,
    resolvedAt: record.resolvedAt,
  } satisfies PredictionRecord;
}

function normalizeExamRun(record: {
  _id?: string;
  id?: string;
  modeKind: string;
  durationSec: number;
  questionCount: number;
  correctCount: number;
  accuracy: number;
  unitAccuracy: Record<string, number>;
  topicMisses: Record<string, number>;
  startedAt: number;
  completedAt: number;
}) {
  return {
    id: record.id ?? record._id ?? "",
    modeKind: record.modeKind as ExamRunRecord["modeKind"],
    durationSec: record.durationSec,
    questionCount: record.questionCount,
    correctCount: record.correctCount,
    accuracy: record.accuracy,
    unitAccuracy: record.unitAccuracy,
    topicMisses: record.topicMisses,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
  } satisfies ExamRunRecord;
}

function createClientId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useInsights() {
  return useContext(InsightsContext);
}

export function InsightsProvider({ children }: { children: React.ReactNode }) {
  const auth = useConvexAuth();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const guest = useSyncExternalStore(
    subscribeGuest,
    getGuestSnapshot,
    getGuestServerSnapshot
  );
  const [guestPredictions, setGuestPredictions] = useState<PredictionRecord[]>(() =>
    typeof window !== "undefined" && isGuestMode()
      ? loadGuestState<PredictionRecord>(GUEST_PREDICTIONS_KEY)
      : []
  );
  const [guestExamRuns, setGuestExamRuns] = useState<ExamRunRecord[]>(() =>
    typeof window !== "undefined" && isGuestMode()
      ? loadGuestState<ExamRunRecord>(GUEST_EXAM_RUNS_KEY)
      : []
  );

  const predictionsData = useQuery(
    api.predictions.listRecent,
    isAuthenticated ? { limit: 100 } : "skip"
  );
  const examRunsData = useQuery(
    api.examRuns.listRecent,
    isAuthenticated ? { limit: 30 } : "skip"
  );
  const createPredictionMutation = useMutation(api.predictions.create);
  const resolvePredictionMutation = useMutation(api.predictions.resolve);
  const recordExamRunMutation = useMutation(api.examRuns.record);

  const predictions = useMemo(
    () =>
      guest
        ? guestPredictions
        : (predictionsData ?? []).map(normalizePredictionRecord),
    [guest, guestPredictions, predictionsData]
  );
  const examRuns = useMemo(
    () => (guest ? guestExamRuns : (examRunsData ?? []).map(normalizeExamRun)),
    [examRunsData, guest, guestExamRuns]
  );

  const createPrediction = useCallback(
    async (input: CreatePredictionInput) => {
      if (guest) {
        const nextRecord: PredictionRecord = {
          id: createClientId("prediction"),
          simId: input.simId,
          unitSlug: input.unitSlug,
          topicKey: input.topicKey,
          predictedNumber: input.predictedNumber,
          predictedChoice: input.predictedChoice,
          actualNumber: undefined,
          actualChoice: undefined,
          rationale: input.rationale,
          confidence: input.confidence,
          outcome: "pending",
          score: 0,
          createdAt: input.createdAt,
          resolvedAt: null,
        };

        setGuestPredictions((prev) => {
          const next = [nextRecord, ...prev].slice(0, 100);
          saveGuestState(GUEST_PREDICTIONS_KEY, next);
          return next;
        });

        return nextRecord;
      }

      const created = await createPredictionMutation(input);
      return created ? normalizePredictionRecord(created) : null;
    },
    [createPredictionMutation, guest]
  );

  const resolvePrediction = useCallback(
    async (input: ResolvePredictionInput) => {
      if (guest) {
        let resolved: PredictionRecord | null = null;

        setGuestPredictions((prev) => {
          const next = prev.map((record) => {
            if (record.id !== input.predictionId) {
              return record;
            }

            resolved = {
              ...record,
              actualNumber: input.actualNumber,
              actualChoice: input.actualChoice,
              outcome: input.outcome,
              score: input.score,
              resolvedAt: input.resolvedAt,
            };

            return resolved;
          });

          saveGuestState(GUEST_PREDICTIONS_KEY, next);
          return next;
        });

        return resolved;
      }

      const resolved = await resolvePredictionMutation({
        predictionId: input.predictionId as Id<"simulationPredictions">,
        actualNumber: input.actualNumber,
        actualChoice: input.actualChoice,
        outcome: input.outcome,
        score: input.score,
        resolvedAt: input.resolvedAt,
      });

      return resolved ? normalizePredictionRecord(resolved) : null;
    },
    [guest, resolvePredictionMutation]
  );

  const recordExamRun = useCallback(
    async (input: RecordExamRunInput) => {
      if (guest) {
        const nextRecord: ExamRunRecord = {
          id: createClientId("exam-run"),
          ...input,
        };

        setGuestExamRuns((prev) => {
          const next = [nextRecord, ...prev]
            .sort((a, b) => b.completedAt - a.completedAt)
            .slice(0, 30);
          saveGuestState(GUEST_EXAM_RUNS_KEY, next);
          return next;
        });

        return nextRecord;
      }

      const created = await recordExamRunMutation(input);
      return created ? normalizeExamRun(created) : null;
    },
    [guest, recordExamRunMutation]
  );

  const value = useMemo(
    () => ({
      predictions,
      examRuns,
      createPrediction,
      resolvePrediction,
      recordExamRun,
    }),
    [createPrediction, examRuns, predictions, recordExamRun, resolvePrediction]
  );

  return (
    <InsightsContext.Provider value={value}>{children}</InsightsContext.Provider>
  );
}
