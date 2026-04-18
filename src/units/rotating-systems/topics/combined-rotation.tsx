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

export function CombinedRotation({ onComplete, isComplete }: TopicProps) {
  // Yo-yo / Atwood-with-pulley scenario
  const [hangingMass, setHangingMass] = useState(2.0); // kg
  const [pulleyMass, setPulleyMass] = useState(1.0); // kg
  const pulleyR = 0.1; // m
  const g = 9.8;

  // Pulley I = (1/2)MR^2 (solid disk)
  const pulleyI = 0.5 * pulleyMass * pulleyR ** 2;
  // a = mg / (m + I/R^2) = mg / (m + M/2)
  const acceleration = (hangingMass * g) / (hangingMass + pulleyMass / 2);
  // Tension T = m(g - a)
  const tension = hangingMass * (g - acceleration);
  const angularAccel = acceleration / pulleyR;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">
            Combined Translation + Rotation
          </h2>
          <p className="text-gray-400 mt-1">
            Systems with both linear and rotational motion: pulleys, yo-yos,
            Atwood machines
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
          <CardTitle className="text-teal-300 text-lg">Key Formulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 py-4">
            <div className="text-xl text-white"><Tex display>{"\\Sigma F = ma"}</Tex> <span className="text-sm text-gray-400">(translating mass)</span></div>
            <div className="text-xl text-white"><Tex display>{"\\Sigma \\tau = I\\alpha"}</Tex> <span className="text-sm text-gray-400">(rotating pulley)</span></div>
            <div className="text-xl text-white"><Tex display>{"a = R\\alpha"}</Tex> <span className="text-sm text-gray-400">(string constraint)</span></div>
          </div>
          <div className="text-gray-300 text-sm mt-2">
            <p>
              Combine Newton&apos;s 2nd law for translation and rotation, linked
              by the constraint that the string does not slip on the pulley.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pulley System Visualization */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Mass Hanging from a Pulley
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-sm">
            A mass hangs from a string wrapped around a solid disk pulley. The
            pulley has mass M and radius R = {pulleyR} m.
          </p>

          <div className="flex justify-center">
            <svg width="200" height="300" viewBox="0 0 200 300">
              {/* Ceiling */}
              <line x1="60" y1="20" x2="140" y2="20" stroke="#6b7280" strokeWidth="3" />
              <line x1="100" y1="20" x2="100" y2="50" stroke="#6b7280" strokeWidth="2" />

              {/* Pulley */}
              <circle
                cx="100"
                cy="70"
                r="25"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3"
              />
              <circle cx="100" cy="70" r="3" fill="#5eead4" />

              {/* String */}
              <line x1="125" y1="70" x2="125" y2="200" stroke="#9ca3af" strokeWidth="1.5" />

              {/* Hanging mass */}
              <rect
                x="110"
                y="200"
                width="30"
                height="30"
                fill="#f59e0b"
                rx="3"
              />
              <text x="125" y="220" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">
                m
              </text>

              {/* Labels */}
              <text x="60" y="75" fill="#14b8a6" fontSize="10">
                M, R
              </text>

              {/* Arrow for acceleration */}
              <line x1="145" y1="210" x2="145" y2="250" stroke="#ef4444" strokeWidth="2" />
              <polygon points="145,255 140,248 150,248" fill="#ef4444" />
              <text x="155" y="240" fill="#ef4444" fontSize="10">
                a
              </text>

              {/* Tension label */}
              <text x="130" y="170" fill="#9ca3af" fontSize="10">
                T
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Hanging mass (m): {hangingMass.toFixed(1)} kg
              </label>
              <Slider
                value={[hangingMass]}
                onValueChange={(v) => setHangingMass(v[0])}
                min={0.5}
                max={10}
                step={0.1}
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Pulley mass (M): {pulleyMass.toFixed(1)} kg
              </label>
              <Slider
                value={[pulleyMass]}
                onValueChange={(v) => setPulleyMass(v[0])}
                min={0.2}
                max={8}
                step={0.1}
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">Linear Acceleration</p>
              <p className="text-teal-300 font-bold text-lg">
                {acceleration.toFixed(2)} m/s&sup2;
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">Angular Acceleration</p>
              <p className="text-teal-300 font-bold text-lg">
                {angularAccel.toFixed(1)} rad/s&sup2;
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">String Tension</p>
              <p className="text-teal-300 font-bold text-lg">
                {tension.toFixed(2)} N
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-gray-500 text-xs">Pulley I</p>
              <p className="text-teal-300 font-bold text-lg">
                {pulleyI.toFixed(4)} kg&middot;m&sup2;
              </p>
            </div>
          </div>

          <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-3 text-gray-300 text-sm">
            <p>
              <strong>Notice:</strong> If the pulley were massless (M = 0), a ={" "}
              {g.toFixed(1)} m/s&sup2; (free fall). The pulley&apos;s inertia
              reduces the acceleration. Heavier pulley = slower fall.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Yo-Yo Conceptual */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Yo-Yo Problem</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-3">
          <p>
            A yo-yo is essentially the same problem as the pulley: a solid disk
            unwinding under gravity. The string exerts an upward tension while
            gravity pulls down.
          </p>
          <p>
            For a solid disk yo-yo: a = 2g/3 &asymp; 6.53 m/s&sup2;, and the
            tension is mg/3 (always less than mg, so it accelerates downward).
          </p>
          <p>
            The key insight is that the string does no net work&mdash;energy
            conservation gives the same result as Newton&apos;s laws.
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
                Why is tension less than mg?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Because the mass is accelerating downward. By Newton&apos;s 2nd
                law: mg - T = ma, so T = m(g - a). Since a &gt; 0, T &lt; mg.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-gray-300">
                Can I use energy methods instead of forces?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes! mgh = &frac12;mv&sup2; + &frac12;I&omega;&sup2; with v =
                R&omega; gives the same results. Energy methods are often faster
                when you don&apos;t need to find tension.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-gray-300">
                What if the string has mass?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400">
                In AP Physics 1, strings are always massless and inextensible.
                This means tension is the same throughout the string, and the
                linear acceleration equals R times the angular acceleration.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
