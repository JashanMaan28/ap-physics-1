"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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

export function NewtonsLaws({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);

  const acceleration = force / mass;
  const blockX = Math.min(50 + acceleration * 8, 340);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Newton&apos;s Laws of Motion</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            The foundation of classical mechanics -- three laws that describe the relationship
            between forces and motion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Law */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">First Law (Law of Inertia)</h3>
            <p className="text-muted-foreground">
              An object at rest stays at rest, and an object in motion stays in motion at constant
              velocity, unless acted upon by a net external force.
            </p>
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">Key Insight:</p>
              <p className="text-sm text-muted-foreground">
                No net force means no change in velocity. This applies to both stationary objects
                and objects moving at constant speed in a straight line.
              </p>
            </div>
          </div>

          <Separator />

          {/* Second Law - Interactive */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Second Law (F = ma) -- Interactive</h3>
            <p className="text-muted-foreground">
              The net force on an object equals its mass times its acceleration. The acceleration is
              in the direction of the net force.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Mass: {mass} kg
                </label>
                <Slider
                  value={[mass]}
                  onValueChange={(v) => setMass(v[0])}
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Applied Force: {force} N
                </label>
                <Slider
                  value={[force]}
                  onValueChange={(v) => setForce(v[0])}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* SVG Animation */}
            <div className="rounded-lg border bg-white p-2">
              <svg viewBox="0 0 400 120" className="w-full">
                {/* Ground */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#888" strokeWidth="2" />
                {/* Hatching */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={i}
                    x1={i * 20}
                    y1="100"
                    x2={i * 20 + 10}
                    y2="110"
                    stroke="#888"
                    strokeWidth="1"
                  />
                ))}
                {/* Block */}
                <rect
                  x={blockX}
                  y={60}
                  width={40}
                  height={40}
                  fill="#ef4444"
                  rx={4}
                  className="transition-all duration-300"
                />
                <text
                  x={blockX + 20}
                  y={84}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {mass}kg
                </text>
                {/* Force Arrow */}
                {force > 0 && (
                  <>
                    <line
                      x1={blockX + 40}
                      y1={80}
                      x2={blockX + 40 + force * 0.8}
                      y2={80}
                      stroke="#2563eb"
                      strokeWidth="3"
                      markerEnd="url(#arrowBlue)"
                    />
                    <text
                      x={blockX + 50 + force * 0.4}
                      y={74}
                      textAnchor="middle"
                      fill="#2563eb"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      F={force}N
                    </text>
                  </>
                )}
                <defs>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#2563eb" />
                  </marker>
                </defs>
              </svg>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-lg font-semibold text-blue-900">
                  a = F / m = {force} / {mass} ={" "}
                  <span className="text-2xl">{acceleration.toFixed(2)} m/s²</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Third Law */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Third Law (Action-Reaction)</h3>
            <p className="text-muted-foreground">
              For every action, there is an equal and opposite reaction. When object A exerts a
              force on object B, object B simultaneously exerts a force equal in magnitude and
              opposite in direction on object A.
            </p>
            <div className="rounded-lg border bg-white p-2">
              <svg viewBox="0 0 400 100" className="w-full">
                {/* Block A */}
                <rect x={120} y={30} width={60} height={40} fill="#ef4444" rx={4} />
                <text x={150} y={55} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">A</text>
                {/* Block B */}
                <rect x={220} y={30} width={60} height={40} fill="#3b82f6" rx={4} />
                <text x={250} y={55} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">B</text>
                {/* Force arrows */}
                <line x1={180} y1={50} x2={218} y2={50} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRed)" />
                <text x={200} y={42} textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">F_AB</text>
                <line x1={220} y1={60} x2={182} y2={60} stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowB2)" />
                <text x={200} y={78} textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">F_BA</text>
                <defs>
                  <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#ef4444" />
                  </marker>
                  <marker id="arrowB2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              F_AB = -F_BA. The forces are equal in magnitude, opposite in direction, and act on
              different objects.
            </p>
          </div>

          <Separator />

          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900">Key Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-2xl font-bold text-amber-900">
                &Sigma;F = ma
              </p>
              <p className="text-center text-sm text-amber-700 mt-1">
                Net force equals mass times acceleration (vector equation)
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* FAQ */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
            <Accordion className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>If action and reaction are equal, why do objects accelerate?</AccordionTrigger>
                <AccordionContent>
                  Action-reaction pairs act on different objects. Object A pushes on B and B pushes
                  back on A. The net force on each individual object depends on all forces acting on
                  that object alone, not just one pair.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Is weight a force?</AccordionTrigger>
                <AccordionContent>
                  Yes. Weight W = mg is the gravitational force the Earth exerts on an object. Mass
                  is a scalar property of the object; weight is a force vector pointing toward Earth.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>Can an object be in equilibrium while moving?</AccordionTrigger>
                <AccordionContent>
                  Yes. An object moving at constant velocity has zero acceleration, which means the
                  net force is zero -- it is in dynamic (translational) equilibrium.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Does F = ma work for variable mass systems?</AccordionTrigger>
                <AccordionContent>
                  The more general form is F = dp/dt (rate of change of momentum). For constant mass,
                  this simplifies to F = ma. Rocket problems require the momentum form.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full" size="lg">
            {isComplete ? "Topic Completed" : "Mark as Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
