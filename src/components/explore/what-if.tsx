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
import { Separator } from "@/components/ui/separator";

type RevealStage = "closed" | "thinking" | "revealed" | "followup";

interface Scenario {
  id: number;
  question: string;
  thinkPrompt: string;
  concept: string;
  answer: string;
  formula?: string;
  followUps: string[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    question: "What if you drilled a hole at the bottom of a boat? How fast does water rush in?",
    thinkPrompt: "Consider what determines the speed of water entering — is it the size of the hole, or something else entirely?",
    concept: "Torricelli's Theorem",
    answer:
      "The exit speed of water depends only on the depth of the hole below the waterline — not the hole's size. Torricelli's theorem is Bernoulli's equation applied to a tank: the fluid exits at v = √(2gh), where h is the depth of the hole below the surface. A hole 1 m below the waterline sends water in at ~4.4 m/s regardless of whether it's a pinhole or a fist-sized gap.",
    formula: "v = √(2gh)",
    followUps: [
      "If the hole is 2 m below the waterline, how fast does water enter?",
      "Why does the hole size affect the flow rate (volume/time) but not the entry speed?",
      "What happens to entry speed as the boat sinks lower?",
    ],
  },
  {
    id: 2,
    question: "What if Earth's gravity doubled? Would ice still float on water?",
    thinkPrompt: "Buoyancy depends on weight of displaced fluid — but so does the weight of the ice. Does doubling both change anything?",
    concept: "Archimedes' Principle — gravity cancels",
    answer:
      "Yes! Ice still floats, and at exactly the same depth. The fraction of an object submerged is ρ_object / ρ_fluid — gravity cancels out completely from both sides of the equation. Ice floats with ~92% submerged on Earth, on Mars, on Jupiter, and even if gravity were zero (in which case it just hovers). The physics of floating is purely about density ratios, not gravity strength.",
    formula: "f_submerged = ρ_ice / ρ_water ≈ 0.917",
    followUps: [
      "Would the wave height in the ocean change if gravity doubled?",
      "Does the boiling point of water change with gravity? What does that do to the ocean?",
      "What would happen to a submarine if g doubled?",
    ],
  },
  {
    id: 3,
    question: "What if you squeezed a balloon underwater?",
    thinkPrompt: "As you compress the balloon, what changes — the balloon's weight, or the water it pushes aside?",
    concept: "Buoyancy and Displaced Volume",
    answer:
      "Squeezing the balloon decreases its volume, which decreases the volume of water displaced. Since buoyant force = ρ_water × g × V_displaced, a smaller displaced volume means a weaker upward push. If you squeeze enough, the balloon sinks — even though its mass hasn't changed at all. This is how a submarine dives: it takes on water to shrink its effective volume (or increase its average density).",
    formula: "F_b = ρ_fluid · g · V_displaced",
    followUps: [
      "At what point does the balloon start to sink?",
      "How do fish use their swim bladders to control depth?",
      "If you sealed the balloon perfectly, would squeezing it harder make it sink faster?",
    ],
  },
  {
    id: 4,
    question: "What if water were compressible — like air?",
    thinkPrompt: "Water at the bottom of the ocean is under enormous pressure. What would happen if that pressure actually compressed it?",
    concept: "Fluid Compressibility & Continuity",
    answer:
      "The continuity equation (A₁v₁ = A₂v₂) assumes incompressible flow — it would break down. Deep ocean water would be significantly denser than surface water. In reality, water is only ~1.8% denser at the deepest ocean trenches. But if water compressed like air, the oceans would shrink dramatically — sea level would be roughly 30 meters lower than it is today. The Titanic would have had much more time to float.",
    formula: "A₁v₁ = A₂v₂ (incompressible only)",
    followUps: [
      "How does sound travel differently in compressible vs. incompressible fluids?",
      "Why does Bernoulli's equation assume incompressibility?",
      "What would hydraulic systems look like if water were compressible?",
    ],
  },
  {
    id: 5,
    question: "What if you put a straw in a vacuum? Could you drink?",
    thinkPrompt: "When you 'suck' on a straw, are you actually pulling the liquid up — or is something pushing it?",
    concept: "Atmospheric Pressure & Suction",
    answer:
      "You can't drink through a straw in a vacuum — and you can't on the Moon either. 'Sucking' a straw doesn't pull liquid up; it lowers the air pressure inside the straw, allowing the atmosphere to push the liquid up from below. No atmosphere = no push = no sipping your juice box on the lunar surface. This is also why suction cups don't work in a vacuum, and why the maximum height water can be lifted by a vacuum pump is ~10.3 m (one atmosphere worth).",
    formula: "h_max = P_atm / (ρg) ≈ 10.3 m",
    followUps: [
      "Why can't a vacuum pump lift water more than 10.3 m even with a perfect vacuum?",
      "How do trees get water to their highest leaves?",
      "Would a siphon work in a vacuum?",
    ],
  },
  {
    id: 6,
    question: "What if you created a fluid with absolutely zero viscosity?",
    thinkPrompt: "Viscosity is internal friction in a fluid. What happens to energy, flow patterns, and walls when friction disappears entirely?",
    concept: "Superfluids & Ideal Fluid Bernoulli",
    answer:
      "You'd have a superfluid — a real phenomenon observed in liquid helium near absolute zero. With zero viscosity: (1) Bernoulli's equation becomes exactly true, not just an approximation. (2) The fluid experiences zero drag — it flows through any opening with no resistance. (3) Most strangely, it creeps up container walls and flows over the rim on its own (the 'Rollin film' effect), defying gravity through quantum effects. Real fluids always have some viscosity, which is why Bernoulli is an idealization.",
    followUps: [
      "Why does viscosity cause Bernoulli's equation to be approximate in real fluids?",
      "What is the Reynolds number, and what does zero viscosity do to it?",
      "Why does liquid helium climb walls but water doesn't?",
    ],
  },
  {
    id: 7,
    question: "What happens to a sealed plastic water bottle as you carry it up a mountain?",
    thinkPrompt: "The bottle was sealed at sea level. What's happening to the pressure inside vs. outside as you climb?",
    concept: "Pascal's Law & Pressure Differentials",
    answer:
      "The bottle puffs up and feels firm. At sea level, internal and external air pressure are equal. As you ascend, external atmospheric pressure drops (~1.2 kPa per 100 m). The air sealed inside the bottle still has the original higher pressure, so it pushes outward on the walls — the bottle expands. Coming back down, it crumples inward. This is exactly why your ears pop and why airplane cabin pressure needs to be maintained.",
    formula: "P_atm ≈ 101.3 kPa − 1.2 kPa per 100 m gain",
    followUps: [
      "How much does a bottle expand going from sea level to a 3000 m peak?",
      "Why do potato chip bags puff up on airplanes?",
      "How does this relate to the bends in scuba diving?",
    ],
  },
  {
    id: 8,
    question: "What if you opened (cut) a hydraulic brake line while driving?",
    thinkPrompt: "Hydraulic brakes use Pascal's law — pressure applied to a fluid transmits equally everywhere. What does Pascal's law require?",
    concept: "Pascal's Law — Enclosed Fluids Only",
    answer:
      "The brakes completely fail. Pascal's law states that pressure applied to an enclosed incompressible fluid is transmitted equally in all directions. The key word is enclosed. A cut brake line opens the system: pressure can no longer build up — the fluid just squirts out. No pressure buildup means no force on the brake calipers means no stopping power. This is why hydraulic systems must be perfectly sealed, and why a single bubble of air (compressible!) in brake fluid is a serious safety hazard.",
    followUps: [
      "Why does air in a brake line (but not a cut line) also reduce braking effectiveness?",
      "How do emergency brakes work differently from hydraulic brakes?",
      "What's the mechanical advantage in a typical hydraulic brake system?",
    ],
  },
  {
    id: 9,
    question: "What if a fish stops swimming entirely — does it float up, sink, or hover?",
    thinkPrompt: "Different fish have very different internal anatomy. Think about what controls their average density.",
    concept: "Neutral Buoyancy & Swim Bladders",
    answer:
      "It depends entirely on the species. Most bony fish (teleosts) have a swim bladder — a gas-filled organ they inflate or deflate to match their average density to surrounding water. A resting bony fish hovers neutrally buoyant, perfectly stationary. Sharks and rays have no swim bladder; their average density is slightly greater than water. If a shark stops swimming, it slowly sinks. This is why sharks must swim continuously — they use their pectoral fins like airplane wings to generate lift as they move forward.",
    followUps: [
      "How does a fish adjust its swim bladder? Is it fast or slow?",
      "Why can't sharks breathe without moving (for most species)?",
      "How do submarines mimic swim bladder mechanics?",
    ],
  },
  {
    id: 10,
    question: "What if you pour oil on water, then drop a small ball into it?",
    thinkPrompt: "Oil floats on water because ρ_oil < ρ_water. What happens at the interface — and what if a ball's density falls right between the two?",
    concept: "Layered Fluids & Density Interfaces",
    answer:
      "If the ball's density is between ρ_oil (~850 kg/m³) and ρ_water (1000 kg/m³), it sinks through the oil but can't sink through the water — so it sits exactly at the oil-water interface, partially submerged in each layer. The ball is too dense to float on the oil surface but too buoyant to sink to the bottom. This effect is used in density column demonstrations and has real applications in liquid-liquid extraction in chemistry labs. The exact position is determined by a two-fluid version of Archimedes' principle.",
    formula: "ρ_oil < ρ_ball < ρ_water → interface floating",
    followUps: [
      "How would you calculate exactly how much of the ball is in each fluid layer?",
      "What happens to the ball if you heat the system (oil expands more than water)?",
      "Can you design a ball that floats at a specific depth in a density-stratified ocean?",
    ],
  },
];

