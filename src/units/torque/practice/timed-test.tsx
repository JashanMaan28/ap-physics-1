"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TimedQuestion {
  question: string;
  options: string[];
  correct: number;
}

const timedQuestions: TimedQuestion[] = [
  { question: "\u03C4 = rF sin\u03B8. If \u03B8 = 0, the torque is:", options: ["Maximum", "Zero", "rF", "F/r"], correct: 1 },
  { question: "Moment of inertia for a solid disk:", options: ["MR\u00B2", "(2/5)MR\u00B2", "(1/2)MR\u00B2", "(1/3)ML\u00B2"], correct: 2 },
  { question: "The rotational analog of F = ma is:", options: ["\u03C4 = I\u03C9", "\u03C4 = I\u03B1", "L = I\u03C9", "W = \u03C4\u03B8"], correct: 1 },
  { question: "An object in rotational equilibrium has:", options: ["\u03C9 = 0", "\u03B1 = 0", "I = 0", "\u03C4 > 0"], correct: 1 },
  { question: "\u03C9 = \u03C9\u2080 + \u03B1t. With \u03C9\u2080=4, \u03B1=3, t=2: \u03C9 = ?", options: ["6", "8", "10", "14"], correct: 2 },
  { question: "1 revolution = ? radians", options: ["\u03C0", "2\u03C0", "\u03C0/2", "4\u03C0"], correct: 1 },
  { question: "Which object reaches the bottom of a ramp first (same m, R)?", options: ["Hoop", "Disk", "Sphere", "All tie"], correct: 2 },
  { question: "If I doubles and \u03C4 stays constant, \u03B1:", options: ["Doubles", "Halves", "Stays same", "Quadruples"], correct: 1 },
  { question: "Torque is measured in:", options: ["N", "J", "N\u00B7m", "kg\u00B7m\u00B2"], correct: 2 },
  { question: "The parallel axis theorem: I = I_cm + ?", options: ["Md", "Md\u00B2", "2Md", "Md\u00B3"], correct: 1 },
];

const TOTAL_TIME = 300; // 5 minutes

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(timedQuestions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [started, finished, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  function selectAnswer(idx: number) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  }

  function submit() {
    setFinished(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function restart() {
    setStarted(false);
    setFinished(false);
    setTimeLeft(TOTAL_TIME);
    setCurrentQ(0);
    setAnswers(new Array(timedQuestions.length).fill(null));
  }

  const score = answers.reduce<number>((acc, a, i) => acc + (a === timedQuestions[i].correct ? 1 : 0), 0);

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timed Test</CardTitle>
          <CardDescription>
            {timedQuestions.length} questions in {TOTAL_TIME / 60} minutes. Test your speed and accuracy!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setStarted(true)} className="w-full">Start Test</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const pct = Math.round((score / timedQuestions.length) * 100);
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-4xl font-bold">{score}/{timedQuestions.length}</p>
            <p className="text-muted-foreground">{pct}% &mdash; Time remaining: {minutes}:{seconds.toString().padStart(2, "0")}</p>
            <Badge variant={pct >= 80 ? "default" : pct >= 60 ? "secondary" : "destructive"}>
              {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Keep Practicing"}
            </Badge>
          </CardContent>
        </Card>
        {timedQuestions.map((q, i) => (
          <Card key={i} className={answers[i] === q.correct ? "border-green-500/30" : "border-red-500/30"}>
            <CardContent className="pt-4 space-y-2">
              <p className="text-sm font-medium">{i + 1}. {q.question}</p>
              <div className="flex gap-2 flex-wrap">
                {q.options.map((opt, oi) => (
                  <Badge
                    key={oi}
                    variant={oi === q.correct ? "default" : oi === answers[i] ? "destructive" : "outline"}
                  >
                    {opt}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={restart} className="w-full">Retake Test</Button>
      </div>
    );
  }

  const q = timedQuestions[currentQ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timed Test</CardTitle>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </Badge>
          </div>
          <CardDescription>
            Question {currentQ + 1} of {timedQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <Button
                key={idx}
                variant={answers[currentQ] === idx ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => selectAnswer(idx)}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </Button>
            ))}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ((c) => c - 1)}>
              Previous
            </Button>
            {currentQ < timedQuestions.length - 1 ? (
              <Button onClick={() => setCurrentQ((c) => c + 1)}>Next</Button>
            ) : (
              <Button onClick={submit} variant="default">Submit Test</Button>
            )}
          </div>
          {/* Question navigation */}
          <div className="flex gap-1 flex-wrap">
            {timedQuestions.map((_, i) => (
              <Button
                key={i}
                variant={i === currentQ ? "default" : answers[i] !== null ? "secondary" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
