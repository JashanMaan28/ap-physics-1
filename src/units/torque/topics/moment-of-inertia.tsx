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

interface Shape {
  name: string;
  formula: string;
  factor: number;
  description: string;
  color: string;
}

const SHAPES: Shape[] = [
  { name: "Solid Disk", formula: "I = (1/2)MR\u00b2", factor: 0.5, description: "Axis through center, perpendicular to face", color: "#3b82f6" },
  { name: "Hoop/Ring", formula: "I = MR\u00b2", factor: 1.0, description: "Axis through center, perpendicular to plane", color: "#ef4444" },
  { name: "Solid Sphere", formula: "I = (2/5)MR\u00b2", factor: 0.4, description: "Axis through center", color: "#22c55e" },
  { name: "Hollow Sphere", formula: "I = (2/3)MR\u00b2", factor: 2 / 3, description: "Thin shell, axis through center", color: "#f97316" },
  { name: "Rod (center)", formula: "I = (1/12)ML\u00b2", factor: 1 / 12, description: "Axis through center, perpendicular to length", color: "#a855f7" },
  { name: "Rod (end)", formula: "I = (1/3)ML\u00b2", factor: 1 / 3, description: "Axis through one end, perpendicular to length", color: "#ec4899" },
];

export function MomentOfInertia({ onComplete, isComplete }: TopicProps) {
  const [mass, setMass] = useState(5);
  const [radius, setRadius] = useState(0.5);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const inertias = SHAPES.map((s) => s.factor * mass * radius * radius);

  // SVG bar chart dimensions
  const chartW = 440;
  const chartH = 200;
  const barW = 50;
  const gap = 20;
  const maxI = Math.max(...inertias, 0.01);
  const startX = 30;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Moment of Inertia</CardTitle>
              <CardDescription className="mt-1 text-base">
                Rotational resistance to angular acceleration
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
              I = &Sigma;m<sub>i</sub>r<sub>i</sub>&sup2;
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The moment of inertia depends on how mass is distributed relative to the
              axis of rotation. Mass farther from the axis contributes more to I.
            </p>
          </div>
          <Separator />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Moment of inertia is the rotational analog of mass. Just as mass resists
            changes in linear motion (inertia), moment of inertia resists changes in
            rotational motion. Its value depends on both the total mass and how that mass
            is distributed around the axis of rotation.
          </p>
        </CardContent>
      </Card>

      {/* Shape Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive: Compare Shapes</CardTitle>
          <CardDescription>
            See how moment of inertia differs for various shapes with the same mass and size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shape SVG illustrations */}
          <div className="flex justify-center">
            <svg viewBox="0 0 460 260" className="w-full max-w-lg border rounded-lg bg-muted/30">
              {/* Bar chart */}
              {SHAPES.map((shape, i) => {
                const barH = (inertias[i] / maxI) * (chartH - 30);
                const x = startX + i * (barW + gap);
                const y = chartH - barH;
                return (
                  <g key={shape.name}>
                    <rect
                      x={x}
                      y={y + 20}
                      width={barW}
                      height={barH}
                      rx={4}
                      fill={shape.color}
                      opacity={i === selectedIdx ? 1 : 0.5}
                      className="cursor-pointer"
                      onClick={() => setSelectedIdx(i)}
                    />
                    <text
                      x={x + barW / 2}
                      y={y + 14}
                      fontSize="10"
                      fill={shape.color}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {inertias[i].toFixed(3)}
                    </text>
                    {/* Shape label (rotated) */}
                    <text
                      x={x + barW / 2}
                      y={chartH + 40}
                      fontSize="9"
                      fill="currentColor"
                      textAnchor="middle"
                      opacity={0.7}
                    >
                      {shape.name}
                    </text>
                  </g>
                );
              })}
              {/* Y-axis label */}
              <text x={10} y={15} fontSize="11" fill="currentColor" opacity={0.6}>
                I (kg&middot;m&sup2;)
              </text>
              {/* Baseline */}
              <line x1={startX - 5} y1={chartH + 20} x2={chartW} y2={chartH + 20} stroke="currentColor" opacity={0.2} />
            </svg>
          </div>

          {/* Selected shape detail */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge style={{ backgroundColor: SHAPES[selectedIdx].color }} className="text-white">
                  {SHAPES[selectedIdx].name}
                </Badge>
                <span className="font-mono font-bold">{SHAPES[selectedIdx].formula}</span>
              </div>
              <p className="text-sm text-muted-foreground">{SHAPES[selectedIdx].description}</p>
              <p className="mt-2 text-lg font-bold">
                I = {inertias[selectedIdx].toFixed(4)} kg&middot;m&sup2;
              </p>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mass (M): {mass} kg</Label>
              <Slider
                value={[mass]}
                onValueChange={([v]) => setMass(v)}
                min={1}
                max={20}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Radius/Length (R or L): {radius.toFixed(2)} m</Label>
              <Slider
                value={[radius]}
                onValueChange={([v]) => setRadius(v)}
                min={0.1}
                max={1.5}
                step={0.05}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <strong>Key insight:</strong> The hoop has the largest I because all its mass is at
            distance R from the axis. The solid sphere has the smallest I because more mass
            is concentrated near the center. Shape matters as much as total mass!
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
              <AccordionTrigger>Why does a hoop have a larger I than a disk of the same mass?</AccordionTrigger>
              <AccordionContent>
                All of the hoop&apos;s mass is at distance R from the axis, so I = MR&sup2;. The disk has
                mass distributed from r = 0 to r = R, so on average each bit of mass is closer
                to the axis, giving I = (1/2)MR&sup2;. Mass farther from the axis contributes
                more to rotational inertia.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is the parallel axis theorem?</AccordionTrigger>
              <AccordionContent>
                I = I_cm + Md&sup2;, where I_cm is the moment of inertia about the center of mass
                and d is the distance from the center of mass to the new axis. This explains
                why a rod rotated about its end (I = 1/3 ML&sup2;) has a larger I than when
                rotated about its center (I = 1/12 ML&sup2;).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Do I need to memorize all the moment of inertia formulas?</AccordionTrigger>
              <AccordionContent>
                On the AP Physics 1 exam, common formulas are provided on the reference sheet.
                However, you should understand why I differs for different shapes and be able
                to use the formulas. Know that I depends on mass distribution relative to the axis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How does moment of inertia affect rolling objects?</AccordionTrigger>
              <AccordionContent>
                When objects roll down a ramp, their energy is split between translational and
                rotational KE. Objects with larger I (like a hoop) have more rotational KE
                and therefore less translational KE, making them roll slower. A solid sphere
                beats a hoop in a race down an incline (assuming no slipping).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
