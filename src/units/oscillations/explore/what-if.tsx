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
import { Slider } from "@/components/ui/slider";

const scenarios = [
  {
    id: "gravity",
    title: "What if gravity changed?",
    description:
      "Explore how a pendulum's period changes on different planets or in different gravitational fields.",
  },
  {
    id: "zero-g",
    title: "What if there were no gravity?",
    description:
      "Compare spring-mass and pendulum behavior in zero gravity (like on the ISS).",
  },
  {
    id: "giant-spring",
    title: "What if the spring constant were extreme?",
    description:
      "See what happens with very stiff or very soft springs.",
  },
];

function GravityScenario() {
  const [gMultiplier, setGMultiplier] = useState(1);
  const L = 1;
  const gEarth = 9.81;
  const g = gEarth * gMultiplier;
  const T = g > 0 ? 2 * Math.PI * Math.sqrt(L / g) : Infinity;

  const planets: { name: string; mult: number }[] = [
    { name: "Moon", mult: 0.166 },
    { name: "Mars", mult: 0.38 },
    { name: "Earth", mult: 1 },
    { name: "Jupiter", mult: 2.53 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm">
        A 1.0 m pendulum under varying gravity. On Earth, T = 2.006 s.
      </p>
      <div>
        <label className="text-sm font-medium">
          Gravity multiplier: {gMultiplier.toFixed(2)}x Earth
          (g = {g.toFixed(2)} m/s^2)
        </label>
        <Slider
          value={[gMultiplier]}
          onValueChange={(v) => setGMultiplier(v[0])}
          min={0.05}
          max={4}
          step={0.05}
        />
      </div>
      <p className="text-lg font-mono font-bold text-cyan-700">
        T = {T === Infinity ? "Infinite" : T.toFixed(3) + " s"}
      </p>
      <div className="flex gap-2 flex-wrap">
        {planets.map((p) => (
          <Button
            key={p.name}
            size="sm"
            variant={Math.abs(gMultiplier - p.mult) < 0.01 ? "default" : "outline"}
            onClick={() => setGMultiplier(p.mult)}
          >
            {p.name} ({p.mult}x)
          </Button>
        ))}
      </div>
    </div>
  );
}

function ZeroGScenario() {
  const m = 2;
  const k = 50;
  const springT = 2 * Math.PI * Math.sqrt(m / k);

  return (
    <div className="space-y-4">
      <p className="text-sm">
        In zero gravity (ISS, free fall), pendulums do not work because there
        is no gravitational restoring force. The string just floats.
      </p>
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-3 pb-3">
          <p className="font-semibold text-amber-900">Pendulum in zero-g:</p>
          <p className="text-sm text-amber-800">
            T = 2pi*sqrt(L/g) = undefined (g = 0). No oscillation occurs.
          </p>
        </CardContent>
      </Card>
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-3 pb-3">
          <p className="font-semibold text-green-900">Spring-mass in zero-g:</p>
          <p className="text-sm text-green-800">
            T = 2pi*sqrt(m/k) = {springT.toFixed(3)} s. Works perfectly!
            The spring provides its own restoring force, no gravity needed.
          </p>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        NASA astronauts actually use spring-mass systems to measure their body
        mass in microgravity by measuring the oscillation period.
      </p>
    </div>
  );
}

function GiantSpringScenario() {
  const [logK, setLogK] = useState(2);
  const k = Math.pow(10, logK);
  const m = 1;
  const T = 2 * Math.PI * Math.sqrt(m / k);
  const f = 1 / T;

  return (
    <div className="space-y-4">
      <p className="text-sm">
        A 1.0 kg mass with an adjustable spring constant from 1 to 10,000 N/m.
      </p>
      <div>
        <label className="text-sm font-medium">
          Spring constant: k = {k.toFixed(0)} N/m
        </label>
        <Slider
          value={[logK]}
          onValueChange={(v) => setLogK(v[0])}
          min={0}
          max={4}
          step={0.1}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-50">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-sm text-muted-foreground">Period</p>
            <p className="text-xl font-mono font-bold">{T.toFixed(4)} s</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-50">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p className="text-xl font-mono font-bold">{f.toFixed(2)} Hz</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        Very stiff springs (large k) give very fast oscillations. Very soft
        springs (small k) give slow oscillations. Diamond has an effective
        spring constant of ~500 N/m per bond.
      </p>
    </div>
  );
}

export function WhatIf({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [active, setActive] = useState(0);

  const ScenarioComponent = [GravityScenario, ZeroGScenario, GiantSpringScenario][active];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>What If? Scenarios</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Explore hypothetical situations to deepen your understanding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {scenarios.map((s, i) => (
              <Button
                key={s.id}
                variant={active === i ? "default" : "outline"}
                size="sm"
                onClick={() => setActive(i)}
              >
                {s.title}
              </Button>
            ))}
          </div>

          <Card className="bg-slate-50">
            <CardContent className="pt-4">
              <h3 className="font-bold">{scenarios[active].title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {scenarios[active].description}
              </p>
            </CardContent>
          </Card>

          <ScenarioComponent />

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
