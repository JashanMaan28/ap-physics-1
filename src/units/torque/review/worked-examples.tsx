"use client";

import { useState } from "react";
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
import { PhysicsText } from "@/components/ui/physics-text";

interface WorkedExample {
  title: string;
  topic: string;
  problem: string;
  steps: { label: string; content: string }[];
  answer: string;
}

const examples: WorkedExample[] = [
  {
    title: "Torque from a Wrench",
    topic: "Torque Basics",
    problem: "You push on a 0.30 m wrench with 80 N of force at 60\u00B0 to the handle. Find the torque.",
    steps: [
      { label: "Identify knowns", content: "r = 0.30 m, F = 80 N, \u03B8 = 60\u00B0" },
      { label: "Apply formula", content: "\u03C4 = rF sin\u03B8 = 0.30 \u00D7 80 \u00D7 sin(60\u00B0)" },
      { label: "Calculate", content: "\u03C4 = 0.30 \u00D7 80 \u00D7 0.866 = 20.8 N\u00B7m" },
    ],
    answer: "\u03C4 = 20.8 N\u00B7m",
  },
  {
    title: "Balancing a Beam",
    topic: "Rotational Equilibrium",
    problem: "A 4 m uniform beam (mass 12 kg) is supported at its left end and at 3 m. A 8 kg mass hangs from the right end. Find the support forces.",
    steps: [
      { label: "Draw FBD", content: "Forces: F_A (at 0 m), F_B (at 3 m), W_beam = 117.6 N (at 2 m center), W_mass = 78.4 N (at 4 m)." },
      { label: "Torque about A (0 m)", content: "\u03A3\u03C4_A = 0: F_B(3) - 117.6(2) - 78.4(4) = 0" },
      { label: "Solve for F_B", content: "3 F_B = 235.2 + 313.6 = 548.8 \u2192 F_B = 182.9 N" },
      { label: "Use \u03A3F_y = 0", content: "F_A + 182.9 - 117.6 - 78.4 = 0 \u2192 F_A = 13.1 N" },
    ],
    answer: "F_A = 13.1 N upward, F_B = 182.9 N upward",
  },
  {
    title: "Angular Acceleration of a Pulley",
    topic: "Newton's 2nd (Rotation)",
    problem: "A 3 kg solid disk pulley (R = 0.2 m) has a rope wrapped around it supporting a 1 kg mass. Find the angular acceleration when released.",
    steps: [
      { label: "Find I", content: "I = (1/2)MR\u00B2 = 0.5(3)(0.04) = 0.06 kg\u00B7m\u00B2" },
      { label: "Equations of motion", content: "Hanging mass: mg - T = ma \u2192 9.8 - T = a. Pulley: TR = I\u03B1 \u2192 0.2T = 0.06\u03B1. Constraint: a = R\u03B1 = 0.2\u03B1." },
      { label: "Substitute", content: "T = 0.06\u03B1/0.2 = 0.3\u03B1. From mass eq: 9.8 - 0.3\u03B1 = 0.2\u03B1 \u2192 9.8 = 0.5\u03B1." },
      { label: "Solve", content: "\u03B1 = 19.6 rad/s\u00B2. a = 0.2(19.6) = 3.92 m/s\u00B2. T = 0.3(19.6) = 5.88 N." },
    ],
    answer: "\u03B1 = 19.6 rad/s\u00B2, a = 3.92 m/s\u00B2, T = 5.88 N",
  },
  {
    title: "Spinning to a Stop",
    topic: "Angular Kinematics",
    problem: "A wheel spinning at 120 rad/s decelerates uniformly and stops after 30 revolutions. Find \u03B1 and the time to stop.",
    steps: [
      { label: "Convert", content: "\u03B8 = 30 rev \u00D7 2\u03C0 = 60\u03C0 = 188.5 rad. \u03C9\u2080 = 120 rad/s, \u03C9 = 0." },
      { label: "Find \u03B1", content: "\u03C9\u00B2 = \u03C9\u2080\u00B2 + 2\u03B1\u03B8. 0 = 14400 + 2\u03B1(188.5). \u03B1 = -14400/377 = -38.2 rad/s\u00B2." },
      { label: "Find time", content: "\u03C9 = \u03C9\u2080 + \u03B1t. 0 = 120 + (-38.2)t. t = 120/38.2 = 3.14 s." },
    ],
    answer: "\u03B1 = -38.2 rad/s\u00B2, t = 3.14 s",
  },
  {
    title: "Race Down a Ramp",
    topic: "Moment of Inertia",
    problem: "A solid sphere and a hoop (same mass 2 kg, radius 0.1 m) start from rest at the top of a 1.5 m high ramp. Find the speed of each at the bottom.",
    steps: [
      { label: "Energy conservation", content: "mgh = (1/2)mv\u00B2 + (1/2)I\u03C9\u00B2. With \u03C9 = v/R: mgh = (1/2)mv\u00B2(1 + I/(mR\u00B2))." },
      { label: "Sphere (I = 2/5 mR\u00B2)", content: "v = \u221A(2gh / (1 + 2/5)) = \u221A(2(9.8)(1.5) / 1.4) = \u221A(21) = 4.58 m/s." },
      { label: "Hoop (I = mR\u00B2)", content: "v = \u221A(2gh / (1 + 1)) = \u221A(2(9.8)(1.5) / 2) = \u221A(14.7) = 3.83 m/s." },
      { label: "Compare", content: "The sphere is faster (4.58 vs 3.83 m/s) because less energy goes to rotation." },
    ],
    answer: "Sphere: 4.58 m/s, Hoop: 3.83 m/s. The sphere wins the race.",
  },
];

export function WorkedExamples() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());

  const ex = examples[currentIdx];

  function revealStep(i: number) {
    setRevealedSteps((prev) => new Set([...prev, i]));
  }

  function revealAll() {
    setRevealedSteps(new Set(ex.steps.map((_, i) => i)));
  }

  function changeExample(idx: number) {
    setCurrentIdx(idx);
    setRevealedSteps(new Set());
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Worked Examples</CardTitle>
          <CardDescription>Step-by-step solutions to key problem types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {examples.map((e, i) => (
              <Button key={i} variant={i === currentIdx ? "default" : "outline"} size="sm" onClick={() => changeExample(i)}>
                {i + 1}. {e.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{ex.topic}</Badge>
            <CardTitle>{ex.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium">{ex.problem}</p>
          </div>

          <div className="space-y-3">
            {ex.steps.map((step, i) => (
              <div key={i}>
                {revealedSteps.has(i) ? (
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-semibold text-primary mb-1">Step {i + 1}: {step.label}</p>
                    <PhysicsText className="text-sm">{step.content}</PhysicsText>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => revealStep(i)} className="w-full justify-start">
                    Reveal Step {i + 1}: {step.label}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={revealAll}>Show All Steps</Button>
          </div>

          {revealedSteps.size === ex.steps.length && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 border border-green-200 dark:border-green-800 dark:bg-green-500/10 dark:border-green-500/30">
              <p className="font-semibold text-green-700 dark:text-green-400 dark:text-green-300">Final Answer</p>
              <p className="text-sm mt-1">{ex.answer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
