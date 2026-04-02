"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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

export function RotationalKE({ onComplete, isComplete }: TopicProps) {
  const [momentOfInertia, setMomentOfInertia] = useState(2); // kg·m²
  const [angularVelocity, setAngularVelocity] = useState(4); // rad/s

  const kineticEnergy = 0.5 * momentOfInertia * angularVelocity ** 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">
            Rotational Kinetic Energy
          </h2>
          <p className="text-gray-400 mt-1">
            Understand how spinning objects store kinetic energy
          </p>
        </div>
        {isComplete && <Badge className="bg-teal-600">Completed</Badge>}
      </div>

      {/* Key Formula */}
      <Card className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border-teal-700">
        <CardHeader>
          <CardTitle className="text-teal-300 text-lg">Key Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-3xl font-mono text-white py-4">
            KE<sub>rot</sub> = &frac12; I &omega;&sup2;
          </div>
          <div className="text-gray-300 text-sm space-y-1 mt-2">
            <p>
              <strong>I</strong> = moment of inertia (kg&middot;m&sup2;) &mdash;
              rotational analog of mass
            </p>
            <p>
              <strong>&omega;</strong> = angular velocity (rad/s) &mdash;
              rotational analog of velocity
            </p>
            <p>
              This is the rotational analog of KE = &frac12;mv&sup2;
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive SVG Visualization */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Interactive Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <svg width="260" height="260" viewBox="0 0 260 260">
              {/* Outer ring representing object */}
              <circle
                cx="130"
                cy="130"
                r={40 + momentOfInertia * 10}
                fill="none"
                stroke="#14b8a6"
                strokeWidth={3 + momentOfInertia}
                opacity={0.7}
              />
              {/* Center dot */}
              <circle cx="130" cy="130" r="4" fill="#5eead4" />
              {/* Rotating arm indicator */}
              <line
                x1="130"
                y1="130"
                x2={130 + (40 + momentOfInertia * 10) * Math.cos(0)}
                y2={130 + (40 + momentOfInertia * 10) * Math.sin(0)}
                stroke="#5eead4"
                strokeWidth="2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 130 130"
                  to="360 130 130"
                  dur={`${Math.max(0.3, 6 / angularVelocity)}s`}
                  repeatCount="indefinite"
                />
              </line>
              {/* Energy bar */}
              <rect x="220" y="20" width="20" height="220" fill="#1f2937" rx="4" />
              <rect
                x="220"
                y={240 - Math.min(220, kineticEnergy * 2)}
                width="20"
                height={Math.min(220, kineticEnergy * 2)}
                fill="#14b8a6"
                rx="4"
              />
              <text x="230" y="15" textAnchor="middle" fill="#9ca3af" fontSize="10">
                KE
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Moment of Inertia (I): {momentOfInertia.toFixed(1)} kg&middot;m&sup2;
              </label>
              <Slider
                value={[momentOfInertia]}
                onValueChange={(v) => setMomentOfInertia(v[0])}
                min={0.5}
                max={8}
                step={0.1}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Angular Velocity (&omega;): {angularVelocity.toFixed(1)} rad/s
              </label>
              <Slider
                value={[angularVelocity]}
                onValueChange={(v) => setAngularVelocity(v[0])}
                min={0.5}
                max={12}
                step={0.1}
              />
            </div>
          </div>

          {/* Computed value */}
          <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Rotational Kinetic Energy</p>
            <p className="text-3xl font-bold text-teal-300">
              {kineticEnergy.toFixed(1)} J
            </p>
            <p className="text-gray-500 text-xs mt-1">
              &frac12; &times; {momentOfInertia.toFixed(1)} &times;{" "}
              {angularVelocity.toFixed(1)}&sup2; = {kineticEnergy.toFixed(1)} J
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Key Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-300">
          <p>
            Rotational kinetic energy depends on <strong>moment of inertia</strong>{" "}
            and the <strong>square of angular velocity</strong>. Doubling &omega;
            quadruples the energy, while doubling I only doubles it.
          </p>
          <p>
            Common moments of inertia: solid cylinder = &frac12;MR&sup2;, solid
            sphere = 2/5 MR&sup2;, thin hoop = MR&sup2;, thin rod (center) =
            1/12 ML&sup2;.
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
                Why does &omega; matter more than I for KE?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Because KE depends on &omega;&sup2;, a small increase in angular
                velocity causes a large increase in energy. This is the same reason
                speed matters more than mass for translational KE.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-gray-300">
                How is moment of inertia different from mass?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Moment of inertia depends on both mass and how that mass is
                distributed relative to the axis of rotation. A hollow cylinder has
                more I than a solid one of the same mass because its mass is farther
                from the axis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-gray-300">
                Can an object have both translational and rotational KE?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes! A rolling ball has KE<sub>total</sub> = &frac12;mv&sup2; +
                &frac12;I&omega;&sup2;. The total energy is the sum of both forms.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Mark Complete */}
      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          disabled={isComplete}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isComplete ? "Completed" : "Mark Complete"}
        </Button>
      </div>
    </div>
  );
}
