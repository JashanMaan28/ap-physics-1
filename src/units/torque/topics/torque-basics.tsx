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

export function TorqueBasics({ onComplete, isComplete }: TopicProps) {
  const [radius, setRadius] = useState(0.3);
  const [force, setForce] = useState(50);
  const [angle, setAngle] = useState(90);

  const angleRad = (angle * Math.PI) / 180;
  const torque = radius * force * Math.sin(angleRad);
  const momentArm = radius * Math.sin(angleRad);

  // SVG dimensions
  const cx = 200;
  const cy = 200;
  const scale = 150;
  const wrenchEndX = cx + radius * scale;
  const wrenchEndY = cy;
  const forceScale = 0.8;
  const forceDx = force * forceScale * Math.cos(Math.PI - angleRad);
  const forceDy = force * forceScale * -Math.sin(Math.PI - angleRad);
  const forceEndX = wrenchEndX + forceDx;
  const forceEndY = wrenchEndY + forceDy;
  const momentArmEndX = cx + momentArm * scale;
  const momentArmEndY = cy;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Torque Basics</CardTitle>
              <CardDescription className="mt-1 text-base">
                The rotational equivalent of force
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
              <Tex display>{"\\tau = r F \\sin(\\theta)"}</Tex>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Tex>{"\\tau"}</Tex> = torque (N·m)</li>
              <li><Tex>r</Tex> = distance from pivot to point of force application (m)</li>
              <li><Tex>F</Tex> = magnitude of applied force (N)</li>
              <li><Tex>{"\\theta"}</Tex> = angle between <Tex>r</Tex> and <Tex>F</Tex> vectors</li>
            </ul>
          </div>
          <Separator />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Torque measures the tendency of a force to cause rotation about an axis.
            It depends on three factors: how far the force is from the pivot (r),
            how strong the force is (F), and the angle at which the force is applied (&theta;).
            Maximum torque occurs when &theta; = 90&deg; (force perpendicular to the lever arm).
          </p>
        </CardContent>
      </Card>

      {/* Interactive SVG */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive: Wrench on a Bolt</CardTitle>
          <CardDescription>
            Adjust the lever arm length, force, and angle to see how torque changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <svg viewBox="0 0 400 400" className="w-full max-w-md border rounded-lg bg-muted/30">
              {/* Bolt (pivot) */}
              <circle cx={cx} cy={cy} r={12} fill="#71717a" stroke="#3f3f46" strokeWidth={2} />
              <circle cx={cx} cy={cy} r={5} fill="#27272a" />

              {/* Wrench arm */}
              <line
                x1={cx}
                y1={cy}
                x2={wrenchEndX}
                y2={wrenchEndY}
                stroke="#ec4899"
                strokeWidth={6}
                strokeLinecap="round"
              />

              {/* Moment arm (dashed perpendicular distance) */}
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy - momentArm * scale}
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={0.6}
              />
              <text
                x={cx - 50}
                y={cy - (momentArm * scale) / 2}
                fill="#ec4899"
                fontSize="11"
                textAnchor="middle"
              >
                moment arm
              </text>

              {/* Force vector */}
              <line
                x1={wrenchEndX}
                y1={wrenchEndY}
                x2={forceEndX}
                y2={forceEndY}
                stroke="#3b82f6"
                strokeWidth={3}
                markerEnd="url(#arrowBlue)"
              />

              {/* Angle arc */}
              {angle > 0 && angle < 180 && (
                <path
                  d={`M ${wrenchEndX - 20} ${wrenchEndY} A 20 20 0 0 ${angle > 0 ? 0 : 1} ${wrenchEndX + 20 * Math.cos(Math.PI - angleRad)} ${wrenchEndY + 20 * -Math.sin(Math.PI - angleRad)}`}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth={2}
                />
              )}
              <text
                x={wrenchEndX - 30}
                y={wrenchEndY - 15}
                fill="#facc15"
                fontSize="12"
                fontWeight="bold"
              >
                &theta;={angle}&deg;
              </text>

              {/* Labels */}
              <text
                x={(cx + wrenchEndX) / 2}
                y={cy + 20}
                fill="#ec4899"
                fontSize="12"
                textAnchor="middle"
              >
                r = {radius.toFixed(2)} m
              </text>
              <text
                x={forceEndX + 5}
                y={forceEndY - 5}
                fill="#3b82f6"
                fontSize="12"
              >
                F = {force} N
              </text>

              {/* Rotation direction indicator */}
              <path
                d="M 200 160 A 40 40 0 0 0 160 200"
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                markerEnd="url(#arrowGreen)"
                opacity={torque > 0.1 ? 0.8 : 0.2}
              />

              {/* Arrow markers */}
              <defs>
                <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                </marker>
                <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lever Arm (r): {radius.toFixed(2)} m</Label>
              <Slider
                value={[radius]}
                onValueChange={([v]) => setRadius(v)}
                min={0.05}
                max={0.8}
                step={0.05}
              />
            </div>
            <div className="space-y-2">
              <Label>Force (F): {force} N</Label>
              <Slider
                value={[force]}
                onValueChange={([v]) => setForce(v)}
                min={5}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Angle (&theta;): {angle}&deg;</Label>
              <Slider
                value={[angle]}
                onValueChange={([v]) => setAngle(v)}
                min={0}
                max={180}
                step={5}
              />
            </div>
          </div>

          <Separator />

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Torque (&tau;)</p>
                <p className="text-2xl font-bold text-primary">
                  {torque.toFixed(2)} N&middot;m
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Moment Arm</p>
                <p className="text-2xl font-bold">
                  {momentArm.toFixed(3)} m
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <strong>Try this:</strong> Set &theta; = 0&deg; or 180&deg; and notice the torque goes to zero.
            The force is parallel to the lever arm, so it cannot cause rotation.
            Maximum torque occurs at &theta; = 90&deg;.
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
              <AccordionTrigger>What is the difference between torque and force?</AccordionTrigger>
              <AccordionContent>
                Force causes linear acceleration (F = ma), while torque causes rotational
                acceleration (&tau; = I&alpha;). Torque depends on where and at what angle
                the force is applied relative to the axis of rotation. The same force can
                produce different torques depending on the lever arm and angle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Why does sin(&theta;) appear in the torque equation?</AccordionTrigger>
              <AccordionContent>
                Only the component of force perpendicular to the lever arm causes rotation.
                The perpendicular component is F sin(&theta;). When &theta; = 90&deg;,
                the entire force contributes to torque. When &theta; = 0&deg; or 180&deg;,
                the force is along the lever arm and produces no rotation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What is the moment arm?</AccordionTrigger>
              <AccordionContent>
                The moment arm (or lever arm) is the perpendicular distance from the axis
                of rotation to the line of action of the force. It equals r sin(&theta;).
                You can compute torque as either &tau; = rF sin(&theta;) or &tau; = (moment arm) &times; F.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>What are the units of torque?</AccordionTrigger>
              <AccordionContent>
                Torque is measured in Newton-meters (N&middot;m). Although this is dimensionally
                the same as a Joule (energy), torque is not energy. We keep the unit as
                N&middot;m to distinguish it. Torque is a vector quantity (direction given by
                the right-hand rule or CW/CCW convention).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>How do you determine the sign (direction) of torque?</AccordionTrigger>
              <AccordionContent>
                By convention, counterclockwise (CCW) torque is positive and clockwise (CW)
                torque is negative. On the AP exam, you can use either convention as long
                as you are consistent. The right-hand rule also works: curl your fingers
                in the direction of rotation, and your thumb points along the torque vector.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
