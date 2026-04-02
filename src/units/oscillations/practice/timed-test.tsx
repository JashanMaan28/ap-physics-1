"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface TimedQuestion {
  question: string;
  choices: string[];
  correct: number;
}

const questionPool: TimedQuestion[] = [
  { question: "The period of a spring-mass system T = 2pi*sqrt(m/k). Doubling k does what to T?", choices: ["Doubles T", "Halves T", "Multiplies by sqrt(2)", "Divides by sqrt(2)"], correct: 3 },
  { question: "At x = 0 in SHM, kinetic energy is:", choices: ["Zero", "Maximum", "Equal to PE", "Half of total"], correct: 1 },
  { question: "A pendulum length is quadrupled. The new period is:", choices: ["4T", "2T", "T/2", "T/4"], correct: 1 },
  { question: "The maximum speed in SHM equals:", choices: ["A*omega^2", "A*omega", "A/omega", "omega/A"], correct: 1 },
  { question: "Acceleration in SHM is proportional to:", choices: ["velocity", "negative displacement", "time", "energy"], correct: 1 },
  { question: "Two identical springs in series have effective k:", choices: ["2k", "k/2", "k", "4k"], correct: 1 },
  { question: "The SI unit of spring constant is:", choices: ["kg/s", "N/m", "J/m", "Pa"], correct: 1 },
  { question: "A pendulum's frequency does NOT depend on:", choices: ["length", "gravity", "mass", "all of these"], correct: 2 },
  { question: "In SHM, if E = 1/2 kA^2 = 10 J, KE at x = A/2 is:", choices: ["2.5 J", "5.0 J", "7.5 J", "10 J"], correct: 2 },
  { question: "The phase difference between velocity and acceleration in SHM is:", choices: ["0 deg", "90 deg", "180 deg", "270 deg"], correct: 1 },
];

export function TimedTest({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    if (idx === questionPool[current].correct) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (current < questionPool.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 500);
  };

  if (!started) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Timed Mini-Test: Oscillations</CardTitle>
            <CardDescription>
              {questionPool.length} questions in 5 minutes. Test your speed and
              accuracy on oscillation concepts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStarted(true)} className="w-full" size="lg">
              Start Timed Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questionPool.length) * 100);
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-center">
              {score} / {questionPool.length} ({pct}%)
            </p>
            <p className="text-center text-muted-foreground">
              Time remaining: {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <Progress value={pct} className="h-3" />
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setStarted(false);
                  setCurrent(0);
                  setSelected(null);
                  setScore(0);
                  setFinished(false);
                  setTimeLeft(300);
                }}
                variant="outline"
                className="flex-1"
              >
                Retry
              </Button>
              <Button onClick={onComplete} disabled={isComplete} className="flex-1">
                {isComplete ? "Completed" : "Mark Complete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questionPool[current];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timed Test</CardTitle>
            <Badge variant={timeLeft < 60 ? "destructive" : "secondary"}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </Badge>
          </div>
          <Progress value={((current + 1) / questionPool.length) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Question {current + 1} of {questionPool.length}
          </p>
          <p className="text-lg font-medium">{q.question}</p>
          <div className="space-y-2">
            {q.choices.map((choice, idx) => (
              <Button
                key={idx}
                variant={selected === idx ? (idx === q.correct ? "default" : "destructive") : "outline"}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
              >
                {String.fromCharCode(65 + idx)}. {choice}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
