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

export function Friction({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [appliedForce, setAppliedForce] = useState(10);
  const [muS, setMuS] = useState(0.5);
  const [muK, setMuK] = useState(0.3);
  const [mass, setMass] = useState(10);

  const weight = mass * 9.8;
  const normalForce = weight;
  const maxStaticFriction = muS * normalForce;
  const kineticFriction = muK * normalForce;

  const isSliding = appliedForce > maxStaticFriction;
  const frictionForce = isSliding ? kineticFriction : Math.min(appliedForce, maxStaticFriction);
  const netForce = isSliding ? appliedForce - kineticFriction : 0;
  const acceleration = netForce / mass;

  const blockX = isSliding ? 60 + Math.min(acceleration * 15, 200) : 60;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Friction</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Friction is a contact force that opposes the relative motion (or tendency of motion)
            between two surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theory */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Static vs Kinetic Friction</h3>
            <p className="text-muted-foreground">
              <strong>Static friction</strong> (f_s) prevents motion and can vary from 0 up to
              a maximum of mu_s * N. <strong>Kinetic friction</strong> (f_k = mu_k * N) acts on
              sliding objects and is typically less than the maximum static friction.
            </p>
          </div>

          <Separator />

          {/* Interactive Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interactive: Static to Kinetic Transition</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mass: {mass} kg</label>
                <Slider value={[mass]} onValueChange={(v) => setMass(v[0])} min={1} max={30} step={0.5} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Applied Force: {appliedForce} N</label>
                <Slider value={[appliedForce]} onValueChange={(v) => setAppliedForce(v[0])} min={0} max={200} step={1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">mu_s (static): {muS.toFixed(2)}</label>
                <Slider value={[muS]} onValueChange={(v) => setMuS(v[0])} min={0.1} max={1.0} step={0.01} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">mu_k (kinetic): {muK.toFixed(2)}</label>
                <Slider value={[muK]} onValueChange={(v) => setMuK(v[0])} min={0.05} max={0.9} step={0.01} />
              </div>
            </div>

            {/* SVG Diagram */}
            <div className="rounded-lg border bg-white p-2">
              <svg viewBox="0 0 400 130" className="w-full">
                <line x1="0" y1="110" x2="400" y2="110" stroke="#888" strokeWidth="2" />
                {Array.from({ length: 20 }).map((_, i) => (
                  <line key={i} x1={i * 20} y1="110" x2={i * 20 + 10} y2="120" stroke="#888" strokeWidth="1" />
                ))}

                {/* Block */}
                <rect
                  x={blockX}
                  y={70}
                  width={50}
                  height={40}
                  fill={isSliding ? "#ef4444" : "#22c55e"}
                  rx={4}
                  className="transition-all duration-300"
                />
                <text x={blockX + 25} y={94} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                  {mass}kg
                </text>

                {/* Applied force arrow */}
                {appliedForce > 0 && (
                  <line
                    x1={blockX + 50}
                    y1={90}
                    x2={blockX + 50 + appliedForce * 0.5}
                    y2={90}
                    stroke="#2563eb"
                    strokeWidth="3"
                    markerEnd="url(#arrowApplied)"
                  />
                )}
                {/* Friction arrow */}
                {frictionForce > 0 && (
                  <line
                    x1={blockX}
                    y1={90}
                    x2={blockX - frictionForce * 0.5}
                    y2={90}
                    stroke="#dc2626"
                    strokeWidth="3"
                    markerEnd="url(#arrowFric)"
                  />
                )}

                {/* Labels */}
                <text x={blockX + 60 + appliedForce * 0.25} y={85} fill="#2563eb" fontSize="10" fontWeight="bold">
                  F={appliedForce}N
                </text>
                <text x={blockX - frictionForce * 0.5 - 5} y={85} textAnchor="end" fill="#dc2626" fontSize="10" fontWeight="bold">
                  f={frictionForce.toFixed(1)}N
                </text>

                {/* Status */}
                <text x={200} y={20} textAnchor="middle" fontSize="14" fontWeight="bold"
                  fill={isSliding ? "#ef4444" : "#22c55e"}>
                  {isSliding ? "SLIDING (Kinetic Friction)" : "STATIONARY (Static Friction)"}
                </text>

                <defs>
                  <marker id="arrowApplied" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#2563eb" />
                  </marker>
                  <marker id="arrowFric" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#dc2626" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Results */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="bg-slate-50">
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">Max Static Friction</p>
                  <p className="text-lg font-bold">{maxStaticFriction.toFixed(1)} N</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50">
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">Net Force</p>
                  <p className="text-lg font-bold">{netForce.toFixed(1)} N</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50">
                <CardContent className="pt-3 text-center">
                  <p className="text-xs text-muted-foreground">Acceleration</p>
                  <p className="text-lg font-bold">{acceleration.toFixed(2)} m/s²</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900">Key Formulas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-center text-xl font-bold text-amber-900">f_s &le; &mu;_s N</p>
              <p className="text-center text-xl font-bold text-amber-900">f_k = &mu;_k N</p>
              <p className="text-center text-sm text-amber-700 mt-1">
                where N is the normal force and &mu; is the coefficient of friction
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* FAQ */}
          <Accordion className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Why is kinetic friction less than maximum static friction?</AccordionTrigger>
              <AccordionContent>
                At the microscopic level, static surfaces have time to form stronger bonds between
                surface irregularities. Once sliding begins, contacts break before they can fully
                bond, resulting in a smaller friction force.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Does friction depend on surface area?</AccordionTrigger>
              <AccordionContent>
                For the AP Physics model, no. Friction depends only on the normal force and the
                coefficient of friction. In reality, surface area can play a minor role in some
                situations, but this is beyond the scope of AP Physics 1.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can static friction cause acceleration?</AccordionTrigger>
              <AccordionContent>
                Yes! Static friction is what allows you to walk, cars to accelerate, and objects on
                conveyor belts to speed up. It acts to prevent relative sliding and can accelerate
                objects as long as surfaces don&apos;t slip.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <Button onClick={onComplete} disabled={isComplete} className="w-full" size="lg">
            {isComplete ? "Topic Completed" : "Mark as Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
