"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getUnitPracticeBank } from "@/content/practice/banks";
import { getUnitBySlug } from "@/data/units";
import { useMistakes } from "@/contexts/mistake-context";
import type { PracticeFrqProblem } from "@/content/practice/types";

function useUnitBank(unitSlug: string) {
  return useMemo(() => getUnitPracticeBank(unitSlug), [unitSlug]);
}

function PracticeQuizView({ unitSlug }: { unitSlug: string }) {
  const bank = useUnitBank(unitSlug);
  const unit = getUnitBySlug(unitSlug);
  const { addMistake } = useMistakes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  if (!bank || bank.quizQuestions.length === 0) {
    return null;
  }

  const question = bank.quizQuestions[currentIndex];
  const done = answered >= bank.quizQuestions.length;

  if (done) {
    const percent = Math.round((score / bank.quizQuestions.length) * 100);
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle>{unit?.shortName} Quiz Complete</CardTitle>
          <CardDescription>Shared practice bank</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold font-mono">
            {score}/{bank.quizQuestions.length}
          </p>
          <Progress value={percent} className="mx-auto h-3 max-w-sm" />
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setSelected(null);
              setShowAnswer(false);
              setScore(0);
              setAnswered(0);
            }}
          >
            Retry Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>
            Question {currentIndex + 1} of {bank.quizQuestions.length}
          </CardTitle>
          <Badge variant="secondary" className="font-mono">
            {score}/{answered}
          </Badge>
        </div>
        <Progress
          value={(currentIndex / bank.quizQuestions.length) * 100}
          className="h-1.5"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="outline">{question.topicKey}</Badge>
        <p className="text-base font-medium">{question.prompt}</p>
        <div className="grid gap-2">
          {question.choices.map((choice, choiceIndex) => {
            const isCorrect = choiceIndex === question.answer;
            const isSelected = choiceIndex === selected;
            const className = showAnswer
              ? isCorrect
                ? "border-green-500 bg-green-500/10"
                : isSelected
                  ? "border-red-500 bg-red-500/10"
                  : ""
              : "hover:bg-muted";

            return (
              <button
                key={choice}
                type="button"
                disabled={showAnswer}
                onClick={() => {
                  setSelected(choiceIndex);
                  setShowAnswer(true);
                  setAnswered((value) => value + 1);

                  if (choiceIndex === question.answer) {
                    setScore((value) => value + 1);
                    return;
                  }

                  addMistake({
                    unit: unitSlug,
                    topic: question.topicKey,
                    question: question.prompt,
                    yourAnswer: choice,
                    correctAnswer: question.choices[question.answer],
                    timestamp: Date.now(),
                  });
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${className}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {showAnswer && (
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            {question.explanation}
          </div>
        )}
        {showAnswer && (
          <Button
            onClick={() => {
              if (currentIndex === bank.quizQuestions.length - 1) {
                setAnswered(bank.quizQuestions.length);
                return;
              }

              setCurrentIndex((value) => value + 1);
              setSelected(null);
              setShowAnswer(false);
            }}
          >
            {currentIndex === bank.quizQuestions.length - 1 ? "See Results" : "Next Question"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function TimedTestView({ unitSlug }: { unitSlug: string }) {
  const bank = useUnitBank(unitSlug);
  const unit = getUnitBySlug(unitSlug);
  const { addMistake } = useMistakes();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [timeLeft, setTimeLeft] = useState(12 * 60);

  useEffect(() => {
    if (!started || finished) {
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
  }, [finished, started, timeLeft]);

  useEffect(() => {
    if (!finished || !bank) {
      return;
    }

    bank.quizQuestions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === null || answer === undefined || answer === question.answer) {
        return;
      }

      addMistake({
        unit: unitSlug,
        topic: question.topicKey,
        question: question.prompt,
        yourAnswer: question.choices[answer],
        correctAnswer: question.choices[question.answer],
        timestamp: Date.now(),
      });
    });
  }, [addMistake, answers, bank, finished, unitSlug]);

  if (!bank || bank.quizQuestions.length === 0) {
    return null;
  }

  const totalQuestions = Math.min(10, bank.quizQuestions.length);
  const questions = bank.quizQuestions.slice(0, totalQuestions);
  const score = questions.reduce(
    (sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0),
    0
  );

  if (!started) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>{unit?.shortName} Timed Mini-Test</CardTitle>
          <CardDescription>
            {questions.length} questions in 12 minutes from the shared practice bank.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setStarted(true);
              setFinished(false);
              setCurrentIndex(0);
              setTimeLeft(12 * 60);
              setAnswers(Array(questions.length).fill(null));
            }}
          >
            Start Timed Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle>{unit?.shortName} Test Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold font-mono">
            {score}/{questions.length}
          </p>
          <Progress value={(score / questions.length) * 100} className="mx-auto h-3 max-w-sm" />
          <Button onClick={() => setStarted(false)} variant="outline">
            Retake Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>
            Question {currentIndex + 1} of {questions.length}
          </CardTitle>
          <Badge variant={timeLeft < 60 ? "destructive" : "secondary"} className="font-mono">
            {formatTimer(timeLeft)}
          </Badge>
        </div>
        <Progress value={(currentIndex / questions.length) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="outline">{current.topicKey}</Badge>
        <p className="text-base font-medium">{current.prompt}</p>
        <div className="grid gap-2">
          {current.choices.map((choice, choiceIndex) => (
            <button
              key={choice}
              type="button"
              onClick={() =>
                setAnswers((prev) => {
                  const next = [...prev];
                  next[currentIndex] = choiceIndex;
                  return next;
                })
              }
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                answers[currentIndex] === choiceIndex ? "border-primary bg-primary/10" : "hover:bg-muted"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={() => setCurrentIndex((value) => value - 1)}>
              Previous
            </Button>
          )}
          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex((value) => value + 1)}>Next</Button>
          ) : (
            <Button onClick={() => setFinished(true)}>Submit Test</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FrqProblemCard({
  problem,
  openKey,
  setOpenKey,
}: {
  problem: PracticeFrqProblem;
  openKey: string | null;
  setOpenKey: (value: string | null) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{problem.title}</CardTitle>
        <CardDescription>{problem.scenario}</CardDescription>
        <div className="flex flex-wrap gap-2">
          {problem.given.map((item) => (
            <Badge key={item} variant="secondary" className="font-mono text-[10px]">
              {item}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {problem.parts.map((part) => {
          const key = `${problem.id}:${part.label}`;
          const open = openKey === key;
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">
                  ({part.label}) {part.question}
                </p>
                <Badge variant="outline">{part.points} pts</Badge>
              </div>
              {open ? (
                <div className="rounded-xl border bg-muted/40 p-4 text-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Rubric
                  </p>
                  {part.rubric.map((item) => (
                    <p key={item} className="text-muted-foreground">
                      {item}
                    </p>
                  ))}
                  <Separator className="my-3" />
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sample Response
                  </p>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {part.sampleResponse}
                  </p>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setOpenKey(key)}>
                  Show Rubric
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function FrqPracticeView({ unitSlug }: { unitSlug: string }) {
  const bank = useUnitBank(unitSlug);
  const unit = getUnitBySlug(unitSlug);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (!bank || bank.frqProblems.length === 0) {
    return null;
  }

  const activeProblem = bank.frqProblems[activeIndex];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{unit?.shortName} FRQ Practice</CardTitle>
          <CardDescription>Shared rubric bank</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {bank.frqProblems.map((problem, index) => (
            <Button
              key={problem.id}
              variant={index === activeIndex ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveIndex(index);
                setOpenKey(null);
              }}
            >
              {problem.title}
            </Button>
          ))}
        </CardContent>
      </Card>
      <FrqProblemCard problem={activeProblem} openKey={openKey} setOpenKey={setOpenKey} />
    </div>
  );
}

export function createUnitPracticeQuiz(unitSlug: string) {
  return function UnitPracticeQuiz() {
    return <PracticeQuizView unitSlug={unitSlug} />;
  };
}

export function createUnitTimedTest(unitSlug: string) {
  return function UnitTimedTest() {
    return <TimedTestView unitSlug={unitSlug} />;
  };
}

export function createUnitFrqPractice(unitSlug: string) {
  return function UnitFrqPractice() {
    return <FrqPracticeView unitSlug={unitSlug} />;
  };
}
