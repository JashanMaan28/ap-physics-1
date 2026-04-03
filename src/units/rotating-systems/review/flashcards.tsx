"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Flashcard {
  front: string;
  back: string;
  topic: string;
}

const cards: Flashcard[] = [
  { front: "Rotational kinetic energy formula", back: "KE_rot = (1/2)Iω²", topic: "rotational-ke" },
  { front: "Angular momentum formula", back: "L = Iω", topic: "angular-momentum" },
  { front: "Conservation of angular momentum condition", back: "No net external torque: I₁ω₁ = I₂ω₂", topic: "conservation-angular" },
  { front: "Rolling without slipping constraint", back: "v = Rω (contact point has zero velocity)", topic: "rolling-motion" },
  { front: "Total KE for rolling object", back: "KE = (1/2)mv² + (1/2)Iω²", topic: "rolling-motion" },
  { front: "Moment of inertia: solid cylinder", back: "I = (1/2)MR²", topic: "rotational-ke" },
  { front: "Moment of inertia: solid sphere", back: "I = (2/5)MR²", topic: "rotational-ke" },
  { front: "Moment of inertia: thin hoop", back: "I = MR²", topic: "rotational-ke" },
  { front: "Moment of inertia: hollow sphere", back: "I = (2/3)MR²", topic: "rotational-ke" },
  { front: "Moment of inertia: thin rod (center)", back: "I = (1/12)ML²", topic: "rotational-ke" },
  { front: "Moment of inertia: thin rod (end)", back: "I = (1/3)ML²", topic: "rotational-ke" },
  { front: "Parallel axis theorem", back: "I = I_cm + Md²", topic: "rotational-ke" },
  { front: "Angular impulse-momentum theorem", back: "τΔt = ΔL", topic: "angular-momentum" },
  { front: "What happens when a skater pulls arms in?", back: "I decreases, ω increases, L stays constant, KE increases", topic: "conservation-angular" },
  { front: "Speed of rolling object down incline (I = cmR²)", back: "v = √(2gh/(1 + c))", topic: "rolling-motion" },
  { front: "Which shape wins a rolling race?", back: "Solid sphere (smallest c = 2/5), mass and radius don't matter", topic: "rolling-motion" },
  { front: "Acceleration of mass on string around solid disk pulley", back: "a = mg/(m + M/2)", topic: "combined-rotation" },
  { front: "Yo-yo (solid disk) acceleration", back: "a = 2g/3 ≈ 6.53 m/s²", topic: "combined-rotation" },
  { front: "Why is T < mg for a falling yo-yo?", back: "The mass accelerates downward, so mg - T = ma, meaning T = m(g-a) < mg", topic: "combined-rotation" },
  { front: "Units of angular momentum", back: "kg·m²/s (also J·s or N·m·s)", topic: "angular-momentum" },
  { front: "Units of moment of inertia", back: "kg·m²", topic: "rotational-ke" },
  { front: "Does static friction do work in rolling?", back: "No, because the contact point has zero velocity", topic: "rolling-motion" },
  { front: "Rotational analog of F = ma", back: "τ = Iα (net torque = moment of inertia × angular acceleration)", topic: "combined-rotation" },
  { front: "Rotational analog of p = mv", back: "L = Iω (angular momentum = moment of inertia × angular velocity)", topic: "angular-momentum" },
  { front: "What provides torque for rolling on an incline?", back: "Static friction at the contact point", topic: "rolling-motion" },
  { front: "In Atwood machine with massive pulley, are tensions equal?", back: "No. T₁ ≠ T₂ because the pulley needs net torque to accelerate.", topic: "combined-rotation" },
  { front: "KE in terms of angular momentum", back: "KE = L²/(2I)", topic: "rotational-ke" },
  { front: "Why does shape (not mass/radius) determine rolling race winner?", back: "In mgh = (1/2)mv²(1+c), both m and R cancel. Only geometric factor c remains.", topic: "rolling-motion" },
];

export function Flashcards() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[currentIdx];

  const markKnown = () => {
    setKnown((prev) => new Set(prev).add(currentIdx));
    next();
  };

  const next = () => {
    setFlipped(false);
    setCurrentIdx((i) => (i + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setCurrentIdx((i) => (i - 1 + cards.length) % cards.length);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Flashcards</h2>
        <Badge variant="secondary">
          {currentIdx + 1} / {cards.length} &middot; {known.size} known
        </Badge>
      </div>

      {/* Progress */}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-teal-500 transition-all"
          style={{ width: `${(known.size / cards.length) * 100}%` }}
        />
      </div>

      <Card
        className={`flex min-h-[220px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md ${
          known.has(currentIdx) ? "opacity-50" : ""
        }`}
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="text-center py-12 px-8">
          {!flipped ? (
            <div>
              <p className="mb-4 text-xs text-muted-foreground">QUESTION (click to flip)</p>
              <p className="text-xl font-bold text-foreground">{card.front}</p>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-xs text-muted-foreground">ANSWER</p>
              <p className="text-xl font-mono text-foreground">{card.back}</p>
            </div>
          )}
          <Badge variant="outline" className="mt-4 border-teal-500/40 bg-teal-500/10 text-teal-300">{card.topic}</Badge>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={prev}
          variant="outline"
          className="cursor-pointer"
        >
          Previous
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={markKnown}
            variant="outline"
            className="cursor-pointer border-green-700 text-green-300 hover:bg-green-900/20"
          >
            Got It
          </Button>
          <Button onClick={next} className="cursor-pointer bg-teal-600 hover:bg-teal-700">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
