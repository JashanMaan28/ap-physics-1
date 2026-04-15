export type PredictionSourceType = "native" | "phet";
export type PredictionPromptKind = "number" | "choice";
export type PredictionScoringMode = "numeric" | "choice";
export type PredictionConfidence = "low" | "medium" | "high";
export type PredictionOutcome = "pending" | "hit" | "close" | "miss";
export type ExamModeKind =
  | "mixed-mc-sprint"
  | "weak-unit-focus"
  | "frq-focus-block";

export interface PredictionManifest {
  simId: string;
  unitSlug: string;
  topicKey: string;
  sourceType: PredictionSourceType;
  promptKind: PredictionPromptKind;
  promptLabel: string;
  unitLabel: string;
  scoringMode: PredictionScoringMode;
  manualActualEntry: boolean;
  viewId: string;
  choiceOptions?: string[];
  predictionPlaceholder?: string;
  actualLabel?: string;
}

export interface PredictionRecord {
  id: string;
  simId: string;
  unitSlug: string;
  topicKey: string;
  predictedNumber?: number;
  predictedChoice?: string;
  actualNumber?: number;
  actualChoice?: string;
  rationale: string;
  confidence: PredictionConfidence;
  outcome: PredictionOutcome;
  score: number;
  createdAt: number;
  resolvedAt: number | null;
}

export interface ExamRunRecord {
  id: string;
  modeKind: ExamModeKind;
  durationSec: number;
  questionCount: number;
  correctCount: number;
  accuracy: number;
  unitAccuracy: Record<string, number>;
  topicMisses: Record<string, number>;
  startedAt: number;
  completedAt: number;
}

export interface WeakSpotNode {
  kind: "unit" | "topic";
  label: string;
  unitSlug: string;
  topicKey?: string;
  score: number;
  reason: string;
  targetHref: string;
  dominantSignal: string;
}

export interface ReadinessSnapshot {
  overallReadiness: number;
  topWeakUnits: WeakSpotNode[];
  topWeakTopics: WeakSpotNode[];
  recentPredictionAccuracy: number | null;
  recentExamTrend: number | null;
}

export interface PredictionScoreResult {
  outcome: Exclude<PredictionOutcome, "pending">;
  score: number;
  percentError: number | null;
}

export interface ExamBlockRecommendation {
  kind: ExamModeKind;
  title: string;
  reason: string;
}
