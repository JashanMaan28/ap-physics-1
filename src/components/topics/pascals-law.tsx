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

export function PascalsLaw({ onComplete, isComplete }: TopicProps) {
  const [inputForce, setInputForce] = useState(100);
  const [inputArea, setInputArea] = useState(2);
  const [outputArea, setOutputArea] = useState(20);

  const pressure = inputForce / inputArea;
  const outputForce = pressure * outputArea;
  const mechanicalAdvantage = outputArea / inputArea;
  const inputDistance = 10; // cm for visualization
  const outputDistance = inputDistance * (inputArea / outputArea);

  return (
    <div className="space-y-6">
      {/* Concept Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Pascal&apos;s Law</CardTitle>
              <CardDescription className="mt-1 text-base">
                Pressure applied to an enclosed fluid is transmitted equally in
                all directions
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
            <p className="font-mono text-xl font-bold tracking-tight">
              F<sub>1</sub>/A<sub>1</sub> = F<sub>2</sub>/A<sub>2</sub>
            </p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              &Delta;P = F/A is transmitted equally throughout the fluid
            </p>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              When you push on a confined fluid, the pressure increase is felt
              everywhere in the fluid equally. This is the basis of all hydraulic
              systems &mdash; car brakes, lifts, and jacks.
            </p>
            <p>
              A small force on a small piston creates a large force on a large
              piston. But energy is conserved: what you gain in force, you lose
              in distance.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Hydraulic Press */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Hydraulic Press Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Input Force (F&#8321;)
                </label>
                <span className="formula-box">{inputForce} N</span>
              </div>
              <Slider
                value={[inputForce]}
                onValueChange={([v]) => setInputForce(v)}
                min={10}
                max={500}
                step={10}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Input Area (A&#8321;)
                </label>
                <span className="formula-box">
                  {inputArea} cm&#178;
                </span>
              </div>
              <Slider
                value={[inputArea]}
                onValueChange={([v]) => setInputArea(v)}
                min={1}
                max={20}
                step={0.5}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Output Area (A&#8322;)
                </label>
                <span className="formula-box">
                  {outputArea} cm&#178;
                </span>
              </div>
              <Slider
                value={[outputArea]}
                onValueChange={([v]) => setOutputArea(v)}
                min={1}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            <Separator />

            {/* Results */}
            <div className="space-y-3 rounded-xl bg-primary/5 p-4">
              <h4 className="text-sm font-semibold text-primary">Results</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pressure</span>
                  <span className="font-mono font-semibold">
                    {pressure.toFixed(1)} N/cm&#178;
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Output Force (F&#8322;)
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {outputForce.toFixed(0)} N
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Mechanical Advantage
                  </span>
                  <span className="font-mono font-semibold">
                    {mechanicalAdvantage.toFixed(1)}x
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    If input moves {inputDistance} cm
                  </span>
                  <span className="font-mono text-xs">
                    Output moves {outputDistance.toFixed(2)} cm
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Hydraulic Press</CardTitle>
          </CardHeader>
          <CardContent>
            <svg
              viewBox="0 0 500 320"
              className="w-full"
              aria-label="Hydraulic press diagram showing input and output pistons connected by fluid"
            >
              {/* Fluid body */}
              <rect
                x="50"
                y="180"
                width="400"
                height="100"
                rx="8"
                fill="oklch(0.7 0.12 230 / 0.3)"
                stroke="oklch(0.55 0.15 230)"
                strokeWidth="2"
              />

              {/* Left (input) piston cylinder */}
              <rect
                x="70"
                y="100"
                width={Math.max(30, inputArea * 4)}
                height="80"
                fill="oklch(0.7 0.12 230 / 0.2)"
                stroke="oklch(0.55 0.15 230)"
                strokeWidth="2"
                rx="2"
              />
              {/* Left piston head */}
              <rect
                x={70 - 4}
                y="90"
                width={Math.max(30, inputArea * 4) + 8}
                height="20"
                rx="4"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              {/* Input force arrow */}
              <line
                x1={70 + Math.max(15, inputArea * 2)}
                y1="40"
                x2={70 + Math.max(15, inputArea * 2)}
                y2="85"
                stroke="oklch(0.55 0.2 260)"
                strokeWidth="3"
                markerEnd="url(#arrowDown)"
              />
              <text
                x={70 + Math.max(15, inputArea * 2)}
                y="32"
                textAnchor="middle"
                className="fill-primary text-xs font-bold"
              >
                F&#8321; = {inputForce}N
              </text>
              {/* Input area label */}
              <text
                x={70 + Math.max(15, inputArea * 2)}
                y="115"
                textAnchor="middle"
                className="text-[10px] font-medium fill-foreground/80"
              >
                A&#8321; = {inputArea}cm&#178;
              </text>

              {/* Right (output) piston cylinder */}
              <rect
                x={450 - Math.max(40, outputArea * 2.5)}
                y="100"
                width={Math.max(40, outputArea * 2.5)}
                height="80"
                fill="oklch(0.7 0.12 230 / 0.2)"
                stroke="oklch(0.55 0.15 230)"
                strokeWidth="2"
                rx="2"
              />
              {/* Right piston head */}
              <rect
                x={450 - Math.max(40, outputArea * 2.5) - 4}
                y="90"
                width={Math.max(40, outputArea * 2.5) + 8}
                height="20"
                rx="4"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              {/* Output force arrow */}
              <line
                x1={450 - Math.max(20, outputArea * 1.25)}
                y1="85"
                x2={450 - Math.max(20, outputArea * 1.25)}
                y2="40"
                stroke="oklch(0.6 0.2 145)"
                strokeWidth="3"
                markerEnd="url(#arrowUp)"
              />
              <text
                x={450 - Math.max(20, outputArea * 1.25)}
                y="32"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="oklch(0.5 0.2 145)"
              >
                F&#8322; = {outputForce.toFixed(0)}N
              </text>
              {/* Output area label */}
              <text
                x={450 - Math.max(20, outputArea * 1.25)}
                y="115"
                textAnchor="middle"
                className="text-[10px] font-medium fill-foreground/80"
              >
                A&#8322; = {outputArea}cm&#178;
              </text>

              {/* Pressure arrows inside fluid */}
              {[140, 200, 260, 320, 380].map((x) => (
                <g key={x} opacity="0.5">
                  <circle
                    cx={x}
                    cy="230"
                    r="8"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <line x1={x} y1={222} x2={x} y2={218} stroke="white" strokeWidth="1.5" />
                  <line x1={x} y1={238} x2={x} y2={242} stroke="white" strokeWidth="1.5" />
                  <line x1={x - 8} y1={230} x2={x - 12} y2={230} stroke="white" strokeWidth="1.5" />
                  <line x1={x + 8} y1={230} x2={x + 12} y2={230} stroke="white" strokeWidth="1.5" />
                </g>
              ))}

              {/* Pressure label */}
              <text
                x="250"
                y="265"
                textAnchor="middle"
                className="text-xs font-medium fill-foreground/75"
              >
                Pressure = {pressure.toFixed(1)} N/cm&#178; (uniform throughout)
              </text>

              {/* Arrow markers */}
              <defs>
                <marker
                  id="arrowDown"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0,0 8,4 0,8"
                    fill="oklch(0.55 0.2 260)"
                  />
                </marker>
                <marker
                  id="arrowUp"
                  markerWidth="8"
                  markerHeight="8"
                  refX="4"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0,0 8,4 0,8"
                    fill="oklch(0.5 0.2 145)"
                  />
                </marker>
              </defs>
            </svg>

            {/* Insight */}
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
              <Badge variant="outline" className="mt-0.5 shrink-0">
                Insight
              </Badge>
              <p className="text-sm text-muted-foreground">
                {mechanicalAdvantage > 5
                  ? `With a ${mechanicalAdvantage.toFixed(0)}x mechanical advantage, a ${inputForce}N push produces ${outputForce.toFixed(0)}N of output force! But the output piston only moves ${outputDistance.toFixed(2)}cm for every ${inputDistance}cm of input movement.`
                  : mechanicalAdvantage > 1
                    ? `The output area is ${mechanicalAdvantage.toFixed(1)}x the input area, so force is multiplied by that same factor. Energy is conserved: more force, less distance.`
                    : `When areas are equal or the output is smaller, there's no force multiplication. Try increasing the output area!`}
              </p>
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
                Pascal&apos;s Law only works with enclosed (confined) fluids
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The fluid must be confined and incompressible. If the fluid can
                escape or compress (like a gas), the pressure won&apos;t
                transmit equally. Hydraulic systems use oil precisely because
                it&apos;s nearly incompressible.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="cursor-pointer text-sm">
                Force is multiplied, but work is conserved
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                W = Fd is the same on both sides (ignoring friction). If the
                output force is 10x the input, the output distance is 1/10 the
                input. This is why hydraulic jacks require many pumps to lift a
                car &mdash; each pump moves the car only a tiny distance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="cursor-pointer text-sm">
                AP Exam: They love setting equal pressures
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                A common problem type: &ldquo;Two pistons are connected by fluid.
                Given F&#8321;, A&#8321;, and A&#8322;, find F&#8322;.&rdquo;
                Just use F&#8321;/A&#8321; = F&#8322;/A&#8322;. Watch for unit
                conversions (cm&#178; vs m&#178;) &mdash; but if both areas use
                the same units, they cancel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
