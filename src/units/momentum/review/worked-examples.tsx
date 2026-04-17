"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PhysicsText } from "@/components/ui/physics-text";

interface WorkedExample {
  title: string;
  topic: string;
  problem: string;
  steps: { label: string; content: string }[];
  answer: string;
  tip: string;
}

const examples: WorkedExample[] = [
  {
    title: "Momentum Calculation",
    topic: "momentum-impulse",
    problem: "A 1500 kg car travels east at 20 m/s. A 0.01 kg bullet travels east at 800 m/s. Compare their momenta.",
    steps: [
      { label: "Car momentum", content: "p_car = mv = (1500)(20) = 30,000 kg·m/s east" },
      { label: "Bullet momentum", content: "p_bullet = mv = (0.01)(800) = 8 kg·m/s east" },
      { label: "Comparison", content: "The car has 3,750× more momentum than the bullet despite being much slower." },
    ],
    answer: "p_car = 30,000 kg·m/s, p_bullet = 8 kg·m/s. Mass matters enormously.",
    tip: "A common AP trap: heavy slow objects often have more momentum than light fast objects.",
  },
  {
    title: "Impulse from a Variable Force",
    topic: "impulse-force",
    problem: "A force on a 3 kg object varies as follows: 0–2 s at 10 N, 2–5 s at 20 N. The object starts at rest. Find the final velocity.",
    steps: [
      { label: "Impulse from first interval", content: "J₁ = F₁Δt₁ = (10)(2) = 20 N·s" },
      { label: "Impulse from second interval", content: "J₂ = F₂Δt₂ = (20)(3) = 60 N·s" },
      { label: "Total impulse", content: "J_total = 20 + 60 = 80 N·s" },
      { label: "Apply impulse-momentum theorem", content: "J = Δp = mvf − mvi = 3(vf) − 0\nvf = 80/3 ≈ 26.67 m/s" },
    ],
    answer: "vf ≈ 26.67 m/s",
    tip: "Break piecewise F-t graphs into rectangles/triangles and sum the areas for total impulse.",
  },
  {
    title: "Two-Body Collision with Unknown Mass",
    topic: "conservation-momentum",
    problem: "A 5 kg cart at 8 m/s collides with a stationary cart. After the collision, the 5 kg cart moves at 2 m/s and the other cart moves at 6 m/s. Find the unknown mass.",
    steps: [
      { label: "Conservation of momentum", content: "m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f" },
      { label: "Substitute", content: "(5)(8) + m₂(0) = (5)(2) + m₂(6)\n40 = 10 + 6m₂" },
      { label: "Solve", content: "6m₂ = 30\nm₂ = 5 kg" },
    ],
    answer: "m₂ = 5 kg",
    tip: "When you know 3 of the 4 velocities, conservation of momentum lets you find the mass or remaining velocity.",
  },
  {
    title: "Elastic Collision: Ball Bouncing off a Heavy Wall",
    topic: "elastic-collisions",
    problem: "A 0.2 kg ball traveling at 15 m/s hits a massive wall and bounces back at 15 m/s. What is the impulse on the ball?",
    steps: [
      { label: "Define direction", content: "Let rightward be positive. vᵢ = +15 m/s, vf = −15 m/s" },
      { label: "Calculate impulse", content: "J = Δp = m(vf − vᵢ) = 0.2(−15 − 15) = 0.2(−30) = −6 N·s" },
      { label: "Interpret", content: "The impulse is 6 N·s to the left (toward the wall)." },
    ],
    answer: "J = −6 N·s (6 N·s toward the wall)",
    tip: "When an object reverses direction, Δv = vf − vᵢ is large. Don't forget to account for the sign change!",
  },
  {
    title: "Ballistic Pendulum (Perfectly Inelastic + Energy)",
    topic: "inelastic-collisions",
    problem: "A 0.01 kg bullet at 400 m/s embeds in a 2 kg block hanging from a string. How high does the block+bullet swing?",
    steps: [
      { label: "Step 1: Perfectly inelastic collision", content: "m₁v₁ + m₂(0) = (m₁+m₂)vf\n(0.01)(400) = (2.01)vf\nvf = 4/2.01 ≈ 1.99 m/s" },
      { label: "Step 2: Energy conservation (after collision)", content: "½(m₁+m₂)vf² = (m₁+m₂)gh\n½vf² = gh\nh = vf²/(2g) = (1.99)²/(2×9.8) ≈ 0.202 m" },
      { label: "Key insight", content: "Use momentum conservation for the collision, then energy conservation for the swing." },
    ],
    answer: "h ≈ 0.20 m (20 cm)",
    tip: "The ballistic pendulum is a classic 2-step problem: momentum for the collision, energy for the swing. This is a favorite AP exam question.",
  },
];

export function WorkedExamples() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Worked Examples</CardTitle>
          <CardDescription>{examples.length} step-by-step solutions covering all momentum topics</CardDescription>
        </CardHeader>
      </Card>

      {examples.map((ex, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{ex.title}</CardTitle>
              <Badge variant="secondary">{ex.topic}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded">
              <p className="font-medium">{ex.problem}</p>
            </div>

            <Accordion>
              <AccordionItem value="solution">
                <AccordionTrigger>View Step-by-Step Solution</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {ex.steps.map((step, si) => (
                    <div key={si} className="space-y-1">
                      <p className="font-semibold text-sm text-purple-500">{step.label}</p>
                      <PhysicsText className="bg-muted p-3 rounded text-sm">
                        {step.content}
                      </PhysicsText>
                    </div>
                  ))}

                  <Separator />

                  <div className="p-3 rounded bg-purple-500/10 border border-purple-500/30">
                    <p className="font-bold">{ex.answer}</p>
                  </div>

                  <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-sm">
                    <p className="font-semibold">AP Tip:</p>
                    <p>{ex.tip}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default WorkedExamples;
