"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { unitConfigs, units } from "@/units/registry";
import { useProgress } from "@/contexts/progress-context";
import { useMistakes } from "@/contexts/mistake-context";
import { useInsights } from "@/contexts/insights-context";
import { useToast } from "@/components/effects/toast";
import {
  createShareCardText,
  getTodayKey,
  gradeBossBattle,
} from "@/lib/arcade-data";

type NotebookEntryKind = "note" | "prediction";

export interface NotebookEntry {
  id: string;
  kind: NotebookEntryKind;
  title: string;
  body: string;
  unitSlug?: string;
  createdAt: number;
  confidence?: "low" | "medium" | "high";
}

interface DailyChallengeRecord {
  dateKey: string;
  score: number;
  total: number;
  completedAt: number;
}

interface BossBattleRecord {
  unitSlug: string;
  score: number;
  total: number;
  rank: "S" | "A" | "B" | "C";
  completedAt: number;
}

interface FormulaRoundRecord {
  id: string;
  score: number;
  total: number;
  bestStreak: number;
  completedAt: number;
}

interface ArcadeState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  notebook: NotebookEntry[];
  dailyChallenges: DailyChallengeRecord[];
  bossBattles: BossBattleRecord[];
  formulaRounds: FormulaRoundRecord[];
  rematchWins: number;
  shareCopies: number;
  draftsGenerated: number;
  unlockedAchievementIds: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface ArcadeContextType {
  xp: number;
  level: number;
  streak: number;
  nextLevelXp: number;
  overallProgress: number;
  progressByUnit: Record<string, number>;
  mistakesByUnit: Record<string, number>;
  notebook: NotebookEntry[];
  achievements: Achievement[];
  dailyChallenges: DailyChallengeRecord[];
  bossBattles: BossBattleRecord[];
  formulaRounds: FormulaRoundRecord[];
  rematchWins: number;
  draftsGenerated: number;
  shareCopies: number;
  addNotebookNote: (input: { title: string; body: string; unitSlug?: string }) => void;
  savePrediction: (input: {
    title: string;
    body: string;
    unitSlug?: string;
    confidence: "low" | "medium" | "high";
  }) => void;
  completeDailyChallenge: (input: { dateKey: string; score: number; total: number }) => void;
  completeBossBattle: (input: { unitSlug: string; score: number; total: number }) => void;
  completeFormulaRound: (input: { id: string; score: number; total: number; bestStreak: number }) => void;
  completeRematch: (topic: string) => void;
  recordDraftGenerated: () => void;
  copyShareCard: () => Promise<string>;
}

const STORAGE_KEY = "ap-physics-study-arcade";

const defaultState: ArcadeState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  notebook: [],
  dailyChallenges: [],
  bossBattles: [],
  formulaRounds: [],
  rematchWins: 0,
  shareCopies: 0,
  draftsGenerated: 0,
  unlockedAchievementIds: [],
};

const ArcadeContext = createContext<ArcadeContextType>({
  xp: 0,
  level: 1,
  streak: 0,
  nextLevelXp: 120,
  overallProgress: 0,
  progressByUnit: {},
  mistakesByUnit: {},
  notebook: [],
  achievements: [],
  dailyChallenges: [],
  bossBattles: [],
  formulaRounds: [],
  rematchWins: 0,
  draftsGenerated: 0,
  shareCopies: 0,
  addNotebookNote: () => {},
  savePrediction: () => {},
  completeDailyChallenge: () => {},
  completeBossBattle: () => {},
  completeFormulaRound: () => {},
  completeRematch: () => {},
  recordDraftGenerated: () => {},
  copyShareCard: async () => "",
});

function loadState(): ArcadeState {
  let loaded = defaultState;

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        loaded = {
          ...defaultState,
          ...(JSON.parse(raw) as Partial<ArcadeState>),
        };
      }
    } catch {
      loaded = defaultState;
    }
  }

  const today = getTodayKey();
  if (loaded.lastActiveDate === today) {
    return loaded;
  }

  const isConsecutive =
    loaded.lastActiveDate !== null && dayDiff(loaded.lastActiveDate, today) === 1;

  return {
    ...loaded,
    xp: loaded.xp + 15,
    streak: isConsecutive ? loaded.streak + 1 : 1,
    lastActiveDate: today,
  };
}

