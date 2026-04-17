"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PhysicsText } from "@/components/ui/physics-text";

interface Flashcard {
  front: string;
  back: string;
  topic: string;
}

const cards: Flashcard[] = [
  { front: "Define linear momentum.", back: "p = mv. The product of mass and velocity. A vector quantity measured in kg·m/s.", topic: "momentum-impulse" },
  { front: "Is momentum a scalar or vector?", back: "Vector — it has the same direction as velocity.", topic: "momentum-impulse" },
  { front: "SI unit of momentum?", back: "kg·m/s (equivalently N·s)", topic: "momentum-impulse" },
  { front: "What is impulse?", back: "J = FΔt = Δp. The product of force and time interval, equal to the change in momentum.", topic: "impulse-force" },
  { front: "State the Impulse-Momentum Theorem.", back: "The net impulse on an object equals its change in momentum: J = Δp = mvf − mvi.", topic: "impulse-force" },
  { front: "How is impulse found from a F-t graph?", back: "Impulse = area under the Force vs. Time curve.", topic: "impulse-force" },
  { front: "Why do airbags reduce injury?", back: "They increase the collision time Δt, reducing the average force F while keeping impulse (Δp) the same.", topic: "impulse-force" },
  { front: "When is momentum conserved?", back: "When the net external force on the system is zero (isolated system).", topic: "conservation-momentum" },
  { front: "Write the conservation of momentum equation for two objects.", back: "m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f", topic: "conservation-momentum" },
  { front: "Do internal forces affect total momentum?", back: "No. Internal forces are equal and opposite (Newton's 3rd law) and cancel out.", topic: "conservation-momentum" },
  { front: "Does momentum conservation apply in 2D?", back: "Yes — independently in the x and y directions.", topic: "conservation-momentum" },
  { front: "What is an elastic collision?", back: "A collision in which both momentum AND kinetic energy are conserved.", topic: "elastic-collisions" },
  { front: "Give an example of a nearly elastic collision.", back: "Billiard ball collisions, steel ball bearings, atomic/molecular collisions.", topic: "elastic-collisions" },
  { front: "Equal-mass elastic collision with one at rest: what happens?", back: "The objects exchange velocities. The moving one stops, the stationary one moves at the original speed.", topic: "elastic-collisions" },
  { front: "Elastic collision formula for v₁f (target at rest)?", back: "v₁f = v₁ᵢ(m₁ − m₂)/(m₁ + m₂)", topic: "elastic-collisions" },
  { front: "Elastic collision formula for v₂f (target at rest)?", back: "v₂f = 2m₁v₁ᵢ/(m₁ + m₂)", topic: "elastic-collisions" },
  { front: "What is a perfectly inelastic collision?", back: "A collision where the objects stick together and move with a common final velocity. Maximum KE is lost.", topic: "inelastic-collisions" },
  { front: "Perfectly inelastic collision formula?", back: "m₁v₁ᵢ + m₂v₂ᵢ = (m₁ + m₂)vf", topic: "inelastic-collisions" },
  { front: "Where does 'lost' KE go in an inelastic collision?", back: "Converted to thermal energy (heat), sound, and permanent deformation.", topic: "inelastic-collisions" },
  { front: "How do you check if a collision is elastic?", back: "Calculate total KE before and after. If they're equal, it's elastic.", topic: "elastic-collisions" },
  { front: "What is a 'system' in momentum problems?", back: "The collection of objects being analyzed. Only external forces on this system can change its total momentum.", topic: "conservation-momentum" },
  { front: "Newton's 2nd law in terms of momentum?", back: "F_net = dp/dt (the net force equals the rate of change of momentum).", topic: "impulse-force" },
  { front: "What fraction of KE is lost when equal masses collide perfectly inelastically (one at rest)?", back: "50% of the initial KE is lost.", topic: "inelastic-collisions" },
  { front: "In an explosion from rest, what is the total final momentum?", back: "Zero — momentum is conserved, and the initial momentum was zero.", topic: "conservation-momentum" },
  { front: "Rocket propulsion uses which conservation law?", back: "Conservation of momentum. Exhaust goes backward, rocket goes forward.", topic: "conservation-momentum" },
  { front: "How does doubling velocity affect momentum vs. KE?", back: "Momentum doubles (p = mv), but KE quadruples (KE = ½mv²).", topic: "momentum-impulse" },
  { front: "A ball bouncing vs. sticking to a wall: which has more impulse from the wall?", back: "The bouncing ball — it undergoes a larger change in momentum (reversal of direction).", topic: "impulse-force" },
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Flashcards</CardTitle>
              <CardDescription>{cards.length} cards &mdash; {known.size} mastered</CardDescription>
            </div>
            <Badge variant="outline">{currentIdx + 1} / {cards.length}</Badge>
          </div>
          <Progress value={(known.size / cards.length) * 100} className="h-2" />
        </CardHeader>
      </Card>

      <Card
        className="flex min-h-[250px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md"
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="text-center p-8">
          <Badge variant="secondary" className="mb-4">{card.topic}</Badge>
          <div className="text-xl font-medium leading-relaxed text-foreground">
            {flipped ? <PhysicsText>{card.back}</PhysicsText> : card.front}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {flipped ? "Answer" : "Click to flip"}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={prev} className="cursor-pointer">Previous</Button>
        <Button variant="outline" onClick={() => setFlipped(!flipped)} className="cursor-pointer">Flip</Button>
        <Button variant="outline" onClick={next} className="cursor-pointer">Next</Button>
        <Button onClick={markKnown} className="cursor-pointer bg-green-600 hover:bg-green-700">
          Got It
        </Button>
      </div>
    </div>
  );
}

export default Flashcards;
