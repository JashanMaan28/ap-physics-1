"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface FRQ {
  id: string;
  title: string;
  scenario: string;
  parts: {
    label: string;
    question: string;
    points: number;
    rubric: string[];
    sampleAnswer: string;
  }[];
}

const frqs: FRQ[] = [
  {
    id: "frq1",
    title: "FRQ 1: Collision on a Track",
    scenario:
      "A 4 kg cart (Cart A) traveling at 6 m/s to the right on a frictionless track collides with a 2 kg cart (Cart B) initially at rest. After the collision, Cart A moves to the right at 2 m/s.",
    parts: [
      {
        label: "a",
        question: "Calculate the velocity of Cart B after the collision.",
        points: 3,
        rubric: [
          "1 pt: Correctly states conservation of momentum equation",
          "1 pt: Correct substitution of values",
          "1 pt: Correct answer with units (8 m/s to the right)",
        ],
        sampleAnswer:
          "m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f\n(4)(6) + (2)(0) = (4)(2) + (2)v₂f\n24 = 8 + 2v₂f\nv₂f = 8 m/s to the right",
      },
      {
        label: "b",
        question: "Determine whether this collision is elastic or inelastic. Justify your answer with a calculation.",
        points: 4,
        rubric: [
          "1 pt: Calculates KE before collision correctly (72 J)",
          "1 pt: Calculates KE after collision correctly (72 J)",
          "1 pt: Compares KE before and after",
          "1 pt: Correct conclusion with justification (elastic because KE is conserved)",
        ],
        sampleAnswer:
          "KEᵢ = ½(4)(6)² + ½(2)(0)² = 72 J\nKEf = ½(4)(2)² + ½(2)(8)² = 8 + 64 = 72 J\nSince KEᵢ = KEf = 72 J, kinetic energy is conserved, so this is an elastic collision.",
      },
      {
        label: "c",
        question:
          "If instead the carts stuck together, calculate the final velocity and the kinetic energy lost.",
        points: 3,
        rubric: [
          "1 pt: Correct perfectly inelastic equation and final velocity (4 m/s)",
          "1 pt: Correct KE after (48 J)",
          "1 pt: Correct KE lost (24 J)",
        ],
        sampleAnswer:
          "vf = m₁v₁ᵢ/(m₁+m₂) = (4)(6)/(6) = 4 m/s\nKEf = ½(6)(4)² = 48 J\nKE lost = 72 − 48 = 24 J",
      },
    ],
  },
  {
    id: "frq2",
    title: "FRQ 2: Impulse and Force Analysis",
    scenario:
      "A 0.4 kg ball is dropped from rest and hits the ground at 10 m/s. It bounces back up at 8 m/s. The ball is in contact with the ground for 0.05 s.",
    parts: [
      {
        label: "a",
        question: "Calculate the impulse delivered to the ball by the ground.",
        points: 3,
        rubric: [
          "1 pt: Correct identification of initial and final velocities with signs",
          "1 pt: Correct impulse calculation",
          "1 pt: Correct answer with units (7.2 N·s upward)",
        ],
        sampleAnswer:
          "Taking up as positive: vᵢ = −10 m/s, vf = +8 m/s\nJ = Δp = m(vf − vᵢ) = 0.4(8 − (−10)) = 0.4(18) = 7.2 N·s upward",
      },
      {
        label: "b",
        question: "Calculate the average force exerted by the ground on the ball.",
        points: 2,
        rubric: [
          "1 pt: Correct application of F = J/Δt",
          "1 pt: Correct answer (144 N upward)",
        ],
        sampleAnswer: "F = J/Δt = 7.2/0.05 = 144 N upward",
      },
      {
        label: "c",
        question:
          "Sketch a possible Force vs. Time graph for this collision. Explain how the area under the curve relates to your answer in part (a).",
        points: 3,
        rubric: [
          "1 pt: Graph shows force only during contact time (0 to 0.05 s)",
          "1 pt: Graph peaks above 144 N (since average is 144, peak must be higher for realistic shape)",
          "1 pt: States area under curve equals impulse (7.2 N·s)",
        ],
        sampleAnswer:
          "The F-t graph shows zero force before and after contact. During the 0.05 s contact, force rises to a peak and returns to zero (roughly triangular or bell-shaped). The area under this curve equals the impulse of 7.2 N·s. For a triangular pulse, the peak force would be about 288 N.",
      },
    ],
  },
  {
    id: "frq3",
    title: "FRQ 3: Explosion / Recoil",
    scenario:
      "A 70 kg astronaut is floating at rest in space. She throws a 5 kg tool kit at 8 m/s to the right.",
    parts: [
      {
        label: "a",
        question: "What is the astronaut's velocity after throwing the tool kit? Justify using conservation of momentum.",
        points: 3,
        rubric: [
          "1 pt: States total initial momentum is zero",
          "1 pt: Correct conservation equation",
          "1 pt: Correct answer (−0.571 m/s, i.e., to the left)",
        ],
        sampleAnswer:
          "Initial momentum = 0 (both at rest)\n0 = m_astro × v_astro + m_tool × v_tool\n0 = (70)(v_astro) + (5)(8)\nv_astro = −40/70 = −0.571 m/s (to the left)",
      },
      {
        label: "b",
        question: "Calculate the kinetic energy of the system after the throw. Where did this energy come from?",
        points: 3,
        rubric: [
          "1 pt: Correct KE of tool kit (160 J)",
          "1 pt: Correct KE of astronaut (11.4 J)",
          "1 pt: States energy came from astronaut's internal/chemical energy (muscles)",
        ],
        sampleAnswer:
          "KE_tool = ½(5)(8)² = 160 J\nKE_astro = ½(70)(0.571)² ≈ 11.4 J\nTotal KE = 171.4 J\nThis energy came from the astronaut's internal (chemical/metabolic) energy — her muscles did work to throw the tool kit.",
      },
      {
        label: "c",
        question: "Is momentum conserved in this scenario? Is kinetic energy conserved? Explain.",
        points: 2,
        rubric: [
          "1 pt: Momentum is conserved (no external forces in space) — total is still 0",
          "1 pt: KE is not conserved in the traditional sense — it increased from 0 to 171.4 J due to internal energy conversion",
        ],
        sampleAnswer:
          "Momentum IS conserved: pᵢ = 0 and pf = (70)(−0.571) + (5)(8) = −40 + 40 = 0. No external forces act on the system.\nKE is NOT conserved in the sense that it changed from 0 to 171.4 J. This is an 'explosion' — internal energy was converted to KE.",
      },
    ],
  },
];

