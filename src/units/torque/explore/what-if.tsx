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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Scenario {
  title: string;
  question: string;
  description: string;
}

const scenarios: Scenario[] = [
  {
    title: "What if gravity changed?",
    question: "How would torque-based systems behave on the Moon (g = 1.6 m/s\u00B2) vs. Jupiter (g = 24.8 m/s\u00B2)?",
    description: "Torque from gravity-based forces (\u03C4 = mgr) scales directly with g.",
  },
  {
    title: "What if mass distribution changed?",
    question: "What happens to a spinning object if you move mass from the center to the rim?",
    description: "Increasing I while conserving angular momentum decreases \u03C9.",
  },
  {
    title: "What if there were no friction?",
    question: "Could a ball roll down a ramp without friction? What would happen?",
    description: "Without static friction, there is no torque to cause rolling. The ball would slide, not roll.",
  },
];

export function WhatIf() {
  const [activeScenario, setActiveScenario] = useState(0);

  // Scenario 1: Gravity
  const [gravity, setGravity] = useState(9.8);
  const mass = 5;
  const dist = 2;
  const torqueGravity = mass * gravity * dist;

  // Scenario 2: Mass distribution
  const [innerFrac, setInnerFrac] = useState(0.5);
  const totalMass = 4;
  const R = 0.5;
  const innerR = 0.1;
  const mInner = totalMass * innerFrac;
  const mOuter = totalMass * (1 - innerFrac);
  const I_total = mInner * innerR * innerR + mOuter * R * R;
  const L = 10; // conserved angular momentum
  const omega = L / I_total;

  // Scenario 3: Friction
  const [mu, setMu] = useState(0.3);
  const rampAngle = 30;
  const sphereMass = 2;
  const gVal = 9.8;
  const sinA = Math.sin((rampAngle * Math.PI) / 180);
  const cosA = Math.cos((rampAngle * Math.PI) / 180);
  const maxFriction = mu * sphereMass * gVal * cosA;
  const neededFriction = (2 / 7) * sphereMass * gVal * sinA;
  const canRoll = maxFriction >= neededFriction;
  const accel = canRoll ? (5 / 7) * gVal * sinA : gVal * sinA; // rolling vs sliding

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What-If Scenarios</CardTitle>
          <CardDescription>Explore hypothetical situations and build deeper intuition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {scenarios.map((s, i) => (
              <Button key={i} variant={i === activeScenario ? "default" : "outline"} size="sm" onClick={() => setActiveScenario(i)}>
                {s.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeScenario === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{scenarios[0].title}</CardTitle>
            <CardDescription>{scenarios[0].question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{scenarios[0].description}</p>

            <div className="space-y-2">
              <Label>Surface Gravity: {gravity.toFixed(1)} m/s\u00B2</Label>
              <Slider value={[gravity]} onValueChange={([v]) => setGravity(v)} min={0.5} max={30} step={0.1} />
              <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
                <Button variant="ghost" size="sm" onClick={() => setGravity(1.6)}>Moon (1.6)</Button>
                <Button variant="ghost" size="sm" onClick={() => setGravity(3.7)}>Mars (3.7)</Button>
                <Button variant="ghost" size="sm" onClick={() => setGravity(9.8)}>Earth (9.8)</Button>
                <Button variant="ghost" size="sm" onClick={() => setGravity(24.8)}>Jupiter (24.8)</Button>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">A {mass} kg mass at {dist} m from the pivot:</p>
              <p className="text-2xl font-bold text-primary">\u03C4 = {torqueGravity.toFixed(1)} N\u00B7m</p>
              <p className="text-xs text-muted-foreground">
                On Earth: {(mass * 9.8 * dist).toFixed(1)} N\u00B7m.
                Ratio: {(gravity / 9.8).toFixed(2)}x Earth gravity, so {(gravity / 9.8).toFixed(2)}x the torque.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeScenario === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{scenarios[1].title}</CardTitle>
            <CardDescription>{scenarios[1].question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{scenarios[1].description}</p>

            <div className="space-y-2">
              <Label>Fraction of mass near center: {(innerFrac * 100).toFixed(0)}%</Label>
              <Slider value={[innerFrac]} onValueChange={([v]) => setInnerFrac(v)} min={0.05} max={0.95} step={0.05} />
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">Total mass: {totalMass} kg, Outer radius: {R} m</p>
              <p className="text-sm">Inner mass: {mInner.toFixed(2)} kg at r = {innerR} m | Outer mass: {mOuter.toFixed(2)} kg at r = {R} m</p>
              <p className="text-lg font-bold">I = {I_total.toFixed(4)} kg\u00B7m\u00B2</p>
              <p className="text-lg font-bold text-primary">\u03C9 = {omega.toFixed(2)} rad/s</p>
              <p className="text-xs text-muted-foreground">
                (Conserving L = {L} kg\u00B7m\u00B2/s). Moving mass outward increases I and decreases \u03C9.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeScenario === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{scenarios[2].title}</CardTitle>
            <CardDescription>{scenarios[2].question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{scenarios[2].description}</p>

            <div className="space-y-2">
              <Label>Coefficient of static friction (\u03BC_s): {mu.toFixed(2)}</Label>
              <Slider value={[mu]} onValueChange={([v]) => setMu(v)} min={0} max={1} step={0.01} />
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">{sphereMass} kg solid sphere on a {rampAngle}\u00B0 ramp:</p>
              <p className="text-sm">Friction available: {maxFriction.toFixed(2)} N | Friction needed for rolling: {neededFriction.toFixed(2)} N</p>
              <p className={`text-lg font-bold ${canRoll ? "text-green-500" : "text-red-500"}`}>
                {canRoll ? "Rolling without slipping" : "Sliding! Not enough friction to roll"}
              </p>
              <p className="text-sm">Acceleration: {accel.toFixed(2)} m/s\u00B2 ({canRoll ? "rolling" : "sliding, faster!"})</p>
              <p className="text-xs text-muted-foreground">
                When \u03BC = 0, the sphere slides with a = g sin\u03B8 = {(gVal * sinA).toFixed(2)} m/s\u00B2 (no rotation at all).
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
