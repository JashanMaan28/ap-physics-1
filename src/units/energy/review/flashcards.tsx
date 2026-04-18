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
import { PhysicsText } from "@/components/ui/physics-text";
import { energyFlashcards as cards } from "@/content/energy/flashcards";

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
              <PhysicsText className="text-lg text-foreground">{cards[index].back}</PhysicsText>
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
