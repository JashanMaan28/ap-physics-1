"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface Scenario {
  id: number;
  title: string;
  description: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "What if gravity were different?",
    description:
      "Explore how changing gravitational acceleration affects potential energy, free-fall speed, and power required to climb.",
  },
  {
    id: 2,
    title: "What if there were no friction?",
    description:
      "See how a world without friction would affect mechanical energy conservation, braking distances, and everyday life.",
  },
  {
    id: 3,
    title: "What if you could store all your kinetic energy?",
    description:
      "Explore perfect regenerative braking and how much energy we waste in daily transportation.",
  },
];

function GravityScenario() {
  const [gFactor, setGFactor] = useState(1);

  const g = 9.8 * gFactor;
  const mass = 70; // kg person
  const height = 10;
  const pe = mass * g * height;
  const fallSpeed = Math.sqrt(2 * g * height);
  const climbPower = (mass * g * height) / 10; // 10 seconds

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Gravity multiplier: {gFactor.toFixed(1)}x (g = {g.toFixed(1)} m/s^2)
        </label>
        <Slider
          value={[gFactor]}
          onValueChange={(v) => setGFactor(v[0])}
          min={0.1}
          max={5}
          step={0.1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Moon (0.17x)</span>
          <span>Earth (1x)</span>
          <span>Jupiter (2.5x)</span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">PE at {height}m</p>
            <p className="text-2xl font-bold text-amber-600">
              {pe.toFixed(0)} J
            </p>
            <p className="text-xs">(vs {(mass * 9.8 * height).toFixed(0)} J on Earth)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Fall speed from {height}m
            </p>
            <p className="text-2xl font-bold text-red-600">
              {fallSpeed.toFixed(1)} m/s
            </p>
            <p className="text-xs">(vs {Math.sqrt(2 * 9.8 * height).toFixed(1)} m/s on Earth)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Power to climb {height}m in 10s
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {climbPower.toFixed(0)} W
            </p>
            <p className="text-xs">(vs {((mass * 9.8 * height) / 10).toFixed(0)} W on Earth)</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-gray-600 italic">
        {gFactor < 0.5
          ? "With much lower gravity, you could jump incredibly high. Sports and architecture would be completely different."
          : gFactor > 2
            ? "With much higher gravity, walking would be exhausting. Buildings would need to be shorter and sturdier."
            : "Near Earth-normal gravity. Life as we know it."}
      </p>
    </div>
  );
}

function FrictionScenario() {
  const [frictionCoeff, setFrictionCoeff] = useState(0.3);

  const mass = 1000; // kg car
  const speed = 20; // m/s
  const ke = 0.5 * mass * speed * speed;
  const brakingForce = frictionCoeff * mass * 9.8;
  const brakingDist = brakingForce > 0 ? ke / brakingForce : Infinity;
  const energyLost = brakingForce * brakingDist;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Friction coefficient: {frictionCoeff.toFixed(2)}
        </label>
        <Slider
          value={[frictionCoeff]}
          onValueChange={(v) => setFrictionCoeff(v[0])}
          min={0}
          max={1}
          step={0.01}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Ice (0.05)</span>
          <span>Rubber on dry road (0.7)</span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Car KE at 20 m/s</p>
            <p className="text-2xl font-bold text-red-600">
              {(ke / 1000).toFixed(0)} kJ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Braking distance</p>
            <p className="text-2xl font-bold text-amber-600">
              {brakingDist === Infinity ? "\u221e" : brakingDist.toFixed(1)} m
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Braking force</p>
            <p className="text-2xl font-bold text-purple-600">
              {brakingForce.toFixed(0)} N
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-gray-600 italic">
        {frictionCoeff < 0.05
          ? "With nearly zero friction, the car would never stop! Objects in motion would stay in motion indefinitely."
          : frictionCoeff > 0.6
            ? "High friction provides excellent stopping power. This is why good tires on dry roads are so important."
            : "Moderate friction. Watch out for wet or icy conditions that reduce this value."}
      </p>
    </div>
  );
}

function RegenerativeScenario() {
  const [efficiency, setEfficiency] = useState(65);

  const mass = 1500; // kg car
  const speed = 30; // m/s (highway)
  const stopsPerDay = 50;
  const ke = 0.5 * mass * speed * speed;
  const recovered = ke * (efficiency / 100);
  const dailyRecovered = (recovered * stopsPerDay) / 1e6; // MJ
  const gasolineEquiv = dailyRecovered / 34.2; // MJ per liter

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">
          Recovery efficiency: {efficiency}%
        </label>
        <Slider
          value={[efficiency]}
          onValueChange={(v) => setEfficiency(v[0])}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>No recovery (0%)</span>
          <span>Current EVs (~65%)</span>
          <span>Perfect (100%)</span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">KE per stop</p>
            <p className="text-2xl font-bold text-red-600">
              {(ke / 1000).toFixed(0)} kJ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Energy recovered/stop</p>
            <p className="text-2xl font-bold text-green-600">
              {(recovered / 1000).toFixed(0)} kJ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">Daily savings (~50 stops)</p>
            <p className="text-2xl font-bold text-amber-600">
              {dailyRecovered.toFixed(1)} MJ
            </p>
            <p className="text-xs">({gasolineEquiv.toFixed(2)} L gasoline equiv.)</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-gray-600 italic">
        {efficiency === 100
          ? "Perfect recovery! No energy wasted during braking. This is theoretically impossible due to thermodynamic losses."
          : efficiency === 0
            ? "All kinetic energy wasted as heat in brake pads. This is how traditional cars work."
            : `At ${efficiency}% efficiency, ${(100 - efficiency)}% of braking energy is still lost as heat. Current EVs are approaching physical limits.`}
      </p>
    </div>
  );
}

export function WhatIf() {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenarios</CardTitle>
          <CardDescription>
            Explore hypothetical situations to deepen your understanding of
            energy concepts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{scenarios[active].title}</CardTitle>
          <CardDescription>{scenarios[active].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {active === 0 && <GravityScenario />}
          {active === 1 && <FrictionScenario />}
          {active === 2 && <RegenerativeScenario />}
        </CardContent>
      </Card>
    </div>
  );
}
