"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getUnitPracticeBank } from "@/content/practice/banks";
import { getUnitBySlug } from "@/data/units";
import { useMistakes } from "@/contexts/mistake-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type {
  PracticeFrqDifficulty,
  PracticeFrqProblem,
} from "@/content/practice/types";
import { ErrorBoundary } from "@/components/error-boundary";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

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

  const question = bank?.quizQuestions[currentIndex];
  const done = !!bank && answered >= bank.quizQuestions.length;

  useEffect(() => {
    if (!bank || done || !question) return;

    const handleKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      const digit = parseInt(e.key, 10);
      if (!showAnswer && !Number.isNaN(digit) && digit >= 1 && digit <= question.choices.length) {
        e.preventDefault();
        const choiceIndex = digit - 1;
        const choice = question.choices[choiceIndex];
        setSelected(choiceIndex);
        setShowAnswer(true);
        setAnswered((value) => value + 1);
        if (choiceIndex === question.answer) {
          setScore((value) => value + 1);
        } else {
          addMistake({
            unit: unitSlug,
            topic: question.topicKey,
            question: question.prompt,
            yourAnswer: choice,
            correctAnswer: question.choices[question.answer],
            timestamp: Date.now(),
          });
        }
        return;
      }

      if (e.key === "Enter" && showAnswer) {
        e.preventDefault();
        if (currentIndex === bank.quizQuestions.length - 1) {
          setAnswered(bank.quizQuestions.length);
          return;
        }
        setCurrentIndex((value) => value + 1);
        setSelected(null);
        setShowAnswer(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [addMistake, bank, currentIndex, done, question, showAnswer, unitSlug]);

  if (!bank || bank.quizQuestions.length === 0 || !question) {
    return null;
  }

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
        <p className="text-sm md:text-base font-medium">{question.prompt}</p>
        <p className="text-[11px] text-muted-foreground">
          Tip: 1-{question.choices.length} to select · Enter to advance
        </p>
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
                <span className="mr-2 font-mono text-xs text-muted-foreground">{choiceIndex + 1}.</span>
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

  const totalQuestions = Math.min(10, bank?.quizQuestions.length ?? 0);
  const questions = useMemo(
    () => (bank ? bank.quizQuestions.slice(0, totalQuestions) : []),
    [bank, totalQuestions]
  );
  const score = questions.reduce(
    (sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0),
    0
  );

  useEffect(() => {
    if (!started || finished || questions.length === 0) return;

    const handleKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const current = questions[currentIndex];
      if (!current) return;

      const digit = parseInt(e.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= current.choices.length) {
        e.preventDefault();
        const choiceIndex = digit - 1;
        setAnswers((prev) => {
          const next = [...prev];
          next[currentIndex] = choiceIndex;
          return next;
        });
        return;
      }

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((v) => v - 1);
        return;
      }

      if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        e.preventDefault();
        setCurrentIndex((v) => v + 1);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((v) => v + 1);
        } else {
          setFinished(true);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, finished, questions, started]);

  if (!bank || bank.quizQuestions.length === 0) {
    return null;
  }

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

  const timerClass =
    timeLeft <= 10
      ? "text-red-500 border-red-500/50 animate-pulse font-bold"
      : timeLeft <= 30
        ? "text-red-500 border-red-500/50 animate-pulse"
        : timeLeft <= 60
          ? "text-amber-500 border-amber-500/50"
          : "";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-b-lg sm:px-4">
        <span className="text-xs text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <Badge variant="outline" className={`font-mono text-sm ${timerClass}`}>
          {formatTimer(timeLeft)}
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base md:text-lg">
              Question {currentIndex + 1} of {questions.length}
            </CardTitle>
            <Badge variant={timeLeft <= 30 ? "destructive" : timeLeft <= 60 ? "outline" : "secondary"} className="font-mono">
              {formatTimer(timeLeft)}
            </Badge>
          </div>
          <Progress value={(currentIndex / questions.length) * 100} className="h-1.5" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant="outline">{current.topicKey}</Badge>
          <p className="text-sm md:text-base font-medium">{current.prompt}</p>
          <p className="text-[11px] text-muted-foreground">
            Tip: 1-{current.choices.length} to select · ← → to navigate · Enter to advance
          </p>
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
                <span className="mr-2 font-mono text-xs text-muted-foreground">{choiceIndex + 1}.</span>
                {choice}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
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
    </div>
  );
}

