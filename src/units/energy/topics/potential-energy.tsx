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

export function PotentialEnergy({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [mass, setMass] = useState(5);
  const [height, setHeight] = useState(10);
  const [springK, setSpringK] = useState(200);
  const [compression, setCompression] = useState(0.1);

  const g = 9.8;
  const peGrav = mass * g * height;
  const peSpring = 0.5 * springK * compression * compression;

  const svgWidth = 400;
  const svgHeight = 220;
  const groundY = 200;
  const objY = groundY - height * 8;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Potential Energy</CardTitle>
              <CardDescription className="mt-1">
                Potential energy is stored energy due to an object&apos;s position or
                configuration.
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
          {/* Key Formulas */}
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-amber-900 dark:text-amber-200">
                Key Formulas
              </p>
              <div className="text-2xl text-amber-800 dark:text-amber-200 mt-1 dark:text-amber-300">
                <Tex display>{"PE_{grav} = mgh"}</Tex>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                Gravitational PE: <Tex>m</Tex> = mass (kg), <Tex>{"g = 9.8 \\text{ m/s}^2"}</Tex>, <Tex>h</Tex> = height (m)
              </p>
              <div className="text-2xl text-amber-800 dark:text-amber-200 mt-3 dark:text-amber-300">
                <Tex display>{"PE_{spring} = \\tfrac{1}{2}kx^2"}</Tex>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300/80 mt-1">
                Elastic PE: <Tex>k</Tex> = spring constant (N/m), <Tex>x</Tex> = compression/extension (m)
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG - Gravitational */}
          <div>
            <h3 className="font-semibold mb-3">
              Gravitational Potential Energy
            </h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white dark:bg-slate-900"
            >
              {/* Ground */}
              <line
                x1={0}
                y1={groundY}
                x2={svgWidth}
                y2={groundY}
                stroke="#888"
                strokeWidth={2}
              />
              {/* Height reference */}
              <line
                x1={50}
                y1={groundY}
                x2={50}
                y2={objY}
                stroke="#2563eb"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text x={30} y={(groundY + objY) / 2} fontSize={12} fill="#2563eb" textAnchor="middle">
                h={height}m
              </text>
              {/* Object */}
              <rect
                x={70}
                y={objY - 25}
                width={40}
                height={25}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth={2}
                rx={4}
              />
              <text x={90} y={objY - 9} textAnchor="middle" fontSize={11} fill="#fff" fontWeight="bold">
                {mass}kg
              </text>
              {/* PE value */}
              <text x={svgWidth - 10} y={25} textAnchor="end" fontSize={16} fontWeight="bold" fill="#16a34a">
                PE_grav = {peGrav.toFixed(1)} J
              </text>

              {/* Spring section */}
              <g transform="translate(220, 0)">
                {/* Wall */}
                <rect x={0} y={groundY - 60} width={8} height={60} fill="#666" />
                {/* Spring coils */}
                <path
                  d={`M 8 ${groundY - 30} ${Array.from({ length: 6 }, (_, i) => {
                    const baseX = 8 + ((100 - compression * 200) / 6) * (i + 0.5);
                    const yOff = i % 2 === 0 ? -12 : 12;
                    return `L ${baseX} ${groundY - 30 + yOff}`;
                  }).join(" ")} L ${108 - compression * 200} ${groundY - 30}`}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
                {/* Block on spring */}
                <rect
                  x={108 - compression * 200}
                  y={groundY - 50}
                  width={35}
                  height={40}
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth={2}
                  rx={4}
                />
                <text
                  x={svgWidth - 230}
                  y={groundY + 15}
                  fontSize={11}
                  fill="#7c3aed"
                >
                  PE_spring = {peSpring.toFixed(1)} J
                </text>
              </g>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mass: {mass} kg</label>
              <Slider
                value={[mass]}
                onValueChange={(v) => setMass(v[0])}
                min={1}
                max={20}
                step={0.5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Height: {height} m
              </label>
              <Slider
                value={[height]}
                onValueChange={(v) => setHeight(v[0])}
                min={0}
                max={20}
                step={0.5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Spring Constant: {springK} N/m
              </label>
              <Slider
                value={[springK]}
                onValueChange={(v) => setSpringK(v[0])}
                min={50}
                max={500}
                step={10}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Compression: {compression.toFixed(2)} m
              </label>
              <Slider
                value={[compression]}
                onValueChange={(v) => setCompression(v[0])}
                min={0}
                max={0.5}
                step={0.01}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Is potential energy always relative?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Gravitational PE depends on the chosen reference point
                (h = 0). Only changes in PE are physically meaningful. You can
                choose any convenient reference level.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                Does a compressed and stretched spring have the same PE?
              </AccordionTrigger>
              <AccordionContent>
                <PhysicsText display={false}>{"Yes, because PE_spring = ½kx² depends on x². Whether the spring is compressed or stretched by the same amount x, the elastic PE is the same."}</PhysicsText>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                Can gravitational PE be negative?
              </AccordionTrigger>
              <AccordionContent>
                Yes, if you choose a reference point above the object. For
                example, if h = 0 is at the tabletop, an object on the floor
                below has negative gravitational PE.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
