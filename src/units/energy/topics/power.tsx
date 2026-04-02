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

export function Power({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [force, setForce] = useState(20);
  const [velocity, setVelocity] = useState(5);
  const [work, setWork] = useState(100);
  const [time, setTime] = useState(10);

  const powerFV = force * velocity;
  const powerWT = work / time;

  const svgWidth = 400;
  const svgHeight = 180;
  const maxP = 1000;
  const barFV = Math.min((powerFV / maxP) * 140, 140);
  const barWT = Math.min((powerWT / maxP) * 140, 140);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Power</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Power is the rate at which work is done or energy is transferred.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-amber-900">
                Key Formulas
              </p>
              <p className="text-2xl font-mono text-amber-800 mt-1">
                P = W / t
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Power = work / time
              </p>
              <p className="text-2xl font-mono text-amber-800 mt-2">
                P = F &middot; v
              </p>
              <p className="text-sm text-amber-700 mt-1">
                P = power (W), F = force (N), v = velocity (m/s). 1 watt = 1
                J/s
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG */}
          <div>
            <h3 className="font-semibold mb-3">Power Comparison</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white"
            >
              {/* P = Fv bar */}
              <rect x={60} y={40} width={barFV} height={30} fill="#f59e0b" rx={4} />
              <text x={50} y={60} textAnchor="end" fontSize={12} fill="#333">
                P=Fv
              </text>
              <text
                x={65 + barFV}
                y={60}
                fontSize={13}
                fill="#d97706"
                fontWeight="bold"
              >
                {powerFV.toFixed(0)} W
              </text>

              {/* P = W/t bar */}
              <rect x={60} y={90} width={barWT} height={30} fill="#7c3aed" rx={4} />
              <text x={50} y={110} textAnchor="end" fontSize={12} fill="#333">
                P=W/t
              </text>
              <text
                x={65 + barWT}
                y={110}
                fontSize={13}
                fill="#7c3aed"
                fontWeight="bold"
              >
                {powerWT.toFixed(0)} W
              </text>

              {/* Moving object with force */}
              <g transform="translate(200, 150)">
                <rect x={0} y={-20} width={30} height={20} fill="#f59e0b" stroke="#d97706" strokeWidth={1.5} rx={3} />
                <line
                  x1={30}
                  y1={-10}
                  x2={30 + velocity * 4}
                  y2={-10}
                  stroke="#dc2626"
                  strokeWidth={2}
                  markerEnd="url(#pArrow)"
                />
                <defs>
                  <marker id="pArrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
                  </marker>
                </defs>
                <text x={15} y={-25} textAnchor="middle" fontSize={10} fill="#333">
                  F={force}N, v={velocity}m/s
                </text>
              </g>
            </svg>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">P = Fv</h4>
              <div>
                <label className="text-sm font-medium">
                  Force: {force} N
                </label>
                <Slider
                  value={[force]}
                  onValueChange={(v) => setForce(v[0])}
                  min={1}
                  max={100}
                  step={1}
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
                  max={20}
                  step={0.5}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-sm">P = W/t</h4>
              <div>
                <label className="text-sm font-medium">Work: {work} J</label>
                <Slider
                  value={[work]}
                  onValueChange={(v) => setWork(v[0])}
                  min={10}
                  max={500}
                  step={10}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time: {time} s</label>
                <Slider
                  value={[time]}
                  onValueChange={(v) => setTime(v[0])}
                  min={1}
                  max={60}
                  step={1}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                What is the difference between energy and power?
              </AccordionTrigger>
              <AccordionContent>
                Energy is the ability to do work (measured in joules). Power is
                the rate at which energy is transferred (measured in watts).
                A powerful engine does the same work in less time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                What is a watt in everyday terms?
              </AccordionTrigger>
              <AccordionContent>
                A 100 W light bulb converts 100 joules of electrical energy
                into light and heat every second. A typical human can sustain
                about 75 W of power output during exercise. A horsepower is
                about 746 W.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                When do you use P = Fv vs P = W/t?
              </AccordionTrigger>
              <AccordionContent>
                Use P = Fv when you know the instantaneous force and velocity
                (e.g., a car engine pulling at constant speed). Use P = W/t
                when you know the total work done over a time interval (average
                power).
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
