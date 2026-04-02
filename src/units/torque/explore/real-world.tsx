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

interface RealWorldExample {
  title: string;
  icon: string;
  physics: string;
  explanation: string;
  funFact: string;
  relatedConcepts: string[];
}

const examples: RealWorldExample[] = [
  {
    title: "Opening a Door",
    icon: "\uD83D\uDEAA",
    physics: "\u03C4 = rF sin\u03B8",
    explanation:
      "Door handles are placed far from the hinges to maximize the lever arm (r). Pushing near the hinge requires much more force for the same torque. The force is most effective perpendicular to the door (\u03B8 = 90\u00B0).",
    funFact: "Pushing a door at the handle requires about 5-10x less force than pushing near the hinge.",
    relatedConcepts: ["Torque", "Lever arm", "Perpendicular force"],
  },
  {
    title: "Using a Wrench",
    icon: "\uD83D\uDD27",
    physics: "\u03C4 = rF sin\u03B8",
    explanation:
      "A longer wrench provides a larger lever arm, requiring less force to achieve the same torque on a bolt. This is why mechanics use breaker bars for stuck bolts -- the extra length multiplies the effective torque.",
    funFact: "A 1-foot extension on a wrench can double your effective torque without extra effort.",
    relatedConcepts: ["Torque", "Mechanical advantage", "Lever arm"],
  },
  {
    title: "Bicycle Gears",
    icon: "\u2699\uFE0F",
    physics: "\u03C4 = I\u03B1 and gear ratios",
    explanation:
      "Low gear (big rear sprocket): large torque on the wheel for climbing hills, but lower speed. High gear (small rear sprocket): less torque but higher angular velocity of the wheel. The gear ratio changes the trade-off between torque and angular speed.",
    funFact: "A typical bicycle has gear ratios from about 1:1 (low) to 4:1 (high), providing a 4x range of mechanical advantage.",
    relatedConcepts: ["Torque", "Angular velocity", "Gear ratio"],
  },
  {
    title: "Figure Skater Spin",
    icon: "\u26F8\uFE0F",
    physics: "L = I\u03C9 (conservation of angular momentum)",
    explanation:
      "When a skater pulls their arms in, their moment of inertia decreases. Since angular momentum is conserved (no external torques), their angular velocity increases dramatically. Extending arms slows the spin.",
    funFact: "A figure skater can go from 2 rev/s to 7 rev/s just by pulling in their arms, reducing I by about 3.5x.",
    relatedConcepts: ["Moment of inertia", "Angular momentum", "Conservation laws"],
  },
  {
    title: "Car Engine Torque",
    icon: "\uD83D\uDE97",
    physics: "\u03C4 = rF and power = \u03C4\u03C9",
    explanation:
      "An engine produces torque on the crankshaft. More torque means better acceleration (truck engines). Higher RPM (\u03C9) with moderate torque means higher top speed (sports car engines). Transmissions convert between torque and angular velocity.",
    funFact: "A diesel truck engine can produce 1000+ N\u00B7m of torque, while a motorcycle might produce 100 N\u00B7m at much higher RPM.",
    relatedConcepts: ["Torque", "Power", "Angular velocity"],
  },
  {
    title: "Seesaw / Playground Balance",
    icon: "\u2696\uFE0F",
    physics: "\u03A3\u03C4 = 0",
    explanation:
      "A heavier person must sit closer to the fulcrum to balance a lighter person farther away. This is rotational equilibrium: m\u2081g d\u2081 = m\u2082g d\u2082. The same principle governs balance scales and lever-based machines.",
    funFact: "Archimedes said 'Give me a lever long enough and a fulcrum on which to place it, and I shall move the world.'",
    relatedConcepts: ["Rotational equilibrium", "Lever principle", "Torque balance"],
  },
];

export function RealWorld() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const ex = examples[selectedIdx];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-World Applications</CardTitle>
          <CardDescription>See torque and rotation in everyday life</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {examples.map((e, i) => (
              <Button
                key={i}
                variant={i === selectedIdx ? "default" : "outline"}
                className="h-auto py-2 flex-col"
                onClick={() => setSelectedIdx(i)}
              >
                <span className="text-xl">{e.icon}</span>
                <span className="text-xs mt-1">{e.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-3xl">{ex.icon}</span>
            {ex.title}
          </CardTitle>
          <CardDescription className="font-mono">{ex.physics}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{ex.explanation}</p>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800">
            <p className="text-sm"><strong>Fun Fact:</strong> {ex.funFact}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {ex.relatedConcepts.map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
