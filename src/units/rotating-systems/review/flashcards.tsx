"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhysicsText } from "@/components/ui/physics-text";
import { rotatingSystemsFlashcards as cards } from "@/content/rotating-systems/flashcards";

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
              <PhysicsText className="text-xl text-foreground">{card.back}</PhysicsText>
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
