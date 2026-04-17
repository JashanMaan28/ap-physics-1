"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PhysicsText } from "@/components/ui/physics-text";

const examples = [
  {
    title: "Basic F = ma",
    difficulty: "Easy",
    problem: "A 12 kg box is pushed across a frictionless floor with a constant horizontal force of 36 N. Find the acceleration.",
    steps: [
      "Identify: m = 12 kg, F = 36 N, frictionless surface.",
      "Draw FBD: F (right), N (up), mg (down). No friction.",
      "Apply Newton's 2nd Law horizontally: ΣF_x = ma → 36 = 12a.",
      "Solve: a = 36/12 = 3.0 m/s².",
    ],
    answer: "a = 3.0 m/s² to the right",
  },
  {
    title: "Friction Problem",
    difficulty: "Medium",
    problem: "A 20 kg crate is pushed across a floor with μk = 0.35 by a horizontal force of 120 N. Find the acceleration.",
    steps: [
      "Given: m = 20 kg, F_applied = 120 N, μk = 0.35.",
      "Normal force: N = mg = 20 × 9.8 = 196 N.",
      "Kinetic friction: f_k = μk × N = 0.35 × 196 = 68.6 N.",
      "Net force: F_net = 120 − 68.6 = 51.4 N.",
      "Acceleration: a = F_net / m = 51.4 / 20 = 2.57 m/s².",
    ],
    answer: "a = 2.57 m/s²",
  },
  {
    title: "Inclined Plane with Friction",
    difficulty: "Medium",
    problem: "A 4 kg block slides down a 40° incline with μk = 0.2. Find the acceleration.",
    steps: [
      "Given: m = 4 kg, θ = 40°, μk = 0.2, g = 9.8 m/s².",
      "Component along incline: mg sin(40°) = 4 × 9.8 × 0.6428 = 25.2 N.",
      "Normal force: N = mg cos(40°) = 4 × 9.8 × 0.7660 = 30.0 N.",
      "Friction (up the ramp): f_k = 0.2 × 30.0 = 6.0 N.",
      "Net force along incline: 25.2 − 6.0 = 19.2 N.",
      "Acceleration: a = 19.2 / 4 = 4.80 m/s² down the incline.",
    ],
    answer: "a = 4.80 m/s² down the incline",
  },
  {
    title: "Atwood Machine",
    difficulty: "Medium",
    problem: "An Atwood machine has m₁ = 7 kg and m₂ = 3 kg. Find the acceleration of the system and the tension in the rope.",
    steps: [
      "Given: m₁ = 7 kg, m₂ = 3 kg, g = 9.8 m/s².",
      "For m₁ (heavier, accelerates down): m₁g − T = m₁a → 68.6 − T = 7a.",
      "For m₂ (lighter, accelerates up): T − m₂g = m₂a → T − 29.4 = 3a.",
      "Add equations: 68.6 − 29.4 = 10a → 39.2 = 10a → a = 3.92 m/s².",
      "Tension: T = m₂(g + a) = 3(9.8 + 3.92) = 3 × 13.72 = 41.16 N.",
      "Check with formula: T = 2m₁m₂g/(m₁+m₂) = 2×7×3×9.8/10 = 41.16 N ✓",
    ],
    answer: "a = 3.92 m/s², T = 41.16 N",
  },
  {
    title: "Elevator Problem (Apparent Weight)",
    difficulty: "Hard",
    problem: "A 60 kg person stands on a scale in an elevator. The elevator accelerates upward at 2 m/s². What does the scale read?",
    steps: [
      "The scale reads the normal force N (apparent weight).",
      "Draw FBD: N (up), mg (down). Person accelerates upward.",
      "Apply Newton's 2nd Law (up positive): N − mg = ma.",
      "N = m(g + a) = 60(9.8 + 2) = 60 × 11.8 = 708 N.",
      "In 'kg' reading: 708 / 9.8 = 72.2 kg apparent mass.",
      "The person feels 18% heavier than their actual weight of 588 N.",
    ],
    answer: "Scale reads 708 N (apparent weight), equivalent to 72.2 kg",
  },
  {
    title: "Two Connected Blocks",
    difficulty: "Hard",
    problem: "Two blocks (m₁ = 5 kg and m₂ = 3 kg) are connected by a rope on a frictionless surface. A 40 N force pulls m₁. Find the acceleration and tension in the connecting rope.",
    steps: [
      "Treat as a system first: F_net = (m₁ + m₂)a → 40 = 8a → a = 5.0 m/s².",
      "Now find tension using m₂ alone: T = m₂ × a = 3 × 5.0 = 15.0 N.",
      "Check with m₁: F − T = m₁a → 40 − 15 = 25 = 5 × 5 ✓.",
      "The tension (15 N) is less than the applied force (40 N) because it only needs to accelerate m₂.",
    ],
    answer: "a = 5.0 m/s², T = 15.0 N",
  },
];

export function WorkedExamples() {
  const [currentEx, setCurrentEx] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Worked Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {examples.map((ex, idx) => (
              <Button
                key={idx}
                variant={currentEx === idx ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentEx(idx)}
              >
                {idx + 1}. {ex.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{examples[currentEx].title}</CardTitle>
            <Badge>{examples[currentEx].difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 border p-4">
            <p className="font-medium">{examples[currentEx].problem}</p>
          </div>

          <Accordion>
            <AccordionItem value="steps">
              <AccordionTrigger>Show Step-by-Step Solution</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {examples[currentEx].steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <Badge variant="outline" className="shrink-0 mt-0.5">
                        Step {idx + 1}
                      </Badge>
                      <PhysicsText className="text-sm">{step}</PhysicsText>
                    </div>
                  ))}
                  <Separator />
                  <div className="rounded-lg bg-green-50 border-green-200 border p-3">
                    <p className="font-bold text-green-900">{examples[currentEx].answer}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
