import { simulationManifests } from "@/lib/simulation-manifests";
import { unitConfigs, units } from "@/units/registry";
import type { MistakeEntry } from "@/types/unit";
import type {
  ExamBlockRecommendation,
  ExamModeKind,
  ExamRunRecord,
  PredictionManifest,
  PredictionRecord,
  PredictionScoreResult,
  ReadinessSnapshot,
  WeakSpotNode,
} from "@/types/insights";
import type { PracticeChoiceQuestion, PracticeFrqProblem } from "@/content/practice/types";

interface TopicSnapshot {
  label: string;
  unitSlug: string;
  topicKey: string;
  score: number;
  dominantSignal: string;
  targetHref: string;
  reason: string;
}

export interface RadarInputs {
  progressByUnit: Record<string, number>;
  completedTopicsByUnit: Record<string, string[]>;
  mistakes: MistakeEntry[];
  predictions: PredictionRecord[];
  examRuns: ExamRunRecord[];
}

export interface PracticeBanksInput {
  questionsByUnit: Record<string, PracticeChoiceQuestion[]>;
  frqsByUnit: Record<string, PracticeFrqProblem[]>;
}

export interface BuildExamBlockInput extends RadarInputs, PracticeBanksInput {
  seed?: number;
}

export function parseExamWeightMidpoint(weightLabel: string) {
  const match = weightLabel.match(/(\d+)[–-](\d+)/);
  if (!match) {
    return 0;
  }

  return (Number(match[1]) + Number(match[2])) / 2;
}

