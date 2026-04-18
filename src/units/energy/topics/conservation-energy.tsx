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

export function ConservationEnergy({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [position, setPosition] = useState(0); // 0 = top, 100 = bottom

  const g = 9.8;
  const mass = 2;
  const maxHeight = 10;

  // Pendulum simulation: position 0 = top-left, 50 = bottom, 100 = top-right
  const fraction = position / 100;
  const heightFrac = Math.abs(fraction - 0.5) * 2; // 1 at ends, 0 at bottom
  const currentHeight = heightFrac * maxHeight;
  const pe = mass * g * currentHeight;
  const totalE = mass * g * maxHeight;
  const ke = totalE - pe;

  const svgWidth = 420;
  const svgHeight = 280;
  const pivotX = svgWidth / 2;
  const pivotY = 30;
  const ropeLen = 160;
  const angleMax = Math.PI / 3;
  const currentAngle = (fraction - 0.5) * 2 * angleMax;
  const bobX = pivotX + ropeLen * Math.sin(currentAngle);
  const bobY = pivotY + ropeLen * Math.cos(currentAngle);

  const barMax = 120;
  const keBarH = (ke / totalE) * barMax;
  const peBarH = (pe / totalE) * barMax;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Conservation of Energy</CardTitle>
              <CardDescription className="mt-1">
                In an isolated system with no non-conservative forces, the total
                mechanical energy remains constant.
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
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                Key Formula
              </p>
              <div className="text-2xl text-amber-800 dark:text-amber-200 mt-1 dark:text-amber-300">
                <Tex display>{"KE_i + PE_i = KE_f + PE_f"}</Tex>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                Total mechanical energy is conserved when only conservative
                forces act.
              </p>
              <div className="text-xl text-amber-800 dark:text-amber-200 mt-2 dark:text-amber-300">
                <Tex display>{"E_{total} = KE + PE = \\text{constant}"}</Tex>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Pendulum Simulation */}
          <div>
            <h3 className="font-semibold mb-3">
              Pendulum Simulation (KE &harr; PE)
            </h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white dark:bg-slate-900"
            >
              {/* Pivot */}
              <circle cx={pivotX} cy={pivotY} r={5} fill="#333" />
              {/* Rope */}
              <line
                x1={pivotX}
                y1={pivotY}
                x2={bobX}
                y2={bobY}
                stroke="#666"
                strokeWidth={2}
              />
              {/* Bob */}
              <circle
                cx={bobX}
                cy={bobY}
                r={18}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth={2}
              />
              <text
                x={bobX}
                y={bobY + 5}
                textAnchor="middle"
                fontSize={11}
                fill="#fff"
                fontWeight="bold"
              >
                {mass}kg
              </text>

              {/* Dashed lowest point line */}
              <line
                x1={pivotX - 120}
                y1={pivotY + ropeLen}
                x2={pivotX + 120}
                y2={pivotY + ropeLen}
                stroke="#aaa"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text
                x={pivotX + 125}
                y={pivotY + ropeLen + 4}
                fontSize={10}
                fill="#aaa"
              >
                h = 0
              </text>

              {/* Height line */}
              {currentHeight > 0.1 && (
                <>
                  <line
                    x1={bobX + 25}
                    y1={bobY}
                    x2={bobX + 25}
                    y2={pivotY + ropeLen}
                    stroke="#2563eb"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={bobX + 35}
                    y={(bobY + pivotY + ropeLen) / 2}
                    fontSize={11}
                    fill="#2563eb"
                  >
                    h = {currentHeight.toFixed(1)}m
                  </text>
                </>
              )}

              {/* Energy Bars */}
              <g transform={`translate(20, ${svgHeight - 20})`}>
                {/* KE bar */}
                <rect
                  x={0}
                  y={-keBarH}
                  width={25}
                  height={keBarH}
                  fill="#dc2626"
                  rx={3}
                />
                <text x={12} y={12} textAnchor="middle" fontSize={10} fill="#666">
                  KE
                </text>
                <text
                  x={12}
                  y={-keBarH - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#dc2626"
                >
                  {ke.toFixed(0)}J
                </text>

                {/* PE bar */}
                <rect
                  x={35}
                  y={-peBarH}
                  width={25}
                  height={peBarH}
                  fill="#2563eb"
                  rx={3}
                />
                <text x={47} y={12} textAnchor="middle" fontSize={10} fill="#666">
                  PE
                </text>
                <text
                  x={47}
                  y={-peBarH - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#2563eb"
                >
                  {pe.toFixed(0)}J
                </text>

                {/* Total bar */}
                <rect
                  x={70}
                  y={-barMax}
                  width={25}
                  height={barMax}
                  fill="#16a34a"
                  rx={3}
                  opacity={0.3}
                />
                <text x={82} y={12} textAnchor="middle" fontSize={10} fill="#666">
                  Total
                </text>
                <text
                  x={82}
                  y={-barMax - 5}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#16a34a"
                >
                  {totalE.toFixed(0)}J
                </text>
              </g>
            </svg>
          </div>

          {/* Slider */}
          <div>
            <label className="text-sm font-medium">
              Pendulum Position (drag to swing)
            </label>
            <Slider
              value={[position]}
              onValueChange={(v) => setPosition(v[0])}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Left (max PE)</span>
              <span>Bottom (max KE)</span>
              <span>Right (max PE)</span>
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                When is energy NOT conserved?
              </AccordionTrigger>
              <AccordionContent>
                Mechanical energy is not conserved when non-conservative forces
                (like friction or air resistance) do work. In those cases, some
                mechanical energy is converted to thermal energy. Total energy
                (including thermal) is always conserved.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                How do you use conservation of energy to solve problems?
              </AccordionTrigger>
              <AccordionContent>
                <PhysicsText display={false}>{"1. Choose a reference level for h = 0. 2. Identify the initial and final states. 3. Write KE_i + PE_i = KE_f + PE_f. 4. Plug in known values and solve for the unknown. This avoids the need for force and acceleration analysis."}</PhysicsText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What about a roller coaster?
              </AccordionTrigger>
              <AccordionContent>
                On a frictionless roller coaster, the car converts PE to KE
                going downhill and KE to PE going uphill. The speed at any height
                depends only on the height difference from the start, not on the
                path taken (assuming no friction).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
