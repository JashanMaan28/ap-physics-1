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

export function AngularMomentum({ onComplete, isComplete }: TopicProps) {
  const [armsExtended, setArmsExtended] = useState(true);
  const [momentOfInertia, setMomentOfInertia] = useState(5); // kg·m²
  const [angularVelocity, setAngularVelocity] = useState(3); // rad/s

  const angularMomentum = momentOfInertia * angularVelocity;

  // Figure skater simulation
  const skaterI = armsExtended ? 4.0 : 1.2;
  const initialL = 4.0 * 3.0; // L = I_extended * omega_initial
  const skaterOmega = initialL / skaterI;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">Angular Momentum</h2>
          <p className="text-gray-400 mt-1">
            The rotational analog of linear momentum
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
            L = I&omega;
          </div>
          <div className="text-gray-300 text-sm space-y-1 mt-2">
            <p>
              <strong>L</strong> = angular momentum (kg&middot;m&sup2;/s)
            </p>
            <p>
              <strong>I</strong> = moment of inertia (kg&middot;m&sup2;)
            </p>
            <p>
              <strong>&omega;</strong> = angular velocity (rad/s)
            </p>
            <p>
              Analogous to p = mv in translational motion.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Figure Skater Visualization */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Figure Skater Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            Click to toggle arms in/out. Notice how &omega; changes while L stays
            constant.
          </p>
          <div className="flex justify-center">
            <svg width="240" height="280" viewBox="0 0 240 280">
              {/* Skater body */}
              <ellipse
                cx="120"
                cy="140"
                rx={armsExtended ? 60 : 20}
                ry="80"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2"
              />
              {/* Head */}
              <circle cx="120" cy="50" r="16" fill="none" stroke="#5eead4" strokeWidth="2" />
              {/* Arms */}
              {armsExtended ? (
                <>
                  <line x1="60" y1="110" x2="30" y2="100" stroke="#5eead4" strokeWidth="2" />
                  <line x1="180" y1="110" x2="210" y2="100" stroke="#5eead4" strokeWidth="2" />
                </>
              ) : (
                <>
                  <line x1="105" y1="100" x2="100" y2="130" stroke="#5eead4" strokeWidth="2" />
                  <line x1="135" y1="100" x2="140" y2="130" stroke="#5eead4" strokeWidth="2" />
                </>
              )}
              {/* Rotation arrows */}
              <text x="120" y="260" textAnchor="middle" fill="#9ca3af" fontSize="12">
                &omega; = {skaterOmega.toFixed(1)} rad/s
              </text>
              {/* Spinning indicator */}
              <circle
                cx="120"
                cy="140"
                r={armsExtended ? 65 : 25}
                fill="none"
                stroke="#5eead4"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.4"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 120 140"
                  to="360 120 140"
                  dur={`${Math.max(0.3, 6 / skaterOmega)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setArmsExtended(!armsExtended)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {armsExtended ? "Pull Arms In" : "Extend Arms Out"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-500 text-xs">I</p>
              <p className="text-teal-300 font-bold">{skaterI.toFixed(1)} kg&middot;m&sup2;</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-500 text-xs">&omega;</p>
              <p className="text-teal-300 font-bold">{skaterOmega.toFixed(1)} rad/s</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-500 text-xs">L (conserved)</p>
              <p className="text-yellow-300 font-bold">{initialL.toFixed(1)} kg&middot;m&sup2;/s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Explorer */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">L = I&omega; Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Moment of Inertia (I): {momentOfInertia.toFixed(1)} kg&middot;m&sup2;
            </label>
            <Slider
              value={[momentOfInertia]}
              onValueChange={(v) => setMomentOfInertia(v[0])}
              min={0.5}
              max={10}
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
              max={15}
              step={0.1}
            />
          </div>
          <div className="bg-teal-900/30 border border-teal-700 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Angular Momentum</p>
            <p className="text-3xl font-bold text-teal-300">
              {angularMomentum.toFixed(1)} kg&middot;m&sup2;/s
            </p>
          </div>
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
                Is angular momentum a vector?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes. Its direction is along the axis of rotation, determined by the
                right-hand rule. For AP Physics 1, you typically only need the
                magnitude and sign (CW vs CCW).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-gray-300">
                How does a figure skater speed up without a torque?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                By pulling their arms in, they reduce I. Since no external torque
                acts, L = I&omega; is conserved, so &omega; must increase. Internal
                forces redistribute mass but cannot change total L.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-gray-300">
                What is the unit of angular momentum?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                kg&middot;m&sup2;/s, which is also equivalent to J&middot;s
                (joule-seconds) or N&middot;m&middot;s.
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
