"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

const g = 9.8;

export function RotationalEquilibrium({ onComplete, isComplete }: TopicProps) {
  const [mass1, setMass1] = useState(5);
  const [dist1, setDist1] = useState(2);
  const [mass2, setMass2] = useState(5);
  const [dist2, setDist2] = useState(2);

  const torqueCCW = mass1 * g * dist1;
  const torqueCW = mass2 * g * dist2;
  const netTorque = torqueCCW - torqueCW;
  const isEquilibrium = Math.abs(netTorque) < 0.1;

  // SVG layout
  const fulcrumX = 250;
  const fulcrumY = 220;
  const beamHalfLen = 180;
  const tiltAngle = isEquilibrium ? 0 : Math.min(Math.max(netTorque * 0.2, -15), 15);
  const tiltRad = (tiltAngle * Math.PI) / 180;

  const leftX = fulcrumX - (dist1 / 4) * beamHalfLen;
  const leftY = fulcrumY - Math.sin(tiltRad) * (dist1 / 4) * beamHalfLen;
  const rightX = fulcrumX + (dist2 / 4) * beamHalfLen;
  const rightY = fulcrumY + Math.sin(tiltRad) * (dist2 / 4) * beamHalfLen;

  const beamLeftX = fulcrumX - beamHalfLen * Math.cos(tiltRad);
  const beamLeftY = fulcrumY + beamHalfLen * Math.sin(tiltRad);
  const beamRightX = fulcrumX + beamHalfLen * Math.cos(tiltRad);
  const beamRightY = fulcrumY - beamHalfLen * Math.sin(tiltRad);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Rotational Equilibrium</CardTitle>
              <CardDescription className="mt-1 text-base">
                When the net torque on a system is zero
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formula
            </h3>
            <p className="font-mono text-xl font-bold tracking-tight">
              &Sigma;&tau; = 0
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              For an object in rotational equilibrium, the sum of all torques about any
              point must equal zero. Counterclockwise torques balance clockwise torques.
            </p>
          </div>
          <Separator />
          <p className="text-sm leading-relaxed text-muted-foreground">
            A system is in rotational equilibrium when it has zero angular acceleration.
            This means the sum of all torques about any chosen pivot must be zero.
            This principle is essential for analyzing seesaws, bridges, beams, and
            any structure that must not rotate.
          </p>
        </CardContent>
      </Card>

      {/* Interactive Seesaw */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive: Balance Beam</CardTitle>
          <CardDescription>
            Place masses on each side and check if the beam is in equilibrium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 500 320" className="w-full max-w-lg border rounded-lg bg-muted/30">
              {/* Fulcrum triangle */}
              <polygon
                points={`${fulcrumX},${fulcrumY} ${fulcrumX - 20},${fulcrumY + 40} ${fulcrumX + 20},${fulcrumY + 40}`}
                fill="#71717a"
                stroke="#3f3f46"
                strokeWidth={2}
              />

              {/* Beam */}
              <line
                x1={beamLeftX}
                y1={beamLeftY}
                x2={beamRightX}
                y2={beamRightY}
                stroke="#ec4899"
                strokeWidth={6}
                strokeLinecap="round"
              />

              {/* Left mass */}
              <rect
                x={leftX - 15}
                y={leftY - 35 - Math.max(mass1 * 1.5, 10)}
                width={30}
                height={Math.max(mass1 * 1.5, 10)}
                rx={3}
                fill="#3b82f6"
                stroke="#2563eb"
                strokeWidth={1.5}
              />
              <text
                x={leftX}
                y={leftY - 40 - Math.max(mass1 * 1.5, 10)}
                fill="#3b82f6"
                fontSize="11"
                textAnchor="middle"
              >
                {mass1} kg
              </text>

              {/* Right mass */}
              <rect
                x={rightX - 15}
                y={rightY - 35 - Math.max(mass2 * 1.5, 10)}
                width={30}
                height={Math.max(mass2 * 1.5, 10)}
                rx={3}
                fill="#f97316"
                stroke="#ea580c"
                strokeWidth={1.5}
              />
              <text
                x={rightX}
                y={rightY - 40 - Math.max(mass2 * 1.5, 10)}
                fill="#f97316"
                fontSize="11"
                textAnchor="middle"
              >
                {mass2} kg
              </text>

              {/* Distance labels */}
              <text
                x={(fulcrumX + leftX) / 2}
                y={fulcrumY + 60}
                fill="#3b82f6"
                fontSize="11"
                textAnchor="middle"
              >
                d₁ = {dist1.toFixed(1)} m
              </text>
              <text
                x={(fulcrumX + rightX) / 2}
                y={fulcrumY + 60}
                fill="#f97316"
                fontSize="11"
                textAnchor="middle"
              >
                d₂ = {dist2.toFixed(1)} m
              </text>

              {/* Equilibrium indicator */}
              <text
                x={fulcrumX}
                y={30}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill={isEquilibrium ? "#22c55e" : "#ef4444"}
              >
                {isEquilibrium ? "BALANCED" : "NOT BALANCED"}
              </text>
            </svg>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-500">Left Side</h4>
              <div className="space-y-2">
                <Label>Mass 1: {mass1} kg</Label>
                <Slider
                  value={[mass1]}
                  onValueChange={([v]) => setMass1(v)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance 1: {dist1.toFixed(1)} m</Label>
                <Slider
                  value={[dist1]}
                  onValueChange={([v]) => setDist1(v)}
                  min={0.5}
                  max={4}
                  step={0.1}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-500">Right Side</h4>
              <div className="space-y-2">
                <Label>Mass 2: {mass2} kg</Label>
                <Slider
                  value={[mass2]}
                  onValueChange={([v]) => setMass2(v)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance 2: {dist2.toFixed(1)} m</Label>
                <Slider
                  value={[dist2]}
                  onValueChange={([v]) => setDist2(v)}
                  min={0.5}
                  max={4}
                  step={0.1}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Torque display */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">CCW Torque</p>
                <p className="text-lg font-bold text-blue-500">
                  {torqueCCW.toFixed(1)} N&middot;m
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">CW Torque</p>
                <p className="text-lg font-bold text-orange-500">
                  {torqueCW.toFixed(1)} N&middot;m
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Net Torque</p>
                <p className={`text-lg font-bold ${isEquilibrium ? "text-green-500" : "text-red-500"}`}>
                  {netTorque.toFixed(1)} N&middot;m
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <strong>Try this:</strong> Set m₁ = 10 kg at d₁ = 2 m and m₂ = 5 kg at d₂ = 4 m.
            The beam balances because 10 &times; 9.8 &times; 2 = 5 &times; 9.8 &times; 4 = 196 N&middot;m.
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>Does the choice of pivot point matter?</AccordionTrigger>
              <AccordionContent>
                For a system in both translational and rotational equilibrium, you can choose
                any point as the pivot and &Sigma;&tau; = 0 will hold. Choosing the right pivot can
                simplify calculations by eliminating unknown forces that act at that point.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the difference between static and dynamic equilibrium?</AccordionTrigger>
              <AccordionContent>
                Static equilibrium: the object is at rest and not rotating (&Sigma;F = 0 and &Sigma;&tau; = 0).
                Dynamic equilibrium: the object moves with constant velocity and/or rotates with
                constant angular velocity. In both cases, net force and net torque are zero.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How do you solve equilibrium problems on the AP exam?</AccordionTrigger>
              <AccordionContent>
                1) Draw a free-body diagram. 2) Choose a convenient pivot point. 3) Write
                &Sigma;&tau; = 0 about that pivot. 4) Write &Sigma;F = 0 in x and y directions. 5) Solve
                the system of equations. Choosing the pivot where an unknown force acts
                eliminates that force from the torque equation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Can a system have zero net torque but nonzero net force?</AccordionTrigger>
              <AccordionContent>
                Yes. A system can be in rotational equilibrium (no angular acceleration) while
                still having a net force causing translational acceleration. For complete
                equilibrium (no acceleration at all), both &Sigma;F = 0 and &Sigma;&tau; = 0 must hold.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
