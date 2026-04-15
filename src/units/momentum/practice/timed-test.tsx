"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

interface TestQuestion {
  question: string;
  choices: string[];
  correct: number;
}

const testQuestions: TestQuestion[] = [
  { question: "A 10 kg object at 3 m/s has momentum of:", choices: ["3.3 kg·m/s", "13 kg·m/s", "30 kg·m/s", "300 kg·m/s"], correct: 2 },
  { question: "Impulse has the same units as:", choices: ["Force", "Energy", "Momentum", "Acceleration"], correct: 2 },
  { question: "A 5 kg object at rest is hit with an impulse of 20 N·s. Its final speed is:", choices: ["4 m/s", "100 m/s", "0.25 m/s", "20 m/s"], correct: 0 },
  { question: "In a perfectly inelastic collision, objects:", choices: ["Bounce apart elastically", "Stick together", "Explode", "Pass through each other"], correct: 1 },
  { question: "Conservation of momentum requires:", choices: ["No friction", "No external net force on the system", "Elastic collision", "Equal masses"], correct: 1 },
  { question: "A 2 kg ball at 6 m/s hits a wall and bounces back at 4 m/s. The change in momentum is:", choices: ["-20 kg·m/s", "-4 kg·m/s", "20 kg·m/s", "2 kg·m/s"], correct: 0 },
  { question: "In an explosion from rest, the total momentum after is:", choices: ["Positive", "Negative", "Zero", "Depends on masses"], correct: 2 },
  { question: "Doubling the mass while halving the velocity changes momentum by a factor of:", choices: ["0.5", "1 (unchanged)", "2", "4"], correct: 1 },
  { question: "A 1000 kg car at 20 m/s and a 2000 kg truck at 10 m/s have:", choices: ["Same KE", "Same momentum", "Different momentum", "Same speed"], correct: 1 },
  { question: "Which is NOT true of elastic collisions?", choices: ["Momentum conserved", "KE conserved", "Objects stick together", "Relative speed conserved"], correct: 2 },
  { question: "An astronaut throws a ball in space. The astronaut recoils because of:", choices: ["Gravity", "Conservation of momentum", "Air resistance", "Conservation of energy"], correct: 1 },
  { question: "The area under a F vs t graph gives:", choices: ["Work", "Impulse", "Power", "Acceleration"], correct: 1 },
  { question: "A 6 kg object at 5 m/s collides with a 4 kg object at rest (perfectly inelastic). vf =", choices: ["2 m/s", "3 m/s", "5 m/s", "10 m/s"], correct: 1 },
  { question: "If net external force is zero, which can change?", choices: ["Total momentum", "Individual momenta", "Total KE must be constant", "System mass"], correct: 1 },
  { question: "A bouncing ball vs. a ball that sticks: which has greater impulse from the floor?", choices: ["Bouncing ball", "Sticking ball", "Same impulse", "Cannot determine"], correct: 0 },
];

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(testQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!started || submitted) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        setSubmitted(true);
      } else {
        setTimeLeft((t) => t - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [started, submitted, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const selectAnswer = useCallback((qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = aIdx;
      return next;
    });
  }, [submitted]);

  const score = answers.reduce<number>((s, a, i) => s + (a === testQuestions[i].correct ? 1 : 0), 0);
  const answeredCount = answers.filter((a) => a !== null).length;

  if (!started) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Timed Test: Linear Momentum</CardTitle>
            <CardDescription>15 questions in 15 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>15 multiple-choice questions</li>
              <li>15-minute time limit</li>
              <li>Auto-submits when time runs out</li>
              <li>No going back after submission</li>
            </ul>
            <Button onClick={() => setStarted(true)} className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-5xl font-bold text-purple-500">{score}/{testQuestions.length}</div>
            <Progress value={(score / testQuestions.length) * 100} className="h-3" />
            <p className="text-muted-foreground">
              {score >= 13 ? "Excellent — you're exam-ready!" :
               score >= 10 ? "Good — review your mistakes." :
               "Keep studying and retake the test."}
            </p>
          </CardContent>
        </Card>

        {testQuestions.map((q, i) => (
          <Card key={i} className={answers[i] === q.correct ? "border-green-500/30" : "border-red-500/30"}>
            <CardContent className="pt-4 space-y-2">
              <p className="font-medium text-sm">{i + 1}. {q.question}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {q.choices.map((c, ci) => (
                  <div
                    key={ci}
                    className={`p-2 rounded ${ci === q.correct ? "bg-green-500/20 font-semibold" : ci === answers[i] ? "bg-red-500/20" : "bg-muted"}`}
                  >
                    {String.fromCharCode(65 + ci)}. {c}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={() => { setStarted(false); setSubmitted(false); setTimeLeft(15 * 60); setAnswers(new Array(testQuestions.length).fill(null)); }}>
          Retake Test
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Time Remaining</Label>
            <Badge variant={timeLeft < 120 ? "destructive" : "secondary"}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </Badge>
          </div>
          <Progress value={(timeLeft / (15 * 60)) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {answeredCount}/{testQuestions.length} answered
          </p>
        </CardContent>
      </Card>

      {testQuestions.map((q, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-3">
            <p className="font-medium">{i + 1}. {q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.choices.map((c, ci) => (
                <Button
                  key={ci}
                  variant={answers[i] === ci ? "default" : "outline"}
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => selectAnswer(i, ci)}
                >
                  <span className="font-mono mr-2">{String.fromCharCode(65 + ci)}.</span> {c}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={() => setSubmitted(true)} className="w-full" size="lg" variant="destructive">
        Submit Test ({answeredCount}/{testQuestions.length} answered)
      </Button>
    </div>
  );
}

export default TimedTest;
