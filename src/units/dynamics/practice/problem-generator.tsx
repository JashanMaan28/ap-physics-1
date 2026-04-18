"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhysicsText } from "@/components/ui/physics-text";

type Problem = {
  type: string;
  question: string;
  answer: string;
  solution: string;
};

function randomBetween(min: number, max: number, step = 1) {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

function generateProblem(): Problem {
  const type = ["fma", "friction", "incline", "atwood"][Math.floor(Math.random() * 4)];

  if (type === "fma") {
    const m = randomBetween(2, 20, 1);
    const f = randomBetween(10, 200, 5);
    const a = (f / m).toFixed(2);
    return {
      type: "F = ma",
      question: `A ${m} kg object has a net force of ${f} N applied to it. What is the acceleration?`,
      answer: `${a} m/s²`,
      solution: `a = F/m = ${f}/${m} = ${a} m/s²`,
    };
  }

  if (type === "friction") {
    const m = randomBetween(3, 15, 1);
    const mu = (randomBetween(10, 60, 5) / 100);
    const N = m * 9.8;
    const fk = (mu * N).toFixed(1);
    return {
      type: "Friction",
      question: `A ${m} kg block slides on a horizontal surface with μk = ${mu.toFixed(2)}. What is the kinetic friction force?`,
      answer: `${fk} N`,
      solution: `f_k = μk × N = μk × mg = ${mu.toFixed(2)} × ${m} × 9.8 = ${fk} N`,
    };
  }

  if (type === "incline") {
    const m = randomBetween(2, 12, 1);
    const angle = randomBetween(15, 60, 5);
    const theta = (angle * Math.PI) / 180;
    const a = (9.8 * Math.sin(theta)).toFixed(2);
    return {
      type: "Inclined Plane",
      question: `A ${m} kg block slides down a frictionless ${angle}° incline. What is its acceleration?`,
      answer: `${a} m/s²`,
      solution: `a = g sin(${angle}°) = 9.8 × sin(${angle}°) = 9.8 × ${Math.sin(theta).toFixed(3)} = ${a} m/s² (mass cancels)`,
    };
  }

  // atwood
  const m1 = randomBetween(4, 15, 1);
  const m2 = randomBetween(2, m1 - 1, 1);
  const a = (((m1 - m2) * 9.8) / (m1 + m2)).toFixed(2);
  const T = ((2 * m1 * m2 * 9.8) / (m1 + m2)).toFixed(1);
  return {
    type: "Atwood Machine",
    question: `An Atwood machine has masses m₁ = ${m1} kg and m₂ = ${m2} kg. Find the acceleration and tension.`,
    answer: `a = ${a} m/s², T = ${T} N`,
    solution: `a = (m₁-m₂)g/(m₁+m₂) = (${m1}-${m2})×9.8/(${m1}+${m2}) = ${a} m/s²\nT = 2m₁m₂g/(m₁+m₂) = 2×${m1}×${m2}×9.8/${m1 + m2} = ${T} N`,
  };
}

export function ProblemGenerator() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [showSolution, setShowSolution] = useState(false);
  const [count, setCount] = useState(1);

  const newProblem = useCallback(() => {
    setProblem(generateProblem());
    setShowSolution(false);
    setCount((c) => c + 1);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problem Generator</CardTitle>
            <Badge variant="outline">Problem #{count}</Badge>
          </div>
          <CardDescription>
            Randomly generated dynamics problems. Solve on paper, then check.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge>{problem.type}</Badge>
          <PhysicsText display={false} className="text-lg font-medium">{problem.question}</PhysicsText>

          {showSolution ? (
            <>
              <Separator />
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-2 dark:bg-green-500/10 dark:border-green-500/30">
                <p className="font-semibold text-green-900 dark:text-green-200">Answer: {problem.answer}</p>
                <PhysicsText display={false} className="text-sm text-green-800 dark:text-green-300">{problem.solution}</PhysicsText>
              </div>
            </>
          ) : (
            <Button variant="outline" onClick={() => setShowSolution(true)}>
              Show Solution
            </Button>
          )}

          <Separator />
          <Button onClick={newProblem} className="w-full">
            Generate New Problem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