const conceptColors: Record<string, string> = {
  "Torricelli's Theorem": "bg-blue-100 text-blue-800 border-blue-200",
  "Archimedes' Principle — gravity cancels": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Buoyancy and Displaced Volume": "bg-teal-100 text-teal-800 border-teal-200",
  "Fluid Compressibility & Continuity": "bg-violet-100 text-violet-800 border-violet-200",
  "Atmospheric Pressure & Suction": "bg-orange-100 text-orange-800 border-orange-200",
  "Superfluids & Ideal Fluid Bernoulli": "bg-pink-100 text-pink-800 border-pink-200",
  "Pascal's Law & Pressure Differentials": "bg-amber-100 text-amber-800 border-amber-200",
  "Pascal's Law — Enclosed Fluids Only": "bg-red-100 text-red-800 border-red-200",
  "Neutral Buoyancy & Swim Bladders": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Layered Fluids & Density Interfaces": "bg-lime-100 text-lime-800 border-lime-200",
};

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [stage, setStage] = useState<RevealStage>("closed");

  const badgeClass =
    conceptColors[scenario.concept] ?? "bg-gray-100 text-gray-800 border-gray-200";

  const isOpen = stage !== "closed";

  return (
    <Card
      className={`transition-all duration-300 border-2 ${
        isOpen
          ? "border-indigo-300 shadow-lg shadow-indigo-100"
          : "border-slate-200 hover:border-indigo-200 hover:shadow-md cursor-pointer"
      }`}
      onClick={() => {
        if (stage === "closed") setStage("thinking");
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {scenario.id}
            </span>
            <CardTitle className="text-base font-semibold leading-snug text-slate-800">
              {scenario.question}
            </CardTitle>
          </div>
          {!isOpen && (
            <span className="shrink-0 text-xs text-slate-400 pt-1">tap to explore →</span>
          )}
        </div>
        <div className="pl-10">
          <Badge
            variant="outline"
            className={`mt-1 text-xs font-medium border ${badgeClass}`}
          >
            {scenario.concept}
          </Badge>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pl-10 pr-4 pb-4 space-y-4">
          {/* Think about it */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-1">
              Think about it...
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">{scenario.thinkPrompt}</p>
          </div>

          {stage === "thinking" && (
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setStage("revealed");
              }}
            >
              Reveal the physics
            </Button>
          )}

          {(stage === "revealed" || stage === "followup") && (
            <>
              <Separator />

              {/* Physics explanation */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-2">
                  The Physics
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{scenario.answer}</p>
                {scenario.formula && (
                  <div className="mt-3 inline-block rounded-md bg-slate-900 px-3 py-1.5">
                    <code className="text-sm font-mono text-emerald-400">{scenario.formula}</code>
                  </div>
                )}
              </div>

              {stage === "revealed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStage("followup");
                  }}
                >
                  Show follow-up questions
                </Button>
              )}

              {stage === "followup" && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                      Keep digging...
                    </p>
                    <ul className="space-y-2">
                      {scenario.followUps.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 text-indigo-400 font-bold">?</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 -ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStage("closed");
                    }}
                  >
                    Collapse
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function WhatIfScenarios() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌊</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            What If? Scenarios
          </h1>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          Ten thought experiments that expose the real logic behind fluid mechanics.
          Tap a scenario, think it through, then reveal the physics.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-500">
            tap → think → reveal → follow-up
          </Badge>
          <Badge variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-600">
            10 scenarios
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Scenario cards */}
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs text-slate-400 pt-2">
        Each "What If?" is a real AP Physics 1 concept in disguise.
      </p>
    </div>
  );
}
