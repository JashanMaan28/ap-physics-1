"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
}

const testQuestions: TestQuestion[] = [
  {
    question: "KE_rot = ?",
    choices: ["(1/2)mv²", "(1/2)Iω²", "Iω", "mgh"],
    correctIndex: 1,
  },
  {
    question: "Angular momentum L = ?",
    choices: ["mv", "Iα", "Iω", "(1/2)Iω²"],
    correctIndex: 2,
  },
  {
    question:
      "A disk (I=0.5MR²) rolls without slipping. Total KE in terms of mv² is:",
    choices: ["(1/2)mv²", "(3/4)mv²", "(7/10)mv²", "mv²"],
    correctIndex: 1,
  },
  {
    question:
      "If no net external torque acts on a system, which quantity is conserved?",
    choices: [
      "Rotational KE",
      "Angular velocity",
      "Angular momentum",
      "Moment of inertia",
    ],
    correctIndex: 2,
  },
  {
    question:
      "A solid sphere has what fraction of its total rolling KE as rotational?",
    choices: ["1/2", "2/7", "1/3", "2/5"],
    correctIndex: 1,
  },
  {
    question: "The unit of moment of inertia is:",
    choices: ["kg·m", "kg·m²", "kg·m/s", "N·m"],
    correctIndex: 1,
  },
  {
    question:
      "For a yo-yo (solid disk) falling under gravity, the acceleration is:",
    choices: ["g", "g/2", "2g/3", "g/3"],
    correctIndex: 2,
  },
  {
    question: "Doubling both I and ω multiplies the angular momentum by:",
    choices: ["2", "4", "1", "8"],
    correctIndex: 1,
  },
  {
    question:
      "Which reaches the bottom of an incline first (rolling without slipping, same m and R)?",
    choices: ["Hoop", "Hollow sphere", "Solid cylinder", "Solid sphere"],
    correctIndex: 3,
  },
  {
    question:
      "In an Atwood machine with a massive pulley, the two tensions are:",
    choices: ["Equal", "Unequal", "Both zero", "Both equal to mg"],
    correctIndex: 1,
  },
];

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(testQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && !submitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setSubmitted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const selectAnswer = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = aIdx;
      return next;
    });
  };

  const score = answers.reduce<number>(
    (s, a, i) => (s ?? 0) + (a === testQuestions[i].correctIndex ? 1 : 0),
    0
  );

  if (!started) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-teal-400">Timed Test</h2>
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="text-center py-12 space-y-4">
            <p className="text-gray-300 text-lg">
              {testQuestions.length} questions &middot; 5 minutes
            </p>
            <p className="text-gray-500">
              Test your speed and accuracy on rotating systems concepts.
            </p>
            <Button
              onClick={() => setStarted(true)}
              className="bg-teal-600 hover:bg-teal-700 text-lg px-8 py-3"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    const pct = Math.round((score / testQuestions.length) * 100);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-teal-400">Test Results</h2>
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="text-center py-8 space-y-4">
            <p className="text-5xl font-bold text-white">{pct}%</p>
            <p className="text-gray-400">
              {score} / {testQuestions.length} correct in{" "}
              {formatTime(300 - timeLeft)}
            </p>
            <Badge
              className={
                pct >= 80
                  ? "bg-green-600"
                  : pct >= 60
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }
            >
              {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Review"}
            </Badge>
            <div>
              <Button
                onClick={() => {
                  setStarted(false);
                  setSubmitted(false);
                  setTimeLeft(300);
                  setAnswers(new Array(testQuestions.length).fill(null));
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Retake
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Review answers */}
        <div className="space-y-3">
          {testQuestions.map((q, i) => (
            <Card
              key={i}
              className={`border ${
                answers[i] === q.correctIndex
                  ? "border-green-700"
                  : "border-red-700"
              } bg-gray-900`}
            >
              <CardContent className="py-3">
                <p className="text-white text-sm font-bold">{q.question}</p>
                <p className="text-green-400 text-xs mt-1">
                  Correct: {q.choices[q.correctIndex]}
                </p>
                {answers[i] !== q.correctIndex && answers[i] !== null && (
                  <p className="text-red-400 text-xs">
                    Your answer: {q.choices[answers[i]!]}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-gray-950 py-2 z-10">
        <h2 className="text-xl font-bold text-teal-400">Timed Test</h2>
        <div className="flex items-center gap-3">
          <Badge
            className={timeLeft < 60 ? "bg-red-600 animate-pulse" : "bg-gray-700"}
          >
            {formatTime(timeLeft)}
          </Badge>
          <Button
            onClick={() => setSubmitted(true)}
            className="bg-teal-600 hover:bg-teal-700"
            size="sm"
          >
            Submit
          </Button>
        </div>
      </div>

      {testQuestions.map((q, i) => (
        <Card key={i} className="bg-gray-900 border-gray-700">
          <CardContent className="py-3 space-y-2">
            <p className="text-white text-sm font-bold">
              {i + 1}. {q.question}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {q.choices.map((c, j) => (
                <button
                  key={j}
                  onClick={() => selectAnswer(i, j)}
                  className={`text-left text-sm p-2 rounded border ${
                    answers[i] === j
                      ? "border-teal-500 bg-teal-900/30 text-teal-300"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
