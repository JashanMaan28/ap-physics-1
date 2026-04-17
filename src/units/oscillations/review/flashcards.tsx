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
import { Progress } from "@/components/ui/progress";
import { PhysicsText } from "@/components/ui/physics-text";

interface Flashcard {
  front: string;
  back: string;
}

const cards: Flashcard[] = [
  { front: "What is Simple Harmonic Motion (SHM)?", back: "Periodic motion where the restoring force is proportional to displacement from equilibrium: F = -kx." },
  { front: "Position equation for SHM", back: "x(t) = A cos(omega*t + phi)" },
  { front: "Velocity equation for SHM", back: "v(t) = -A*omega*sin(omega*t + phi)" },
  { front: "Acceleration equation for SHM", back: "a(t) = -A*omega^2*cos(omega*t + phi) = -omega^2 * x(t)" },
  { front: "Period of a spring-mass system", back: "T = 2*pi*sqrt(m/k)" },
  { front: "Period of a simple pendulum", back: "T = 2*pi*sqrt(L/g) (small angles only)" },
  { front: "Relationship: omega and frequency", back: "omega = 2*pi*f" },
  { front: "Relationship: omega and period", back: "omega = 2*pi / T" },
  { front: "Total energy in SHM", back: "E = 1/2 * k * A^2 (constant for undamped SHM)" },
  { front: "Kinetic energy in SHM", back: "KE = 1/2 * m * v^2 = 1/2 * k * (A^2 - x^2)" },
  { front: "Potential energy in SHM (spring)", back: "PE = 1/2 * k * x^2" },
  { front: "Maximum speed in SHM", back: "v_max = A * omega (occurs at x = 0)" },
  { front: "Maximum acceleration in SHM", back: "a_max = A * omega^2 (occurs at x = +/- A)" },
  { front: "What is Hooke's Law?", back: "F = -kx, where k is the spring constant and x is displacement from equilibrium." },
  { front: "At what position is KE = PE?", back: "At x = A / sqrt(2), approximately 0.707A." },
  { front: "Effect of doubling mass on spring period", back: "Period increases by sqrt(2) since T is proportional to sqrt(m)." },
  { front: "Effect of doubling spring constant on period", back: "Period decreases by sqrt(2) since T is proportional to 1/sqrt(k)." },
  { front: "Effect of doubling pendulum length on period", back: "Period increases by sqrt(2) since T is proportional to sqrt(L)." },
  { front: "Phase relationship: velocity and position", back: "Velocity leads position by 90 degrees (pi/2 radians)." },
  { front: "Phase relationship: acceleration and position", back: "Acceleration is 180 degrees (pi radians) out of phase with position." },
  { front: "Does amplitude affect period in SHM?", back: "No. Period is independent of amplitude for ideal SHM." },
  { front: "Does mass affect pendulum period?", back: "No. Period depends only on length and gravitational acceleration." },
  { front: "Springs in parallel: effective k", back: "k_eff = k1 + k2 (forces add for same displacement)." },
  { front: "Springs in series: effective k", back: "1/k_eff = 1/k1 + 1/k2 (displacements add for same force)." },
  { front: "What is the restoring force?", back: "A force that always points toward the equilibrium position, proportional to displacement." },
  { front: "Condition for SHM", back: "The net force (or torque) must be proportional to, and opposite in direction to, the displacement from equilibrium." },
  { front: "Energy at equilibrium position", back: "All kinetic (KE = E_total, PE = 0), object at maximum speed." },
  { front: "Energy at turning points (+/- A)", back: "All potential (PE = E_total, KE = 0), object momentarily at rest." },
];

export function Flashcards({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[index];

  const markKnown = () => {
    setKnown((prev) => new Set(prev).add(index));
    next();
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flashcards: Oscillations</CardTitle>
            <Badge variant="secondary">
              {known.size} / {cards.length} known
            </Badge>
          </div>
          <CardDescription>Click the card to flip it.</CardDescription>
          <Progress value={(known.size / cards.length) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Card {index + 1} of {cards.length}
          </p>

          <Card
            className={`flex min-h-[200px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md ${
              flipped ? "border-cyan-500/40 bg-cyan-500/10" : ""
            } ${known.has(index) ? "opacity-50" : ""}`}
            onClick={() => setFlipped(!flipped)}
          >
            <CardContent className="pt-6 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                {flipped ? "Answer" : "Question"}
              </p>
              {flipped ? (
                <PhysicsText className="text-lg font-medium text-foreground">{card.back}</PhysicsText>
              ) : (
                <p className="text-lg font-medium text-foreground">{card.front}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={prev} variant="outline" className="flex-1 cursor-pointer">
              Previous
            </Button>
            <Button onClick={() => setFlipped(!flipped)} variant="outline" className="flex-1 cursor-pointer">
              Flip
            </Button>
            <Button onClick={next} variant="outline" className="flex-1 cursor-pointer">
              Next
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={markKnown} variant="outline" className="flex-1 cursor-pointer" disabled={known.has(index)}>
              Mark as Known
            </Button>
            <Button onClick={onComplete} disabled={isComplete} className="flex-1 cursor-pointer">
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