export function FRQPractice() {
  const [activeFRQ, setActiveFRQ] = useState(0);
  const [revealedParts, setRevealedParts] = useState<Set<string>>(new Set());

  const toggleReveal = (partKey: string) => {
    setRevealedParts((prev) => {
      const next = new Set(prev);
      if (next.has(partKey)) next.delete(partKey);
      else next.add(partKey);
      return next;
    });
  };

  const frq = frqs[activeFRQ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">FRQ Practice</CardTitle>
          <CardDescription>Free-response questions styled after the AP Physics 1 exam</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={String(activeFRQ)} onValueChange={(v) => { setActiveFRQ(Number(v)); setRevealedParts(new Set()); }}>
        <TabsList className="grid w-full grid-cols-3">
          {frqs.map((f, i) => (
            <TabsTrigger key={f.id} value={String(i)}>FRQ {i + 1}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{frq.title}</CardTitle>
            <Badge variant="outline">
              {frq.parts.reduce((sum, p) => sum + p.points, 0)} pts total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded">
            <p>{frq.scenario}</p>
          </div>

          <Separator />

          {frq.parts.map((part) => {
            const key = `${frq.id}-${part.label}`;
            const revealed = revealedParts.has(key);
            return (
              <div key={key} className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium">
                    ({part.label}) {part.question}
                    <Badge variant="secondary" className="ml-2">{part.points} pt{part.points > 1 ? "s" : ""}</Badge>
                  </p>
                </div>

                <Button variant="outline" size="sm" onClick={() => toggleReveal(key)}>
                  {revealed ? "Hide Solution" : "Show Solution"}
                </Button>

                {revealed && (
                  <div className="space-y-3">
                    <div className="bg-muted p-4 rounded font-mono text-sm whitespace-pre-line">
                      {part.sampleAnswer}
                    </div>
                    <Accordion>
                      <AccordionItem value="rubric">
                        <AccordionTrigger className="text-sm">Scoring Rubric</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {part.rubric.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                <Separator />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default FRQPractice;
