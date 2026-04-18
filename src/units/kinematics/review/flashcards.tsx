"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PhysicsText } from "@/components/ui/physics-text";
import { kinematicsFlashcards as ALL_CARDS } from "@/content/kinematics/flashcards";

export function Flashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [confidence, setConfidence] = useState<Record<string, "know" | "study">>({});

  const card = ALL_CARDS[index];
  const cardKey = String(card.id ?? index);
  const knowCount = Object.values(confidence).filter(c => c === "know").length;

  const mark = useCallback((level: "know" | "study") => {
    setConfidence(prev => ({ ...prev, [cardKey]: level }));
    setFlipped(false);
    if (index < ALL_CARDS.length - 1) setIndex(i => i + 1);
  }, [cardKey, index]);

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
            <PhysicsText className="text-sm text-foreground">{card.back}</PhysicsText>
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