type FrqPartState = {
  draft: string;
  submitted: boolean;
  checked: number[];
};

type FrqProblemState = {
  parts: Record<string, FrqPartState>;
};

const EMPTY_FRQ_STATE: FrqProblemState = { parts: {} };

function getPartState(state: FrqProblemState, label: string): FrqPartState {
  return state.parts[label] ?? { draft: "", submitted: false, checked: [] };
}

function problemTotalPoints(problem: PracticeFrqProblem): number {
  return problem.parts.reduce((sum, part) => sum + part.points, 0);
}

function problemEarnedPoints(problem: PracticeFrqProblem, state: FrqProblemState): number {
  return problem.parts.reduce((sum, part) => {
    const partState = getPartState(state, part.label);
    if (!partState.submitted || part.rubric.length === 0) return sum;
    const fraction = partState.checked.length / part.rubric.length;
    return sum + part.points * fraction;
  }, 0);
}

function problemPartsSubmitted(problem: PracticeFrqProblem, state: FrqProblemState): number {
  return problem.parts.reduce(
    (count, part) => count + (getPartState(state, part.label).submitted ? 1 : 0),
    0,
  );
}

function difficultyBadgeClass(difficulty?: PracticeFrqDifficulty): string {
  switch (difficulty) {
    case "easy":
      return "border-green-500/50 text-green-600 dark:text-green-400";
    case "medium":
      return "border-amber-500/50 text-amber-600 dark:text-amber-400";
    case "hard":
      return "border-red-500/50 text-red-600 dark:text-red-400";
    default:
      return "";
  }
}

