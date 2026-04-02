"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TimedQuestion {
  id: number;
  question: string;
  choices: string[];
  correct: number;
}

const testQuestions: TimedQuestion[] = [
  { id: 1, question: "Work is defined as:", choices: ["Force times velocity", "Force times displacement times cos(theta)", "Mass times acceleration", "Power times distance"], correct: 1 },
  { id: 2, question: "A 3 kg object moves at 4 m/s. Its KE is:", choices: ["6 J", "12 J", "24 J", "48 J"], correct: 2 },
  { id: 3, question: "Gravitational PE depends on:", choices: ["Speed", "Mass, g, and height", "Spring constant", "Time"], correct: 1 },
  { id: 4, question: "1 watt equals:", choices: ["1 J", "1 N*m", "1 J/s", "1 kg*m/s"], correct: 2 },
  { id: 5, question: "Which force is conservative?", choices: ["Friction", "Air resistance", "Gravity", "Applied push"], correct: 2 },
  { id: 6, question: "A ball thrown upward: at max height, KE is:", choices: ["Maximum", "Zero", "Equal to PE", "Negative"], correct: 1 },
  { id: 7, question: "The area under a force-displacement graph gives:", choices: ["Power", "Acceleration", "Work", "Momentum"], correct: 2 },
  { id: 8, question: "Doubling mass while keeping speed constant:", choices: ["Doubles KE", "Quadruples KE", "Halves KE", "No change to KE"], correct: 0 },
  { id: 9, question: "A spring stretched twice as far stores:", choices: ["Twice the PE", "Four times the PE", "Half the PE", "Same PE"], correct: 1 },
  { id: 10, question: "Mechanical energy is conserved when:", choices: ["Friction acts", "Only conservative forces act", "Velocity is constant", "Net force is zero"], correct: 1 },
];

const TIME_LIMIT = 600; // 10 minutes in seconds

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && !submitted && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setSubmitted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [started, submitted, timeLeft]);

  const handleSelect = (qId: number, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setStarted(false);
    setSubmitted(false);
    setAnswers({});
    setTimeLeft(TIME_LIMIT);
  };

  const score = testQuestions.filter((q) => answers[q.id] === q.correct).length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timed Test: Work, Energy, and Power</CardTitle>
          <CardDescription>
            10 questions in 10 minutes. Test your speed and accuracy under
            exam-like conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setStarted(true)} className="w-full">
            Start Timed Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timed Test</CardTitle>
            <Badge variant={timeLeft < 60 ? "destructive" : "outline"} className="text-lg px-3 py-1">
              {mins}:{secs.toString().padStart(2, "0")}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {testQuestions.map((q, qi) => (
        <Card key={q.id} className={submitted ? (answers[q.id] === q.correct ? "border-green-300" : "border-red-300") : ""}>
          <CardContent className="pt-4">
            <p className="font-medium mb-2">{qi + 1}. {q.question}</p>
            <div className="space-y-1">
              {q.choices.map((c, ci) => (
                <button
                  key={ci}
                  onClick={() => handleSelect(q.id, ci)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm ${
                    answers[q.id] === ci
                      ? submitted
                        ? ci === q.correct ? "bg-green-200 font-semibold" : "bg-red-200"
                        : "bg-amber-200 font-semibold"
                      : submitted && ci === q.correct
                        ? "bg-green-100"
                        : "hover:bg-gray-100"
                  }`}
                >
                  {String.fromCharCode(65 + ci)}. {c}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Separator />

      {!submitted ? (
        <Button onClick={handleSubmit} className="w-full">
          Submit Test ({Object.keys(answers).length}/{testQuestions.length})
        </Button>
      ) : (
        <Card>
          <CardContent className="pt-4 text-center space-y-3">
            <p className="text-2xl font-bold">
              Score: {score}/{testQuestions.length} ({Math.round((score / testQuestions.length) * 100)}%)
            </p>
            <p className="text-sm text-muted-foreground">
              Time used: {Math.floor((TIME_LIMIT - timeLeft) / 60)}m {(TIME_LIMIT - timeLeft) % 60}s
            </p>
            <Button onClick={handleReset} variant="outline">
              Retake Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
