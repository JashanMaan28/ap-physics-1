"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhysicsText } from "@/components/ui/physics-text";
import { dynamicsFlashcards as cards } from "@/content/dynamics/flashcards";

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
              <PhysicsText className="text-lg text-foreground">{card.back}</PhysicsText>
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