function FrqPartBlock({
  problem,
  part,
  state,
  updateState,
}: {
  problem: PracticeFrqProblem;
  part: PracticeFrqProblem["parts"][number];
  state: FrqProblemState;
  updateState: (updater: (prev: FrqProblemState) => FrqProblemState) => void;
}) {
  const partState = getPartState(state, part.label);
  const [draft, setDraft] = useState(partState.draft);

  const setPart = (partial: Partial<FrqPartState>) => {
    updateState((prev) => {
      const existing = getPartState(prev, part.label);
      return {
        ...prev,
        parts: {
          ...prev.parts,
          [part.label]: { ...existing, ...partial },
        },
      };
    });
  };

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return;
    setPart({ draft: text, submitted: true, checked: [] });
  };

  const handleResubmit = () => {
    setPart({ submitted: false });
  };

  const handleClear = () => {
    setDraft("");
    setPart({ draft: "", submitted: false, checked: [] });
  };

  const toggleRubricItem = (index: number) => {
    const current = partState.checked;
    const next = current.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index].sort((a, b) => a - b);
    setPart({ checked: next });
  };

  const earned =
    part.rubric.length === 0
      ? part.points
      : Math.round((partState.checked.length / part.rubric.length) * part.points * 10) / 10;

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-medium leading-relaxed">
          <span className="mr-1 font-mono text-muted-foreground">({part.label})</span>
          {part.question}
        </p>
        <div className="flex items-center gap-2">
          {partState.submitted && (
            <Badge variant="secondary" className="font-mono">
              {earned}/{part.points}
            </Badge>
          )}
          <Badge variant="outline">{part.points} pt{part.points === 1 ? "" : "s"}</Badge>
        </div>
      </div>

      {!partState.submitted ? (
        <div className="space-y-2">
          <Label
            htmlFor={`${problem.id}-${part.label}-response`}
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Your response
          </Label>
          <textarea
            id={`${problem.id}-${part.label}-response`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              if (draft !== partState.draft) {
                setPart({ draft });
              }
            }}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Write your answer here. Show your work and reasoning. Ctrl/Cmd+Enter to submit."
            className="min-h-28 w-full resize-y rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed outline-none ring-ring/50 transition focus-visible:ring-3"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!draft.trim()}>
              Submit Response
            </Button>
            {draft.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setDraft("")}>
                Clear
              </Button>
            )}
            <span className="ml-auto text-[11px] text-muted-foreground">
              {draft.length} characters · autosaved on blur
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Your response
            </p>
            <p className="whitespace-pre-wrap text-foreground/90">{partState.draft}</p>
          </div>

          <div className="rounded-lg border border-dashed bg-background p-3 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Self-score against rubric
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                {partState.checked.length}/{part.rubric.length} items
              </span>
            </div>
            <ul className="space-y-1.5">
              {part.rubric.map((item, index) => {
                const checked = partState.checked.includes(index);
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggleRubricItem(index)}
                      className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-muted ${
                        checked ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                          checked
                            ? "border-green-500 bg-green-500/20 text-green-600 dark:text-green-400"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Sample response
            </p>
            <p className="whitespace-pre-wrap text-muted-foreground">{part.sampleResponse}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleResubmit}>
              Edit response
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FrqProblemCard({ problem }: { problem: PracticeFrqProblem }) {
  const [state, setState] = useLocalStorage<FrqProblemState>(
    `frq-state:v1:${problem.id}`,
    EMPTY_FRQ_STATE,
  );

  const submittedCount = problemPartsSubmitted(problem, state);
  const totalParts = problem.parts.length;
  const totalPoints = problemTotalPoints(problem);
  const earnedPoints = Math.round(problemEarnedPoints(problem, state) * 10) / 10;
  const allSubmitted = submittedCount === totalParts;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{problem.title}</CardTitle>
            <CardDescription>{problem.scenario}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.difficulty && (
              <Badge
                variant="outline"
                className={`capitalize ${difficultyBadgeClass(problem.difficulty)}`}
              >
                {problem.difficulty}
              </Badge>
            )}
            {problem.estimatedMinutes && (
              <Badge variant="secondary" className="font-mono">
                ~{problem.estimatedMinutes} min
              </Badge>
            )}
            <Badge variant="outline" className="font-mono">
              {totalPoints} pts
            </Badge>
          </div>
        </div>
        {problem.given.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {problem.given.map((item) => (
              <Badge key={item} variant="secondary" className="font-mono text-[10px]">
                {item}
              </Badge>
            ))}
          </div>
        )}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {submittedCount}/{totalParts} parts submitted
            </span>
            {allSubmitted && (
              <span className="font-mono">
                Self-score {earnedPoints}/{totalPoints}
              </span>
            )}
          </div>
          <Progress
            value={totalParts === 0 ? 0 : (submittedCount / totalParts) * 100}
            className="h-1.5"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {problem.parts.map((part) => (
          <FrqPartBlock
            key={`${problem.id}:${part.label}`}
            problem={problem}
            part={part}
            state={state}
            updateState={setState}
          />
        ))}
        {submittedCount > 0 && (
          <div className="flex justify-end pt-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setState(EMPTY_FRQ_STATE)}
            >
              Reset all parts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type FrqDifficultyFilter = PracticeFrqDifficulty | "all";

const DIFFICULTY_FILTERS: { label: string; value: FrqDifficultyFilter }[] = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

function FrqPracticeView({ unitSlug }: { unitSlug: string }) {
  const bank = useUnitBank(unitSlug);
  const unit = getUnitBySlug(unitSlug);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<FrqDifficultyFilter>("all");

  const filteredProblems = useMemo(() => {
    if (!bank) return [];
    if (difficulty === "all") return bank.frqProblems;
    return bank.frqProblems.filter((problem) => problem.difficulty === difficulty);
  }, [bank, difficulty]);

  if (!bank || bank.frqProblems.length === 0) {
    return null;
  }

  const resolvedIndex = activeId
    ? filteredProblems.findIndex((problem) => problem.id === activeId)
    : -1;
  const activeIndex = resolvedIndex >= 0 ? resolvedIndex : 0;
  const activeProblem = filteredProblems[activeIndex];

  const availableDifficulties = new Set(
    bank.frqProblems.map((problem) => problem.difficulty).filter(Boolean),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{unit?.shortName} FRQ Practice</CardTitle>
              <CardDescription>
                Write your answer, submit, then self-score against the rubric and sample response.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {bank.frqProblems.length} problem{bank.frqProblems.length === 1 ? "" : "s"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableDifficulties.size > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Filter
              </span>
              {DIFFICULTY_FILTERS.map((filter) => {
                const count =
                  filter.value === "all"
                    ? bank.frqProblems.length
                    : bank.frqProblems.filter((p) => p.difficulty === filter.value).length;
                if (filter.value !== "all" && count === 0) return null;
                return (
                  <Button
                    key={filter.value}
                    size="xs"
                    variant={filter.value === difficulty ? "default" : "outline"}
                    onClick={() => setDifficulty(filter.value)}
                  >
                    {filter.label}
                    <span className="ml-1 font-mono text-[10px] opacity-70">{count}</span>
                  </Button>
                );
              })}
            </div>
          )}
          <Separator />
          <div className="flex flex-wrap gap-2">
            {filteredProblems.map((problem) => (
              <FrqProblemNavButton
                key={problem.id}
                problem={problem}
                isActive={problem.id === activeProblem?.id}
                onSelect={() => setActiveId(problem.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      {activeProblem ? (
        <>
          <FrqProblemCard key={activeProblem.id} problem={activeProblem} />
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={activeIndex <= 0}
              onClick={() => {
                const next = filteredProblems[activeIndex - 1];
                if (next) setActiveId(next.id);
              }}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Problem {activeIndex + 1} of {filteredProblems.length}
            </span>
            <Button
              size="sm"
              disabled={activeIndex >= filteredProblems.length - 1}
              onClick={() => {
                const next = filteredProblems[activeIndex + 1];
                if (next) setActiveId(next.id);
              }}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No FRQs match the current filter.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FrqProblemNavButton({
  problem,
  isActive,
  onSelect,
}: {
  problem: PracticeFrqProblem;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [state] = useLocalStorage<FrqProblemState>(
    `frq-state:v1:${problem.id}`,
    EMPTY_FRQ_STATE,
  );
  const submitted = problemPartsSubmitted(problem, state);
  const total = problem.parts.length;
  const complete = submitted === total && total > 0;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onSelect}
      className="gap-1.5"
    >
      <span>{problem.title}</span>
      <span
        className={`rounded-full px-1.5 font-mono text-[10px] ${
          isActive
            ? "bg-primary-foreground/20"
            : complete
              ? "bg-green-500/15 text-green-600 dark:text-green-400"
              : "bg-muted"
        }`}
      >
        {submitted}/{total}
      </span>
    </Button>
  );
}

export function createUnitPracticeQuiz(unitSlug: string) {
  return function UnitPracticeQuiz() {
    return (
      <ErrorBoundary fallbackLabel="This practice quiz failed to load">
        <PracticeQuizView unitSlug={unitSlug} />
      </ErrorBoundary>
    );
  };
}

export function createUnitTimedTest(unitSlug: string) {
  return function UnitTimedTest() {
    return (
      <ErrorBoundary fallbackLabel="This timed test failed to load">
        <TimedTestView unitSlug={unitSlug} />
      </ErrorBoundary>
    );
  };
}

export function createUnitFrqPractice(unitSlug: string) {
  return function UnitFrqPractice() {
    return (
      <ErrorBoundary fallbackLabel="This FRQ practice failed to load">
        <FrqPracticeView unitSlug={unitSlug} />
      </ErrorBoundary>
    );
  };
}
