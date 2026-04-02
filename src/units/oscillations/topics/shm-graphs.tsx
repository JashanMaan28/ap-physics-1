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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function buildWavePoints(
  svgWidth: number,
  centerY: number,
  ampPx: number,
  omega: number,
  phaseOffset: number,
): string {
  const pts: string[] = [];
  for (let px = 0; px < svgWidth; px++) {
    const t = (px / svgWidth) * 4;
    const y = centerY - ampPx * Math.cos(omega * t + phaseOffset);
    pts.push(`${px},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export function SHMGraphs({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [frequency, setFrequency] = useState(1);
  const [time, setTime] = useState(0);

  const omega = 2 * Math.PI * frequency;
  const svgWidth = 500;
  const graphH = 100;
  const ampPx = 35;
  const centerY = graphH / 2;

  const xPos = Math.cos(omega * time);
  const vel = -omega * Math.sin(omega * time);
  const acc = -omega * omega * Math.cos(omega * time);

  const cursorX = (time / 4) * svgWidth;

  const xPoints = buildWavePoints(svgWidth, centerY, ampPx, omega, 0);
  const vPoints = buildWavePoints(svgWidth, centerY, ampPx, omega, Math.PI / 2);
  const aPoints = buildWavePoints(svgWidth, centerY, ampPx, omega, Math.PI);

  const graphs = [
    { label: "x(t) — Position", points: xPoints, color: "#06b6d4", value: xPos.toFixed(3) },
    { label: "v(t) — Velocity", points: vPoints, color: "#f59e0b", value: vel.toFixed(3) },
    { label: "a(t) — Acceleration", points: aPoints, color: "#ef4444", value: acc.toFixed(3) },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">SHM Graphs &amp; Phase Relationships</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Position, velocity, and acceleration in SHM are sinusoidal functions
            with specific phase relationships.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-cyan-900">Key Relationships</p>
              <div className="space-y-1 mt-1">
                <p className="text-lg font-mono text-cyan-800">
                  x(t) = A cos(&omega;t)
                </p>
                <p className="text-lg font-mono text-amber-700">
                  v(t) = &minus;A&omega; sin(&omega;t)
                </p>
                <p className="text-lg font-mono text-red-700">
                  a(t) = &minus;A&omega;&sup2; cos(&omega;t)
                </p>
              </div>
              <p className="text-sm text-cyan-700 mt-2">
                v leads x by 90&deg; (quarter cycle). a leads v by 90&deg;.
                a is 180&deg; out of phase with x.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Three synced graphs */}
          <div>
            <h3 className="font-semibold mb-3">Synced Graphs</h3>
            <div className="space-y-4">
              {graphs.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium" style={{ color: g.color }}>
                      {g.label}
                    </span>
                    <span className="text-sm font-mono" style={{ color: g.color }}>
                      = {g.value}
                    </span>
                  </div>
                  <svg
                    width={svgWidth}
                    height={graphH}
                    viewBox={`0 0 ${svgWidth} ${graphH}`}
                    className="border rounded bg-white w-full"
                  >
                    {/* Center line */}
                    <line x1={0} y1={centerY} x2={svgWidth} y2={centerY} stroke="#e5e7eb" strokeWidth={1} />
                    {/* Wave */}
                    <polyline
                      points={g.points}
                      fill="none"
                      stroke={g.color}
                      strokeWidth={2.5}
                    />
                    {/* Time cursor */}
                    <line
                      x1={cursorX} y1={0} x2={cursorX} y2={graphH}
                      stroke="#666" strokeWidth={1} strokeDasharray="3,3"
                    />
                    {/* Current value dot */}
                    <circle
                      cx={cursorX}
                      cy={centerY - ampPx * (g.label.startsWith("x") ? xPos : g.label.startsWith("v") ? vel / (omega || 1) : acc / ((omega * omega) || 1))}
                      r={5}
                      fill={g.color}
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Frequency: {frequency.toFixed(1)} Hz
              </label>
              <Slider
                value={[frequency]}
                onValueChange={(v) => setFrequency(v[0])}
                min={0.3}
                max={3}
                step={0.1}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Time: {time.toFixed(2)} s
              </label>
              <Slider
                value={[time]}
                onValueChange={(v) => setTime(v[0])}
                min={0}
                max={4}
                step={0.01}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Why is velocity maximum at equilibrium?
              </AccordionTrigger>
              <AccordionContent>
                At equilibrium (x = 0), the object has been accelerating toward
                the center from the turning point. All energy is kinetic here,
                so the speed is at its maximum value A&omega;.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                Why is acceleration opposite to position?
              </AccordionTrigger>
              <AccordionContent>
                The restoring force (and hence acceleration) always points toward
                equilibrium. When displacement is positive, acceleration is
                negative, and vice versa. That&rsquo;s why a(t) = &minus;&omega;&sup2;x(t).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What does &ldquo;90&deg; out of phase&rdquo; mean?
              </AccordionTrigger>
              <AccordionContent>
                It means one quantity reaches its peak a quarter-cycle before
                or after the other. Velocity leads position by 90&deg;&mdash;when
                x is at its peak, v is zero and about to go negative.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
