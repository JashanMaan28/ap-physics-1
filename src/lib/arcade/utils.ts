import { units } from "@/data/units";
import type { ExamDraftStep } from "./types";
import { hashSeed } from "./seeding";

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseExamWeight(weight: string): number {
  const match = weight.match(/(\d+)[–-](\d+)/);
  if (!match) {
    return 10;
  }
  return (Number(match[1]) + Number(match[2])) / 2;
}

export function buildExamDraft(
  progressByUnit: Record<string, number>,
  mistakesByUnit: Record<string, number>,
  seed: number
): ExamDraftStep[] {
  const ranked = [...units]
    .map((unit) => {
      const examWeight = parseExamWeight(unit.examWeight);
      const progressPenalty = 100 - (progressByUnit[unit.slug] ?? 0);
      const mistakePressure = (mistakesByUnit[unit.slug] ?? 0) * 8;
      const swing = ((hashSeed(`${unit.slug}:${seed}`) % 11) - 5) * 0.8;
      const score = examWeight * 2 + progressPenalty + mistakePressure + swing;

      return { unit, score, examWeight };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return ranked.map(({ unit, examWeight }, index) => {
    const minutes = Math.max(10, Math.round(examWeight + 6 - index));
    const progress = progressByUnit[unit.slug] ?? 0;
    const mistakes = mistakesByUnit[unit.slug] ?? 0;

    return {
      unitSlug: unit.slug,
      unitName: unit.shortName,
      minutes,
      focus:
        index === 0
          ? "Boss battle + quiz"
          : index === 1
            ? "Mistake revenge + worked example"
            : index === 2
              ? "Formula recall + timed drill"
              : "One simulation + recap note",
      reason:
        progress < 50
          ? "Low progress and strong exam weight make this the best payoff."
          : mistakes > 0
            ? "Your mistake log says this unit still bites."
            : "This keeps the session aligned with AP exam weighting.",
    };
  });
}

export function createShareCardText(input: {
  level: number;
  xp: number;
  streak: number;
  progress: number;
  dailyBest?: string;
  bossBest?: string;
}): string {
  const lines = [
    "AP Physics 1 Study Arcade",
    `Level ${input.level} · ${input.xp} XP`,
    `Overall progress: ${Math.round(input.progress)}%`,
    `Current streak: ${input.streak} day${input.streak === 1 ? "" : "s"}`,
  ];

  if (input.dailyBest) {
    lines.push(`Daily challenge: ${input.dailyBest}`);
  }

  if (input.bossBest) {
    lines.push(`Best boss battle: ${input.bossBest}`);
  }

  lines.push("Built in the AP Physics 1 app.");
  return lines.join("\n");
}
