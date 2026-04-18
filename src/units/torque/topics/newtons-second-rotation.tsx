"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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

export function NewtonsSecondRotation({ onComplete, isComplete }: TopicProps) {
  const [torqueApplied, setTorqueApplied] = useState(10);
  const [momentOfInertia, setMomentOfInertia] = useState(2);

  const alpha = torqueApplied / momentOfInertia;

  // SVG disk visualization
  const cx = 200;
  const cy = 180;
  const diskR = 80;
  // Angular acceleration arrow size proportional to alpha
  const arrowArc = Math.min(alpha * 5, 120);
  const arrowArcRad = (arrowArc * Math.PI) / 180;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Newton&apos;s Second Law for Rotation</CardTitle>
              <CardDescription className="mt-1 text-base">
                The rotational analog of F = ma
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formula
            </h3>
            <div className="text-xl font-bold tracking-tight">
              <Tex display>{"\\tau_{net} = I\\alpha"}</Tex>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Tex>{"\\tau_{net}"}</Tex> = net torque (N·m)</li>
              <li><Tex>I</Tex> = moment of inertia (kg·m²)</li>
              <li><Tex>{"\\alpha"}</Tex> = angular acceleration (rad/s²)</li>
            </ul>
          </div>
          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-semibold">Linear</th>
                  <th className="py-2 text-left font-semibold">Rotational</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="py-1.5">F (force)</td><td>&tau; (torque)</td></tr>
                <tr className="border-b"><td className="py-1.5">m (mass)</td><td>I (moment of inertia)</td></tr>
                <tr className="border-b"><td className="py-1.5">a (acceleration)</td><td>&alpha; (angular acceleration)</td></tr>
                <tr><td className="py-1.5">F = ma</td><td className="font-bold text-foreground">&tau; = I&alpha;</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Disk */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive: Torque on a Rotating Disk</CardTitle>
          <CardDescription>
            Apply torque to a disk and observe how angular acceleration changes with I
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 400 360" className="w-full max-w-md border rounded-lg bg-muted/30">
              {/* Disk */}
              <circle
                cx={cx}
                cy={cy}
                r={diskR}
                fill="none"
                stroke="#ec4899"
                strokeWidth={4}
              />
              <circle
                cx={cx}
                cy={cy}
                r={diskR}
                fill="#ec4899"
                opacity={0.1}
              />
              {/* Center axis */}
              <circle cx={cx} cy={cy} r={5} fill="#71717a" />

              {/* Spokes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={cx}
                    y1={cy}
                    x2={cx + diskR * 0.9 * Math.cos(rad)}
                    y2={cy + diskR * 0.9 * Math.sin(rad)}
                    stroke="#ec4899"
                    strokeWidth={1.5}
                    opacity={0.3}
                  />
                );
              })}

              {/* Applied torque arrow (tangential force at edge) */}
              <line
                x1={cx + diskR}
                y1={cy}
                x2={cx + diskR}
                y2={cy - Math.min(torqueApplied * 2, 80)}
                stroke="#3b82f6"
                strokeWidth={3}
                markerEnd="url(#arrowTorque)"
              />
              <text
                x={cx + diskR + 10}
                y={cy - Math.min(torqueApplied, 40)}
                fill="#3b82f6"
                fontSize="12"
                fontWeight="bold"
              >
                &tau; = {torqueApplied} N&middot;m
              </text>

              {/* Angular acceleration arc */}
              {alpha > 0.01 && (
                <path
                  d={`M ${cx + diskR + 20} ${cy} A ${diskR + 20} ${diskR + 20} 0 0 0 ${cx + (diskR + 20) * Math.cos(-arrowArcRad)} ${cy + (diskR + 20) * Math.sin(-arrowArcRad)}`}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  markerEnd="url(#arrowAlpha)"
                />
              )}
              <text
                x={cx}
                y={cy + diskR + 40}
                textAnchor="middle"
                fill="#22c55e"
                fontSize="14"
                fontWeight="bold"
              >
                &alpha; = {alpha.toFixed(2)} rad/s&sup2;
              </text>

              {/* I label */}
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="bold"
                opacity={0.7}
              >
                I = {momentOfInertia.toFixed(1)}
              </text>

              <defs>
                <marker id="arrowTorque" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                </marker>
                <marker id="arrowAlpha" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Applied Torque (&tau;): {torqueApplied} N&middot;m</Label>
              <Slider
                value={[torqueApplied]}
                onValueChange={([v]) => setTorqueApplied(v)}
                min={1}
                max={50}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Moment of Inertia (I): {momentOfInertia.toFixed(1)} kg&middot;m&sup2;</Label>
              <Slider
                value={[momentOfInertia]}
                onValueChange={([v]) => setMomentOfInertia(v)}
                min={0.5}
                max={10}
                step={0.5}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">&tau;<sub>net</sub></p>
                <p className="text-xl font-bold text-blue-500">{torqueApplied} N&middot;m</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">I</p>
                <p className="text-xl font-bold">{momentOfInertia.toFixed(1)} kg&middot;m&sup2;</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">&alpha;</p>
                <p className="text-xl font-bold text-green-500">{alpha.toFixed(2)} rad/s&sup2;</p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <strong>Try this:</strong> Keep torque constant at 10 N&middot;m and increase I from 1 to 10.
            Watch &alpha; decrease. Then keep I constant and increase torque. This is the rotational
            version of F = ma: more &ldquo;rotational mass&rdquo; means less angular acceleration for the same torque.
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>How is &tau; = I&alpha; related to F = ma?</AccordionTrigger>
              <AccordionContent>
                They are direct analogs. Force causes linear acceleration of mass; torque causes
                angular acceleration of a rotating body with moment of inertia I. If you replace
                F &rarr; &tau;, m &rarr; I, and a &rarr; &alpha;, you get the rotational form.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What if multiple torques act on the object?</AccordionTrigger>
              <AccordionContent>
                Sum all torques (with signs for direction) to get &tau;_net. Then
                &alpha; = &tau;_net / I. Clockwise and counterclockwise torques partially cancel.
                If &tau;_net = 0, the object has zero angular acceleration (could be stationary
                or rotating at constant angular velocity).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can &alpha; be negative?</AccordionTrigger>
              <AccordionContent>
                Yes! Negative &alpha; means the angular acceleration is in the clockwise direction
                (if you use the convention CCW = positive). A negative &alpha; could mean an object
                is slowing down (if spinning CCW) or speeding up (if spinning CW).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How does friction torque work?</AccordionTrigger>
              <AccordionContent>
                Friction at a pivot or axle creates a torque that opposes rotation. It acts like
                a &ldquo;negative&rdquo; torque that must be included in &tau;_net. For example, if you
                apply 10 N&middot;m to spin a wheel but friction provides 3 N&middot;m opposing it,
                &tau;_net = 7 N&middot;m.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
