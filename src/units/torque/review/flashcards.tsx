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
import { torqueFlashcards as cards } from "@/content/torque/flashcards";

export function Flashcards() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = [...new Set(cards.map((c) => c.category).filter((c): c is string => typeof c === "string"))];
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
