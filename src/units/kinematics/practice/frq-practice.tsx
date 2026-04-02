"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FRQPart { label: string; question: string; points: number; rubric: string[]; sampleResponse: string; }
interface FRQ { id: number; title: string; scenario: string; given: string[]; parts: FRQPart[]; }

const problems: FRQ[] = [
  {
    id: 1, title: "Car Braking on a Highway",
    scenario: "A car traveling at 30 m/s applies its brakes and decelerates uniformly, coming to a complete stop in 75 m.",
    given: ["v₀ = 30 m/s", "v = 0 m/s", "Δx = 75 m", "g = 9.8 m/s²"],
    parts: [
      { label: "a", question: "Determine the acceleration of the car.", points: 2, rubric: ["(1 pt) Uses v² = v₀² + 2aΔx correctly", "(1 pt) a = −6.0 m/s²"], sampleResponse: "v² = v₀² + 2aΔx\n0 = 900 + 2a(75)\na = −900/150 = −6.0 m/s²" },
      { label: "b", question: "Calculate the time it takes to stop.", points: 2, rubric: ["(1 pt) Uses v = v₀ + at", "(1 pt) t = 5.0 s"], sampleResponse: "v = v₀ + at\n0 = 30 + (−6.0)t\nt = 5.0 s" },
      { label: "c", question: "Sketch the v-t graph and explain how the area relates to displacement.", points: 3, rubric: ["(1 pt) Straight line from (0, 30) to (5, 0)", "(1 pt) States area = displacement", "(1 pt) Calculates area = ½(30)(5) = 75 m ✓"], sampleResponse: "The v-t graph is a straight line from v=30 at t=0 to v=0 at t=5s. The area under this line is a triangle:\nA = ½ × base × height = ½ × 5 × 30 = 75 m\nThis equals the given displacement, confirming our calculation." },
    ],
  },
  {
    id: 2, title: "Projectile from a Cliff",
    scenario: "A ball is thrown horizontally at 15 m/s from the edge of a 45 m tall cliff.",
    given: ["v₀ₓ = 15 m/s", "v₀ᵧ = 0", "h = 45 m", "g = 9.8 m/s²"],
    parts: [
      { label: "a", question: "How long does it take the ball to reach the ground?", points: 2, rubric: ["(1 pt) Uses h = ½gt²", "(1 pt) t = 3.03 s"], sampleResponse: "h = ½gt²\n45 = ½(9.8)t²\nt² = 9.18\nt = 3.03 s" },
      { label: "b", question: "How far from the base of the cliff does it land?", points: 2, rubric: ["(1 pt) Uses x = v₀ₓ × t", "(1 pt) x = 45.5 m"], sampleResponse: "x = v₀ₓ × t = 15 × 3.03 = 45.5 m" },
      { label: "c", question: "What is the ball's speed just before it hits the ground?", points: 3, rubric: ["(1 pt) Finds vᵧ = gt = 29.7 m/s", "(1 pt) Uses v = √(vₓ² + vᵧ²)", "(1 pt) v = 33.3 m/s"], sampleResponse: "vᵧ = gt = 9.8 × 3.03 = 29.7 m/s\nvₓ = 15 m/s (constant)\nv = √(15² + 29.7²) = √(225 + 882) = √1107 = 33.3 m/s" },
    ],
  },
  {
    id: 3, title: "Two-Stage Rocket Launch",
    scenario: "A model rocket accelerates upward at 20 m/s² for 3 s, then the engine cuts off and it continues under gravity alone until it reaches maximum height.",
    given: ["a₁ = 20 m/s²", "t₁ = 3 s", "g = 9.8 m/s²"],
    parts: [
      { label: "a", question: "Find the velocity and height at engine cutoff.", points: 2, rubric: ["(1 pt) v = 60 m/s", "(1 pt) h = 90 m"], sampleResponse: "v = at = 20 × 3 = 60 m/s\nh = ½at² = ½(20)(9) = 90 m" },
      { label: "b", question: "Find the maximum height reached.", points: 3, rubric: ["(1 pt) Uses v² = v₀² − 2g(Δh)", "(1 pt) Δh = 183.7 m", "(1 pt) Total = 273.7 m"], sampleResponse: "After cutoff: v² = v₀² − 2gΔh\n0 = 3600 − 2(9.8)Δh\nΔh = 183.7 m\nTotal height = 90 + 183.7 = 273.7 m" },
      { label: "c", question: "Find the total time from launch to landing.", points: 3, rubric: ["(1 pt) Time to peak after cutoff: t = 6.12 s", "(1 pt) Total fall from 273.7 m: t = 7.47 s", "(1 pt) Total = 3 + 6.12 + 7.47 = 16.6 s"], sampleResponse: "Time engine→peak: v = v₀ − gt → t₂ = 60/9.8 = 6.12 s\nFall from 273.7 m: h = ½gt² → t₃ = √(2×273.7/9.8) = 7.47 s\nTotal = 3 + 6.12 + 7.47 = 16.6 s" },
    ],
  },
];

export function FRQPractice() {
  const [activeProblem, setActiveProblem] = useState(0);
  const [showParts, setShowParts] = useState<Record<string, boolean>>({});

  const p = problems[activeProblem];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>FRQ Practice</CardTitle>
          <CardDescription>Free-response questions with rubrics and sample answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {problems.map((prob, i) => (
              <Button key={prob.id} variant={i === activeProblem ? "default" : "outline"} size="sm" onClick={() => { setActiveProblem(i); setShowParts({}); }} className="cursor-pointer">{prob.title}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{p.title}</CardTitle>
          <CardDescription>{p.scenario}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {p.given.map(g => <Badge key={g} variant="secondary" className="font-mono text-xs">{g}</Badge>)}
          </div>
          <Separator />
          {p.parts.map(part => (
            <div key={part.label} className="space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">({part.label}) {part.question} <Badge variant="outline" className="ml-2 text-[10px]">{part.points} pts</Badge></p>
              </div>
              {showParts[part.label] ? (
                <div className="rounded-lg bg-muted/50 border p-3 space-y-2">
                  <p className="text-xs font-semibold text-primary">Rubric:</p>
                  {part.rubric.map((r, i) => <p key={i} className="text-xs text-muted-foreground">{r}</p>)}
                  <Separator />
                  <p className="text-xs font-semibold text-primary">Sample Response:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line font-mono">{part.sampleResponse}</p>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowParts(p => ({ ...p, [part.label]: true }))} className="cursor-pointer text-xs">Show Answer</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
