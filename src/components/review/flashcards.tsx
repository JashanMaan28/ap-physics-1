"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type Topic = "Pressure" | "Pascal's" | "Buoyancy" | "Continuity" | "Bernoulli's" | "General";
type Confidence = "know" | "study" | null;

interface Flashcard {
  id: number;
  topic: Topic;
  front: string;
  back: string;
}

const ALL_CARDS: Flashcard[] = [
  // Pressure
  { id: 1, topic: "Pressure", front: "Define pressure and give its SI unit.", back: "Pressure = Force / Area (P = F/A). SI unit is the Pascal (Pa = N/m²)." },
  { id: 2, topic: "Pressure", front: "What is gauge pressure?", back: "Pressure relative to atmospheric: P_gauge = ρgh. Does NOT include atmospheric pressure." },
  { id: 3, topic: "Pressure", front: "Write the equation for absolute pressure at depth h.", back: "P = P₀ + ρgh\nP₀ = atmospheric pressure, ρ = fluid density, g = 9.8 m/s², h = depth." },
  { id: 4, topic: "Pressure", front: "How does pressure vary with depth in a static fluid?", back: "Pressure increases linearly with depth: ΔP = ρgΔh. Pressure depends only on depth, not on the shape of the container." },
  { id: 5, topic: "Pressure", front: "Common pitfall: Does pressure depend on the volume of fluid above a point?", back: "No! Pressure depends only on depth (h) and fluid density (ρ). A narrow column at depth h has the same pressure as a wide lake at depth h." },

  // Pascal's Law
  { id: 6, topic: "Pascal's", front: "State Pascal's Principle.", back: "A change in pressure applied to an enclosed fluid is transmitted undiminished to every point in the fluid and to the walls of the container." },
  { id: 7, topic: "Pascal's", front: "Write the hydraulic lift equation.", back: "F₁/A₁ = F₂/A₂\nForce is amplified by the ratio of areas. Work is conserved: the smaller piston moves a greater distance." },
  { id: 8, topic: "Pascal's", front: "In a hydraulic system, if A₂ = 10·A₁, how does displacement compare?", back: "d₁ = 10·d₂. To conserve volume (A₁d₁ = A₂d₂), the small piston moves 10× farther. Mechanical advantage ≠ energy gain." },
  { id: 9, topic: "Pascal's", front: "Common pitfall: Does a hydraulic press create energy?", back: "No. Work in = Work out (ignoring friction). W = Fd is the same on both sides. Large force × small distance = small force × large distance." },

  // Buoyancy
  { id: 10, topic: "Buoyancy", front: "State Archimedes' Principle.", back: "The buoyant force on an object equals the weight of the fluid displaced: F_b = ρ_fluid · V_displaced · g." },
  { id: 11, topic: "Buoyancy", front: "What fraction of a floating object is submerged?", back: "ρ_object / ρ_fluid\nDerived from F_b = W_object: ρ_fluid · V_sub · g = ρ_obj · V_total · g." },
  { id: 12, topic: "Buoyancy", front: "An object is fully submerged and stationary. What are the forces?", back: "F_b (up) = W_object (down) + T (down) if tethered, or F_b = W if neutrally buoyant. Net force = 0 for equilibrium." },
  { id: 13, topic: "Buoyancy", front: "Common pitfall: Does the buoyant force depend on the object's weight?", back: "No! F_b = ρ_fluid · V_displaced · g — it depends on the fluid density and volume displaced, not the object's mass or weight." },
  { id: 14, topic: "Buoyancy", front: "A steel ship floats — why?", back: "The ship's average density (steel hull + air inside) is less than water. The large V_displaced creates enough buoyant force to support the ship's weight." },
  { id: 15, topic: "Buoyancy", front: "How does the buoyant force change as an object is pushed deeper (fully submerged)?", back: "It does NOT change. Once fully submerged, V_displaced = V_object = constant, so F_b = ρ_fluid · V_object · g stays constant regardless of depth." },

  // Continuity
  { id: 16, topic: "Continuity", front: "Write the continuity equation.", back: "A₁v₁ = A₂v₂\nVolume flow rate Q = Av is constant for an incompressible fluid (steady flow)." },
  { id: 17, topic: "Continuity", front: "What assumptions does the continuity equation require?", back: "1) Incompressible fluid (constant ρ)\n2) Steady flow (not turbulent)\n3) Non-viscous (ideal fluid)\n4) No fluid added or removed." },
  { id: 18, topic: "Continuity", front: "A pipe narrows from radius 4 cm to 2 cm. How does velocity change?", back: "A ∝ r², so A₁/A₂ = 16/4 = 4. Therefore v₂ = 4v₁. Fluid speeds up by a factor of 4." },
  { id: 19, topic: "Continuity", front: "Common pitfall: In a wider pipe, does flow rate increase?", back: "No! Q = Av is constant throughout. Wider pipe → slower velocity. The volume passing any cross-section per second is the same." },

  // Bernoulli's
  { id: 20, topic: "Bernoulli's", front: "Write Bernoulli's equation.", back: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂\nThis is conservation of energy per unit volume for ideal fluid flow." },
  { id: 21, topic: "Bernoulli's", front: "What does Bernoulli's equation assume?", back: "1) Ideal fluid (incompressible, non-viscous)\n2) Steady, laminar flow\n3) Along a streamline\n4) No energy added (no pump) or removed." },
  { id: 22, topic: "Bernoulli's", front: "Why does a wing generate lift?", back: "Airfoil shape forces air to travel faster over the top → lower pressure on top (Bernoulli). Higher pressure below creates net upward force (lift)." },
  { id: 23, topic: "Bernoulli's", front: "Common pitfall: Does faster fluid always mean lower pressure?", back: "Only along the same streamline at the same height. Bernoulli compares conditions at different points on ONE streamline, not between different flow streams." },
  { id: 24, topic: "Bernoulli's", front: "Venturi effect: fluid speeds up in a constriction. What happens to pressure?", back: "Pressure decreases (Bernoulli). Higher v → lower P at the same height. Used in carburetors, atomizers, and flow meters." },
  { id: 25, topic: "Bernoulli's", front: "Torricelli's theorem: speed of fluid exiting a tank at depth h?", back: "v = √(2gh)\nDerived from Bernoulli's with P_top = P_exit = P_atm and v_top ≈ 0. Same as free-fall speed from height h!" },

  // General
  { id: 26, topic: "General", front: "What is the density of water? Why does it matter?", back: "ρ_water = 1000 kg/m³ (1 g/cm³). Reference point for buoyancy: objects denser than 1000 kg/m³ sink; less dense float." },
  { id: 27, topic: "General", front: "Distinguish between laminar and turbulent flow.", back: "Laminar: smooth, parallel streamlines; predictable (low velocity, high viscosity).\nTurbulent: chaotic, mixing eddies; Bernoulli/continuity equations break down." },
  { id: 28, topic: "General", front: "What is viscosity and how does it affect flow?", back: "Viscosity is a fluid's resistance to flow (internal friction). High viscosity → slower flow, more energy loss. Ideal fluids are assumed non-viscous in AP Physics." },
  { id: 29, topic: "General", front: "Common pitfall: Confusing mass density and weight density.", back: "ρ (mass density) = mass/volume [kg/m³]. Weight density = ρg [N/m³]. In F_b = ρgV, ρ is mass density — make sure units are consistent." },
  { id: 30, topic: "General", front: "A fluid is in a U-tube. One side has a denser fluid. What determines equilibrium?", back: "ρ₁h₁ = ρ₂h₂ (pressures at the bottom of each side must be equal). The denser fluid rises to a lower height." },
];

const TOPICS: Topic[] = ["Pressure", "Pascal's", "Buoyancy", "Continuity", "Bernoulli's", "General"];

const TOPIC_COLORS: Record<Topic, string> = {
  "Pressure": "bg-blue-100 text-blue-800 border-blue-200",
  "Pascal's": "bg-purple-100 text-purple-800 border-purple-200",
  "Buoyancy": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Continuity": "bg-green-100 text-green-800 border-green-200",
  "Bernoulli's": "bg-orange-100 text-orange-800 border-orange-200",
  "General": "bg-gray-100 text-gray-800 border-gray-200",
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
            <span className="text-amber-600">↺ Study more: {studyCount}</span>
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
