"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type Difficulty = "easy" | "medium" | "hard";

interface GeneratedProblem {
  statement: string;
  givens: string[];
  solution: string[];
  answer: string;
  topic: string;
}

function randomBetween(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

function generateProblem(difficulty: Difficulty): GeneratedProblem {
  const templates = {
    easy: [
      () => {
        const m = randomBetween(2, 20);
        const v = randomBetween(3, 30);
        const p = m * v;
        return {
          statement: `A ${m} kg object moves at ${v} m/s. Calculate its momentum.`,
          givens: [`m = ${m} kg`, `v = ${v} m/s`],
          solution: [`p = mv`, `p = (${m})(${v})`],
          answer: `p = ${p} kg·m/s`,
          topic: "momentum-impulse",
        };
      },
      () => {
        const F = randomBetween(50, 500, 10);
        const dt = randomBetween(1, 10) / 10;
        const J = F * dt;
        return {
          statement: `A force of ${F} N acts on a ball for ${dt} s. What is the impulse?`,
          givens: [`F = ${F} N`, `Δt = ${dt} s`],
          solution: [`J = FΔt`, `J = (${F})(${dt})`],
          answer: `J = ${J.toFixed(1)} N·s`,
          topic: "impulse-force",
        };
      },
    ],
    medium: [
      () => {
        const m1 = randomBetween(2, 10);
        const v1 = randomBetween(4, 15);
        const m2 = randomBetween(2, 10);
        const vf = (m1 * v1) / (m1 + m2);
        return {
          statement: `A ${m1} kg cart moving at ${v1} m/s collides with a ${m2} kg cart at rest. They stick together. Find the final velocity.`,
          givens: [`m₁ = ${m1} kg`, `v₁ᵢ = ${v1} m/s`, `m₂ = ${m2} kg`, `v₂ᵢ = 0`],
          solution: [
            `m₁v₁ᵢ + m₂v₂ᵢ = (m₁+m₂)vf`,
            `(${m1})(${v1}) + 0 = (${m1 + m2})vf`,
            `vf = ${m1 * v1}/${m1 + m2}`,
          ],
          answer: `vf = ${vf.toFixed(2)} m/s`,
          topic: "inelastic-collisions",
        };
      },
      () => {
        const m = randomBetween(1, 5, 0.5);
        const vi = randomBetween(5, 15);
        const vf = -randomBetween(5, 15);
        const dp = m * (vf - vi);
        const dt = randomBetween(1, 5) / 100;
        const F = dp / dt;
        return {
          statement: `A ${m} kg ball moving at ${vi} m/s bounces back at ${Math.abs(vf)} m/s. The contact time is ${dt} s. Find the average force.`,
          givens: [`m = ${m} kg`, `vᵢ = ${vi} m/s`, `vf = ${vf} m/s`, `Δt = ${dt} s`],
          solution: [
            `Δp = m(vf − vᵢ) = ${m}(${vf} − ${vi}) = ${dp.toFixed(1)} kg·m/s`,
            `F = Δp/Δt = ${dp.toFixed(1)}/${dt}`,
          ],
          answer: `F = ${F.toFixed(1)} N`,
          topic: "impulse-force",
        };
      },
    ],
    hard: [
      () => {
        const m1 = randomBetween(2, 8);
        const v1 = randomBetween(5, 15);
        const m2 = randomBetween(2, 8);
        const v1f = ((m1 - m2) * v1) / (m1 + m2);
        const v2f = (2 * m1 * v1) / (m1 + m2);
        const KEi = 0.5 * m1 * v1 * v1;
        const KEf = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
        return {
          statement: `A ${m1} kg object at ${v1} m/s elastically collides with a ${m2} kg object at rest. Find both final velocities and verify KE is conserved.`,
          givens: [`m₁ = ${m1} kg`, `v₁ᵢ = ${v1} m/s`, `m₂ = ${m2} kg`, `v₂ᵢ = 0`, `Elastic collision`],
          solution: [
            `v₁f = v₁(m₁−m₂)/(m₁+m₂) = ${v1}(${m1 - m2})/${m1 + m2} = ${v1f.toFixed(2)} m/s`,
            `v₂f = 2m₁v₁/(m₁+m₂) = 2(${m1})(${v1})/${m1 + m2} = ${v2f.toFixed(2)} m/s`,
            `KEᵢ = ½(${m1})(${v1})² = ${KEi.toFixed(1)} J`,
            `KEf = ½(${m1})(${v1f.toFixed(2)})² + ½(${m2})(${v2f.toFixed(2)})² = ${KEf.toFixed(1)} J`,
          ],
          answer: `v₁f = ${v1f.toFixed(2)} m/s, v₂f = ${v2f.toFixed(2)} m/s, KE conserved: ${KEi.toFixed(1)} ≈ ${KEf.toFixed(1)} J`,
          topic: "elastic-collisions",
        };
      },
      () => {
        const m1 = randomBetween(3, 10);
        const v1 = randomBetween(5, 15);
        const m2 = randomBetween(3, 10);
        const v2 = -randomBetween(3, 10);
        const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
        const KEi = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
        const KEf = 0.5 * (m1 + m2) * vf * vf;
        const lost = KEi - KEf;
        return {
          statement: `A ${m1} kg object at ${v1} m/s collides head-on with a ${m2} kg object at ${Math.abs(v2)} m/s (opposite direction). They stick together. Find vf and KE lost.`,
          givens: [`m₁ = ${m1} kg`, `v₁ᵢ = +${v1} m/s`, `m₂ = ${m2} kg`, `v₂ᵢ = ${v2} m/s`],
          solution: [
            `(m₁+m₂)vf = m₁v₁ + m₂v₂`,
            `(${m1 + m2})vf = (${m1})(${v1}) + (${m2})(${v2})`,
            `vf = ${(m1 * v1 + m2 * v2).toFixed(1)}/${m1 + m2} = ${vf.toFixed(2)} m/s`,
            `KE lost = ${KEi.toFixed(1)} − ${KEf.toFixed(1)} = ${lost.toFixed(1)} J`,
          ],
          answer: `vf = ${vf.toFixed(2)} m/s, KE lost = ${lost.toFixed(1)} J`,
          topic: "inelastic-collisions",
        };
      },
    ],
  };

  const pool = templates[difficulty];
  const gen = pool[Math.floor(Math.random() * pool.length)];
  return gen();
}

export function ProblemGenerator() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [problem, setProblem] = useState<GeneratedProblem | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const generate = useCallback(() => {
    setProblem(generateProblem(difficulty));
    setShowSolution(false);
  }, [difficulty]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Problem Generator</CardTitle>
          <CardDescription>Generate random momentum problems at your level</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={generate} className="w-full bg-purple-600 hover:bg-purple-700">
            Generate Problem
          </Button>
        </CardContent>
      </Card>

      {problem && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Problem</CardTitle>
              <Badge>{problem.topic}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{problem.statement}</p>

            <div className="bg-muted p-3 rounded">
              <p className="text-sm font-semibold mb-1">Given:</p>
              <ul className="text-sm space-y-0.5">
                {problem.givens.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {!showSolution && (
              <Button variant="outline" onClick={() => setShowSolution(true)}>
                Show Solution
              </Button>
            )}

            {showSolution && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold">Solution:</p>
                  <div className="bg-muted p-4 rounded font-mono text-sm space-y-1">
                    {problem.solution.map((step, i) => (
                      <p key={i}>{step}</p>
                    ))}
                  </div>
                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                    <p className="font-bold text-purple-600">{problem.answer}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProblemGenerator;
