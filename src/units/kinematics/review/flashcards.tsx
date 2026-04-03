"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Flashcard { id: number; topic: string; front: string; back: string; }

const ALL_CARDS: Flashcard[] = [
  { id: 1, topic: "Position", front: "Define displacement.", back: "Displacement is the change in position: Δx = x_f − x_i. It's a vector (has direction). Unlike distance, it can be negative." },
  { id: 2, topic: "Position", front: "What is the difference between distance and displacement?", back: "Distance is total path length (scalar, always ≥ 0). Displacement is the straight-line change in position (vector, can be negative)." },
  { id: 3, topic: "Velocity", front: "Define average velocity.", back: "v_avg = Δx/Δt. It's displacement divided by time — a vector quantity. Not the same as average speed unless motion is in one direction." },
  { id: 4, topic: "Velocity", front: "What does instantaneous velocity mean?", back: "The velocity at a single instant in time. It equals the slope of the x-t graph at that point, or the limit of Δx/Δt as Δt → 0." },
  { id: 5, topic: "Velocity", front: "Can speed be negative?", back: "No. Speed = |velocity| is always ≥ 0. Velocity can be negative (indicating direction)." },
  { id: 6, topic: "Acceleration", front: "Define acceleration.", back: "a = Δv/Δt. The rate of change of velocity. Units: m/s². It's a vector — direction matters." },
  { id: 7, topic: "Acceleration", front: "Can an object accelerate while having zero velocity?", back: "Yes! Example: a ball at the peak of its trajectory has v = 0 but a = −9.8 m/s² (gravity still acts)." },
  { id: 8, topic: "Acceleration", front: "Does negative acceleration always mean slowing down?", back: "No. If v < 0 and a < 0, the object speeds up in the negative direction. 'Slowing down' = v and a have opposite signs." },
  { id: 9, topic: "Equations", front: "List the four kinematic equations.", back: "1) v = v₀ + at\n2) x = x₀ + v₀t + ½at²\n3) v² = v₀² + 2a(x−x₀)\n4) x = x₀ + ½(v₀+v)t\nAll require constant acceleration." },
  { id: 10, topic: "Equations", front: "Which kinematic equation has no x (displacement)?", back: "v = v₀ + at. Use this when you know v₀, a, and t, and want v (or vice versa)." },
  { id: 11, topic: "Equations", front: "Which kinematic equation has no time (t)?", back: "v² = v₀² + 2a(x−x₀). Very useful for problems where time is not given or asked for." },
  { id: 12, topic: "Free Fall", front: "What is free fall?", back: "Motion under gravity alone (no air resistance). a = g = 9.8 m/s² downward for all objects, regardless of mass." },
  { id: 13, topic: "Free Fall", front: "A ball is thrown up at 20 m/s. What is its velocity at the top?", back: "v = 0 m/s at the very top. But acceleration is still −9.8 m/s² (gravity never turns off)." },
  { id: 14, topic: "Projectile", front: "What are the two independent components of projectile motion?", back: "Horizontal (x): aₓ = 0, vₓ = constant\nVertical (y): aᵧ = −g, vᵧ changes\nThey are independent — horizontal motion doesn't affect vertical." },
  { id: 15, topic: "Projectile", front: "What is the range formula?", back: "R = v₀²sin(2θ)/g. Valid only for level ground (launch and landing at same height)." },
  { id: 16, topic: "Projectile", front: "What angle maximizes projectile range?", back: "45° (on level ground). Complementary angles (e.g., 30° and 60°) give the same range." },
  { id: 17, topic: "Projectile", front: "What is the acceleration at the peak of a projectile?", back: "Still g = 9.8 m/s² downward! Common mistake: thinking a = 0 because v_y = 0." },
  { id: 18, topic: "Graphs", front: "What does the slope of an x-t graph represent?", back: "Velocity. Steep slope = fast. Zero slope = at rest. Negative slope = moving in negative direction." },
  { id: 19, topic: "Graphs", front: "What does the slope of a v-t graph represent?", back: "Acceleration. Positive slope = speeding up (if v > 0). The slope magnitude gives |a|." },
  { id: 20, topic: "Graphs", front: "What does the area under a v-t graph represent?", back: "Displacement (Δx). Area above t-axis = positive displacement. Area below = negative displacement." },
  { id: 21, topic: "Graphs", front: "A curved x-t graph means what?", back: "Non-constant velocity → the object is accelerating. The curvature direction tells you the sign of acceleration." },
  { id: 22, topic: "Graphs", front: "A horizontal line on a v-t graph means what?", back: "Constant velocity → zero acceleration. The object moves at steady speed." },
  { id: 23, topic: "Equations", front: "How do you choose the right kinematic equation?", back: "1) List knowns (3 of 5 variables: x, v₀, v, a, t)\n2) Identify which variable you want\n3) Pick the equation that doesn't contain the one variable you neither know nor need." },
  { id: 24, topic: "Free Fall", front: "Two objects of different mass are dropped. Which lands first?", back: "They land at the same time (ignoring air resistance). Galileo demonstrated this — acceleration due to gravity is independent of mass." },
  { id: 25, topic: "Position", front: "What is a reference frame?", back: "A coordinate system from which measurements are made. All motion is relative to a chosen reference frame. Velocity depends on the observer's frame." },
];

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [confidence, setConfidence] = useState<Record<number, "know" | "study">>({});

  const card = ALL_CARDS[index];
  const knowCount = Object.values(confidence).filter(c => c === "know").length;

  const mark = useCallback((level: "know" | "study") => {
    setConfidence(prev => ({ ...prev, [card.id]: level }));
    setFlipped(false);
    if (index < ALL_CARDS.length - 1) setIndex(i => i + 1);
  }, [card.id, index]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Card {index + 1} of {ALL_CARDS.length}</p>
        <Badge variant="secondary" className="font-mono text-xs">{knowCount}/{ALL_CARDS.length} mastered</Badge>
      </div>
      <Progress value={(index / ALL_CARDS.length) * 100} className="h-1.5" />

      <Card className="flex min-h-[220px] cursor-pointer items-center justify-center border-border/70 bg-card/90 shadow-sm transition-all hover:shadow-md" onClick={() => setFlipped(!flipped)}>
        <CardContent className="p-6 text-center">
          <Badge variant="outline" className="mb-3 text-[10px]">{card.topic}</Badge>
          {flipped ? (
            <p className="whitespace-pre-line text-sm text-foreground">{card.back}</p>
          ) : (
            <p className="text-base font-medium text-foreground">{card.front}</p>
          )}
          <p className="text-xs text-muted-foreground/50 mt-4">{flipped ? "Click to see question" : "Click to flip"}</p>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={() => mark("study")} className="cursor-pointer">Still Learning</Button>
        <Button size="sm" onClick={() => mark("know")} className="cursor-pointer">Got It</Button>
      </div>

      <div className="flex gap-2 justify-center">
        <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => { setIndex(i => i - 1); setFlipped(false); }} className="cursor-pointer">← Prev</Button>
        <Button variant="ghost" size="sm" disabled={index === ALL_CARDS.length - 1} onClick={() => { setIndex(i => i + 1); setFlipped(false); }} className="cursor-pointer">Next →</Button>
      </div>
    </div>
  );
}
