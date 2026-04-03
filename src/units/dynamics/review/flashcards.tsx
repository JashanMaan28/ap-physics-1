"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cards = [
  { front: "Newton's First Law", back: "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force (Law of Inertia)." },
  { front: "Newton's Second Law", back: "ΣF = ma. The net force on an object equals its mass times its acceleration." },
  { front: "Newton's Third Law", back: "For every action, there is an equal and opposite reaction. Forces come in pairs acting on different objects." },
  { front: "What is inertia?", back: "The tendency of an object to resist changes in its state of motion. It is proportional to mass." },
  { front: "Weight formula", back: "W = mg, where g ≈ 9.8 m/s² on Earth's surface. Weight is a force (measured in Newtons)." },
  { front: "Static friction formula", back: "f_s ≤ μ_s × N. Static friction can range from 0 up to its maximum value." },
  { front: "Kinetic friction formula", back: "f_k = μ_k × N. Kinetic friction has a constant magnitude for a given pair of surfaces." },
  { front: "Why is μ_k < μ_s?", back: "Moving surfaces have less time to form microscopic bonds than stationary surfaces, resulting in a smaller friction force." },
  { front: "Normal force on a flat surface", back: "N = mg (when no other vertical forces act). The normal force is perpendicular to the surface." },
  { front: "Normal force on an incline", back: "N = mg cos θ, where θ is the angle of the incline." },
  { front: "Parallel component of gravity on incline", back: "F_parallel = mg sin θ (down the ramp)." },
  { front: "Perpendicular component of gravity on incline", back: "F_perpendicular = mg cos θ (into the surface)." },
  { front: "Acceleration on a frictionless incline", back: "a = g sin θ. Note that mass cancels out!" },
  { front: "Acceleration on incline with friction", back: "a = g(sin θ − μ_k cos θ)." },
  { front: "Critical angle for sliding", back: "θ_c = arctan(μ_s). The block slides when the incline angle exceeds this." },
  { front: "Atwood machine acceleration", back: "a = (m₁ − m₂)g / (m₁ + m₂), where m₁ > m₂." },
  { front: "Atwood machine tension", back: "T = 2m₁m₂g / (m₁ + m₂)." },
  { front: "Tension in a rope (massless)", back: "Tension is the same throughout a massless rope, even over a frictionless pulley." },
  { front: "Free-body diagram (FBD)", back: "A diagram showing all forces acting on a single object, represented as arrows from the object's center." },
  { front: "Net force = 0 means...", back: "The object is in equilibrium: either at rest or moving at constant velocity (zero acceleration)." },
  { front: "What is a contact force?", back: "A force that requires physical contact: normal force, friction, tension, applied force." },
  { front: "What is a field force?", back: "A force that acts at a distance: gravity, electromagnetic force." },
  { front: "Apparent weight in an elevator", back: "N = m(g + a) going up / accelerating upward; N = m(g − a) going down / accelerating downward." },
  { front: "When does an object feel weightless?", back: "When in free fall (a = g). The normal force is zero. Examples: astronauts in orbit, the peak of a thrown ball." },
  { front: "How to solve force problems", back: "1) Draw FBD. 2) Choose coordinate axes. 3) Decompose forces into components. 4) Apply ΣF = ma in each direction. 5) Solve." },
  { front: "Mass vs Weight", back: "Mass (kg) is an intrinsic property. Weight (N) is the gravitational force on an object and depends on location." },
  { front: "Modified Atwood machine", back: "One mass on a table, one hanging. a = m_hang × g / (m_table + m_hang) on a frictionless table." },
];

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[index];
  const remaining = cards.length - known.size;

  const next = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markKnown = () => {
    setKnown((prev) => new Set(prev).add(index));
    next();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{index + 1} / {cards.length}</Badge>
        <Badge variant="secondary">{remaining} remaining</Badge>
      </div>

      <Card
        className="flex min-h-[220px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md"
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="pt-6 text-center px-8">
          {!flipped ? (
            <div>
              <p className="text-xs text-muted-foreground mb-2">QUESTION (click to flip)</p>
              <p className="text-xl font-semibold text-foreground">{card.front}</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-muted-foreground mb-2">ANSWER (click to flip)</p>
              <p className="text-lg text-foreground">{card.back}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={prev} className="cursor-pointer">Previous</Button>
        <Button variant="outline" onClick={next} className="flex-1 cursor-pointer">Next</Button>
        <Button
          onClick={markKnown}
          disabled={known.has(index)}
          variant={known.has(index) ? "secondary" : "default"}
          className="cursor-pointer"
        >
          {known.has(index) ? "Known" : "Mark Known"}
        </Button>
      </div>
    </div>
  );
}
