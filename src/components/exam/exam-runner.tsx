"use client";

import { useEffect, useMemo, useState } from "react";
import { unitPracticeBanks } from "@/content/practice/banks";
import { buildExamModeBlock } from "@/lib/insights";
import { useInsightsView } from "@/components/insights/use-insights-view";
import { useInsights } from "@/contexts/insights-context";
import { useMistakes } from "@/contexts/mistake-context";
import type { ExamModeKind } from "@/types/insights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MathText, Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toLatex } from "@/lib/latex";

const DURATION_BY_MODE: Record<ExamModeKind, number> = {
  "mixed-mc-sprint": 12 * 60,
  "weak-unit-focus": 10 * 60,
  "frq-focus-block": 15 * 60,
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ExamRunner({
  modeKind,
  onExit,
}: {
  modeKind: ExamModeKind;
  onExit: () => void;
}) {
  const startedAt = useMemo(() => Date.now(), []);
  const { inputs } = useInsightsView();
  const { recordExamRun } = useInsights();
  const { addMistake } = useMistakes();
  const [timeLeft, setTimeLeft] = useState(DURATION_BY_MODE[modeKind]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [selfScore, setSelfScore] = useState(70);
  const [recorded, setRecorded] = useState(false);

  const questionMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(unitPracticeBanks).map(([unitSlug, bank]) => [
          unitSlug,
          bank.quizQuestions,
        ])
      ),
    []
  );
  const frqMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(unitPracticeBanks).map(([unitSlug, bank]) => [
          unitSlug,
          bank.frqProblems,
        ])
      ),
    []
  );

  const block = useMemo(
    () =>
      buildExamModeBlock(modeKind, {
        ...inputs,
        questionsByUnit: questionMap,
        frqsByUnit: frqMap,
        seed: startedAt,
      }),
    [frqMap, inputs, modeKind, questionMap, startedAt]
  );

  useEffect(() => {
    if (finished) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [finished, timeLeft]);

  async function finishMcBlock() {
    const unitTotals: Record<string, { correct: number; total: number }> = {};
    const topicMisses: Record<string, number> = {};
    let correctCount = 0;

    for (const question of block.questions) {
      const answer = answers[question.id];
      const correct = answer === question.answer;
      unitTotals[question.unitSlug] ??= { correct: 0, total: 0 };
      unitTotals[question.unitSlug].total += 1;

      if (correct) {
        correctCount += 1;
        unitTotals[question.unitSlug].correct += 1;
      } else if (answer !== undefined) {
        topicMisses[question.topicKey] = (topicMisses[question.topicKey] ?? 0) + 1;
        addMistake({
          unit: question.unitSlug,
          topic: question.topicKey,
          question: question.prompt,
          yourAnswer: question.choices[answer] ?? "No answer",
          correctAnswer: question.choices[question.answer],
          timestamp: Date.now(),
        });
      }
    }

    const unitAccuracy = Object.fromEntries(
      Object.entries(unitTotals).map(([unitSlug, totals]) => [
        unitSlug,
        totals.total === 0 ? 0 : (totals.correct / totals.total) * 100,
      ])
    );
    const accuracy =
      block.questions.length === 0 ? 0 : (correctCount / block.questions.length) * 100;

    await recordExamRun({
      modeKind,
      durationSec: DURATION_BY_MODE[modeKind] - timeLeft,
      questionCount: block.questions.length,
      correctCount,
      accuracy,
      unitAccuracy,
      topicMisses,
      startedAt,
      completedAt: Date.now(),
    });
    setRecorded(true);
  }

  async function finishFrqBlock() {
    if (!block.frq) {
      return;
    }

    await recordExamRun({
      modeKind,
      durationSec: DURATION_BY_MODE[modeKind] - timeLeft,
      questionCount: 1,
      correctCount: selfScore >= 60 ? 1 : 0,
      accuracy: selfScore,
      unitAccuracy: {
        [block.frq.unitSlug]: selfScore,
      },
      topicMisses: {},
      startedAt,
      completedAt: Date.now(),
    });
    setRecorded(true);
  }

  const currentQuestion = block.questions[currentIndex];

  if (modeKind === "frq-focus-block" && block.frq) {
    return (
      <div className="space-y-6">
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>FRQ Focus Block</CardTitle>
                <CardDescription>{block.frq.title}</CardDescription>
              </div>
              <Badge variant={timeLeft < 120 ? "destructive" : "secondary"} className="font-mono">
                {formatTime(timeLeft)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <PhysicsText display={false} className="text-sm text-muted-foreground">
              {block.frq.scenario}
            </PhysicsText>
            <div className="flex flex-wrap gap-2">
              {block.frq.given.map((item) => (
                <Badge key={item} variant="outline" className="font-mono text-[10px]">
                  <Tex>{toLatex(item)}</Tex>
                </Badge>
              ))}
            </div>
            {block.frq.parts.map((part) => (
              <div key={part.label} className="space-y-2 rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-sm font-medium">
                  <span className="mr-1 font-mono text-muted-foreground">({part.label})</span>
                  <MathText>{part.question}</MathText>
                </p>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Write your response here."
                />
                {finished && (
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Rubric
                    </p>
                    {part.rubric.map((item) => (
                      <PhysicsText
                        key={item}
                        display={false}
                        className="text-muted-foreground"
                      >
                        {item}
                      </PhysicsText>
                    ))}
                    <Separator className="my-3" />
                    <PhysicsText
                      display={false}
                      className="whitespace-pre-line text-muted-foreground"
                    >
                      {part.sampleResponse}
                    </PhysicsText>
                  </div>
                )}
              </div>
            ))}

            {!finished ? (
              <div className="flex gap-2">
                <Button onClick={() => setFinished(true)}>End Block</Button>
                <Button variant="outline" onClick={onExit}>
                  Exit
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <label className="block text-sm font-medium">
                  Self-score this FRQ: {selfScore}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={selfScore}
                  onChange={(event) => setSelfScore(Number(event.target.value))}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button onClick={() => void finishFrqBlock()} disabled={recorded}>
                    {recorded ? "Recorded" : "Save Run"}
                  </Button>
                  <Button variant="outline" onClick={onExit}>
                    Back to dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finished) {
    const total = block.questions.length;
    const score = block.questions.reduce(
      (sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0),
      0
    );
    const unanswered = block.questions.reduce(
      (count, question) => count + (answers[question.id] === undefined ? 1 : 0),
      0,
    );
    const accuracy = total === 0 ? 0 : (score / total) * 100;
    const durationSec = DURATION_BY_MODE[modeKind] - timeLeft;
    const durationLabel = formatTime(Math.max(durationSec, 0));

    const perUnit: Record<string, { correct: number; total: number }> = {};
    for (const question of block.questions) {
      const entry = perUnit[question.unitSlug] ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (answers[question.id] === question.answer) entry.correct += 1;
      perUnit[question.unitSlug] = entry;
    }
    const unitRows = Object.entries(perUnit).sort((a, b) => b[1].total - a[1].total);

    return (
      <div className="space-y-5">
        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader className="text-center">
            <CardTitle>Block Complete</CardTitle>
            <CardDescription>
              {modeKind === "mixed-mc-sprint" ? "Mixed MC Sprint" : "Weak-Unit Focus"} ·{" "}
              {durationLabel} elapsed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 text-center sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Score
                </p>
                <p className="mt-1 text-2xl font-black font-mono">
                  {score}/{total}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Accuracy
                </p>
                <p className="mt-1 text-2xl font-black font-mono">{Math.round(accuracy)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Unanswered
                </p>
                <p className="mt-1 text-2xl font-black font-mono">{unanswered}</p>
              </div>
            </div>
            <Progress
              value={total === 0 ? 0 : (score / total) * 100}
              className="mx-auto h-3 max-w-sm"
            />
            {unitRows.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Per-unit breakdown
                </p>
                <div className="space-y-2">
                  {unitRows.map(([unitSlug, { correct, total: unitTotal }]) => {
                    const pct = unitTotal === 0 ? 0 : (correct / unitTotal) * 100;
                    return (
                      <div key={unitSlug} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize text-foreground/80">
                            {unitSlug.replace(/-/g, " ")}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {correct}/{unitTotal} · {Math.round(pct)}%
                          </span>
                        </div>
                        <Progress value={pct} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => void finishMcBlock()} disabled={recorded}>
                {recorded ? "Recorded" : "Save Run"}
              </Button>
              <Button variant="outline" onClick={onExit}>
                Back to dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/[0.08] bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-base">Question Review</CardTitle>
            <CardDescription>Missed and skipped questions first.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {block.questions
              .map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.answer;
                const isSkipped = userAnswer === undefined;
                return { question, userAnswer, isCorrect, isSkipped, index };
              })
              .sort((a, b) => {
                const weight = (row: { isCorrect: boolean; isSkipped: boolean }) =>
                  row.isSkipped ? 0 : row.isCorrect ? 2 : 1;
                return weight(a) - weight(b);
              })
              .map(({ question, userAnswer, isCorrect, isSkipped, index }) => {
                const status = isSkipped ? "skipped" : isCorrect ? "correct" : "wrong";
                const statusClass =
                  status === "correct"
                    ? "border-green-500/40 bg-green-500/5"
                    : status === "wrong"
                      ? "border-red-500/40 bg-red-500/5"
                      : "border-border bg-background/40";
                return (
                  <div
                    key={question.id}
                    className={`rounded-xl border p-3 text-sm ${statusClass}`}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Q{index + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {question.unitSlug}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {question.topicKey}
                      </Badge>
                      <span
                        className={`ml-auto font-mono text-[10px] uppercase tracking-widest ${
                          status === "correct"
                            ? "text-green-600 dark:text-green-400"
                            : status === "wrong"
                              ? "text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="mb-2 font-medium leading-snug">
                      <MathText>{question.prompt}</MathText>
                    </p>
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="text-muted-foreground">Your answer: </span>
                        <span
                          className={
                            isSkipped
                              ? "text-muted-foreground italic"
                              : isCorrect
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                          }
                        >
                          {isSkipped ? (
                            "— not answered —"
                          ) : (
                            <MathText>
                              {question.choices[userAnswer ?? 0] ?? "—"}
                            </MathText>
                          )}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="text-muted-foreground">Correct: </span>
                          <span className="text-green-600 dark:text-green-400">
                            <MathText>{question.choices[question.answer]}</MathText>
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-white/[0.08] bg-white/[0.03]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>
              {modeKind === "mixed-mc-sprint" ? "Mixed MC Sprint" : "Weak-Unit Focus"}
            </CardTitle>
            <CardDescription>
              {block.recommendedUnits.join(", ")}
            </CardDescription>
          </div>
          <Badge variant={timeLeft < 120 ? "destructive" : "secondary"} className="font-mono">
            {formatTime(timeLeft)}
          </Badge>
        </div>
        <Progress
          value={((currentIndex + 1) / Math.max(block.questions.length, 1)) * 100}
          className="h-1.5"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQuestion && (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{currentQuestion.unitSlug}</Badge>
              <Badge variant="secondary">{currentQuestion.topicKey}</Badge>
            </div>
            <p className="text-base font-medium leading-snug">
              <MathText>{currentQuestion.prompt}</MathText>
            </p>
            <div className="grid gap-2">
              {currentQuestion.choices.map((choice, choiceIndex) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: choiceIndex,
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    answers[currentQuestion.id] === choiceIndex
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                >
                  <MathText>{choice}</MathText>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {currentIndex > 0 && (
                <Button variant="outline" onClick={() => setCurrentIndex((value) => value - 1)}>
                  Previous
                </Button>
              )}
              {currentIndex < block.questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex((value) => value + 1)}>Next</Button>
              ) : (
                <Button onClick={() => setFinished(true)}>Finish Block</Button>
              )}
              <Button variant="ghost" onClick={onExit}>
                Exit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
