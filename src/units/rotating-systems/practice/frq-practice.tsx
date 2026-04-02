"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FRQ {
  id: number;
  title: string;
  scenario: string;
  parts: { label: string; question: string; solution: string }[];
}

const frqs: FRQ[] = [
  {
    id: 1,
    title: "Merry-Go-Round Collision",
    scenario:
      "A uniform solid disk merry-go-round of mass M = 120 kg and radius R = 2.0 m rotates freely at ω₀ = 2.5 rad/s. A child of mass m = 40 kg, initially at rest, jumps onto the edge.",
    parts: [
      {
        label: "a",
        question:
          "Calculate the moment of inertia of the merry-go-round alone.",
        solution:
          "I_disk = (1/2)MR² = (1/2)(120)(2.0²) = 240 kg·m²",
      },
      {
        label: "b",
        question: "Find the angular velocity after the child jumps on.",
        solution:
          "L_i = I_disk × ω₀ = 240 × 2.5 = 600 kg·m²/s\nI_child = mR² = 40(4) = 160 kg·m²\nI_total = 240 + 160 = 400 kg·m²\nω_f = L_i / I_total = 600/400 = 1.5 rad/s",
      },
      {
        label: "c",
        question:
          "Calculate the kinetic energy before and after. Is energy conserved? Explain.",
        solution:
          "KE_i = (1/2)(240)(2.5²) = 750 J\nKE_f = (1/2)(400)(1.5²) = 450 J\nEnergy is NOT conserved. 300 J is lost to the inelastic collision (heat, sound, deformation). This is analogous to a perfectly inelastic linear collision.",
      },
      {
        label: "d",
        question:
          "The child then walks to the center. What is the new angular velocity?",
        solution:
          "At center, r = 0, so I_child = 0. I_total = 240 kg·m².\nω = L/I = 600/240 = 2.5 rad/s.\nThe system returns to its original angular velocity! The child does positive work walking inward (against the centrifugal effect in the rotating frame).",
      },
    ],
  },
  {
    id: 2,
    title: "Rolling Race with Energy Analysis",
    scenario:
      "A solid sphere, a solid cylinder, and a hollow sphere (all mass m = 2.0 kg, radius R = 0.10 m) are released from rest at the top of a 1.5 m high ramp.",
    parts: [
      {
        label: "a",
        question:
          "Using energy conservation, derive the general formula for speed at the bottom for a rolling object with I = cmR².",
        solution:
          "mgh = (1/2)mv² + (1/2)Iω² = (1/2)mv² + (1/2)(cmR²)(v/R)²\nmgh = (1/2)mv²(1 + c)\nv = √(2gh/(1 + c))",
      },
      {
        label: "b",
        question: "Calculate the speed at the bottom for each shape.",
        solution:
          "Solid sphere (c = 2/5): v = √(2(9.8)(1.5)/1.4) = √(21) = 4.58 m/s\nSolid cylinder (c = 1/2): v = √(2(9.8)(1.5)/1.5) = √(19.6) = 4.43 m/s\nHollow sphere (c = 2/3): v = √(2(9.8)(1.5)/1.667) = √(17.64) = 4.20 m/s",
      },
      {
        label: "c",
        question:
          "What fraction of the total KE is rotational for each shape?",
        solution:
          "KE_rot/KE_total = (1/2)Iω² / [(1/2)mv²(1+c)] = c/(1+c)\nSolid sphere: 0.4/1.4 = 28.6%\nSolid cylinder: 0.5/1.5 = 33.3%\nHollow sphere: 0.667/1.667 = 40.0%",
      },
      {
        label: "d",
        question: "Explain why mass and radius do not affect the outcome.",
        solution:
          "In the energy equation mgh = (1/2)mv²(1+c), mass m cancels from both sides. Since I = cmR² and ω = v/R, the R also cancels. Only the geometric factor c determines the speed. This is why shape matters but size and mass do not.",
      },
    ],
  },
  {
    id: 3,
    title: "Pulley with Two Masses",
    scenario:
      "An Atwood machine has masses m₁ = 5.0 kg and m₂ = 3.0 kg connected by a massless string over a solid disk pulley of mass M = 2.0 kg and radius R = 0.15 m.",
    parts: [
      {
        label: "a",
        question: "Draw free body diagrams for both masses and the pulley.",
        solution:
          "m₁: Weight m₁g downward, Tension T₁ upward.\nm₂: Weight m₂g downward, Tension T₂ upward.\nPulley: T₁ and T₂ create torques. T₁ > T₂ since m₁ > m₂.\nNote: T₁ ≠ T₂ because the pulley has mass.",
      },
      {
        label: "b",
        question:
          "Write Newton's 2nd law for each mass and the torque equation for the pulley. Solve for the acceleration.",
        solution:
          "m₁: m₁g - T₁ = m₁a → T₁ = m₁(g-a)\nm₂: T₂ - m₂g = m₂a → T₂ = m₂(g+a)\nPulley: (T₁ - T₂)R = Iα = (MR²/2)(a/R)\nT₁ - T₂ = Ma/2\nm₁(g-a) - m₂(g+a) = Ma/2\n(m₁-m₂)g = a(m₁ + m₂ + M/2)\na = (5-3)(9.8)/(5+3+1) = 19.6/9 = 2.18 m/s²",
      },
      {
        label: "c",
        question: "Find both tensions.",
        solution:
          "T₁ = m₁(g-a) = 5(9.8-2.18) = 38.1 N\nT₂ = m₂(g+a) = 3(9.8+2.18) = 35.9 N\nCheck: T₁ - T₂ = 2.2 N, Ma/2 = 2(2.18)/2 = 2.18 N ✓ (small rounding difference)",
      },
    ],
  },
];

export function FRQPractice() {
  const [currentFRQ, setCurrentFRQ] = useState(0);
  const [revealedParts, setRevealedParts] = useState<Set<string>>(new Set());

  const frq = frqs[currentFRQ];

  const togglePart = (label: string) => {
    setRevealedParts((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const changeFRQ = (idx: number) => {
    setCurrentFRQ(idx);
    setRevealedParts(new Set());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">FRQ Practice</h2>

      {/* FRQ selector */}
      <div className="flex gap-2 flex-wrap">
        {frqs.map((f, i) => (
          <Button
            key={f.id}
            onClick={() => changeFRQ(i)}
            variant={i === currentFRQ ? "default" : "outline"}
            className={
              i === currentFRQ
                ? "bg-teal-600"
                : "border-gray-700 text-gray-300"
            }
            size="sm"
          >
            FRQ {f.id}
          </Button>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">{frq.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{frq.scenario}</p>

          {frq.parts.map((part) => (
            <div
              key={part.label}
              className="border border-gray-700 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-white font-bold">
                  ({part.label}) {part.question}
                </p>
                <Button
                  onClick={() => togglePart(part.label)}
                  size="sm"
                  variant="outline"
                  className="border-teal-700 text-teal-300"
                >
                  {revealedParts.has(part.label) ? "Hide" : "Show"} Solution
                </Button>
              </div>
              {revealedParts.has(part.label) && (
                <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-3 mt-2">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                    {part.solution}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
