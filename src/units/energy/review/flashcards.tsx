"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Flashcard {
  front: string;
  back: string;
}

const cards: Flashcard[] = [
  { front: "Define work in physics.", back: "Work is the energy transferred by a force acting over a displacement: W = Fd cos(theta)." },
  { front: "What are the SI units of work?", back: "Joules (J). 1 J = 1 N*m = 1 kg*m^2/s^2." },
  { front: "When is work zero?", back: "When force is perpendicular to displacement (theta = 90 degrees), or when displacement is zero." },
  { front: "When is work negative?", back: "When the force component opposes the displacement (90 < theta <= 180). Example: friction." },
  { front: "Formula for kinetic energy.", back: "KE = 1/2 mv^2, where m is mass (kg) and v is velocity (m/s)." },
  { front: "Can kinetic energy be negative?", back: "No. Mass is positive and v^2 is always non-negative, so KE >= 0." },
  { front: "What happens to KE if speed doubles?", back: "KE quadruples (since KE is proportional to v^2)." },
  { front: "State the work-energy theorem.", back: "The net work done on an object equals its change in kinetic energy: W_net = Delta KE." },
  { front: "Formula for gravitational PE.", back: "PE_grav = mgh, where h is height above the reference level." },
  { front: "Is gravitational PE relative?", back: "Yes. It depends on the chosen reference level (h = 0). Only changes in PE matter physically." },
  { front: "Formula for elastic PE.", back: "PE_spring = 1/2 kx^2, where k is the spring constant and x is the displacement from equilibrium." },
  { front: "Does a compressed spring have the same PE as a stretched spring (same |x|)?", back: "Yes. PE depends on x^2, so compression and extension of the same magnitude give equal PE." },
  { front: "State conservation of mechanical energy.", back: "In a system with only conservative forces: KE_i + PE_i = KE_f + PE_f." },
  { front: "What is a conservative force?", back: "A force where the work done is path-independent (depends only on start and end positions). Examples: gravity, spring force." },
  { front: "What is a non-conservative force?", back: "A force where work depends on the path taken. Examples: friction, air resistance." },
  { front: "How does friction affect mechanical energy?", back: "Friction converts mechanical energy into thermal energy, reducing total mechanical energy." },
  { front: "Energy conservation with friction.", back: "KE_i + PE_i + W_nc = KE_f + PE_f, where W_nc is work done by non-conservative forces (negative for friction)." },
  { front: "Define power.", back: "Power is the rate of doing work or transferring energy: P = W/t." },
  { front: "SI unit of power.", back: "Watt (W). 1 W = 1 J/s." },
  { front: "Alternative formula for power.", back: "P = Fv (force times velocity), giving instantaneous power when force is along velocity." },
  { front: "What is 1 horsepower in watts?", back: "1 hp = 746 W." },
  { front: "What does the area under an F-vs-x graph represent?", back: "The work done by the force over that displacement." },
  { front: "At what point in a pendulum swing is KE maximum?", back: "At the lowest point of the swing (where PE is minimum)." },
  { front: "A ball is thrown upward. Where is total mechanical energy greatest?", back: "Total mechanical energy is the same everywhere (conserved), assuming no air resistance." },
  { front: "How do you find speed at any height using energy?", back: "Use mgh_i + 1/2 mv_i^2 = mgh_f + 1/2 mv_f^2. Solve for v_f. Mass cancels if no friction." },
  { front: "What is the relationship between work and energy?", back: "Work is the mechanism by which energy is transferred between objects or converted between forms." },
  { front: "Can a centripetal force do work?", back: "No. Centripetal force is always perpendicular to velocity, so it does zero work." },
];

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const handleNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  const toggleKnown = () => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flashcards: Energy</CardTitle>
            <Badge variant="outline">
              {index + 1}/{cards.length} | {known.size} mastered
            </Badge>
          </div>
          <CardDescription>
            {cards.length} flashcards covering work, energy, and power concepts.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card
        className="flex min-h-[220px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md"
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="pt-6 text-center">
          {!flipped ? (
            <div>
              <Badge variant="outline" className="mb-3">Question</Badge>
              <p className="text-xl font-medium text-foreground">{cards[index].front}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
            </div>
          ) : (
            <div>
              <Badge className="mb-3">Answer</Badge>
              <p className="text-lg text-foreground">{cards[index].back}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handlePrev} className="flex-1 cursor-pointer">
          Previous
        </Button>
        <Button
          variant={known.has(index) ? "default" : "outline"}
          onClick={toggleKnown}
          className="flex-1 cursor-pointer"
        >
          {known.has(index) ? "Mastered" : "Mark as Known"}
        </Button>
        <Button onClick={handleNext} className="flex-1 cursor-pointer">
          Next
        </Button>
      </div>
    </div>
  );
}