function dayDiff(a: string, b: string) {
  const first = new Date(`${a}T00:00:00`);
  const second = new Date(`${b}T00:00:00`);
  return Math.round((second.getTime() - first.getTime()) / 86_400_000);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getRewardDateKey(timestamp: number | null | undefined) {
  if (!timestamp) {
    return getTodayKey();
  }

  return new Date(timestamp).toISOString().slice(0, 10);
}

function getPredictionRewardXp(
  predictions: Array<{
    outcome: "pending" | "hit" | "close" | "miss";
    resolvedAt: number | null;
  }>
) {
  const rewardedCountsByDay: Record<string, number> = {};
  let xp = 0;

  const resolvedPredictions = predictions
    .filter((entry) => entry.resolvedAt !== null)
    .sort((a, b) => (a.resolvedAt ?? 0) - (b.resolvedAt ?? 0));

  for (const prediction of resolvedPredictions) {
    const rewardDay = getRewardDateKey(prediction.resolvedAt);
    const rewardedToday = rewardedCountsByDay[rewardDay] ?? 0;

    if (rewardedToday < 3) {
      xp += 12;
      rewardedCountsByDay[rewardDay] = rewardedToday + 1;
    }

    if (prediction.outcome === "hit" || prediction.outcome === "close") {
      xp += 6;
    }
  }

  return xp;
}

function getExamRunRewardXp(
  examRuns: Array<{
    modeKind: string;
    correctCount: number;
    completedAt: number;
  }>
) {
  const rewardedCountsByDay: Record<string, number> = {};
  let xp = 0;

  const sortedRuns = [...examRuns].sort((a, b) => a.completedAt - b.completedAt);

  for (const run of sortedRuns) {
    const rewardDay = getRewardDateKey(run.completedAt);
    const rewardedToday = rewardedCountsByDay[rewardDay] ?? 0;

    if (rewardedToday < 2) {
      xp += 25;
      rewardedCountsByDay[rewardDay] = rewardedToday + 1;
    }

    if (run.modeKind !== "frq-focus-block") {
      xp += run.correctCount * 2;
    }
  }

  return xp;
}

export function useArcade() {
  return useContext(ArcadeContext);
}

export function ArcadeProvider({ children }: { children: React.ReactNode }) {
  const { getCompleted, getOverallProgress, getProgress } = useProgress();
  const { mistakes } = useMistakes();
  const { predictions, examRuns } = useInsights();
  const { toast } = useToast();
  const [state, setState] = useState<ArcadeState>(() => loadState());

  const progressByUnit = useMemo(() => {
    const progressMap: Record<string, number> = {};

    for (const unit of units) {
      const config = unitConfigs[unit.slug];
      const totalTopics = config?.learnTopicIds.length ?? 0;
      progressMap[unit.slug] = getProgress(unit.slug, totalTopics);
    }

    return progressMap;
  }, [getProgress]);

  const overallProgress = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const unit of units) {
      totals[unit.slug] = unitConfigs[unit.slug]?.learnTopicIds.length ?? 0;
    }

    return getOverallProgress(totals);
  }, [getOverallProgress]);

  const completedTopicIds = useMemo(() => {
    const ids: string[] = [];

    for (const unit of units) {
      for (const topicId of getCompleted(unit.slug)) {
        ids.push(`${unit.slug}:${topicId}`);
      }
    }

    ids.sort();
    return ids;
  }, [getCompleted]);

  const mistakesByUnit = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const mistake of mistakes) {
      counts[mistake.unit] = (counts[mistake.unit] ?? 0) + 1;
    }

    return counts;
  }, [mistakes]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  const topicXp = completedTopicIds.length * 35;
  const predictionXp = useMemo(() => getPredictionRewardXp(predictions), [predictions]);
  const examRunXp = useMemo(() => getExamRunRewardXp(examRuns), [examRuns]);
  const totalXp = state.xp + topicXp + predictionXp + examRunXp;
  const level = Math.floor(totalXp / 120) + 1;
  const nextLevelXp = level * 120;

  const achievements: Achievement[] = useMemo(() => {
    const dailyPerfect = state.dailyChallenges.some((run) => run.score === run.total);
    const bossBest = state.bossBattles.find((battle) => battle.rank === "S" || battle.rank === "A");
    const formulaBestStreak = Math.max(
      0,
      ...state.formulaRounds.map((round) => round.bestStreak)
    );
    const noteCount = state.notebook.filter((entry) => entry.kind === "note").length;
    const resolvedPredictions = predictions.filter(
      (entry) => entry.resolvedAt !== null
    );
    const predictionCount = resolvedPredictions.length;
    const examRunCount = examRuns.length;
    const bestPrediction = resolvedPredictions.some((entry) => entry.outcome === "hit");
    const strongExamRuns = examRuns.filter((entry) => entry.accuracy >= 80).length;

    return [
      {
        id: "first-vector",
        title: "First Vector",
        description: "Complete your first topic.",
        unlocked: completedTopicIds.length >= 1,
      },
      {
        id: "daily-solver",
        title: "Daily Solver",
        description: "Finish any daily challenge.",
        unlocked: state.dailyChallenges.length >= 1,
      },
      {
        id: "perfect-challenge",
        title: "Perfect Challenge",
        description: "Ace a daily challenge.",
        unlocked: dailyPerfect,
      },
      {
        id: "boss-breaker",
        title: "Boss Breaker",
        description: "Earn an A or S in any boss battle.",
        unlocked: Boolean(bossBest),
      },
      {
        id: "formula-sprinter",
        title: "Formula Sprinter",
        description: "Reach a formula round streak of 5.",
        unlocked: formulaBestStreak >= 5,
      },
      {
        id: "prediction-engine",
        title: "Prediction Engine",
        description: "Log 3 simulation predictions.",
        unlocked: predictionCount >= 3,
      },
      {
        id: "call-the-shot",
        title: "Call the Shot",
        description: "Resolve your first prediction-versus-reality attempt.",
        unlocked: predictionCount >= 1,
      },
      {
        id: "dead-on",
        title: "Dead On",
        description: "Land a hit on a simulation prediction.",
        unlocked: bestPrediction,
      },
      {
        id: "lab-forecaster",
        title: "Lab Forecaster",
        description: "Resolve 5 simulation predictions.",
        unlocked: predictionCount >= 5,
      },
      {
        id: "lab-rat",
        title: "Lab Rat",
        description: "Write 5 notebook entries.",
        unlocked: noteCount >= 5,
      },
      {
        id: "mistake-avenger",
        title: "Mistake Avenger",
        description: "Clear 3 revenge rematches.",
        unlocked: state.rematchWins >= 3,
      },
      {
        id: "draft-architect",
        title: "Draft Architect",
        description: "Generate your first exam mode draft.",
        unlocked: state.draftsGenerated >= 1,
      },
      {
        id: "exam-runner",
        title: "Exam Runner",
        description: "Finish your first exam mode block.",
        unlocked: examRunCount >= 1,
      },
      {
        id: "pressure-proof",
        title: "Pressure Proof",
        description: "Post three strong exam mode runs.",
        unlocked: strongExamRuns >= 3,
      },
      {
        id: "share-collector",
        title: "Share Collector",
        description: "Copy a result card.",
        unlocked: state.shareCopies >= 1,
      },
      {
        id: "newtons-favorite",
        title: "Newton's Favorite",
        description: "Reach 100% overall progress.",
        unlocked: overallProgress === 100,
      },
    ];
  }, [
    completedTopicIds.length,
    overallProgress,
    state.bossBattles,
    state.dailyChallenges,
    state.draftsGenerated,
    state.formulaRounds,
    state.notebook,
    state.rematchWins,
    state.shareCopies,
    predictions,
    examRuns,
  ]);

  useEffect(() => {
    const freshUnlocks = achievements.filter(
      (achievement) =>
        achievement.unlocked &&
        !state.unlockedAchievementIds.includes(achievement.id)
    );

    if (freshUnlocks.length === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setState((prev) => ({
        ...prev,
        unlockedAchievementIds: [
          ...prev.unlockedAchievementIds,
          ...freshUnlocks.map((achievement) => achievement.id),
        ],
      }));
    });

    for (const achievement of freshUnlocks) {
      toast(`Achievement unlocked: ${achievement.title}`, "🏆", 3500);
    }

    return () => window.cancelAnimationFrame(frame);
  }, [achievements, state.unlockedAchievementIds, toast]);

  const addNotebookNote = (input: {
    title: string;
    body: string;
    unitSlug?: string;
  }) => {
    const entry: NotebookEntry = {
      id: createId("note"),
      kind: "note",
      title: input.title,
      body: input.body,
      unitSlug: input.unitSlug,
      createdAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      xp: prev.xp + 12,
      notebook: [entry, ...prev.notebook].slice(0, 60),
    }));
  };

  const savePrediction = (input: {
    title: string;
    body: string;
    unitSlug?: string;
    confidence: "low" | "medium" | "high";
  }) => {
    const entry: NotebookEntry = {
      id: createId("prediction"),
      kind: "prediction",
      title: input.title,
      body: input.body,
      unitSlug: input.unitSlug,
      confidence: input.confidence,
      createdAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      notebook: [entry, ...prev.notebook].slice(0, 60),
    }));
  };

  const completeDailyChallenge = (input: {
    dateKey: string;
    score: number;
    total: number;
  }) => {
    setState((prev) => {
      const existing = prev.dailyChallenges.find(
        (record) => record.dateKey === input.dateKey
      );

      if (existing && existing.score >= input.score) {
        return prev;
      }

      const xpGain = existing
        ? (input.score - existing.score) * 8
        : 20 + input.score * 8;

      return {
        ...prev,
        xp: prev.xp + Math.max(0, xpGain),
        dailyChallenges: [
          { ...input, completedAt: Date.now() },
          ...prev.dailyChallenges.filter((record) => record.dateKey !== input.dateKey),
        ].slice(0, 20),
      };
    });
  };

  const completeBossBattle = (input: {
    unitSlug: string;
    score: number;
    total: number;
  }) => {
    setState((prev) => {
      const rank = gradeBossBattle(input.score, input.total);
      const existing = prev.bossBattles.find(
        (record) => record.unitSlug === input.unitSlug
      );

      if (existing && existing.score >= input.score) {
        return prev;
      }

      const xpGain = existing
        ? (input.score - existing.score) * 14
        : 30 + input.score * 14;

      return {
        ...prev,
        xp: prev.xp + Math.max(0, xpGain),
        bossBattles: [
          {
            unitSlug: input.unitSlug,
            score: input.score,
            total: input.total,
            rank,
            completedAt: Date.now(),
          },
          ...prev.bossBattles.filter((record) => record.unitSlug !== input.unitSlug),
        ].slice(0, 20),
      };
    });
  };

  const completeFormulaRound = (input: {
    id: string;
    score: number;
    total: number;
    bestStreak: number;
  }) => {
    setState((prev) => {
      const existing = prev.formulaRounds.find((round) => round.id === input.id);

      if (
        existing &&
        existing.score >= input.score &&
        existing.bestStreak >= input.bestStreak
      ) {
        return prev;
      }

      const priorScore = existing?.score ?? 0;
      const priorStreak = existing?.bestStreak ?? 0;
      const xpGain =
        18 +
        Math.max(0, input.score - priorScore) * 10 +
        Math.max(0, input.bestStreak - priorStreak) * 4;

      return {
        ...prev,
        xp: prev.xp + xpGain,
        formulaRounds: [
          {
            ...input,
            completedAt: Date.now(),
          },
          ...prev.formulaRounds.filter((round) => round.id !== input.id),
        ].slice(0, 20),
      };
    });
  };

  const completeRematch = () => {
    setState((prev) => ({
      ...prev,
      xp: prev.xp + 16,
      rematchWins: prev.rematchWins + 1,
    }));
  };

  const recordDraftGenerated = () => {
    setState((prev) => ({
      ...prev,
      xp: prev.xp + (prev.draftsGenerated === 0 ? 20 : 6),
      draftsGenerated: prev.draftsGenerated + 1,
    }));
  };

  const copyShareCard = async () => {
    const dailyBest = state.dailyChallenges[0]
      ? `${state.dailyChallenges[0].score}/${state.dailyChallenges[0].total}`
      : undefined;
    const bossBest = state.bossBattles[0]
      ? `${state.bossBattles[0].unitSlug} (${state.bossBattles[0].rank})`
      : undefined;

    const text = createShareCardText({
      level,
      xp: totalXp,
      streak: state.streak,
      progress: overallProgress,
      dailyBest,
      bossBest,
    });

    try {
      await navigator.clipboard.writeText(text);
      toast("Result card copied to clipboard", "📋", 2500);
    } catch {
      toast("Clipboard unavailable, but the card was generated", "🧾", 2500);
    }

    setState((prev) => ({
      ...prev,
      xp: prev.xp + (prev.shareCopies === 0 ? 18 : 4),
      shareCopies: prev.shareCopies + 1,
    }));

    return text;
  };

  const value = {
    xp: totalXp,
    level,
    streak: state.streak,
    nextLevelXp,
    overallProgress,
    progressByUnit,
    mistakesByUnit,
    notebook: state.notebook,
    achievements,
    dailyChallenges: state.dailyChallenges,
    bossBattles: state.bossBattles,
    formulaRounds: state.formulaRounds,
    rematchWins: state.rematchWins,
    draftsGenerated: state.draftsGenerated,
    shareCopies: state.shareCopies,
    addNotebookNote,
    savePrediction,
    completeDailyChallenge,
    completeBossBattle,
    completeFormulaRound,
    completeRematch,
    recordDraftGenerated,
    copyShareCard,
  } satisfies ArcadeContextType;

  return (
    <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>
  );
}
