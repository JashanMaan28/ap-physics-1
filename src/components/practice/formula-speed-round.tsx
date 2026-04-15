"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { units } from "@/data/units";
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

export function FormulaSpeedRound() {
  const pathname = usePathname();
  const { completeFormulaRound, formulaRounds } = useArcade();
  const unitSlug = pathname.split("/")[1];
  const unit = units.find((entry) => entry.slug === unitSlug) ?? units[0];

  const [roundSeed, setRoundSeed] = useState(() => `${unit.slug}-${Date.now()}`);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [active, setActive] = useState(false);

  const questions = getFormulaSprint(unit.slug, roundSeed);
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

  function startRound() {
    setRoundSeed(`${unit.slug}-${Date.now()}`);
    setAnswers({});
    setScore(null);
    setBestStreak(0);
    setTimeLeft(45);
    setActive(true);
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/[0.08] bg-white/[0.03]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Formula Speed Round</CardTitle>
              <CardDescription>
                Quick recall for {unit.shortName}. Beat the clock and lock in the core equations.
              </CardDescription>
            </div>
            <Badge variant="secondary">{active ? `${timeLeft}s left` : `${questions.length} prompts`}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            <span>One shared timer per round.</span>
            <span>Latest score: {latestRound ? `${latestRound.score}/${latestRound.total}` : "none yet"}</span>
            <span>Best streak: {latestRound?.bestStreak ?? 0}</span>
          </div>
          <Progress value={((45 - timeLeft) / 45) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-white/[0.08] bg-white/[0.03]">
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="text-sm font-semibold">
                  {index + 1}. {question.prompt}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Hint: {question.hint}</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.choices.map((choice, choiceIndex) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: choiceIndex,
                      }))
                    }
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                      answers[question.id] === choiceIndex
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground/75 hover:border-primary/40"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {score !== null && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-foreground/80">
                  Correct formula: <span className="font-mono">{question.formula}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={startRound}>{active ? "Restart round" : "Start round"}</Button>
        <Button variant="outline" onClick={submitRound} disabled={!active && score === null}>
          Submit round
        </Button>
        {score !== null && (
          <span className="text-sm text-foreground/65">
            Score {score}/{questions.length} · best streak {bestStreak}
          </span>
        )}
      </div>
    </div>
  );
}
