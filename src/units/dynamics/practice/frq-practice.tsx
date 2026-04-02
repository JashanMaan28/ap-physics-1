"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const frqs = [
  {
    id: 1,
    title: "Two-Block System on a Surface",
    prompt: `A block of mass M₁ = 4 kg sits on a frictionless horizontal surface. A second block of mass M₂ = 2 kg is placed on top of M₁. The coefficient of static friction between the two blocks is μs = 0.4.

A horizontal force F is applied to M₁.

(a) Draw a free-body diagram for each block.
(b) What is the maximum force F that can be applied to M₁ without M₂ sliding off?
(c) If F exceeds this maximum, describe what happens to each block's acceleration.`,
    rubric: [
      "FBD for M₁: F (right), friction from M₂ on M₁ (left), N₁ (up), (M₁+M₂)g (down) — or equivalent with N from surface and weight of M₁ only plus N₂ down from M₂.",
      "FBD for M₂: friction from M₁ on M₂ (right — this is what accelerates M₂), N₂ (up), M₂g (down).",
      "M₂ accelerates via static friction: f_s = M₂ × a → max a = μs × g = 0.4 × 9.8 = 3.92 m/s².",
      "F_max = (M₁ + M₂) × a_max = 6 × 3.92 = 23.52 N.",
      "If F > F_max: M₂ slides, gaining less acceleration (limited by kinetic friction); M₁ accelerates faster because friction on it decreases.",
    ],
  },
  {
    id: 2,
    title: "Block on an Incline with Friction",
    prompt: `A 5 kg block is placed on a 37° incline. The coefficient of kinetic friction between the block and the surface is μk = 0.25.

(a) Draw a free-body diagram for the block.
(b) Calculate the normal force.
(c) Calculate the kinetic friction force.
(d) Determine the block's acceleration down the incline.
(e) If the block starts from rest, how far does it travel in 2 seconds?`,
    rubric: [
      "FBD: mg down (49 N), N perpendicular to surface (up-left), friction up the incline, mg decomposed into mg sin37° parallel and mg cos37° perpendicular.",
      "N = mg cos(37°) = 5 × 9.8 × 0.7986 = 39.1 N.",
      "f_k = μk × N = 0.25 × 39.1 = 9.78 N.",
      "F_net = mg sin(37°) - f_k = 5 × 9.8 × 0.6018 - 9.78 = 29.49 - 9.78 = 19.71 N. a = 19.71/5 = 3.94 m/s².",
      "d = ½at² = ½ × 3.94 × 4 = 7.88 m.",
    ],
  },
  {
    id: 3,
    title: "Modified Atwood Machine",
    prompt: `A block of mass m₁ = 8 kg sits on a frictionless horizontal table. It is connected by a light string over a frictionless pulley to a hanging block of mass m₂ = 3 kg.

(a) Draw free-body diagrams for both blocks.
(b) Write Newton's second law equations for each block.
(c) Solve for the acceleration of the system.
(d) Solve for the tension in the string.
(e) If m₂ is increased, explain qualitatively what happens to the acceleration and tension.`,
    rubric: [
      "FBD m₁: T (right), N (up), m₁g (down). No friction since surface is frictionless.",
      "FBD m₂: T (up), m₂g (down).",
      "m₁: T = m₁a. m₂: m₂g - T = m₂a.",
      "Adding equations: m₂g = (m₁ + m₂)a → a = m₂g/(m₁+m₂) = 3×9.8/11 = 2.67 m/s².",
      "T = m₁a = 8 × 2.67 = 21.4 N.",
      "If m₂ increases: acceleration increases (approaches g as m₂ → ∞), tension also increases (approaches m₁g).",
    ],
  },
];

export function FRQPractice() {
  const [selectedFRQ, setSelectedFRQ] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Free-Response Practice</CardTitle>
          <CardDescription>
            Practice AP-style free-response questions. Work through the problem on paper before
            checking the rubric.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {frqs.map((frq, idx) => (
              <Button
                key={frq.id}
                variant={selectedFRQ === idx ? "default" : "outline"}
                onClick={() => setSelectedFRQ(idx)}
              >
                FRQ {frq.id}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{frqs[selectedFRQ].title}</CardTitle>
            <Badge>FRQ {frqs[selectedFRQ].id}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 border p-4">
            <p className="whitespace-pre-line text-sm">{frqs[selectedFRQ].prompt}</p>
          </div>

          <Separator />

          <Accordion>
            <AccordionItem value="rubric">
              <AccordionTrigger>Show Scoring Rubric</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {frqs[selectedFRQ].rubric.map((point, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <Badge variant="outline" className="shrink-0">
                        {idx + 1} pt
                      </Badge>
                      <p>{point}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
