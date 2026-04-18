"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";

export function SpringMass({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [mass, setMass] = useState(2);
  const [springK, setSpringK] = useState(50);
  const [displacement, setDisplacement] = useState(0.5);

  const period = 2 * Math.PI * Math.sqrt(mass / springK);
  const frequency = 1 / period;
  const omega = 2 * Math.PI * frequency;

  const svgWidth = 400;
  const svgHeight = 250;
  const chartSurfaceClassName = "w-full rounded border border-border bg-background";
  const axisColor = "var(--muted-foreground)";
  const labelColor = "var(--foreground)";
  const wallX = 30;
  const eqX = 200;
  const blockW = 50;
  const blockH = 40;
  const groundY = 170;
  const blockCenterX = eqX + displacement * 150;

  // Draw spring as zigzag
  const springCoils = 10;
  const springStartX = wallX;
  const springEndX = blockCenterX - blockW / 2;
  const springY = groundY - blockH / 2;
  const coilWidth = (springEndX - springStartX) / springCoils;
  let springPath = `M ${springStartX} ${springY}`;
  for (let i = 0; i < springCoils; i++) {
    const x1 = springStartX + coilWidth * (i + 0.25);
    const x2 = springStartX + coilWidth * (i + 0.75);
    const x3 = springStartX + coilWidth * (i + 1);
    springPath += ` L ${x1} ${springY - 12} L ${x2} ${springY + 12} L ${x3} ${springY}`;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Spring-Mass System</CardTitle>
              <CardDescription className="mt-1">
                A mass attached to a spring oscillates with a period that depends on
                mass and spring constant, but not amplitude.
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer shrink-0"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="border-cyan-200 bg-cyan-50 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:border-cyan-500/30">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-cyan-900 dark:text-cyan-50 dark:text-cyan-200">Key Formula</p>
              <div className="mt-1 text-2xl text-cyan-800 dark:text-cyan-100 dark:text-cyan-300">
                <Tex display>{"T = 2\\pi\\sqrt{m/k}"}</Tex>
              </div>
              <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-100/80 dark:text-cyan-300">
                <Tex>T</Tex> = period (s), <Tex>m</Tex> = mass (kg), <Tex>k</Tex> = spring constant (N/m)
              </p>
              <div className="mt-1 text-sm text-cyan-700 dark:text-cyan-100/80 dark:text-cyan-300">
                Restoring force: <Tex>{"F = -kx"}</Tex> (Hooke&rsquo;s Law)
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG */}
          <div>
            <h3 className="font-semibold mb-3">Spring-Mass Diagram</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className={chartSurfaceClassName}
            >
              {/* Wall */}
              <rect x={wallX - 8} y={groundY - 80} width={8} height={100} fill={axisColor} />
              <line x1={wallX - 8} y1={groundY - 80} x2={wallX - 8} y2={groundY + 20} stroke={labelColor} strokeWidth={2} />

              {/* Ground */}
              <line x1={wallX - 10} y1={groundY} x2={svgWidth - 20} y2={groundY} stroke={axisColor} strokeWidth={2} />

              {/* Spring */}
              <path d={springPath} fill="none" stroke="#06b6d4" strokeWidth={2.5} />

              {/* Block */}
              <rect
                x={blockCenterX - blockW / 2}
                y={groundY - blockH}
                width={blockW}
                height={blockH}
                fill="#06b6d4"
                stroke="#0e7490"
                strokeWidth={2}
                rx={4}
              />
              <text
                x={blockCenterX}
                y={groundY - blockH / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill="#fff"
              >
                m
              </text>

              {/* Equilibrium marker */}
              <line x1={eqX} y1={groundY} x2={eqX} y2={groundY + 20} stroke={axisColor} strokeWidth={1} strokeDasharray="3,3" />
              <text x={eqX} y={groundY + 35} textAnchor="middle" fontSize={11} fill={axisColor}>x=0</text>

              {/* Displacement arrow */}
              {Math.abs(displacement) > 0.05 && (
                <>
                  <line
                    x1={eqX}
                    y1={groundY + 15}
                    x2={blockCenterX}
                    y2={groundY + 15}
                    stroke="#dc2626"
                    strokeWidth={2}
                    markerEnd="url(#redArrow)"
                  />
                  <defs>
                    <marker id="redArrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
                    </marker>
                  </defs>
                </>
              )}

              {/* Info */}
              <text x={svgWidth - 10} y={25} textAnchor="end" fontSize={14} fontWeight="bold" fill="#0e7490">
                T = {period.toFixed(3)} s
              </text>
              <text x={svgWidth - 10} y={45} textAnchor="end" fontSize={13} fill="#0e7490">
                f = {frequency.toFixed(2)} Hz
              </text>
              <text x={svgWidth - 10} y={65} textAnchor="end" fontSize={13} fill="#0e7490">
                &omega; = {omega.toFixed(2)} rad/s
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Mass: {mass.toFixed(1)} kg
              </label>
              <Slider
                value={[mass]}
                onValueChange={(v) => setMass(v[0])}
                min={0.5}
                max={10}
                step={0.5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Spring Constant (k): {springK} N/m
              </label>
              <Slider
                value={[springK]}
                onValueChange={(v) => setSpringK(v[0])}
                min={10}
                max={200}
                step={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Displacement: {displacement.toFixed(2)} m
              </label>
              <Slider
                value={[displacement]}
                onValueChange={(v) => setDisplacement(v[0])}
                min={-1}
                max={1}
                step={0.05}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Why doesn&rsquo;t amplitude affect the period?
              </AccordionTrigger>
              <AccordionContent>
                For an ideal spring, the restoring force is proportional to
                displacement (F = &minus;kx). Larger displacement means greater force,
                which provides exactly the right acceleration to cover the larger
                distance in the same time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                What happens if you double the mass?
              </AccordionTrigger>
              <AccordionContent>
                Since T = 2&pi;&radic;(m/k), doubling the mass increases the period by
                a factor of &radic;2 &asymp; 1.41. The system oscillates more slowly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What is Hooke&rsquo;s Law?
              </AccordionTrigger>
              <AccordionContent>
                Hooke&rsquo;s Law states F = &minus;kx, where k is the spring constant and
                x is displacement from equilibrium. The negative sign indicates
                the force always points back toward equilibrium.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
