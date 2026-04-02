"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Problem {
  question: string;
  answer: string;
  steps: string[];
  topic: string;
}

function randomBetween(min: number, max: number, decimals = 1): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}

function generateProblem(): Problem {
  const type = Math.floor(Math.random() * 5);
  switch (type) {
    case 0: {
      const m = randomBetween(0.5, 5);
      const k = randomBetween(20, 200, 0);
      const T = 2 * Math.PI * Math.sqrt(m / k);
      return {
        question: `A ${m} kg mass is attached to a spring with k = ${k} N/m. Find the period of oscillation.`,
        answer: `T = ${T.toFixed(3)} s`,
        steps: [
          `Use T = 2pi * sqrt(m/k)`,
          `T = 2pi * sqrt(${m}/${k})`,
          `T = 2pi * ${Math.sqrt(m / k).toFixed(4)}`,
          `T = ${T.toFixed(3)} s`,
        ],
        topic: "spring-mass",
      };
    }
    case 1: {
      const L = randomBetween(0.3, 3);
      const T = 2 * Math.PI * Math.sqrt(L / 9.81);
      return {
        question: `Find the period of a simple pendulum with length ${L} m on Earth.`,
        answer: `T = ${T.toFixed(3)} s`,
        steps: [
          `Use T = 2pi * sqrt(L/g)`,
          `T = 2pi * sqrt(${L}/9.81)`,
          `T = 2pi * ${Math.sqrt(L / 9.81).toFixed(4)}`,
          `T = ${T.toFixed(3)} s`,
        ],
        topic: "pendulum",
      };
    }
    case 2: {
      const k = randomBetween(30, 150, 0);
      const A = randomBetween(0.05, 0.3, 2);
      const E = 0.5 * k * A * A;
      return {
        question: `A spring (k = ${k} N/m) is stretched ${A} m from equilibrium. What is the total energy?`,
        answer: `E = ${E.toFixed(3)} J`,
        steps: [
          `Use E = 1/2 * k * A^2`,
          `E = 0.5 * ${k} * (${A})^2`,
          `E = 0.5 * ${k} * ${(A * A).toFixed(4)}`,
          `E = ${E.toFixed(3)} J`,
        ],
        topic: "energy-shm",
      };
    }
    case 3: {
      const f = randomBetween(0.5, 5);
      const omega = 2 * Math.PI * f;
      const A = randomBetween(0.02, 0.2, 2);
      const vMax = A * omega;
      return {
        question: `An object oscillates at ${f} Hz with amplitude ${A} m. What is the maximum velocity?`,
        answer: `v_max = ${vMax.toFixed(3)} m/s`,
        steps: [
          `omega = 2pi * f = 2pi * ${f} = ${omega.toFixed(3)} rad/s`,
          `v_max = A * omega`,
          `v_max = ${A} * ${omega.toFixed(3)}`,
          `v_max = ${vMax.toFixed(3)} m/s`,
        ],
        topic: "shm-graphs",
      };
    }
    default: {
      const f = randomBetween(1, 4);
      const omega = 2 * Math.PI * f;
      const A = randomBetween(0.05, 0.3, 2);
      const aMax = A * omega * omega;
      return {
        question: `An object oscillates at ${f} Hz with amplitude ${A} m. What is the maximum acceleration?`,
        answer: `a_max = ${aMax.toFixed(2)} m/s^2`,
        steps: [
          `omega = 2pi * f = 2pi * ${f} = ${omega.toFixed(3)} rad/s`,
          `a_max = A * omega^2`,
          `a_max = ${A} * (${omega.toFixed(3)})^2`,
          `a_max = ${aMax.toFixed(2)} m/s^2`,
        ],
        topic: "shm-graphs",
      };
    }
  }
}

export function ProblemGenerator({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [showSolution, setShowSolution] = useState(false);
  const [count, setCount] = useState(0);

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
            <Badge variant="secondary">Problems solved: {count}</Badge>
          </div>
          <CardDescription>
            Randomly generated oscillation problems. Try solving before viewing
            the solution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-slate-50">
            <CardContent className="pt-4">
              <Badge variant="outline" className="mb-2">{problem.topic}</Badge>
              <p className="text-lg">{problem.question}</p>
            </CardContent>
          </Card>

          {!showSolution ? (
            <Button onClick={() => setShowSolution(true)} variant="outline" className="w-full">
              Show Solution
            </Button>
          ) : (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 space-y-2">
                <p className="font-semibold text-green-900">Solution</p>
                {problem.steps.map((step, i) => (
                  <p key={i} className="font-mono text-sm text-green-800">
                    {i + 1}. {step}
                  </p>
                ))}
                <Separator />
                <p className="text-lg font-bold text-green-900">{problem.answer}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={newProblem} className="flex-1">
              New Problem
            </Button>
            <Button onClick={onComplete} disabled={isComplete} variant="outline" className="flex-1">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
