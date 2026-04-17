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
import { PhysicsText } from "@/components/ui/physics-text";

interface Flashcard {
  front: string;
  back: string;
  category: string;
}

const cards: Flashcard[] = [
  { front: "What is torque?", back: "The rotational equivalent of force; the tendency of a force to cause rotation about an axis. \u03C4 = rF sin\u03B8.", category: "Torque" },
  { front: "What are the units of torque?", back: "Newton-meters (N\u00B7m). Dimensionally the same as joules, but kept as N\u00B7m to distinguish from energy.", category: "Torque" },
  { front: "When is torque maximized?", back: "When the force is perpendicular to the lever arm (\u03B8 = 90\u00B0), making sin\u03B8 = 1.", category: "Torque" },
  { front: "What is the moment arm?", back: "The perpendicular distance from the axis of rotation to the line of action of the force. Equals r sin\u03B8.", category: "Torque" },
  { front: "What is the sign convention for torque?", back: "Counterclockwise (CCW) is positive, clockwise (CW) is negative. Be consistent!", category: "Torque" },
  { front: "What is rotational equilibrium?", back: "When the net torque about any axis is zero: \u03A3\u03C4 = 0. The object has zero angular acceleration.", category: "Equilibrium" },
  { front: "What two conditions are needed for static equilibrium?", back: "\u03A3F = 0 (translational) and \u03A3\u03C4 = 0 (rotational). No linear or angular acceleration.", category: "Equilibrium" },
  { front: "How should you choose a pivot point?", back: "Choose the pivot where an unknown force acts. That force produces zero torque (r = 0), simplifying the equation.", category: "Equilibrium" },
  { front: "What is moment of inertia?", back: "The rotational analog of mass. It measures resistance to angular acceleration: I = \u03A3m_i r_i\u00B2.", category: "Inertia" },
  { front: "Moment of inertia of a solid disk?", back: "I = (1/2)MR\u00B2, axis through center perpendicular to face.", category: "Inertia" },
  { front: "Moment of inertia of a hoop/ring?", back: "I = MR\u00B2, axis through center perpendicular to plane.", category: "Inertia" },
  { front: "Moment of inertia of a solid sphere?", back: "I = (2/5)MR\u00B2, axis through center.", category: "Inertia" },
  { front: "Moment of inertia of a rod (center)?", back: "I = (1/12)ML\u00B2, axis through center perpendicular to length.", category: "Inertia" },
  { front: "Moment of inertia of a rod (end)?", back: "I = (1/3)ML\u00B2, axis through one end perpendicular to length.", category: "Inertia" },
  { front: "State the parallel axis theorem.", back: "I = I_cm + Md\u00B2, where d is the distance from the center of mass to the new parallel axis.", category: "Inertia" },
  { front: "What does more mass farther from the axis do to I?", back: "Increases I. Moment of inertia depends on r\u00B2, so mass far from the axis contributes much more.", category: "Inertia" },
  { front: "State Newton's second law for rotation.", back: "\u03A3\u03C4 = I\u03B1. Net torque equals moment of inertia times angular acceleration.", category: "Newton" },
  { front: "What are the linear-rotational analogs?", back: "x \u2194 \u03B8, v \u2194 \u03C9, a \u2194 \u03B1, m \u2194 I, F \u2194 \u03C4, p \u2194 L.", category: "Newton" },
  { front: "If net torque is zero, what can you say about \u03C9?", back: "\u03C9 is constant (could be zero or nonzero). Zero net torque means \u03B1 = 0, not \u03C9 = 0.", category: "Newton" },
  { front: "\u03C9 = \u03C9\u2080 + \u03B1t is analogous to what linear equation?", back: "v = v\u2080 + at. Replace v with \u03C9 and a with \u03B1.", category: "Kinematics" },
  { front: "State the angular displacement equation.", back: "\u03B8 = \u03C9\u2080 t + (1/2)\u03B1 t\u00B2. Valid for constant angular acceleration.", category: "Kinematics" },
  { front: "State the time-independent angular kinematic equation.", back: "\u03C9\u00B2 = \u03C9\u2080\u00B2 + 2\u03B1\u03B8. Analogous to v\u00B2 = v\u2080\u00B2 + 2ax.", category: "Kinematics" },
  { front: "How do you convert revolutions to radians?", back: "Multiply by 2\u03C0. 1 revolution = 2\u03C0 radians = 360\u00B0.", category: "Kinematics" },
  { front: "Relationship between linear and angular velocity?", back: "v = r\u03C9 for a point at distance r from the axis (tangential speed).", category: "Kinematics" },
  { front: "What is the rolling without slipping condition?", back: "v_cm = R\u03C9 and a_cm = R\u03B1. The contact point has zero velocity relative to the surface.", category: "Kinematics" },
  { front: "In a race down a ramp, which wins: sphere, disk, or hoop?", back: "Solid sphere (smallest I/MR\u00B2 ratio = 2/5), then disk (1/2), then hoop (1). Less rotational inertia means faster.", category: "Inertia" },
  { front: "What is the right-hand rule for torque?", back: "Curl fingers from r toward F. Your thumb points in the direction of the torque vector (\u03C4 = r \u00D7 F).", category: "Torque" },
];

export function Flashcards() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = [...new Set(cards.map((c) => c.category))];
  const filtered = filter ? cards.filter((c) => c.category === filter) : cards;
  const card = filtered[currentIdx % filtered.length];

  function next() {
    setFlipped(false);
    setCurrentIdx((i) => (i + 1) % filtered.length);
  }

  function prev() {
    setFlipped(false);
    setCurrentIdx((i) => (i - 1 + filtered.length) % filtered.length);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flashcards</CardTitle>
          <CardDescription>{filtered.length} cards {filter ? `in "${filter}"` : "total"} &mdash; click to flip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => { setFilter(null); setCurrentIdx(0); }}>
              All ({cards.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => { setFilter(cat); setCurrentIdx(0); }}
              >
                {cat} ({cards.filter((c) => c.category === cat).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card
        className="min-h-[220px] cursor-pointer border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md"
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <Badge variant="outline" className="mb-4">{card.category}</Badge>
          {flipped ? (
            <PhysicsText className="text-lg text-foreground">{card.back}</PhysicsText>
          ) : (
            <p className="text-xl font-semibold text-foreground">{card.front}</p>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            {flipped ? "Answer" : "Question"} &mdash; click to flip
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev} className="cursor-pointer">Previous</Button>
        <span className="text-sm text-muted-foreground">
          {(currentIdx % filtered.length) + 1} / {filtered.length}
        </span>
        <Button variant="outline" onClick={next} className="cursor-pointer">Next</Button>
      </div>
    </div>
  );
}
