"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhysicsText } from "@/components/ui/physics-text";

interface Problem { category: string; question: string; answer: string; solution: string; }

function rand(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 10) / 10; }

function generateProblem(): Problem {
  const type = Math.floor(Math.random() * 4);
  switch (type) {
    case 0: {
      const v = rand(5, 30); const t = rand(2, 10);
      return { category: "Constant Velocity", question: `A car travels at ${v} m/s for ${t} s. How far does it travel?`, answer: `${(v * t).toFixed(1)} m`, solution: `$x = vt = ${v} × ${t} = ${(v * t).toFixed(1)}$ m` };
    }
    case 1: {
      const v0 = rand(0, 20); const a = rand(1, 5); const t = rand(2, 8);
      const x = v0 * t + 0.5 * a * t * t;
      return { category: "Constant Acceleration", question: `An object starts at ${v0} m/s with acceleration ${a} m/s². Find displacement after ${t} s.`, answer: `${x.toFixed(1)} m`, solution: `$x = v₀t + ½at² = ${v0}(${t}) + ½(${a})(${t}²) = ${(v0 * t).toFixed(1)} + ${(0.5 * a * t * t).toFixed(1)} = ${x.toFixed(1)}$ m` };
    }
    case 2: {
      const h = rand(5, 50);
      const t = Math.sqrt(2 * h / 9.8);
      const v = 9.8 * t;
      return { category: "Free Fall", question: `An object is dropped from ${h} m. How long does it take to hit the ground? ($g = 9.8$ m/s²)`, answer: `${t.toFixed(2)} s`, solution: `$h = ½gt²$ → $t = \\sqrt{2h/g} = \\sqrt{2×${h}/9.8} = ${t.toFixed(2)}$ s.\nFinal velocity $= gt = ${v.toFixed(1)}$ m/s.` };
    }
    default: {
      const v0 = rand(15, 35); const angle = Math.floor(rand(25, 65));
      const rad = angle * Math.PI / 180;
      const R = (v0 * v0 * Math.sin(2 * rad)) / 9.8;
      const H = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * 9.8);
      return { category: "Projectile Motion", question: `A ball is launched at ${v0} m/s at ${angle}°. Find the range and max height.`, answer: `R = ${R.toFixed(1)} m, H = ${H.toFixed(1)} m`, solution: `$R = v₀² \\sin(2θ) / g = ${v0}² × \\sin(${2 * angle}°) / 9.8 = ${R.toFixed(1)}$ m\n$H = v₀² \\sin²(θ) / (2g) = ${v0}² × \\sin²(${angle}°) / 19.6 = ${H.toFixed(1)}$ m` };
    }
  }
}

export function ProblemGenerator() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [showSolution, setShowSolution] = useState(false);

  const newProblem = useCallback(() => { setProblem(generateProblem()); setShowSolution(false); }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Problem Generator</CardTitle>
        <CardDescription>Random kinematics problems with instant solutions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="outline">{problem.category}</Badge>
        <PhysicsText display={false} className="text-base font-medium">{problem.question}</PhysicsText>
        <Separator />
        {showSolution ? (
          <div className="space-y-2 rounded-lg bg-muted/50 border p-4">
            <p className="text-sm font-semibold">Answer: {problem.answer}</p>
            <PhysicsText display={false} className="text-sm text-muted-foreground">{problem.solution}</PhysicsText>
          </div>
        ) : (
          <Button onClick={() => setShowSolution(true)} variant="outline" className="cursor-pointer">Show Solution</Button>
        )}
        <Button onClick={newProblem} className="cursor-pointer">New Problem</Button>
      </CardContent>
    </Card>
  );
}