export function scorePredictionRecord(
  manifest: PredictionManifest,
  record: Pick<
    PredictionRecord,
    "predictedNumber" | "predictedChoice" | "actualNumber" | "actualChoice"
  >
): PredictionScoreResult {
  if (manifest.scoringMode === "choice") {
    const match =
      record.predictedChoice !== undefined &&
      record.actualChoice !== undefined &&
      record.predictedChoice === record.actualChoice;

    return {
      outcome: match ? "hit" : "miss",
      score: match ? 100 : 0,
      percentError: null,
    };
  }

  const predicted = record.predictedNumber;
  const actual = record.actualNumber;

  if (predicted === undefined || actual === undefined) {
    return {
      outcome: "miss",
      score: 0,
      percentError: null,
    };
  }

  const denominator = Math.abs(actual) > 1e-6 ? Math.abs(actual) : 1;
  const percentError = Math.abs(predicted - actual) / denominator * 100;

  if (percentError <= 5) {
    return { outcome: "hit", score: 100, percentError };
  }

  if (percentError <= 15) {
    return { outcome: "close", score: 75, percentError };
  }

  return { outcome: "miss", score: 25, percentError };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAgainstMax(value: number, max: number) {
  if (max <= 0) {
    return null;
  }

  return (value / max) * 100;
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function resolveTopicLabel(unitSlug: string, topicKey: string) {
  const config = unitConfigs[unitSlug];
  const match = config?.sections
    .flatMap((section) => section.items)
    .find((item) => item.id === topicKey);

  return match?.name ?? topicKey;
}

function normalizeTopicKey(unitSlug: string, rawTopic: string) {
  const config = unitConfigs[unitSlug];
  const normalized = rawTopic.trim().toLowerCase();
  const match = config?.sections
    .flatMap((section) => section.items)
    .find(
      (item) =>
        item.id.toLowerCase() === normalized ||
        item.name.toLowerCase() === normalized ||
        item.short.toLowerCase() === normalized
    );

  return match?.id ?? rawTopic;
}

function weightedScore(parts: Array<{ value: number | null; weight: number }>) {
  const available = parts.filter(
    (part): part is { value: number; weight: number } => part.value !== null
  );

  if (available.length === 0) {
    return 0;
  }

  const totalWeight = available.reduce((sum, part) => sum + part.weight, 0);

  return available.reduce(
    (sum, part) => sum + part.value * (part.weight / totalWeight),
    0
  );
}

function getRecentExamRuns(examRuns: ExamRunRecord[]) {
  return [...examRuns]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);
}

function createTopicHref(unitSlug: string, viewId: string) {
  return `/${unitSlug}?view=${viewId}`;
}

export function deriveWeakSpotNodes(inputs: RadarInputs): {
  unitNodes: WeakSpotNode[];
  topicNodesByUnit: Record<string, WeakSpotNode[]>;
} {
  const { progressByUnit, completedTopicsByUnit, mistakes, predictions, examRuns } = inputs;
  const recentRuns = getRecentExamRuns(examRuns);
  const resolvedPredictions = predictions.filter((prediction) => prediction.resolvedAt !== null);
  const maxExamWeight = Math.max(...units.map((unit) => parseExamWeightMidpoint(unit.examWeight)));

  const mistakeCountsByUnit = mistakes.reduce<Record<string, number>>((acc, mistake) => {
    acc[mistake.unit] = (acc[mistake.unit] ?? 0) + 1;
    return acc;
  }, {});
  const maxUnitMistakes = Math.max(0, ...Object.values(mistakeCountsByUnit));

  const predictionMissRateByUnit = resolvedPredictions.reduce<Record<string, number[]>>(
    (acc, prediction) => {
      acc[prediction.unitSlug] ??= [];
      acc[prediction.unitSlug].push(prediction.outcome === "miss" ? 100 : 0);
      return acc;
    },
    {}
  );

  const unitNodes = units
    .map<WeakSpotNode>((unit) => {
      const recentUnitAccuracies = recentRuns
        .map((run) => run.unitAccuracy[unit.slug])
        .filter((value): value is number => typeof value === "number");

      const predictionMissRate = average(predictionMissRateByUnit[unit.slug] ?? []);
      const weightMidpoint = parseExamWeightMidpoint(unit.examWeight);
      const mistakeDensity = normalizeAgainstMax(
        mistakeCountsByUnit[unit.slug] ?? 0,
        maxUnitMistakes
      );
      const unitAccuracyDeficit =
        recentUnitAccuracies.length > 0
          ? 100 - (average(recentUnitAccuracies) ?? 0)
          : null;

      const signals = [
        { key: "exam-weight", value: normalizeAgainstMax(weightMidpoint, maxExamWeight), weight: 35 },
        { key: "incomplete-progress", value: 100 - (progressByUnit[unit.slug] ?? 0), weight: 30 },
        { key: "mistake-density", value: mistakeDensity, weight: 20 },
        { key: "exam-accuracy-deficit", value: unitAccuracyDeficit, weight: 10 },
        { key: "prediction-miss-rate", value: predictionMissRate, weight: 5 },
      ];

      const score = weightedScore(signals.map(({ value, weight }) => ({ value, weight })));
      const dominant = [...signals]
        .filter((signal): signal is typeof signal & { value: number } => signal.value !== null)
        .sort((a, b) => b.value - a.value)[0];

      const reasonMap: Record<string, string> = {
        "exam-weight": "High exam weight keeps this unit urgent.",
        "incomplete-progress": "Progress is still incomplete here.",
        "mistake-density": "Recent mistakes cluster in this unit.",
        "exam-accuracy-deficit": "Recent exam-mode accuracy lags here.",
        "prediction-miss-rate": "Prediction misses suggest the linked lab ideas need review.",
      };

      return {
        kind: "unit",
        label: unit.shortName,
        unitSlug: unit.slug,
        score: clamp(score),
        reason: reasonMap[dominant?.key ?? "incomplete-progress"],
        targetHref: createTopicHref(unit.slug, "quiz"),
        dominantSignal: dominant?.key ?? "incomplete-progress",
      };
    })
    .sort((a, b) => b.score - a.score);

  const topicMistakeCounts = mistakes.reduce<Record<string, number>>((acc, mistake) => {
    const normalizedTopic = normalizeTopicKey(mistake.unit, mistake.topic);
    const key = `${mistake.unit}:${normalizedTopic}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const recentTopicMisses = recentRuns.reduce<Record<string, number>>((acc, run) => {
    for (const [topicKey, count] of Object.entries(run.topicMisses)) {
      acc[topicKey] = (acc[topicKey] ?? 0) + count;
    }
    return acc;
  }, {});

  const predictionMissRateByTopic = resolvedPredictions.reduce<Record<string, number[]>>(
    (acc, prediction) => {
      const key = `${prediction.unitSlug}:${prediction.topicKey}`;
      acc[key] ??= [];
      acc[key].push(prediction.outcome === "miss" ? 100 : 0);
      return acc;
    },
    {}
  );

  const topicNodesByUnit = Object.fromEntries(
    units.map((unit) => {
      const config = unitConfigs[unit.slug];
      const topics = config?.learnTopicIds ?? [];

      const maxTopicMistakes = Math.max(
        0,
        ...topics.map((topicKey) => topicMistakeCounts[`${unit.slug}:${topicKey}`] ?? 0)
      );
      const maxTopicExamMiss = Math.max(
        0,
        ...topics.map((topicKey) => recentTopicMisses[topicKey] ?? 0)
      );

      const nodes = topics
        .map<TopicSnapshot>((topicKey) => {
          const topicId = `${unit.slug}:${topicKey}`;
          const mistakeDensity = normalizeAgainstMax(
            topicMistakeCounts[topicId] ?? 0,
            maxTopicMistakes
          );
          const incompleteFlag = (completedTopicsByUnit[unit.slug] ?? []).includes(topicKey)
            ? 0
            : 100;
          const examMissSignal = normalizeAgainstMax(
            recentTopicMisses[topicKey] ?? 0,
            maxTopicExamMiss
          );
          const predictionSignal = average(predictionMissRateByTopic[topicId] ?? []);

          const signals = [
            { key: "mistake-density", value: mistakeDensity, weight: 50 },
            { key: "incomplete-topic", value: incompleteFlag, weight: 20 },
            { key: "exam-topic-misses", value: examMissSignal, weight: 20 },
            { key: "prediction-miss-rate", value: predictionSignal, weight: 10 },
          ];

          const score = weightedScore(signals.map(({ value, weight }) => ({ value, weight })));
          const dominant = [...signals]
            .filter((signal): signal is typeof signal & { value: number } => signal.value !== null)
            .sort((a, b) => b.value - a.value)[0];

          let targetHref = createTopicHref(unit.slug, "quiz");
          if (dominant?.key === "prediction-miss-rate") {
            const linkedManifest = simulationManifests.find(
              (manifest) =>
                manifest.unitSlug === unit.slug && manifest.topicKey === topicKey
            );
            targetHref = createTopicHref(
              unit.slug,
              linkedManifest?.viewId ?? "quiz"
            );
          } else if (incompleteFlag === 100) {
            targetHref = createTopicHref(unit.slug, topicKey);
          }

          return {
            label: resolveTopicLabel(unit.slug, topicKey),
            unitSlug: unit.slug,
            topicKey,
            score: clamp(score),
            dominantSignal: dominant?.key ?? "incomplete-topic",
            targetHref,
            reason:
              dominant?.key === "prediction-miss-rate"
                ? "Prediction misses are highest here."
                : dominant?.key === "mistake-density"
                  ? "Recent mistakes are clustering here."
                  : dominant?.key === "exam-topic-misses"
                    ? "Exam blocks keep missing this topic."
                    : "This topic is still incomplete.",
          };
        })
        .sort((a, b) => b.score - a.score)
        .map<WeakSpotNode>((topic) => ({
          kind: "topic",
          label: topic.label,
          unitSlug: topic.unitSlug,
          topicKey: topic.topicKey,
          score: topic.score,
          reason: topic.reason,
          targetHref: topic.targetHref,
          dominantSignal: topic.dominantSignal,
        }));

      return [unit.slug, nodes];
    })
  ) as Record<string, WeakSpotNode[]>;

  return { unitNodes, topicNodesByUnit };
}

export function deriveReadinessSnapshot(inputs: RadarInputs): ReadinessSnapshot {
  const { unitNodes, topicNodesByUnit } = deriveWeakSpotNodes(inputs);
  const recentRuns = getRecentExamRuns(inputs.examRuns);
  const recentResolvedPredictions = [...inputs.predictions]
    .filter((prediction) => prediction.resolvedAt !== null)
    .sort((a, b) => (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0))
    .slice(0, 10);

  const recentPredictionAccuracy = average(
    recentResolvedPredictions.map((prediction) =>
      prediction.outcome === "hit" ? 100 : prediction.outcome === "close" ? 75 : 25
    )
  );
  const recentExamAccuracy = average(recentRuns.map((run) => run.accuracy));

  const recentExamTrend =
    recentRuns.length >= 2
      ? recentRuns[0].accuracy - recentRuns[recentRuns.length - 1].accuracy
      : null;

  const overallProgress = average(Object.values(inputs.progressByUnit));
  const urgencyBuffer = average(unitNodes.slice(0, 3).map((node) => 100 - node.score));

  const overallReadiness = clamp(
    weightedScore([
      { value: overallProgress ?? null, weight: 35 },
      { value: recentExamAccuracy, weight: 35 },
      { value: recentPredictionAccuracy, weight: 15 },
      { value: urgencyBuffer, weight: 15 },
    ])
  );

  const topWeakUnits = unitNodes.slice(0, 4);
  const topWeakTopics = topWeakUnits
    .flatMap((unit) => topicNodesByUnit[unit.unitSlug] ?? [])
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    overallReadiness,
    topWeakUnits,
    topWeakTopics,
    recentPredictionAccuracy,
    recentExamTrend,
  };
}

function seededSort<T extends { id: string }>(items: T[], seed: number) {
  return [...items].sort((a, b) => hashString(`${a.id}:${seed}`) - hashString(`${b.id}:${seed}`));
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function chooseWeightedUnits(unitNodes: WeakSpotNode[], count: number) {
  return unitNodes.slice(0, count).map((node) => node.unitSlug);
}

export function buildExamModeBlock(
  modeKind: ExamModeKind,
  input: BuildExamBlockInput
): {
  modeKind: ExamModeKind;
  questions: PracticeChoiceQuestion[];
  frq: PracticeFrqProblem | null;
  recommendedUnits: string[];
} {
  const seed = input.seed ?? 1;
  const { unitNodes } = deriveWeakSpotNodes(input);

  if (modeKind === "frq-focus-block") {
    const unitSlug =
      unitNodes.find((node) => (input.frqsByUnit[node.unitSlug] ?? []).length > 0)?.unitSlug ??
      units.find((unit) => (input.frqsByUnit[unit.slug] ?? []).length > 0)?.slug ??
      units[0].slug;

    const frq = seededSort(input.frqsByUnit[unitSlug] ?? [], seed)[0] ?? null;

    return {
      modeKind,
      questions: [],
      frq,
      recommendedUnits: frq ? [unitSlug] : [],
    };
  }

  if (modeKind === "weak-unit-focus") {
    const unitSlugs = chooseWeightedUnits(unitNodes, 2);
    const questions = unitSlugs.flatMap((unitSlug, index) =>
      seededSort(input.questionsByUnit[unitSlug] ?? [], seed + index).slice(0, 4)
    );

    return {
      modeKind,
      questions: questions.slice(0, 8),
      frq: null,
      recommendedUnits: unitSlugs,
    };
  }

  const weightedUnits = unitNodes.map((node) => node.unitSlug);
  const pool = weightedUnits.flatMap((unitSlug, index) =>
    seededSort(input.questionsByUnit[unitSlug] ?? [], seed + index).slice(0, 3)
  );

  return {
    modeKind,
    questions: seededSort(pool, seed).slice(0, 10),
    frq: null,
    recommendedUnits: weightedUnits.slice(0, 4),
  };
}

export function recommendNextExamBlock(snapshot: ReadinessSnapshot): ExamBlockRecommendation {
  const topUnit = snapshot.topWeakUnits[0];

  if ((topUnit?.score ?? 0) >= 70) {
    return {
      kind: "weak-unit-focus",
      title: "Weak-Unit Focus",
      reason: `${topUnit.label} is pulling hardest on readiness right now.`,
    };
  }

  if ((snapshot.recentExamTrend ?? 0) < -5) {
    return {
      kind: "mixed-mc-sprint",
      title: "Mixed MC Sprint",
      reason: "A broader reset will check if recent exam accuracy is slipping course-wide.",
    };
  }

  return {
    kind: "frq-focus-block",
    title: "FRQ Focus Block",
    reason: "A single rubric-based block is the fastest way to pressure-test reasoning depth.",
  };
}
