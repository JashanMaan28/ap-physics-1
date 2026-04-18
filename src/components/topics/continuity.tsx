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
import { Tex } from "@/components/ui/math";
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

export function ContinuityEquation({ onComplete, isComplete }: TopicProps) {
  const [area1, setArea1] = useState(20);
  const [velocity1, setVelocity1] = useState(2);

  const [area2, setArea2] = useState(5);
  const flowRate = area1 * velocity1;
  const velocity2 = flowRate / area2;

  // For visualization scaling
  const maxRadius = 60;
  const r1 = Math.sqrt(area1 / Math.PI) * 8;
  const r2 = Math.sqrt(area2 / Math.PI) * 8;
  const maxVel = Math.max(velocity1, velocity2);

  return (
    <div className="space-y-6">
      {/* Concept Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Continuity Equation</CardTitle>
              <CardDescription className="mt-1 text-base">
                Conservation of mass for flowing fluids
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
          <div className="key-concept">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formula
            </h3>
            <div className="text-xl font-bold tracking-tight">
              <Tex display>{"A_1 v_1 = A_2 v_2"}</Tex>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Flow rate <Tex>{"Q = Av"}</Tex> is constant for an incompressible fluid
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              For an incompressible fluid (like water) flowing through a pipe,
              the volume flow rate must be the same everywhere. If the pipe gets
              narrower, the fluid speeds up. If it gets wider, the fluid slows
              down.
            </p>
            <p>
              Think of a garden hose: when you partially cover the opening with
              your thumb (decreasing area), the water shoots out faster. The same
              amount of water must pass through per second.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Simulation */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pipe Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                Section 1 (Wide)
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Area (A&#8321;)</span>
                    <span className="formula-box">{area1} cm&#178;</span>
                  </div>
                  <Slider
                    value={[area1]}
                    onValueChange={([v]) => setArea1(v)}
                    min={2}
                    max={50}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Velocity (v&#8321;)</span>
                    <span className="formula-box">{velocity1.toFixed(1)} m/s</span>
                  </div>
                  <Slider
                    value={[velocity1]}
                    onValueChange={([v]) => setVelocity1(v)}
                    min={0.5}
                    max={10}
                    step={0.5}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Section 2 (Narrow)
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Area (A&#8322;)</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 font-mono text-sm font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:bg-orange-500/20">
                      {area2} cm&#178;
                    </span>
                  </div>
                  <Slider
                    value={[area2]}
                    onValueChange={([v]) => setArea2(v)}
                    min={1}
                    max={50}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Velocity (v&#8322;)</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 font-mono text-sm font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:bg-orange-500/20">
                    {velocity2.toFixed(1)} m/s
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 rounded-xl bg-muted/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Flow Rate (Q)</span>
                <Badge variant="default" className="font-mono">
                  {flowRate.toFixed(0)} cm&#178;&middot;m/s
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Q = A&#8321;v&#8321; = A&#8322;v&#8322; = constant
              </p>
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Speed ratio</span>
                <span className="font-mono text-sm font-semibold">
                  v&#8322;/v&#8321; = {(velocity2 / velocity1).toFixed(1)}x
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Area ratio</span>
                <span className="font-mono text-sm font-semibold">
                  A&#8321;/A&#8322; = {(area1 / area2).toFixed(1)}x
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Flow Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <svg
              viewBox="0 0 500 280"
              className="w-full"
              aria-label="Pipe with varying cross-section showing fluid flow. Narrow section has faster flow indicated by longer arrows."
            >
              {/* Pipe outline - wide section */}
              <path
                d={`M 30 ${140 - r1} L 180 ${140 - r1} Q 220 ${140 - r1} 240 ${140 - r2} L 470 ${140 - r2}`}
                fill="none"
                stroke="oklch(0.55 0.15 230)"
                strokeWidth="2.5"
              />
              <path
                d={`M 30 ${140 + r1} L 180 ${140 + r1} Q 220 ${140 + r1} 240 ${140 + r2} L 470 ${140 + r2}`}
                fill="none"
                stroke="oklch(0.55 0.15 230)"
                strokeWidth="2.5"
              />

              {/* Fluid fill - wide section */}
              <path
                d={`M 30 ${140 - r1} L 180 ${140 - r1} Q 220 ${140 - r1} 240 ${140 - r2} L 470 ${140 - r2} L 470 ${140 + r2} Q 220 ${140 + r2} 240 ${140 + r2} L 240 ${140 + r2} Q 220 ${140 + r1} 180 ${140 + r1} L 30 ${140 + r1} Z`}
                fill="oklch(0.7 0.12 230 / 0.25)"
              />

              {/* Flow arrows - wide section */}
              {[60, 100, 140].map((x) => {
                const arrowLen = 15 + (velocity1 / maxVel) * 25;
                return (
                  <g key={`w-${x}`}>
                    <line
                      x1={x}
                      y1="140"
                      x2={x + arrowLen}
                      y2="140"
                      stroke="oklch(0.55 0.2 260)"
                      strokeWidth="2.5"
                      opacity="0.7"
                    />
                    <polygon
                      points={`${x + arrowLen + 6},140 ${x + arrowLen - 2},136 ${x + arrowLen - 2},144`}
                      fill="oklch(0.55 0.2 260)"
                      opacity="0.7"
                    />
                  </g>
                );
              })}

              {/* Flow arrows - narrow section */}
              {[300, 360, 420].map((x) => {
                const arrowLen = 15 + (velocity2 / maxVel) * 25;
                return (
                  <g key={`n-${x}`}>
                    <line
                      x1={x}
                      y1="140"
                      x2={x + arrowLen}
                      y2="140"
                      stroke="oklch(0.65 0.2 50)"
                      strokeWidth="2.5"
                      opacity="0.8"
                    />
                    <polygon
                      points={`${x + arrowLen + 6},140 ${x + arrowLen - 2},136 ${x + arrowLen - 2},144`}
                      fill="oklch(0.65 0.2 50)"
                      opacity="0.8"
                    />
                  </g>
                );
              })}

              {/* Section labels */}
              <text x="105" y={140 - r1 - 15} textAnchor="middle" className="fill-primary text-xs font-semibold">
                Section 1
              </text>
              <text x="105" y={140 - r1 - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                A={area1}cm&#178;, v={velocity1.toFixed(1)}m/s
              </text>

              <text x="385" y={140 - r2 - 15} textAnchor="middle" className="text-xs font-semibold" fill="oklch(0.6 0.2 50)">
                Section 2
              </text>
              <text x="385" y={140 - r2 - 4} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                A={area2}cm&#178;, v={velocity2.toFixed(1)}m/s
              </text>

              {/* Area cross-section indicators */}
              <line
                x1="80"
                y1={140 - r1}
                x2="80"
                y2={140 + r1}
                stroke="oklch(0.55 0.2 260)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.5"
              />
              <line
                x1="400"
                y1={140 - r2}
                x2="400"
                y2={140 + r2}
                stroke="oklch(0.65 0.2 50)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                opacity="0.5"
              />

              {/* Flow rate box */}
              <rect x="170" y="220" width="160" height="36" rx="8" fill="oklch(0.55 0.2 260 / 0.1)" stroke="oklch(0.55 0.2 260 / 0.3)" strokeWidth="1" />
              <text x="250" y="242" textAnchor="middle" className="fill-primary text-xs font-bold">
                Q = {flowRate.toFixed(0)} cm&#178;&middot;m/s
              </text>
            </svg>

            {/* Insight */}
            <div className="mt-2 rounded-xl bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              {area2 < area1
                ? `The pipe narrows by ${(area1 / area2).toFixed(1)}x, so the fluid speeds up by the same factor: ${velocity1.toFixed(1)} m/s to ${velocity2.toFixed(1)} m/s.`
                : area2 > area1
                  ? `The pipe widens by ${(area2 / area1).toFixed(1)}x, so the fluid actually slows down to ${velocity2.toFixed(1)} m/s.`
                  : `Both sections have the same area, so the velocity stays the same throughout.`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Takeaways */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion multiple className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger className="cursor-pointer text-sm">
                Only applies to incompressible fluids
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The continuity equation A&#8321;v&#8321; = A&#8322;v&#8322;
                assumes the fluid density is constant (incompressible). This is
                an excellent approximation for liquids like water. For gases at
                high speeds, you need the full &#961;Av = const form.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="cursor-pointer text-sm">
                Smaller area = faster speed (inverse relationship)
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                v &#8733; 1/A. If area halves, speed doubles. This is why a
                narrowing river flows faster. This relationship is key for
                understanding Bernoulli&apos;s equation (next topic), where
                faster flow means lower pressure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="cursor-pointer text-sm">
                AP Exam: Continuity is often Step 1 of a Bernoulli problem
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Many AP problems first ask you to find v&#8322; using continuity,
                then plug it into Bernoulli&apos;s equation to find a pressure
                difference. Always check if you need continuity first.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
