"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PhysicsText } from "@/components/ui/physics-text";
import { momentumFlashcards as cards } from "@/content/momentum/flashcards";

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
