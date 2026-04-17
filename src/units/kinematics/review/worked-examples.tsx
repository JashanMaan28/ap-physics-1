"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhysicsText } from "@/components/ui/physics-text";

interface Example { id: number; title: string; problem: string; steps: { label: string; work: string }[]; answer: string; }

const examples: Example[] = [
  {
    id: 1, title: "Catching the Bus",
    problem: "A bus starts from rest and accelerates at 1.5 m/s². A student 20 m behind starts running at a constant 6 m/s at the same moment. When does the student catch the bus?",
    steps: [
      { label: "Set up equations", work: "Bus: x_b = ½(1.5)t² = 0.75t²\nStudent: x_s = −20 + 6t\n(Student starts 20 m behind)" },
      { label: "Set positions equal", work: "0.75t² = −20 + 6t\n0.75t² − 6t + 20 = 0" },
      { label: "Solve quadratic", work: "t = (6 ± √(36 − 60)) / 1.5 = (6 ± √(−24)) / 1.5\nDiscriminant < 0 → The student never catches the bus!\n\nThe bus accelerates too quickly." },
    ],
    answer: "The student never catches the bus. The minimum running speed to catch up is v = √(2 × 1.5 × 20) = 7.75 m/s."
  },
  {
    id: 2, title: "Dropped Ball",
    problem: "A ball is dropped from a 45 m building. Find (a) time to hit ground, (b) velocity on impact. (g = 9.8 m/s²)",
    steps: [
      { label: "Identify knowns", work: "v₀ = 0 (dropped), Δy = 45 m, a = 9.8 m/s² (downward = positive here)" },
      { label: "Find time", work: "Δy = v₀t + ½gt²\n45 = 0 + ½(9.8)t²\nt² = 45/4.9 = 9.18\nt = 3.03 s" },
      { label: "Find impact velocity", work: "v = v₀ + gt = 0 + 9.8(3.03) = 29.7 m/s" },
    ],
    answer: "t = 3.03 s, v = 29.7 m/s downward"
  },
  {
    id: 3, title: "Projectile off a Table",
    problem: "A marble rolls off a 1.2 m high table at 3.5 m/s horizontally. Where does it land?",
    steps: [
      { label: "Find fall time (vertical)", work: "h = ½gt² → 1.2 = ½(9.8)t²\nt² = 0.245 → t = 0.495 s" },
      { label: "Find horizontal distance", work: "x = vₓ × t = 3.5 × 0.495 = 1.73 m" },
      { label: "Find final velocity", work: "vᵧ = gt = 9.8(0.495) = 4.85 m/s\nv = √(3.5² + 4.85²) = √(12.25 + 23.5) = 5.98 m/s" },
    ],
    answer: "The marble lands 1.73 m from the table base at 5.98 m/s."
  },
  {
    id: 4, title: "Two-Car Meeting",
    problem: "Car A starts at rest and accelerates at 3 m/s². Car B, 100 m ahead, travels at constant 20 m/s. When does A pass B?",
    steps: [
      { label: "Position equations", work: "Car A: x_A = ½(3)t² = 1.5t²\nCar B: x_B = 100 + 20t" },
      { label: "Set equal", work: "1.5t² = 100 + 20t\n1.5t² − 20t − 100 = 0\n3t² − 40t − 200 = 0" },
      { label: "Solve", work: "t = (40 ± √(1600 + 2400))/6 = (40 ± √4000)/6 = (40 ± 63.2)/6\nt = 17.2 s (take positive root)" },
    ],
    answer: "Car A passes Car B at t = 17.2 s, at position x = 1.5(17.2)² = 444 m."
  },
  {
    id: 5, title: "Symmetry of Projectile Motion",
    problem: "A ball is thrown at 25 m/s at 53° above horizontal. Find time of flight, max height, and range.",
    steps: [
      { label: "Components", work: "vₓ = 25 cos 53° = 15.0 m/s\nvᵧ = 25 sin 53° = 20.0 m/s" },
      { label: "Time of flight", work: "T = 2vᵧ/g = 2(20)/9.8 = 4.08 s" },
      { label: "Max height", work: "H = vᵧ²/(2g) = 400/19.6 = 20.4 m" },
      { label: "Range", work: "R = vₓ × T = 15.0 × 4.08 = 61.2 m" },
    ],
    answer: "T = 4.08 s, H = 20.4 m, R = 61.2 m"
  },
];

export function WorkedExamples() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Worked Examples</CardTitle>
          <CardDescription>Step-by-step kinematics problem solutions</CardDescription>
        </CardHeader>
      </Card>
      {examples.map(ex => (
        <Card key={ex.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{ex.title}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setExpanded(p => ({ ...p, [ex.id]: !p[ex.id] }))} className="cursor-pointer text-xs">
                {expanded[ex.id] ? "Hide" : "Show"} Solution
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{ex.problem}</p>
          </CardHeader>
          {expanded[ex.id] && (
            <CardContent className="space-y-3">
              {ex.steps.map((s, i) => (
                <div key={i}>
                  <Badge variant="outline" className="text-[10px] mb-1">Step {i + 1}: {s.label}</Badge>
                  <PhysicsText className="text-sm text-muted-foreground">{s.work}</PhysicsText>
                </div>
              ))}
              <Separator />
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-sm font-semibold">Answer: {ex.answer}</p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
