"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface WhatIfScenario {
  id: number;
  title: string;
  description: string;
}

const scenarios: WhatIfScenario[] = [
  {
    id: 1,
    title: "What if Earth's radius doubled (but same mass)?",
    description:
      "How would Earth's rotation change? What would happen to the length of a day?",
  },
  {
    id: 2,
    title: "What if all objects had the same moment of inertia?",
    description:
      "Would shape still matter in a rolling race? What would change?",
  },
  {
    id: 3,
    title: "What if angular momentum were NOT conserved?",
    description:
      "How would figure skating, planetary orbits, and gyroscopes behave differently?",
  },
];

function EarthRadiusExplorer() {
  const [radiusFactor, setRadiusFactor] = useState(1);

  // Earth: I = (2/5)MR^2, current day = 24 hrs
  // If R changes by factor k: I changes by k^2, so omega changes by 1/k^2
  // Day length changes by k^2
  const dayLength = 24 * radiusFactor ** 2;
  const surfaceSpeed = (1670 * radiusFactor) / radiusFactor ** 2; // v = Rw, w = w0/k^2
  const surfaceG = 9.8 / radiusFactor ** 2; // g = GM/R^2

  return (
    <div className="space-y-4">
      <div>
        <label className="text-gray-300 text-sm block mb-2">
          Earth Radius Factor: {radiusFactor.toFixed(1)}x (R ={" "}
          {(6371 * radiusFactor).toFixed(0)} km)
        </label>
        <Slider
          value={[radiusFactor]}
          onValueChange={(v) => setRadiusFactor(v[0])}
          min={0.5}
          max={5}
          step={0.1}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-xs">Day Length</p>
          <p className="text-teal-300 font-bold">{dayLength.toFixed(1)} hrs</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-xs">Equator Speed</p>
          <p className="text-teal-300 font-bold">{surfaceSpeed.toFixed(0)} km/h</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-gray-500 text-xs">Surface g</p>
          <p className="text-teal-300 font-bold">{surfaceG.toFixed(2)} m/s²</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm">
        With L conserved: doubling R quadruples the day length (96 hrs). The
        equatorial surface speed changes because w decreases faster than R
        increases. Surface gravity also drops as g = GM/R².
      </p>
    </div>
  );
}

function UniformIExplorer() {
  const [height, setHeight] = useState(2);
  const g = 9.8;

  // If all shapes had the same c, they'd all have the same speed
  const cValues = [
    { name: "Solid Sphere", c: 0.4 },
    { name: "Solid Cylinder", c: 0.5 },
    { name: "Hoop", c: 1.0 },
  ];
  const uniformC = 0.5; // hypothetical

  return (
    <div className="space-y-4">
      <div>
        <label className="text-gray-300 text-sm block mb-2">
          Incline Height: {height.toFixed(1)} m
        </label>
        <Slider
          value={[height]}
          onValueChange={(v) => setHeight(v[0])}
          min={0.5}
          max={5}
          step={0.1}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-gray-500 text-xs mb-2">Real World (different c)</p>
          {cValues.map((s) => (
            <div key={s.name} className="flex justify-between text-sm py-1">
              <span className="text-gray-300">{s.name}</span>
              <span className="text-teal-300 font-mono">
                {Math.sqrt((2 * g * height) / (1 + s.c)).toFixed(2)} m/s
              </span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-2">Hypothetical (all c = {uniformC})</p>
          {cValues.map((s) => (
            <div key={s.name} className="flex justify-between text-sm py-1">
              <span className="text-gray-300">{s.name}</span>
              <span className="text-yellow-300 font-mono">
                {Math.sqrt((2 * g * height) / (1 + uniformC)).toFixed(2)} m/s
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-gray-400 text-sm">
        If all shapes had the same c, there would be no rolling race! Every
        object would reach the bottom at the same speed. The race exists precisely
        because mass distribution (shape) determines c = I/(mR²).
      </p>
    </div>
  );
}

function NoConservationExplorer() {
  return (
    <div className="space-y-3 text-gray-300 text-sm">
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-teal-300 font-bold">Figure Skating</p>
        <p>
          Pulling arms in would not speed up the spin. Skaters would need to
          actively push harder to spin faster. Elegant spins with changing speed
          would be impossible without external torque.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-teal-300 font-bold">Planetary Orbits</p>
        <p>
          Planets could slow down or speed up randomly in their orbits. Kepler's
          second law (equal areas in equal times) would fail. Orbital mechanics
          would be unpredictable, and stable solar systems might not exist.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-teal-300 font-bold">Gyroscopes</p>
        <p>
          Spinning tops would not resist tipping over. Bicycle stability at speed
          would vanish. Spacecraft could not use reaction wheels for attitude
          control. Navigation gyroscopes would be useless.
        </p>
      </div>
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
        <p className="text-yellow-300 font-bold">The Deep Reason</p>
        <p className="text-gray-300">
          Angular momentum conservation comes from rotational symmetry of space
          (Noether's theorem). If angular momentum weren't conserved, it would
          mean space has a preferred direction — physics would depend on which way
          you're facing!
        </p>
      </div>
    </div>
  );
}

export function WhatIf() {
  const [activeScenario, setActiveScenario] = useState(1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">What If...?</h2>
      <p className="text-gray-400 text-sm">
        Explore thought experiments that deepen your understanding of rotational
        physics.
      </p>

      <div className="flex gap-2 flex-wrap">
        {scenarios.map((s) => (
          <Button
            key={s.id}
            onClick={() => setActiveScenario(s.id)}
            variant={s.id === activeScenario ? "default" : "outline"}
            className={
              s.id === activeScenario
                ? "bg-teal-600"
                : "border-gray-700 text-gray-300"
            }
            size="sm"
          >
            {s.title}
          </Button>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {scenarios.find((s) => s.id === activeScenario)!.title}
          </CardTitle>
          <p className="text-gray-400 text-sm">
            {scenarios.find((s) => s.id === activeScenario)!.description}
          </p>
        </CardHeader>
        <CardContent>
          {activeScenario === 1 && <EarthRadiusExplorer />}
          {activeScenario === 2 && <UniformIExplorer />}
          {activeScenario === 3 && <NoConservationExplorer />}
        </CardContent>
      </Card>
    </div>
  );
}
