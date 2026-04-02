"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkedExample {
  id: number;
  title: string;
  problem: string;
  steps: { label: string; content: string }[];
  answer: string;
  topic: string;
}

const examples: WorkedExample[] = [
  {
    id: 1,
    title: "Flywheel Energy Storage",
    problem:
      "A flywheel is a solid cylinder of mass 50 kg and radius 0.30 m spinning at 3000 rpm. How much energy does it store?",
    steps: [
      {
        label: "Convert units",
        content: "ω = 3000 rpm × (2π/60) = 314.2 rad/s",
      },
      {
        label: "Find moment of inertia",
        content: "I = (1/2)MR² = (1/2)(50)(0.09) = 2.25 kg·m²",
      },
      {
        label: "Calculate KE",
        content: "KE = (1/2)Iω² = (1/2)(2.25)(314.2²) = (1/2)(2.25)(98,762) = 111,107 J ≈ 111 kJ",
      },
    ],
    answer: "The flywheel stores approximately 111 kJ of rotational kinetic energy.",
    topic: "rotational-ke",
  },
  {
    id: 2,
    title: "Ice Skater Spin",
    problem:
      "A skater (arms out: I = 3.5 kg·m², ω = 2 rev/s) pulls arms in (I = 1.0 kg·m²). Find new spin rate and the change in KE.",
    steps: [
      {
        label: "Convert to rad/s",
        content: "ω₁ = 2 rev/s × 2π = 4π = 12.57 rad/s",
      },
      {
        label: "Apply conservation of L",
        content: "L = I₁ω₁ = 3.5 × 12.57 = 44.0 kg·m²/s\nω₂ = L/I₂ = 44.0/1.0 = 44.0 rad/s = 7.0 rev/s",
      },
      {
        label: "Calculate KE change",
        content:
          "KE₁ = (1/2)(3.5)(12.57²) = 276.6 J\nKE₂ = (1/2)(1.0)(44.0²) = 968.0 J\nΔKE = 968.0 - 276.6 = +691.4 J",
      },
    ],
    answer:
      "New spin rate: 7.0 rev/s (44.0 rad/s). KE increased by 691 J — the skater did this work by pulling arms inward against centripetal acceleration.",
    topic: "conservation-angular",
  },
  {
    id: 3,
    title: "Rolling Ball on a Ramp",
    problem:
      "A solid ball (m = 0.5 kg, R = 0.05 m) starts from rest and rolls down a 2.0 m high ramp. Find its speed and angular velocity at the bottom.",
    steps: [
      {
        label: "Identify the shape factor",
        content: "Solid sphere: I = (2/5)mR², so c = 2/5 = 0.4",
      },
      {
        label: "Use energy conservation",
        content:
          "mgh = (1/2)mv²(1 + c)\nv = √(2gh/(1+c)) = √(2 × 9.8 × 2.0 / 1.4) = √(28) = 5.29 m/s",
      },
      {
        label: "Find angular velocity",
        content: "ω = v/R = 5.29 / 0.05 = 105.8 rad/s",
      },
    ],
    answer: "v = 5.29 m/s at the bottom, ω = 105.8 rad/s (about 16.8 rev/s).",
    topic: "rolling-motion",
  },
  {
    id: 4,
    title: "Atwood Machine with Pulley",
    problem:
      "Masses of 4 kg and 6 kg are connected over a solid disk pulley (M = 3 kg, R = 0.2 m). Find the acceleration, both tensions, and angular acceleration of the pulley.",
    steps: [
      {
        label: "Set up equations",
        content:
          "For m₂ = 6 kg (heavier, goes down): m₂g - T₂ = m₂a\nFor m₁ = 4 kg (lighter, goes up): T₁ - m₁g = m₁a\nPulley: (T₂ - T₁)R = (MR²/2)(a/R) → T₂ - T₁ = Ma/2",
      },
      {
        label: "Solve for acceleration",
        content:
          "Add: (m₂ - m₁)g = (m₁ + m₂ + M/2)a\na = (6-4)(9.8) / (4 + 6 + 1.5) = 19.6 / 11.5 = 1.70 m/s²",
      },
      {
        label: "Find tensions",
        content:
          "T₁ = m₁(g + a) = 4(9.8 + 1.70) = 46.0 N\nT₂ = m₂(g - a) = 6(9.8 - 1.70) = 48.6 N",
      },
      {
        label: "Angular acceleration",
        content: "α = a/R = 1.70/0.2 = 8.5 rad/s²",
      },
    ],
    answer:
      "a = 1.70 m/s², T₁ = 46.0 N, T₂ = 48.6 N, α = 8.5 rad/s². Note T₂ > T₁ as expected.",
    topic: "combined-rotation",
  },
  {
    id: 5,
    title: "Neutron Star Formation",
    problem:
      "A star (R = 7×10⁸ m, period = 30 days) collapses to a neutron star (R = 10⁴ m). Assuming it's a uniform sphere and mass is conserved, find the new rotation period.",
    steps: [
      {
        label: "Conservation of angular momentum",
        content: "I₁ω₁ = I₂ω₂, where I = (2/5)MR², so MR₁²ω₁ = MR₂²ω₂",
      },
      {
        label: "Solve for ω₂",
        content:
          "ω₂ = ω₁(R₁/R₂)² = ω₁(7×10⁸/10⁴)² = ω₁ × (7×10⁴)² = ω₁ × 4.9×10⁹",
      },
      {
        label: "Find new period",
        content:
          "T₂ = T₁ / (R₁/R₂)² = 30 days / 4.9×10⁹ = 6.12×10⁻⁹ days = 0.00053 s ≈ 0.5 ms",
      },
    ],
    answer:
      "The neutron star rotates with a period of about 0.5 milliseconds — nearly 2000 rotations per second! This is consistent with observed millisecond pulsars.",
    topic: "conservation-angular",
  },
];

