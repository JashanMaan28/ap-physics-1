"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const timedQuestions = [
  {
    question: "What is the net force on a 6 kg object accelerating at 3 m/s²?",
    options: ["2 N", "9 N", "18 N", "54 N"],
    correct: 2,
  },
  {
    question: "A box is pushed with 40 N but doesn't move. Static friction is:",
    options: ["0 N", "40 N", "Greater than 40 N", "Less than 40 N"],
    correct: 1,
  },
  {
    question: "The normal force on a 10 kg block on a 45° incline is approximately:",
    options: ["98 N", "69.3 N", "49 N", "0 N"],
    correct: 1,
  },
  {
    question: "In an Atwood machine (5 kg and 3 kg), the acceleration is:",
    options: ["2.45 m/s²", "4.9 m/s²", "1.225 m/s²", "9.8 m/s²"],
    correct: 0,
  },
  {
    question: "A string can hold 100 N. What is the maximum mass it can support hanging at rest?",
    options: ["100 kg", "10.2 kg", "9.8 kg", "980 kg"],
    correct: 1,
  },
  {
    question: "Two forces of 30 N and 40 N act perpendicular to each other. The net force is:",
    options: ["70 N", "50 N", "10 N", "35 N"],
    correct: 1,
  },
  {
    question: "A 2 kg block on a frictionless 30° incline has what acceleration?",
    options: ["9.8 m/s²", "4.9 m/s²", "8.49 m/s²", "2.45 m/s²"],
    correct: 1,
  },
  {
    question: "Newton's First Law is also known as:",
    options: ["Law of Action-Reaction", "Law of Inertia", "Law of Acceleration", "Law of Gravity"],
    correct: 1,
  },
  {
    question: "A 15 N force accelerates a 5 kg box at 1 m/s². The friction force is:",
    options: ["10 N", "5 N", "15 N", "20 N"],
    correct: 0,
  },
  {
    question: "In an Atwood machine, if both masses equal 4 kg, the tension is:",
    options: ["0 N", "19.6 N", "39.2 N", "78.4 N"],
    correct: 2,
  },
];

const TOTAL_TIME = 15 * 60; // 15 minutes in seconds

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(timedQuestions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        setFinished(true);
      } else {
        setTimeLeft((t) => t - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [started, finished, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSelect = useCallback(
    (idx: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentQ] = idx;
        return next;
      });
    },
    [currentQ]
  );

  const handleSubmit = () => setFinished(true);

  const score = answers.reduce(
    (acc: number, ans, idx) => acc + (ans === timedQuestions[idx].correct ? 1 : 0),
    0
  );

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timed Test: Dynamics</CardTitle>
          <CardDescription>
            10 questions, 15 minutes. Your time starts when you click begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setStarted(true)} size="lg" className="w-full">
            Begin Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const pct = Math.round((score / timedQuestions.length) * 100);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold">{score} / {timedQuestions.length}</p>
            <p className="text-lg text-muted-foreground">{pct}%</p>
            <Badge variant={pct >= 70 ? "default" : "destructive"} className="mt-2">
              {pct >= 90 ? "Excellent!" : pct >= 70 ? "Good job!" : "Keep practicing!"}
            </Badge>
          </div>
          <Separator />
          <div className="space-y-3">
            {timedQuestions.map((q, idx) => (
              <div key={idx} className="rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <Badge variant={answers[idx] === q.correct ? "default" : "destructive"}>
                    {answers[idx] === q.correct ? "Correct" : "Wrong"}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{q.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Your answer: {answers[idx] !== null ? q.options[answers[idx]!] : "No answer"} |
                      Correct: {q.options[q.correct]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => { setStarted(false); setFinished(false); setCurrentQ(0); setAnswers(Array(timedQuestions.length).fill(null)); setTimeLeft(TOTAL_TIME); }} className="w-full">
            Retake Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  const q = timedQuestions[currentQ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Question {currentQ + 1} / {timedQuestions.length}</Badge>
        <Badge variant={timeLeft < 120 ? "destructive" : "secondary"}>
          {minutes}:{seconds.toString().padStart(2, "0")}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg font-medium">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <Button
                key={idx}
                variant={answers[currentQ] === idx ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => handleSelect(idx)}
              >
                {String.fromCharCode(65 + idx)}. {opt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ((c) => c - 1)}>
          Previous
        </Button>
        {currentQ < timedQuestions.length - 1 ? (
          <Button onClick={() => setCurrentQ((c) => c + 1)} className="flex-1">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1" variant="destructive">
            Submit Test
          </Button>
        )}
      </div>

      {/* Question navigator */}
      <div className="flex gap-1 flex-wrap">
        {timedQuestions.map((_, idx) => (
          <Button
            key={idx}
            variant={answers[idx] !== null ? "default" : "outline"}
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setCurrentQ(idx)}
          >
            {idx + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
