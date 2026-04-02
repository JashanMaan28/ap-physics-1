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

export function SHMBasics({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(1);
  const [time, setTime] = useState(0);

  const omega = 2 * Math.PI * frequency;
  const period = 1 / frequency;
  const position = amplitude * Math.cos(omega * time);

  const svgWidth = 500;
  const svgHeight = 200;
  const centerY = svgHeight / 2;
  const points: string[] = [];
  for (let px = 0; px < svgWidth; px++) {
    const t = (px / svgWidth) * 4;
    const y = centerY - (amplitude / 50) * 60 * Math.cos(omega * t);
    points.push(`${px},${y.toFixed(1)}`);
  }

  const currentX = (time / 4) * svgWidth;
  const currentY = centerY - (amplitude / 50) * 60 * Math.cos(omega * time);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Simple Harmonic Motion Basics</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Simple harmonic motion (SHM) is periodic motion where the restoring
            force is proportional to displacement from equilibrium.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-cyan-900">Key Formula</p>
              <p className="text-2xl font-mono text-cyan-800 mt-1">
                x(t) = A cos(&omega;t)
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                x = position (m), A = amplitude (m), &omega; = angular frequency
                (rad/s), t = time (s)
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                &omega; = 2&pi;f = 2&pi;/T
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG */}
          <div>
            <h3 className="font-semibold mb-3">Position vs Time</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white w-full"
            >
              {/* Axes */}
              <line x1={0} y1={centerY} x2={svgWidth} y2={centerY} stroke="#ccc" strokeWidth={1} />
              <text x={svgWidth - 20} y={centerY - 8} fontSize={12} fill="#888">t</text>
              <text x={8} y={20} fontSize={12} fill="#888">x</text>

              {/* Amplitude lines */}
              <line
                x1={0} y1={centerY - 60} x2={svgWidth} y2={centerY - 60}
                stroke="#e0e0e0" strokeDasharray="4,4" strokeWidth={1}
              />
              <line
                x1={0} y1={centerY + 60} x2={svgWidth} y2={centerY + 60}
                stroke="#e0e0e0" strokeDasharray="4,4" strokeWidth={1}
              />
              <text x={4} y={centerY - 63} fontSize={10} fill="#888">+A</text>
              <text x={4} y={centerY + 73} fontSize={10} fill="#888">-A</text>

              {/* Sine wave */}
              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="#06b6d4"
                strokeWidth={2.5}
              />

              {/* Current position dot */}
              <circle cx={currentX} cy={currentY} r={6} fill="#0e7490" />
              <text x={currentX + 10} y={currentY - 10} fontSize={12} fill="#0e7490" fontWeight="bold">
                x = {position.toFixed(1)}
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Amplitude: {amplitude} units
              </label>
              <Slider
                value={[amplitude]}
                onValueChange={(v) => setAmplitude(v[0])}
                min={10}
                max={100}
                step={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Frequency: {frequency.toFixed(1)} Hz (T = {period.toFixed(2)} s)
              </label>
              <Slider
                value={[frequency]}
                onValueChange={(v) => setFrequency(v[0])}
                min={0.2}
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
                What is the difference between frequency and angular frequency?
              </AccordionTrigger>
              <AccordionContent>
                Frequency (f) is the number of complete oscillations per second,
                measured in Hz. Angular frequency (&omega;) equals 2&pi;f and is
                measured in rad/s. They describe the same rate of oscillation in
                different units.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                Does amplitude affect the period of SHM?
              </AccordionTrigger>
              <AccordionContent>
                No. For ideal SHM, the period is independent of amplitude. This is
                a key property&mdash;whether the oscillation is large or small, it
                takes the same time to complete one cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                Why do we use cosine instead of sine?
              </AccordionTrigger>
              <AccordionContent>
                Both work. Using cosine means the object starts at maximum
                displacement (x = A at t = 0). Using sine means it starts at
                equilibrium. You can also add a phase constant: x = A cos(&omega;t + &phi;).
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
