"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMistakes } from "@/app/fluids-study";

// ── helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number, decimals = 0): number {
  const v = Math.random() * (max - min) + min;
  return parseFloat(v.toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── fluid constants ───────────────────────────────────────────────────────────

const FLUIDS: Record<string, { label: string; density: number }> = {
  water:     { label: "water",     density: 1000 },
  saltwater: { label: "saltwater", density: 1025 },
  oil:       { label: "oil",       density: 850  },
  mercury:   { label: "mercury",   density: 13600 },
};

const G = 9.8; // m/s²
const ATM = 101325; // Pa

// ── topic definitions ─────────────────────────────────────────────────────────

type Topic = "pressure" | "pascal" | "buoyancy" | "continuity" | "bernoulli";

const TOPIC_LABELS: Record<Topic, string> = {
  pressure:   "Pressure & Depth",
  pascal:     "Pascal's Law",
  buoyancy:   "Buoyancy",
  continuity: "Continuity",
  bernoulli:  "Bernoulli's",
};

// ── problem shape ─────────────────────────────────────────────────────────────

interface Problem {
  topic: Topic;
  text: string;
  answer: number;        // in SI units
  answerLabel: string;   // human unit for display
  answerSI: number;      // always raw SI for tolerance check
  steps: string[];
  unit: string;
}

// ── generators ────────────────────────────────────────────────────────────────

function genPressure(): Problem {
  const depth = rand(5, 40, 1);
  const fluidKey = pick(["water", "saltwater", "oil"] as const);
  const { label, density } = FLUIDS[fluidKey];
  const isAbsolute = Math.random() > 0.5;

  const gauge = density * G * depth;
  const absolute = gauge + ATM;
  const answer = isAbsolute ? absolute : gauge;
  const answerKPa = parseFloat((answer / 1000).toFixed(2));

  return {
    topic: "pressure",
    text: `A diver is ${depth} m deep in ${label}. Find the ${isAbsolute ? "absolute" : "gauge"} pressure at that depth.`,
    answer: answerKPa,
    answerLabel: `${answerKPa} kPa`,
    answerSI: answer,
    unit: "kPa",
    steps: [
      `Fluid: ${label} → density ρ = ${density} kg/m³`,
      `Depth: h = ${depth} m`,
      `Gauge pressure: P_gauge = ρgh = ${density} × ${G} × ${depth} = ${(gauge / 1000).toFixed(2)} kPa`,
      isAbsolute
        ? `Absolute pressure: P_abs = P_gauge + P_atm = ${(gauge / 1000).toFixed(2)} + ${(ATM / 1000).toFixed(2)} = ${answerKPa} kPa`
        : `Gauge pressure is the answer: ${answerKPa} kPa`,
    ],
  };
}

function genPascal(): Problem {
  const A1 = rand(1, 10, 1);   // cm²
  const A2 = rand(20, 100, 1); // cm²
  const F1 = rand(50, 500, 0); // N

  const F2 = parseFloat(((F1 * A2) / A1).toFixed(2));

  return {
    topic: "pascal",
    text: `A hydraulic system has a small piston with area A₁ = ${A1} cm² and a large piston with area A₂ = ${A2} cm². A force F₁ = ${F1} N is applied to the small piston. Find the output force F₂.`,
    answer: F2,
    answerLabel: `${F2} N`,
    answerSI: F2,
    unit: "N",
    steps: [
      `Pascal's Law: F₁/A₁ = F₂/A₂`,
      `F₂ = F₁ × (A₂ / A₁)`,
      `F₂ = ${F1} × (${A2} / ${A1})`,
      `F₂ = ${F1} × ${(A2 / A1).toFixed(3)}`,
      `F₂ = ${F2} N`,
    ],
  };
}

function genBuoyancy(): Problem {
  const density = rand(200, 8000, 0);  // kg/m³
  const volume = rand(0.001, 0.1, 4);  // m³
  const fluidKey = pick(["water", "oil", "mercury"] as const);
  const { label, density: fluidDensity } = FLUIDS[fluidKey];

  const floats = density < fluidDensity;
  const Fb = parseFloat((fluidDensity * G * volume).toFixed(3));
  const weight = parseFloat((density * G * volume).toFixed(3));

  return {
    topic: "buoyancy",
    text: `An object has density ${density} kg/m³ and volume ${volume} m³. It is placed in ${label} (ρ = ${fluidDensity} kg/m³). Does it float or sink? Find the buoyant force.`,
    answer: Fb,
    answerLabel: `${Fb} N (object ${floats ? "floats" : "sinks"})`,
    answerSI: Fb,
    unit: "N",
    steps: [
      `Object density: ρ_obj = ${density} kg/m³`,
      `Fluid density: ρ_fluid = ${fluidDensity} kg/m³`,
      `Since ρ_obj ${floats ? "<" : "≥"} ρ_fluid → object ${floats ? "floats" : "sinks"}`,
      `Buoyant force: F_b = ρ_fluid × g × V`,
      `F_b = ${fluidDensity} × ${G} × ${volume}`,
      `F_b = ${Fb} N`,
      `Object weight: W = ρ_obj × g × V = ${density} × ${G} × ${volume} = ${weight} N`,
      floats
        ? `F_b (${Fb} N) > W (${weight} N) → net upward force → floats`
        : `F_b (${Fb} N) ≤ W (${weight} N) → net downward force → sinks`,
    ],
  };
}

function genContinuity(): Problem {
  const A1 = rand(10, 50, 1);  // cm²
  const A2 = rand(2, 9, 1);    // cm²  (ensure A2 < A1)
  const v1 = rand(1, 5, 2);    // m/s

  const v2 = parseFloat(((A1 * v1) / A2).toFixed(3));

  return {
    topic: "continuity",
    text: `A pipe narrows from cross-sectional area A₁ = ${A1} cm² to A₂ = ${A2} cm². The fluid enters at v₁ = ${v1} m/s. Find the exit velocity v₂.`,
    answer: v2,
    answerLabel: `${v2} m/s`,
    answerSI: v2,
    unit: "m/s",
    steps: [
      `Continuity equation: A₁v₁ = A₂v₂`,
      `v₂ = (A₁ × v₁) / A₂`,
      `v₂ = (${A1} cm² × ${v1} m/s) / ${A2} cm²`,
      `v₂ = (${(A1 * v1).toFixed(2)}) / ${A2}`,
      `v₂ = ${v2} m/s`,
      `Check: pipe narrowed, so speed increased (${v1} → ${v2} m/s) ✓`,
    ],
  };
}

function genBernoulli(): Problem {
  const P1kPa = rand(100, 300, 1);  // kPa
  const v1 = rand(1, 5, 2);         // m/s
  const v2 = rand(5, 15, 2);        // m/s
  const density = 1000;              // water

  const P1 = P1kPa * 1000;
  const P2 = P1 + 0.5 * density * (v1 ** 2 - v2 ** 2);
  const P2kPa = parseFloat((P2 / 1000).toFixed(2));

  return {
    topic: "bernoulli",
    text: `A horizontal pipe carries water (ρ = 1000 kg/m³). At point 1: P₁ = ${P1kPa} kPa, v₁ = ${v1} m/s. At point 2: v₂ = ${v2} m/s. Find P₂.`,
    answer: P2kPa,
    answerLabel: `${P2kPa} kPa`,
    answerSI: P2,
    unit: "kPa",
    steps: [
      `Bernoulli's equation (horizontal, same height):`,
      `P₁ + ½ρv₁² = P₂ + ½ρv₂²`,
      `P₂ = P₁ + ½ρ(v₁² − v₂²)`,
      `P₂ = ${P1} + ½ × ${density} × (${v1}² − ${v2}²)`,
      `P₂ = ${P1} + ${(0.5 * density * (v1 ** 2 - v2 ** 2)).toFixed(1)}`,
      `P₂ = ${P2.toFixed(1)} Pa = ${P2kPa} kPa`,
      `(Faster flow → lower pressure: ${v2} > ${v1} m/s, so P₂ < P₁) ${P2 < P1 ? "✓" : "— Note: v₂ not greater, verify setup"}`,
    ],
  };
}

const GENERATORS: Record<Topic, () => Problem> = {
  pressure:   genPressure,
  pascal:     genPascal,
  buoyancy:   genBuoyancy,
  continuity: genContinuity,
  bernoulli:  genBernoulli,
};

// ── component ─────────────────────────────────────────────────────────────────

export function ProblemGenerator() {
  const { addMistake } = useMistakes();

  const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(
    new Set(Object.keys(TOPIC_LABELS) as Topic[])
  );
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topic)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  const generateProblem = useCallback(() => {
    const topics = Array.from(selectedTopics);
    const topic = pick(topics);
    const newProblem = GENERATORS[topic]();
    setProblem(newProblem);
    setUserAnswer("");
    setChecked(false);
    setIsCorrect(null);
  }, [selectedTopics]);

  const checkAnswer = () => {
    if (!problem || !userAnswer.trim()) return;
    const parsed = parseFloat(userAnswer.replace(",", "."));
    if (isNaN(parsed)) return;

    const correct = Math.abs((parsed - problem.answer) / problem.answer) <= 0.05;
    setIsCorrect(correct);
    setChecked(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      attempted: prev.attempted + 1,
    }));

    if (!correct) {
      addMistake({
        topic: TOPIC_LABELS[problem.topic],
        question: problem.text,
        yourAnswer: `${parsed} ${problem.unit}`,
        correctAnswer: problem.answerLabel,
        timestamp: Date.now(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !checked) checkAnswer();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Score banner */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Problem Generator</h2>
        <Badge variant={score.attempted === 0 ? "secondary" : score.correct / score.attempted >= 0.7 ? "default" : "destructive"}
               className="font-mono text-sm px-3 py-1">
          {score.correct} / {score.attempted} correct
        </Badge>
      </div>

      {/* Topic selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Topics</CardTitle>
          <CardDescription>Select which topics to include (at least one)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(TOPIC_LABELS) as [Topic, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleTopic(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                  ${selectedTopics.has(key)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent text-muted-foreground border-border hover:border-blue-400"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate button */}
      <Button onClick={generateProblem} className="w-full" size="lg">
        Generate New Problem
      </Button>

      {/* Problem card */}
      {problem && (
        <Card className="border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{TOPIC_LABELS[problem.topic]}</Badge>
            </div>
            <CardDescription className="text-base text-foreground leading-relaxed pt-1">
              {problem.text}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Answer input */}
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-sm font-medium">
                Your Answer <span className="text-muted-foreground font-normal">({problem.unit})</span>
              </Label>
              <div className="flex gap-2">
                <input
                  id="answer"
                  type="number"
                  step="any"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={checked}
                  placeholder={`Enter value in ${problem.unit}`}
                  className="flex-1 font-mono rounded-md border border-input bg-background px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {!checked && (
                  <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                    Check Answer
                  </Button>
                )}
              </div>
            </div>

            {/* Result */}
            {checked && isCorrect !== null && (
              <>
                <div className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2
                  ${isCorrect
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30"
                    : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30"
                  }`}>
                  <span className="text-base">{isCorrect ? "✓" : "✗"}</span>
                  <span>
                    {isCorrect
                      ? "Correct! Well done."
                      : `Incorrect. Correct answer: `}
                    {!isCorrect && (
                      <span className="font-mono font-bold">{problem.answerLabel}</span>
                    )}
                  </span>
                </div>

                <Separator />

                {/* Step-by-step solution */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Step-by-step Solution
                  </p>
                  <ol className="space-y-1.5">
                    {problem.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="font-mono text-muted-foreground shrink-0 w-5 text-right">
                          {i + 1}.
                        </span>
                        <span className="font-mono leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Final answer: </span>
                    <span className="font-mono font-bold">{problem.answerLabel}</span>
                  </div>
                </div>

                <Button onClick={generateProblem} variant="outline" className="w-full mt-2">
                  Next Problem →
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {!problem && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Press <span className="font-mono bg-muted px-1.5 py-0.5 rounded">Generate New Problem</span> to start practicing.
        </div>
      )}
    </div>
  );
}
