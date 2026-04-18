"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { fluidsFlashcards } from "@/content/fluids/flashcards";

type Topic = "Pressure" | "Pascal's" | "Buoyancy" | "Continuity" | "Bernoulli's" | "General";
type Confidence = "know" | "study" | null;

interface Flashcard {
  id: number;
  topic: Topic;
  front: string;
  back: string;
}

const ALL_CARDS: Flashcard[] = fluidsFlashcards as Flashcard[];

const TOPICS: Topic[] = ["Pressure", "Pascal's", "Buoyancy", "Continuity", "Bernoulli's", "General"];

const TOPIC_COLORS: Record<Topic, string> = {
  "Pressure": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-400/40",
  "Pascal's": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-400/40",
  "Buoyancy": "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-200 dark:border-cyan-400/40",
  "Continuity": "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-200 dark:border-green-400/40",
  "Bernoulli's": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-200 dark:border-orange-400/40",
  "General": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-200 dark:border-gray-400/40",
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Flashcards() {
  const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set(TOPICS));
  const [deck, setDeck] = useState<Flashcard[]>(ALL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidence, setConfidence] = useState<Record<number, Confidence>>({});

  const filteredDeck = deck.filter((c) => selectedTopics.has(c.topic));
  const currentCard = filteredDeck[currentIndex] ?? null;

  const knowCount = Object.values(confidence).filter((v) => v === "know").length;
  const studyCount = Object.values(confidence).filter((v) => v === "study").length;

  const goTo = useCallback((index: number) => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(index), 150);
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < filteredDeck.length - 1) goTo(currentIndex + 1);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setDeck(shuffleArray(ALL_CARDS));
      setCurrentIndex(0);
    }, 150);
  };

  const handleFlip = () => setIsFlipped((f) => !f);

  const handleConfidence = (value: "know" | "study") => {
    if (!currentCard) return;
    setConfidence((prev) => ({ ...prev, [currentCard.id]: value }));
    if (currentIndex < filteredDeck.length - 1) {
      goTo(currentIndex + 1);
    }
  };

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const progressPct = filteredDeck.length > 0 ? ((currentIndex + 1) / filteredDeck.length) * 100 : 0;
  const cardConfidence = currentCard ? confidence[currentCard.id] ?? null : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Fluids Flashcards</h2>
        <p className="text-sm text-muted-foreground">AP Physics 1 - click a card to reveal the answer</p>
      </div>

      {/* Topic Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => toggleTopic(topic)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 ${
              selectedTopics.has(topic)
                ? TOPIC_COLORS[topic]
                : "border-border/70 bg-muted/40 text-muted-foreground opacity-70"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <Separator />

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Card {filteredDeck.length > 0 ? currentIndex + 1 : 0} of {filteredDeck.length}</span>
          <span className="flex gap-3">
            <span className="text-emerald-600">✓ Know it: {knowCount}</span>
            <span className="text-amber-600 dark:text-amber-400">↺ Study more: {studyCount}</span>
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Flashcard */}
      {currentCard ? (
        <div
          className="cursor-pointer"
          style={{ perspective: "1200px" }}
          onClick={handleFlip}
          role="button"
          aria-label={isFlipped ? "Click to see front" : "Click to see answer"}
        >
          <div
            className="relative transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "220px",
            }}
          >
            {/* Front */}
            <Card
              className="absolute inset-0 select-none border-2 border-border/80 bg-card/95 shadow-md"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[220px] p-6 text-center gap-3">
                <Badge variant="outline" className={`text-xs ${TOPIC_COLORS[currentCard.topic]}`}>
                  {currentCard.topic}
                </Badge>
                <p className="text-lg font-semibold leading-snug text-foreground">{currentCard.front}</p>
                <p className="mt-2 text-xs text-muted-foreground">Tap to flip</p>
              </CardContent>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0 select-none border-2 border-primary/25 bg-primary/[0.07] shadow-md"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[220px] p-6 text-center gap-3">
                <Badge variant="outline" className="border-primary/25 bg-primary/10 text-xs text-primary">
                  Answer
                </Badge>
                <p className="whitespace-pre-line text-base leading-relaxed text-foreground">{currentCard.back}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-border/70">
          <CardContent className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
            No cards match the selected topics.
          </CardContent>
        </Card>
      )}

      {/* Confidence Buttons */}
      {isFlipped && currentCard && (
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            className={`flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 ${
              cardConfidence === "know" ? "bg-emerald-100 ring-2 ring-emerald-400" : ""
            }`}
            onClick={(e) => { e.stopPropagation(); handleConfidence("know"); }}
          >
            ✓ Know it
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 ${
              cardConfidence === "study" ? "bg-amber-100 ring-2 ring-amber-400" : ""
            }`}
            onClick={(e) => { e.stopPropagation(); handleConfidence("study"); }}
          >
            ↺ Study more
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0 || filteredDeck.length === 0}
            className="w-24 cursor-pointer"
        >
          ← Prev
        </Button>

        <Button
          variant="secondary"
          onClick={handleShuffle}
          className="cursor-pointer px-5"
        >
          Shuffle
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex >= filteredDeck.length - 1 || filteredDeck.length === 0}
          className="w-24 cursor-pointer"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