export function WorkedExamples() {
  const [currentEx, setCurrentEx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const ex = examples[currentEx];

  const revealStep = (idx: number) => {
    setRevealedSteps((prev) => new Set(prev).add(idx));
  };

  const revealAll = () => {
    setRevealedSteps(new Set(ex.steps.map((_, i) => i)));
    setShowAnswer(true);
  };

  const changeExample = (idx: number) => {
    setCurrentEx(idx);
    setRevealedSteps(new Set());
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">Worked Examples</h2>

      <div className="flex gap-2 flex-wrap">
        {examples.map((e, i) => (
          <Button
            key={e.id}
            onClick={() => changeExample(i)}
            variant={i === currentEx ? "default" : "outline"}
            className={
              i === currentEx
                ? "bg-teal-600"
                : "border-gray-700 text-gray-300"
            }
            size="sm"
          >
            {e.title}
          </Button>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{ex.title}</CardTitle>
            <Badge className="bg-teal-900 text-teal-300">{ex.topic}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">{ex.problem}</p>
          </div>

          {ex.steps.map((step, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-teal-300 font-bold text-sm">
                  Step {i + 1}: {step.label}
                </p>
                {!revealedSteps.has(i) && (
                  <Button
                    onClick={() => revealStep(i)}
                    size="sm"
                    variant="outline"
                    className="border-teal-700 text-teal-300"
                  >
                    Reveal
                  </Button>
                )}
              </div>
              {revealedSteps.has(i) && (
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                  {step.content}
                </pre>
              )}
            </div>
          ))}

          {showAnswer && (
            <div className="bg-teal-900/20 border border-teal-700 rounded-lg p-4">
              <p className="text-teal-300 font-bold mb-1">Final Answer:</p>
              <p className="text-gray-300">{ex.answer}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={revealAll}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Show All Steps
            </Button>
            {!showAnswer && revealedSteps.size === ex.steps.length && (
              <Button
                onClick={() => setShowAnswer(true)}
                variant="outline"
                className="border-teal-700 text-teal-300"
              >
                Show Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
