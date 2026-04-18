"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhysicsText } from "@/components/ui/physics-text";

interface Problem {
  question: string;
  answer: string;
  hint: string;
  topic: string;
}

function generateProblem(): Problem {
  const templates = [
    () => {
      const m = +(Math.random() * 5 + 1).toFixed(1);
      const r = +(Math.random() * 0.4 + 0.1).toFixed(2);
      const omega = +(Math.random() * 15 + 2).toFixed(1);
      const I = 0.5 * m * r * r;
      const KE = 0.5 * I * omega * omega;
      return {
        question: `A solid cylinder of mass ${m} kg and radius ${r} m spins at ${omega} rad/s. Find its rotational kinetic energy.`,
        answer: `I = (1/2)MR² = (1/2)(${m})(${r}²) = ${I.toFixed(4)} kg·m². KE = (1/2)Iω² = (1/2)(${I.toFixed(4)})(${omega}²) = ${KE.toFixed(2)} J`,
        hint: "Use I = (1/2)MR² for a solid cylinder, then KE = (1/2)Iω².",
        topic: "rotational-ke",
      };
    },
    () => {
      const I1 = +(Math.random() * 4 + 2).toFixed(1);
      const omega1 = +(Math.random() * 8 + 2).toFixed(1);
      const I2 = +(Math.random() * 2 + 0.5).toFixed(1);
      const L = I1 * omega1;
      const omega2 = L / I2;
      return {
        question: `A system has initial I = ${I1} kg·m² and ω = ${omega1} rad/s. If I changes to ${I2} kg·m² with no external torque, find the new ω.`,
        answer: `L = I₁ω₁ = (${I1})(${omega1}) = ${L.toFixed(1)} kg·m²/s. ω₂ = L/I₂ = ${L.toFixed(1)}/${I2} = ${omega2.toFixed(2)} rad/s`,
        hint: "Use conservation of angular momentum: I₁ω₁ = I₂ω₂.",
        topic: "conservation-angular",
      };
    },
    () => {
      const m = +(Math.random() * 3 + 0.5).toFixed(1);
      const M = +(Math.random() * 2 + 0.5).toFixed(1);
      const g = 9.8;
      const a = (m * g) / (m + M / 2);
      const T = m * (g - a);
      return {
        question: `A ${m} kg mass hangs from a string wrapped around a solid disk pulley of mass ${M} kg. Find the acceleration and tension.`,
        answer: `a = mg/(m + M/2) = (${m})(9.8)/(${m} + ${(M / 2).toFixed(1)}) = ${a.toFixed(2)} m/s². T = m(g-a) = ${m}(9.8 - ${a.toFixed(2)}) = ${T.toFixed(2)} N`,
        hint: "Use a = mg/(m + M/2) for a mass on a solid disk pulley.",
        topic: "combined-rotation",
      };
    },
    () => {
      const h = +(Math.random() * 3 + 0.5).toFixed(1);
      const g = 9.8;
      const shapes = [
        { name: "solid sphere", c: 0.4 },
        { name: "solid cylinder", c: 0.5 },
        { name: "hollow sphere", c: 2 / 3 },
        { name: "thin hoop", c: 1.0 },
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const v = Math.sqrt((2 * g * h) / (1 + shape.c));
      return {
        question: `A ${shape.name} rolls without slipping down a ${h} m high incline. Find its speed at the bottom.`,
        answer: `v = √(2gh/(1+c)) = √(2(9.8)(${h})/(1+${shape.c.toFixed(2)})) = ${v.toFixed(2)} m/s`,
        hint: `Use energy conservation: mgh = (1/2)mv²(1+c), where c = ${shape.c.toFixed(2)} for a ${shape.name}.`,
        topic: "rolling-motion",
      };
    },
    () => {
      const I = +(Math.random() * 5 + 1).toFixed(1);
      const omega = +(Math.random() * 10 + 2).toFixed(1);
      const L = I * omega;
      return {
        question: `Calculate the angular momentum of an object with I = ${I} kg·m² rotating at ${omega} rad/s.`,
        answer: `L = Iω = (${I})(${omega}) = ${L.toFixed(1)} kg·m²/s`,
        hint: "Angular momentum L = Iω.",
        topic: "angular-momentum",
      };
    },
  ];

  return templates[Math.floor(Math.random() * templates.length)]();
}

export function ProblemGenerator() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [count, setCount] = useState(1);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setShowAnswer(false);
    setShowHint(false);
    setCount((c) => c + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-400">Problem Generator</h2>
        <Badge className="bg-gray-700">Problem #{count}</Badge>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg"><PhysicsText display={false} className="inline">{problem.question}</PhysicsText></CardTitle>
          <Badge className="bg-teal-900 text-teal-300 w-fit">{problem.topic}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {showHint && !showAnswer && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
              <p className="text-yellow-300 text-sm font-bold">Hint:</p>
              <PhysicsText display={false} className="text-gray-300 text-sm">{problem.hint}</PhysicsText>
            </div>
          )}

          {showAnswer && (
            <div className="p-4 bg-teal-900/20 border border-teal-800 rounded-lg">
              <p className="text-teal-300 font-bold mb-2">Solution:</p>
              <PhysicsText display={false} className="text-gray-300 text-sm">{problem.answer}</PhysicsText>
            </div>
          )}

          <div className="flex gap-3">
            {!showHint && !showAnswer && (
              <Button
                onClick={() => setShowHint(true)}
                variant="outline"
                className="border-yellow-700 text-yellow-300 hover:bg-yellow-900/20"
              >
                Show Hint
              </Button>
            )}
            {!showAnswer && (
              <Button
                onClick={() => setShowAnswer(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Show Answer
              </Button>
            )}
            <Button
              onClick={nextProblem}
              variant="outline"
              className="border-teal-700 text-teal-300 hover:bg-teal-900/20"
            >
              New Problem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
