"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { units } from "@/units/registry";
import { useArcade } from "@/contexts/arcade-context";
import { getFormulaSprint } from "@/lib/arcade-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MathText, Tex } from "@/components/ui/math";
import { toLatex } from "@/lib/latex";

const ROUND_DURATION = 45;
const QUESTION_COUNT = 6;

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash || 1;
}

function shuffleWithSeed<T>(items: T[], seed: string): { shuffled: T[]; mapping: number[] } {
  const working = items.map((item, idx) => ({ item, idx }));
  let h = hashSeed(seed);
  for (let i = working.length - 1; i > 0; i -= 1) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [working[i], working[j]] = [working[j], working[i]];
  }
  return {
    shuffled: working.map((w) => w.item),
    mapping: working.map((w) => w.idx),
  };
}

export function FormulaSpeedRound() {
  const pathname = usePathname();
  const { completeFormulaRound, formulaRounds } = useArcade();
  const unitSlug = pathname.split("/")[1];
  const unit = units.find((entry) => entry.slug === unitSlug) ?? units[0];

  const [roundSeed, setRoundSeed] = useState(() => `${unit.slug}-${Date.now()}`);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [active, setActive] = useState(false);

  const questions = useMemo(() => {
    const pool = getFormulaSprint(unit.slug, roundSeed, QUESTION_COUNT);
    return pool.map((q) => {
      const { shuffled, mapping } = shuffleWithSeed(q.choices, `${roundSeed}:${q.id}`);
      const newAnswer = mapping.indexOf(q.answer);
      return { ...q, choices: shuffled, answer: newAnswer };
    });
  }, [unit.slug, roundSeed]);

  const latestRound = formulaRounds.find((round) => round.id.startsWith(`${unit.slug}-`));

  const submitRound = useCallback(() => {
    const totalScore = questions.reduce((total, question) => {
      return total + (answers[question.id] === question.answer ? 1 : 0);
    }, 0);

    let currentStreak = 0;
    let longestStreak = 0;
    for (const question of questions) {
      if (answers[question.id] === question.answer) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    setBestStreak(longestStreak);
    setScore(totalScore);
    setActive(false);
    completeFormulaRound({
      id: roundSeed,
      score: totalScore,
      total: questions.length,
      bestStreak: longestStreak,
    });
  }, [answers, completeFormulaRound, questions, roundSeed]);

  useEffect(() => {
    if (!active || score !== null) {
      return;
    }

    if (timeLeft <= 0) {
      const finish = window.setTimeout(() => {
        submitRound();
      }, 0);
      return () => window.clearTimeout(finish);
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [active, score, submitRound, timeLeft]);

  function resetRound() {
    setRoundSeed(`${unit.slug}-${Date.now()}`);
    setAnswers({});
    setScore(null);
    setBestStreak(0);
    setTimeLeft(ROUND_DURATION);
    setActive(false);
  }

  function handleAnswerClick(questionId: string, choiceIndex: number) {
    if (score !== null) return;
    setAnswers((current) => ({ ...current, [questionId]: choiceIndex }));
    if (!active) {
      setActive(true);
    }
  }

  const inProgress = active && score === null;
  const notStarted = !active && score === null;
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-lg">Formula Speed Round</CardTitle>
              <CardDescription>
                {notStarted
                  ? `Tap any answer to start the ${ROUND_DURATION}-second countdown.`
                  : inProgress
                    ? `Lock in the core equations for ${unit.shortName}.`
                    : `Scored ${score}/${questions.length} · best streak ${bestStreak}.`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  inProgress && timeLeft <= 10
                    ? "destructive"
                    : inProgress && timeLeft <= 30
                      ? "outline"
                      : "secondary"
                }
                className={`font-mono ${
                  inProgress && timeLeft <= 10
                    ? "animate-pulse"
                    : inProgress && timeLeft <= 30
                      ? "border-amber-500/60 text-amber-400"
                      : ""
                }`}
              >
                {active ? `${timeLeft}s` : `${ROUND_DURATION}s round`}
              </Badge>
              {inProgress && (
                <Button size="sm" variant="outline" onClick={submitRound}>
                  Submit now
                </Button>
              )}
              {!inProgress && (
                <Button size="sm" onClick={resetRound}>
                  {score !== null ? "Play again" : "Shuffle questions"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            <span>
              {questions.length} prompts · answers shuffled each round · {answered}/{questions.length} answered
            </span>
            <span>Latest: {latestRound ? `${latestRound.score}/${latestRound.total}` : "none yet"}</span>
            <span>Best streak: {latestRound?.bestStreak ?? 0}</span>
          </div>
          <Progress
            value={active ? ((ROUND_DURATION - timeLeft) / ROUND_DURATION) * 100 : 0}
            className="h-2"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-white/[0.08] bg-white/[0.03]">
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="text-sm font-semibold leading-snug">
                  <span className="mr-1 font-mono text-muted-foreground">{index + 1}.</span>
                  <MathText>{question.prompt}</MathText>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hint: <MathText>{question.hint}</MathText>
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice, choiceIndex) => {
                  const isSelected = answers[question.id] === choiceIndex;
                  const isCorrect = score !== null && choiceIndex === question.answer;
                  const isWrongPick =
                    score !== null && isSelected && choiceIndex !== question.answer;
                  return (
                    <button
                      key={`${question.id}-${choiceIndex}`}
                      type="button"
                      disabled={score !== null}
                      onClick={() => handleAnswerClick(question.id, choiceIndex)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        isCorrect
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                          : isWrongPick
                            ? "border-rose-500/60 bg-rose-500/10 text-rose-200"
                            : isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-foreground/75 hover:border-primary/40"
                      } ${score !== null ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <Tex display={false}>{toLatex(choice)}</Tex>
                    </button>
                  );
                })}
              </div>
              {score !== null && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-foreground/80">
                  <span className="mr-2">Correct formula:</span>
                  <Tex display={false}>{toLatex(question.formula)}</Tex>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {score !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <div className="text-sm">
            Final: <span className="font-semibold">{score}/{questions.length}</span> · best streak {bestStreak}
          </div>
          <Button onClick={resetRound}>Play again with new questions</Button>
        </div>
      )}
    </div>
  );
}
