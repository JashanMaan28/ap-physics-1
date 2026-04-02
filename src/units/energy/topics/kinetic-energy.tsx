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

export function KineticEnergy({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [mass, setMass] = useState(5);
  const [velocity, setVelocity] = useState(10);

  const ke = 0.5 * mass * velocity * velocity;
  const maxKE = 0.5 * 20 * 30 * 30; // for bar scaling

  const svgWidth = 400;
  const svgHeight = 200;
  const barMaxH = 150;
  const barH = Math.min((ke / maxKE) * barMaxH, barMaxH);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Kinetic Energy</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Kinetic energy is the energy an object possesses due to its motion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-amber-900">
                Key Formula
              </p>
              <p className="text-2xl font-mono text-amber-800 mt-1">
                KE = &frac12;mv&sup2;
              </p>
              <p className="text-sm text-amber-700 mt-1">
                KE = kinetic energy (J), m = mass (kg), v = velocity (m/s)
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG */}
          <div>
            <h3 className="font-semibold mb-3">Interactive Diagram</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white"
            >
              {/* Moving object */}
              <circle
                cx={60 + velocity * 3}
                cy={100}
                r={10 + mass}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth={2}
              />
              {/* Velocity arrow */}
              <line
                x1={60 + velocity * 3 + 10 + mass}
                y1={100}
                x2={60 + velocity * 3 + 10 + mass + velocity * 2}
                y2={100}
                stroke="#dc2626"
                strokeWidth={2}
                markerEnd="url(#keArrow)"
              />
              <defs>
                <marker
                  id="keArrow"
                  markerWidth={10}
                  markerHeight={7}
                  refX={10}
                  refY={3.5}
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                </marker>
              </defs>
              <text
                x={60 + velocity * 3}
                y={80 - mass}
                textAnchor="middle"
                fontSize={12}
                fill="#333"
              >
                m = {mass} kg
              </text>
              <text
                x={60 + velocity * 3 + 10 + mass + velocity}
                y={90}
                textAnchor="middle"
                fontSize={12}
                fill="#dc2626"
              >
                v = {velocity} m/s
              </text>

              {/* KE Bar */}
              <rect
                x={350}
                y={svgHeight - 10 - barH}
                width={30}
                height={barH}
                fill="#16a34a"
                rx={3}
              />
              <text
                x={365}
                y={svgHeight - 15 - barH}
                textAnchor="middle"
                fontSize={11}
                fill="#16a34a"
                fontWeight="bold"
              >
                {ke.toFixed(0)} J
              </text>
              <text
                x={365}
                y={svgHeight - 2}
                textAnchor="middle"
                fontSize={10}
                fill="#666"
              >
                KE
              </text>
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
                Velocity: {velocity} m/s
              </label>
              <Slider
                value={[velocity]}
                onValueChange={(v) => setVelocity(v[0])}
                min={0}
                max={30}
                step={1}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Why is velocity squared in KE?
              </AccordionTrigger>
              <AccordionContent>
                The v&sup2; term arises from the work-energy theorem. When you
                integrate F = ma over displacement using v dv, you get
                &frac12;mv&sup2;. Physically, doubling velocity quadruples the
                kinetic energy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Can KE be negative?</AccordionTrigger>
              <AccordionContent>
                No. Since mass is always positive and velocity is squared, KE is
                always zero or positive. An object at rest has KE = 0.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What is the work-energy theorem?
              </AccordionTrigger>
              <AccordionContent>
                The net work done on an object equals its change in kinetic
                energy: W_net = &Delta;KE = KE_f &minus; KE_i. This directly
                connects force and motion to energy.
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
