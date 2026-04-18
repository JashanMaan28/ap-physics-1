"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

type Shape = {
  name: string;
  cFactor: number; // I = c * m * R^2
  color: string;
};

const shapes: Shape[] = [
  { name: "Solid Sphere", cFactor: 0.4, color: "#14b8a6" },
  { name: "Solid Cylinder", cFactor: 0.5, color: "#3b82f6" },
  { name: "Hollow Sphere", cFactor: 2 / 3, color: "#f59e0b" },
  { name: "Thin Hoop", cFactor: 1.0, color: "#ef4444" },
];

export function RollingMotion({ onComplete, isComplete }: TopicProps) {
  const [racing, setRacing] = useState(false);
  const [positions, setPositions] = useState([0, 0, 0, 0]);

  const g = 9.8;
  const h = 1.0; // 1 m height
  // v = sqrt(2gh / (1 + c))
  const speeds = shapes.map((s) => Math.sqrt((2 * g * h) / (1 + s.cFactor)));

  const startRace = () => {
    setPositions([0, 0, 0, 0]);
    setRacing(true);

    const maxSpeed = Math.max(...speeds);
    const duration = 2000; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const newPositions = speeds.map((v) => (v / maxSpeed) * t * 100);
      setPositions(newPositions);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setRacing(false);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">Rolling Motion</h2>
          <p className="text-gray-400 mt-1">
            Translation + rotation for objects that roll without slipping
          </p>
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

      {/* Key Formulas */}
      <Card className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border-teal-700">
        <CardHeader>
          <CardTitle className="text-teal-300 text-lg">Key Formulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 py-4">
            <div className="text-2xl text-white"><Tex display>{"v = R\\omega"}</Tex> <span className="text-sm text-gray-400">(rolling constraint)</span></div>
            <div className="text-2xl text-white"><Tex display>{"KE = \\tfrac{1}{2}mv^2 + \\tfrac{1}{2}I\\omega^2"}</Tex></div>
          </div>
          <div className="text-gray-300 text-sm space-y-1 mt-2">
            <p>
              For rolling without slipping, the contact point has zero velocity.
            </p>
            <p>
              Total KE has both translational and rotational parts.
            </p>
            <p>
              Objects with more I (relative to mR&sup2;) are slower down an
              incline because more energy goes into rotation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Race Down Incline */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Race Down the Incline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            All shapes have the same mass and radius, released from the same
            height. Which reaches the bottom first?
          </p>

          <div className="flex justify-center">
            <svg width="400" height="220" viewBox="0 0 400 220">
              {/* Incline */}
              <line
                x1="30"
                y1="20"
                x2="370"
                y2="200"
                stroke="#374151"
                strokeWidth="2"
              />
              {/* Track lines for each shape */}
              {shapes.map((shape, i) => {
                const y = 30 + i * 45;
                return (
                  <g key={shape.name}>
                    {/* Track */}
                    <line
                      x1="30"
                      y1={y}
                      x2="370"
                      y2={y}
                      stroke="#1f2937"
                      strokeWidth="20"
                    />
                    {/* Shape circle */}
                    <circle
                      cx={30 + (positions[i] / 100) * 330}
                      cy={y}
                      r="8"
                      fill={shape.color}
                    />
                    {/* Label */}
                    <text
                      x="375"
                      y={y + 4}
                      fill={shape.color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {shape.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={startRace}
              disabled={racing}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {racing ? "Racing..." : "Start Race"}
            </Button>
          </div>

          {/* Speed results */}
          <div className="grid grid-cols-2 gap-2">
            {shapes.map((shape) => {
              const v = Math.sqrt((2 * g * h) / (1 + shape.cFactor));
              return (
                <div
                  key={shape.name}
                  className="bg-gray-800 rounded-lg p-2 text-center"
                >
                  <p className="text-xs" style={{ color: shape.color }}>
                    {shape.name} (c = {shape.cFactor.toFixed(2)})
                  </p>
                  <p className="text-white font-bold text-sm">
                    v = {v.toFixed(2)} m/s
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-gray-500 text-xs text-center">
            Winner: Solid Sphere (least rotational inertia fraction). Mass and
            radius do not matter!
          </p>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger className="text-gray-300">
                Why does mass cancel out in the race?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Using energy conservation: mgh = &frac12;mv&sup2; +
                &frac12;(cmR&sup2;)(v/R)&sup2; = &frac12;mv&sup2;(1+c). Mass m
                cancels from both sides, so v depends only on h and c.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-gray-300">
                What does &quot;rolling without slipping&quot; mean?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                The contact point between the object and surface has zero velocity.
                This requires v = R&omega;. Static friction provides the torque
                needed for rolling but does no work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-gray-300">
                What if there is no friction?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Without friction, there is no torque, so the object slides without
                rotating. All its PE converts to translational KE, making it faster
                than any rolling object from the same height.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
