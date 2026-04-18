"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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

export function ConservationAngular({ onComplete, isComplete }: TopicProps) {
  // Merry-go-round scenario
  const merryI = 250; // kg·m² (merry-go-round)
  const merryOmega1 = 2.0; // rad/s initial
  const [personMass, setPersonMass] = useState(60); // kg
  const [personR, setPersonR] = useState(2.0); // m from center

  const personI = personMass * personR ** 2;
  const totalI = merryI + personI;
  const L = merryI * merryOmega1; // conserved
  const omegaFinal = L / totalI;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">
            Conservation of Angular Momentum
          </h2>
          <p className="text-gray-400 mt-1">
            When no external torque acts, L stays constant
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

      {/* Key Formula */}
      <Card className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border-teal-700">
        <CardHeader>
          <CardTitle className="text-teal-300 text-lg">Key Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-3xl text-white py-4">
            <Tex display>{"I_1 \\omega_1 = I_2 \\omega_2"}</Tex>
          </div>
          <div className="text-gray-300 text-sm space-y-1 mt-2">
            <p>
              When no net external torque acts on a system, total angular momentum
              is conserved.
            </p>
            <p>
              If the moment of inertia changes, angular velocity must change
              inversely to keep L constant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Merry-Go-Round Simulation */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Merry-Go-Round + Person Scenario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            A merry-go-round (I = {merryI} kg&middot;m&sup2;) spins at{" "}
            {merryOmega1} rad/s. A person jumps on at radius R from center.
          </p>

          <div className="flex justify-center">
            <svg width="260" height="260" viewBox="0 0 260 260">
              {/* Merry-go-round */}
              <circle
                cx="130"
                cy="130"
                r="100"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3"
                opacity="0.5"
              />
              {/* Axis */}
              <circle cx="130" cy="130" r="5" fill="#5eead4" />
              {/* Person dot */}
              <circle
                cx={130 + personR * 40}
                cy="130"
                r="8"
                fill="#f59e0b"
                opacity="0.9"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 130 130"
                  to="360 130 130"
                  dur={`${Math.max(0.4, 6 / omegaFinal)}s`}
                  repeatCount="indefinite"
                />
              </circle>
              {/* Radius line */}
              <line
                x1="130"
                y1="130"
                x2={130 + personR * 40}
                y2="130"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4 2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 130 130"
                  to="360 130 130"
                  dur={`${Math.max(0.4, 6 / omegaFinal)}s`}
                  repeatCount="indefinite"
                />
              </line>
              {/* Labels */}
              <text x="130" y="250" textAnchor="middle" fill="#9ca3af" fontSize="11">
                &omega; = {omegaFinal.toFixed(2)} rad/s
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Person Mass: {personMass} kg
              </label>
              <Slider
                value={[personMass]}
                onValueChange={(v) => setPersonMass(v[0])}
                min={20}
                max={120}
                step={1}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Distance from Center (R): {personR.toFixed(1)} m
              </label>
              <Slider
                value={[personR]}
                onValueChange={(v) => setPersonR(v[0])}
                min={0.5}
                max={2.5}
                step={0.1}
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">Before (just platform)</p>
              <p className="text-teal-300 font-bold">
                I = {merryI} kg&middot;m&sup2;
              </p>
              <p className="text-teal-300 font-bold">&omega; = {merryOmega1} rad/s</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">After (platform + person)</p>
              <p className="text-teal-300 font-bold">
                I = {totalI.toFixed(0)} kg&middot;m&sup2;
              </p>
              <p className="text-teal-300 font-bold">
                &omega; = {omegaFinal.toFixed(2)} rad/s
              </p>
            </div>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-center">
            <p className="text-yellow-300 font-bold">
              L = {L.toFixed(0)} kg&middot;m&sup2;/s (conserved)
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
                Is kinetic energy also conserved when the person jumps on?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                No. This is a perfectly inelastic collision in the rotational
                context. Angular momentum is conserved, but kinetic energy
                decreases. Energy is lost to heat/deformation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-gray-300">
                What counts as an &quot;external torque&quot;?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                A torque from an agent outside the defined system. Friction from
                bearings, pushes from someone on the ground, or gravity acting on
                an off-axis center of mass are common external torques.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-gray-300">
                Can two objects exchange angular momentum?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes. If they interact through internal torques, one gains what the
                other loses. The system&apos;s total L remains unchanged as long as
                there is no external torque.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
