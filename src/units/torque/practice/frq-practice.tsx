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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FRQ {
  id: number;
  title: string;
  scenario: string;
  parts: { label: string; prompt: string; solution: string }[];
}

const frqs: FRQ[] = [
  {
    id: 1,
    title: "Beam with Multiple Forces",
    scenario:
      "A uniform beam of mass 10 kg and length 4 m is supported at its left end by a pivot and at 3 m from the left end by a vertical support. A 5 kg block hangs from the right end of the beam.",
    parts: [
      {
        label: "a",
        prompt: "Draw a free-body diagram of the beam showing all forces and where they act.",
        solution:
          "Forces: (1) Weight of beam W_b = 98 N downward at center (2 m from left). (2) Weight of block W_block = 49 N downward at right end (4 m from left). (3) Normal force N_support upward at 3 m. (4) Force at pivot F_pivot (unknown direction) at 0 m.",
      },
      {
        label: "b",
        prompt: "Taking torques about the pivot, find the normal force from the support.",
        solution:
          "\u03A3\u03C4_pivot = 0: N_support(3) - W_b(2) - W_block(4) = 0. N_support(3) = 98(2) + 49(4) = 196 + 196 = 392. N_support = 130.7 N.",
      },
      {
        label: "c",
        prompt: "Determine the force (magnitude and direction) exerted by the pivot.",
        solution:
          "\u03A3F_y = 0: F_pivot + N_support - W_b - W_block = 0. F_pivot = 98 + 49 - 130.7 = 16.3 N upward.",
      },
      {
        label: "d",
        prompt: "If the support is moved to 2 m from the pivot, what is the new support force?",
        solution:
          "N_support(2) = 98(2) + 49(4) = 392. N_support = 196 N. Moving the support closer to the pivot increases the required force.",
      },
    ],
  },
  {
    id: 2,
    title: "Pulley and Hanging Mass",
    scenario:
      "A solid disk pulley of mass 3 kg and radius 0.2 m is free to rotate about its center. A rope wrapped around the pulley supports a hanging mass of 2 kg. The system is released from rest.",
    parts: [
      {
        label: "a",
        prompt: "Draw free-body diagrams for both the pulley and the hanging mass.",
        solution:
          "Mass: Weight mg = 19.6 N downward, Tension T upward. Pulley: Tension T creates torque \u03C4 = TR. Pivot force supports pulley weight (no torque contribution).",
      },
      {
        label: "b",
        prompt: "Write Newton's second law for the hanging mass and the torque equation for the pulley.",
        solution:
          "Mass: mg - T = ma. Pulley: TR = I\u03B1 = (1/2)MR\u00B2\u03B1. Rolling constraint: a = R\u03B1, so \u03B1 = a/R.",
      },
      {
        label: "c",
        prompt: "Find the linear acceleration of the hanging mass.",
        solution:
          "From pulley: T = (1/2)Ma. Substituting into mass equation: mg - (1/2)Ma = ma. a = mg/(m + M/2) = 2(9.8)/(2 + 1.5) = 19.6/3.5 = 5.6 m/s\u00B2.",
      },
      {
        label: "d",
        prompt: "Calculate the tension in the rope.",
        solution:
          "T = (1/2)Ma = 0.5(3)(5.6) = 8.4 N. Note: T < mg = 19.6 N, confirming the mass accelerates downward.",
      },
    ],
  },
  {
    id: 3,
    title: "Rolling Down a Ramp",
    scenario:
      "A solid sphere (mass 4 kg, radius 0.15 m) is released from rest at the top of a ramp inclined at 30\u00B0 with height h = 2 m. It rolls without slipping.",
    parts: [
      {
        label: "a",
        prompt: "Using energy conservation, find the speed of the sphere at the bottom.",
        solution:
          "mgh = (1/2)mv\u00B2 + (1/2)I\u03C9\u00B2. For solid sphere I = (2/5)mr\u00B2, \u03C9 = v/r. mgh = (1/2)mv\u00B2 + (1/5)mv\u00B2 = (7/10)mv\u00B2. v = \u221A(10gh/7) = \u221A(10(9.8)(2)/7) = 5.29 m/s.",
      },
      {
        label: "b",
        prompt: "Find the linear acceleration of the center of mass down the ramp.",
        solution:
          "For a solid sphere rolling without slipping: a = (5/7)g sin\u03B8 = (5/7)(9.8)(sin 30\u00B0) = (5/7)(4.9) = 3.5 m/s\u00B2.",
      },
      {
        label: "c",
        prompt: "Determine the friction force on the sphere.",
        solution:
          "f = (2/7)mg sin\u03B8 = (2/7)(4)(9.8)(0.5) = 5.6 N. This static friction provides the torque needed for rolling.",
      },
      {
        label: "d",
        prompt: "If a hoop of the same mass and radius were released simultaneously, which reaches the bottom first? Explain.",
        solution:
          "The sphere wins. The hoop has I = mr\u00B2 (larger fraction of energy goes to rotation), giving a_hoop = (1/2)g sin\u03B8 = 2.45 m/s\u00B2 < 3.5 m/s\u00B2. Less translational KE means slower descent.",
      },
    ],
  },
];

export function FRQPractice() {
  const [currentFRQ, setCurrentFRQ] = useState(0);
  const [revealedParts, setRevealedParts] = useState<Set<string>>(new Set());

  const frq = frqs[currentFRQ];

  function toggleReveal(partLabel: string) {
    setRevealedParts((prev) => {
      const next = new Set(prev);
      if (next.has(partLabel)) next.delete(partLabel);
      else next.add(partLabel);
      return next;
    });
  }

  function changeFRQ(idx: number) {
    setCurrentFRQ(idx);
    setRevealedParts(new Set());
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FRQ Practice</CardTitle>
          <CardDescription>
            AP-style free-response questions with step-by-step solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {frqs.map((f, i) => (
              <Button
                key={f.id}
                variant={i === currentFRQ ? "default" : "outline"}
                size="sm"
                onClick={() => changeFRQ(i)}
              >
                FRQ {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="outline">FRQ {currentFRQ + 1}</Badge>
            <CardTitle>{frq.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{frq.scenario}</p>
          <Separator />
          <Accordion>
            {frq.parts.map((part) => (
              <AccordionItem key={part.label} value={part.label}>
                <AccordionTrigger>
                  <span>Part ({part.label}): {part.prompt}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground italic">
                      Try solving this on paper first, then reveal the solution.
                    </p>
                    {revealedParts.has(part.label) ? (
                      <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-sm border border-green-200 dark:border-green-800">
                        <strong>Solution:</strong> {part.solution}
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => toggleReveal(part.label)}>
                        Show Solution
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
