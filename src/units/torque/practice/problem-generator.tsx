"use client";

import { useState, useCallback } from "react";
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
import { Label } from "@/components/ui/label";

type ProblemType = "torque" | "equilibrium" | "newtonRot" | "kinematics";

interface Problem {
  type: ProblemType;
  question: string;
  answer: number;
  unit: string;
  hint: string;
  solution: string;
}

function randBetween(a: number, b: number, step = 1) {
  const steps = Math.round((b - a) / step);
  return a + Math.round(Math.random() * steps) * step;
}

function generateProblem(): Problem {
  const types: ProblemType[] = ["torque", "equilibrium", "newtonRot", "kinematics"];
  const type = types[Math.floor(Math.random() * types.length)];

  switch (type) {
    case "torque": {
      const r = randBetween(0.1, 2.0, 0.1);
      const F = randBetween(10, 100, 5);
      const angle = randBetween(30, 90, 15);
      const ans = r * F * Math.sin((angle * Math.PI) / 180);
      return {
        type,
        question: `A force of ${F} N is applied at ${r} m from the pivot at an angle of ${angle}\u00B0 to the lever arm. Calculate the torque.`,
        answer: Math.round(ans * 100) / 100,
        unit: "N\u00B7m",
        hint: "Use \u03C4 = rF sin\u03B8. Make sure to convert the angle to radians if needed.",
        solution: `\u03C4 = rF sin\u03B8 = ${r} \u00D7 ${F} \u00D7 sin(${angle}\u00B0) = ${ans.toFixed(2)} N\u00B7m`,
      };
    }
    case "equilibrium": {
      const m1 = randBetween(2, 15, 1);
      const d1 = randBetween(1, 4, 0.5);
      const d2 = randBetween(1, 4, 0.5);
      const m2 = (m1 * d1) / d2;
      return {
        type,
        question: `A ${m1} kg mass sits ${d1} m from the pivot on a seesaw. What mass is needed at ${d2} m on the other side for equilibrium?`,
        answer: Math.round(m2 * 100) / 100,
        unit: "kg",
        hint: "Set \u03A3\u03C4 = 0: m\u2081g d\u2081 = m\u2082g d\u2082. The g cancels.",
        solution: `m\u2081d\u2081 = m\u2082d\u2082 \u2192 ${m1}(${d1}) = m\u2082(${d2}) \u2192 m\u2082 = ${m2.toFixed(2)} kg`,
      };
    }
    case "newtonRot": {
      const tau = randBetween(5, 50, 5);
      const M = randBetween(2, 10, 1);
      const R = randBetween(0.2, 1.0, 0.1);
      const I = 0.5 * M * R * R;
      const alpha = tau / I;
      return {
        type,
        question: `A net torque of ${tau} N\u00B7m is applied to a solid disk (M = ${M} kg, R = ${R} m). What is the angular acceleration? (I_disk = \u00BDMR\u00B2)`,
        answer: Math.round(alpha * 100) / 100,
        unit: "rad/s\u00B2",
        hint: "First find I = (1/2)MR\u00B2, then use \u03B1 = \u03C4/I.",
        solution: `I = \u00BD(${M})(${R}\u00B2) = ${I.toFixed(4)} kg\u00B7m\u00B2. \u03B1 = \u03C4/I = ${tau}/${I.toFixed(4)} = ${alpha.toFixed(2)} rad/s\u00B2`,
      };
    }
    case "kinematics": {
      const w0 = randBetween(0, 10, 1);
      const a = randBetween(1, 8, 1);
      const t = randBetween(2, 8, 1);
      const wf = w0 + a * t;
      return {
        type,
        question: `A wheel starts at \u03C9\u2080 = ${w0} rad/s with constant \u03B1 = ${a} rad/s\u00B2. What is \u03C9 after ${t} s?`,
        answer: wf,
        unit: "rad/s",
        hint: "Use \u03C9 = \u03C9\u2080 + \u03B1t.",
        solution: `\u03C9 = \u03C9\u2080 + \u03B1t = ${w0} + ${a}(${t}) = ${wf} rad/s`,
      };
    }
  }
}

export function ProblemGenerator() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const newProblem = useCallback(() => {
    setProblem(generateProblem());
    setUserAnswer("");
    setShowSolution(false);
    setShowHint(false);
    setResult(null);
  }, []);

  function checkAnswer() {
    const parsed = parseFloat(userAnswer);
    if (isNaN(parsed)) return;
    const tolerance = Math.max(Math.abs(problem.answer) * 0.05, 0.1);
    setResult(Math.abs(parsed - problem.answer) <= tolerance ? "correct" : "incorrect");
    setShowSolution(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problem Generator</CardTitle>
            <Badge variant="outline">{problem.type}</Badge>
          </div>
          <CardDescription>Random torque and rotation problems with instant feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">{problem.question}</p>

          {showHint && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-sm border border-yellow-200 dark:border-yellow-800">
              <strong>Hint:</strong> {problem.hint}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label>Your Answer ({problem.unit})</Label>
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Answer in ${problem.unit}`}
                disabled={showSolution}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {!showSolution && (
              <>
                <Button onClick={checkAnswer} disabled={!userAnswer}>Check</Button>
                <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint}>Hint</Button>
              </>
            )}
          </div>

          {result && (
            <>
              <Separator />
              <div className={`rounded-lg p-3 text-sm ${result === "correct" ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
                <strong>{result === "correct" ? "Correct!" : "Not quite."}</strong>{" "}
                {problem.solution}
              </div>
            </>
          )}

          <Button onClick={newProblem} variant="outline" className="w-full">
            Generate New Problem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
