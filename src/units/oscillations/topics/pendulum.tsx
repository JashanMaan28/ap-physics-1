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

export function Pendulum({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [length, setLength] = useState(1);
  const [angle, setAngle] = useState(15);
  const g = 9.81;

  const period = 2 * Math.PI * Math.sqrt(length / g);
  const frequency = 1 / period;

  const svgWidth = 300;
  const svgHeight = 300;
  const pivotX = svgWidth / 2;
  const pivotY = 30;
  const ropeLen = 50 + length * 150;
  const angleRad = (angle * Math.PI) / 180;
  const bobX = pivotX + ropeLen * Math.sin(angleRad);
  const bobY = pivotY + ropeLen * Math.cos(angleRad);
  const bobRadius = 16;

  // Equilibrium line
  const eqBobY = pivotY + ropeLen;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Simple Pendulum</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            A simple pendulum consists of a mass (bob) on a massless string that
            swings back and forth under gravity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-cyan-900">Key Formula</p>
              <p className="text-2xl font-mono text-cyan-800 mt-1">
                T = 2&pi;&radic;(L/g)
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                T = period (s), L = length (m), g = 9.81 m/s&sup2;
              </p>
              <p className="text-sm text-cyan-700 mt-1">
                Valid for small angles (&theta; &lt; ~15&deg;)
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Pendulum SVG */}
          <div>
            <h3 className="font-semibold mb-3">Pendulum Diagram</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white mx-auto block"
            >
              {/* Ceiling */}
              <line x1={pivotX - 40} y1={pivotY - 5} x2={pivotX + 40} y2={pivotY - 5} stroke="#888" strokeWidth={3} />
              <line x1={pivotX - 40} y1={pivotY - 5} x2={pivotX - 30} y2={pivotY - 15} stroke="#888" strokeWidth={1} />
              <line x1={pivotX - 20} y1={pivotY - 5} x2={pivotX - 10} y2={pivotY - 15} stroke="#888" strokeWidth={1} />
              <line x1={pivotX} y1={pivotY - 5} x2={pivotX + 10} y2={pivotY - 15} stroke="#888" strokeWidth={1} />
              <line x1={pivotX + 20} y1={pivotY - 5} x2={pivotX + 30} y2={pivotY - 15} stroke="#888" strokeWidth={1} />

              {/* Equilibrium (dashed) */}
              <line
                x1={pivotX} y1={pivotY}
                x2={pivotX} y2={eqBobY}
                stroke="#ccc" strokeWidth={1} strokeDasharray="4,4"
              />

              {/* Rope */}
              <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#444" strokeWidth={2} />

              {/* Angle arc */}
              {angle > 0 && (
                <>
                  <path
                    d={`M ${pivotX} ${pivotY + 40} A 40 40 0 0 ${angle > 0 ? 1 : 0} ${pivotX + 40 * Math.sin(angleRad)} ${pivotY + 40 * Math.cos(angleRad)}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                  />
                  <text
                    x={pivotX + 20 * Math.sin(angleRad / 2) + 8}
                    y={pivotY + 50}
                    fontSize={12}
                    fill="#f59e0b"
                    fontWeight="bold"
                  >
                    &theta;
                  </text>
                </>
              )}

              {/* Bob */}
              <circle cx={bobX} cy={bobY} r={bobRadius} fill="#06b6d4" stroke="#0e7490" strokeWidth={2} />

              {/* Labels */}
              <text x={svgWidth - 10} y={25} textAnchor="end" fontSize={14} fontWeight="bold" fill="#0e7490">
                T = {period.toFixed(3)} s
              </text>
              <text x={svgWidth - 10} y={45} textAnchor="end" fontSize={13} fill="#0e7490">
                f = {frequency.toFixed(2)} Hz
              </text>

              {/* Length label */}
              <text
                x={(pivotX + bobX) / 2 - 20}
                y={(pivotY + bobY) / 2}
                fontSize={12}
                fill="#444"
              >
                L = {length.toFixed(1)} m
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Length: {length.toFixed(1)} m
              </label>
              <Slider
                value={[length]}
                onValueChange={(v) => setLength(v[0])}
                min={0.2}
                max={2.5}
                step={0.1}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Angle: {angle}&deg;
              </label>
              <Slider
                value={[angle]}
                onValueChange={(v) => setAngle(v[0])}
                min={0}
                max={45}
                step={1}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Why doesn&rsquo;t mass affect the period?
              </AccordionTrigger>
              <AccordionContent>
                The gravitational force and inertia both depend on mass. They cancel
                out in the equation of motion, so the period depends only on length
                and gravitational acceleration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                What happens at large angles?
              </AccordionTrigger>
              <AccordionContent>
                The small-angle approximation (sin&theta; &asymp; &theta;) breaks down.
                The true period increases as the angle gets larger. At 45&deg;,
                the period is about 4% longer than the small-angle prediction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                How would a pendulum behave on the Moon?
              </AccordionTrigger>
              <AccordionContent>
                The Moon&rsquo;s gravity is about g/6. Since T = 2&pi;&radic;(L/g),
                a smaller g means a longer period&mdash;the pendulum swings about
                2.45 times slower.
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
