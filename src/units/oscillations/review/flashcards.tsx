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
import { oscillationsFlashcards as cards } from "@/content/oscillations/flashcards";

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
