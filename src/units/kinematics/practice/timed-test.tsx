"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMistakes } from "@/contexts/mistake-context";

interface Question { question: string; choices: string[]; correct: number; topic: string; }

const getTimestamp = () => Date.now();

const questions: Question[] = [
  { topic: "Kinematics", question: "An object starts at rest and accelerates at 4 m/s² for 5 s. Final velocity?", choices: ["10 m/s", "20 m/s", "25 m/s", "40 m/s"], correct: 1 },
  { topic: "Kinematics", question: "A ball is thrown up at 19.6 m/s. Time to reach max height?", choices: ["1 s", "2 s", "4 s", "9.8 s"], correct: 1 },
  { topic: "Kinematics", question: "Displacement of an object with v₀=10 m/s, a=2 m/s², t=3 s?", choices: ["36 m", "39 m", "30 m", "33 m"], correct: 1 },
  { topic: "Kinematics", question: "On a v-t graph, the area under the curve equals:", choices: ["acceleration", "displacement", "force", "velocity"], correct: 1 },
  { topic: "Kinematics", question: "A projectile's horizontal velocity during flight (no air resistance):", choices: ["increases", "decreases", "stays constant", "becomes zero"], correct: 2 },
  { topic: "Kinematics", question: "An object dropped from 80 m. How long to fall? (g≈10 m/s²)", choices: ["2 s", "4 s", "8 s", "16 s"], correct: 1 },
  { topic: "Kinematics", question: "Two objects have same speed but opposite velocities. Same momentum?", choices: ["Yes", "No, opposite", "Only if same mass", "Cannot determine"], correct: 1 },
  { topic: "Kinematics", question: "A car goes 60 km/h for 2 h then 40 km/h for 1 h. Average speed?", choices: ["50 km/h", "53.3 km/h", "46.7 km/h", "48 km/h"], correct: 1 },
  { topic: "Kinematics", question: "At what angle do complementary projectile angles give equal range?", choices: ["Any angle", "Only 45°", "θ and (90°−θ)", "0° and 90°"], correct: 2 },
  { topic: "Kinematics", question: "A positive slope on an x-t graph means:", choices: ["positive velocity", "positive acceleration", "the object is above origin", "the object is speeding up"], correct: 0 },
];

export function TimedTest() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [finished, setFinished] = useState(false);
  const { addMistake } = useMistakes();

  useEffect(() => {
    if (!started || finished) return;
    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        setFinished(true);
      } else {
        setTimeLeft(t => t - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [started, finished, timeLeft]);

  const submit = useCallback(() => {
    answers.forEach((a, i) => {
      if (a !== null && a !== questions[i].correct) {
        addMistake({ unit: "kinematics", topic: questions[i].topic, question: questions[i].question, yourAnswer: questions[i].choices[a], correctAnswer: questions[i].choices[questions[i].correct], timestamp: getTimestamp() });
      }
    });
    setFinished(true);
  }, [answers, addMistake]);

  const score = answers.reduce<number>((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0);
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Timed Mini-Test</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">10 questions · 15 minutes · Kinematics</p>
          <Button onClick={() => setStarted(true)} className="cursor-pointer" size="lg">Start Test</Button>
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Test Complete!</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-4xl font-bold font-mono">{score}/{questions.length}</p>
          <Progress value={(score / questions.length) * 100} className="h-3" />
          <Button onClick={() => { setStarted(false); setFinished(false); setCurrent(0); setAnswers(Array(questions.length).fill(null)); setTimeLeft(15 * 60); }} className="cursor-pointer">Retake</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {current + 1}/{questions.length}</CardTitle>
          <Badge variant={timeLeft < 60 ? "destructive" : "secondary"} className="font-mono">{mins}:{secs.toString().padStart(2, "0")}</Badge>
        </div>
        <Progress value={(current / questions.length) * 100} className="h-1.5" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-medium">{questions[current].question}</p>
        <div className="grid gap-2">
          {questions[current].choices.map((c, i) => (
            <button key={i} onClick={() => { setSelected(i); const newAns = [...answers]; newAns[current] = i; setAnswers(newAns); }}
              className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors ${answers[current] === i ? "border-primary bg-primary/10" : "hover:bg-muted"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {current > 0 && <Button variant="outline" onClick={() => setCurrent(c => c - 1)} className="cursor-pointer">Previous</Button>}
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent(c => c + 1)} className="cursor-pointer">Next</Button>
          ) : (
            <Button onClick={submit} className="cursor-pointer">Submit Test</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
