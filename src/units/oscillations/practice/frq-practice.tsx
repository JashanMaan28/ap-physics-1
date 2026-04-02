"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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

const frqs = [
  {
    id: 1,
    title: "Spring-Mass Oscillation",
    scenario:
      "A 0.4 kg block is attached to a horizontal spring (k = 160 N/m) on a frictionless surface. The block is displaced 0.1 m from equilibrium and released from rest.",
    parts: [
      {
        label: "(a)",
        question: "Calculate the period and frequency of oscillation.",
        answer:
          "T = 2pi*sqrt(m/k) = 2pi*sqrt(0.4/160) = 2pi*sqrt(0.0025) = 2pi*0.05 = 0.314 s. f = 1/T = 3.18 Hz.",
      },
      {
        label: "(b)",
        question: "Determine the maximum speed of the block.",
        answer:
          "v_max = A*omega = A*2pi*f = 0.1 * 2pi * 3.18 = 2.0 m/s. Or v_max = A*sqrt(k/m) = 0.1*sqrt(160/0.4) = 0.1*20 = 2.0 m/s.",
      },
      {
        label: "(c)",
        question: "What is the maximum acceleration?",
        answer:
          "a_max = omega^2 * A = (20)^2 * 0.1 = 40 m/s^2. Or a_max = kA/m = 160*0.1/0.4 = 40 m/s^2.",
      },
      {
        label: "(d)",
        question:
          "Sketch graphs of x(t), v(t), and a(t) for two complete cycles. Label amplitudes and periods.",
        answer:
          "x(t) = 0.1 cos(20t): starts at +0.1 m, cosine wave, T=0.314 s. v(t) = -2.0 sin(20t): starts at 0, leads x by 90 deg. a(t) = -40 cos(20t): starts at -40, opposite phase to x.",
      },
    ],
  },
  {
    id: 2,
    title: "Pendulum on Another Planet",
    scenario:
      "A student measures the period of a 0.8 m simple pendulum to be 2.53 s on an unknown planet.",
    parts: [
      {
        label: "(a)",
        question: "Determine the gravitational acceleration on this planet.",
        answer:
          "T = 2pi*sqrt(L/g), so g = 4pi^2*L/T^2 = 4pi^2*0.8/(2.53)^2 = 39.478*0.8/6.4009 = 4.93 m/s^2.",
      },
      {
        label: "(b)",
        question:
          "If the pendulum length is doubled, what is the new period?",
        answer:
          "T_new = 2pi*sqrt(2L/g) = sqrt(2)*T_old = 1.414 * 2.53 = 3.58 s.",
      },
      {
        label: "(c)",
        question:
          "The student replaces the bob with one of triple the mass. How does the period change?",
        answer:
          "The period does not change. T = 2pi*sqrt(L/g) is independent of mass for a simple pendulum.",
      },
    ],
  },
  {
    id: 3,
    title: "Energy in a Spring System",
    scenario:
      "A 2.0 kg block oscillates on a spring with k = 800 N/m and amplitude 0.05 m.",
    parts: [
      {
        label: "(a)",
        question: "Calculate the total mechanical energy of the system.",
        answer: "E = 1/2 * k * A^2 = 0.5 * 800 * 0.0025 = 1.0 J.",
      },
      {
        label: "(b)",
        question:
          "At what displacement from equilibrium is KE equal to PE?",
        answer:
          "KE = PE when 1/2 kx^2 = 1/2 k(A^2 - x^2), so 2x^2 = A^2, x = A/sqrt(2) = 0.05/1.414 = 0.0354 m.",
      },
      {
        label: "(c)",
        question: "Find the speed when the block is at x = 0.03 m.",
        answer:
          "1/2 mv^2 = E - 1/2 kx^2 = 1.0 - 0.5*800*0.0009 = 1.0 - 0.36 = 0.64 J. v = sqrt(2*0.64/2.0) = sqrt(0.64) = 0.8 m/s.",
      },
    ],
  },
];

export function FRQPractice({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [activeFRQ, setActiveFRQ] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>FRQ Practice: Oscillations</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            AP-style free-response questions. Try solving each part before
            revealing the answer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {frqs.map((frq, i) => (
              <Button
                key={frq.id}
                variant={activeFRQ === i ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFRQ(i)}
              >
                FRQ {frq.id}
              </Button>
            ))}
          </div>

          <Separator />

          <Card className="bg-slate-50">
            <CardContent className="pt-4">
              <h3 className="font-bold text-lg">{frqs[activeFRQ].title}</h3>
              <p className="mt-2">{frqs[activeFRQ].scenario}</p>
            </CardContent>
          </Card>

          <Accordion>
            {frqs[activeFRQ].parts.map((part, i) => (
              <AccordionItem key={i} value={`part-${i}`}>
                <AccordionTrigger>
                  <span>
                    <span className="font-bold">{part.label}</span> {part.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-green-50 p-3 rounded text-green-900 text-sm font-mono whitespace-pre-wrap">
                    {part.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
