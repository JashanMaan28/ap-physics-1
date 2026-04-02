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

export function Work({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [force, setForce] = useState(10);
  const [distance, setDistance] = useState(5);
  const [angle, setAngle] = useState(0);

  const angleRad = (angle * Math.PI) / 180;
  const work = force * distance * Math.cos(angleRad);

  const svgWidth = 400;
  const svgHeight = 200;
  const blockX = 80;
  const blockY = 130;
  const blockW = 60;
  const blockH = 40;
  const arrowLen = 80;
  const arrowEndX = blockX + blockW + arrowLen * Math.cos(angleRad);
  const arrowEndY = blockY - blockH / 2 - arrowLen * Math.sin(angleRad);
  const arrowStartX = blockX + blockW;
  const arrowStartY = blockY - blockH / 2;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Work</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            Work is the energy transferred to or from an object by a force
            acting over a displacement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Formula */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-lg font-semibold text-amber-900">
                Key Formula
              </p>
              <p className="text-2xl font-mono text-amber-800 mt-1">
                W = F &middot; d &middot; cos&theta;
              </p>
              <p className="text-sm text-amber-700 mt-1">
                W = work (J), F = force (N), d = displacement (m), &theta; =
                angle between force and displacement
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Interactive SVG */}
          <div>
            <h3 className="font-semibold mb-3">Interactive Diagram</h3>
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="border rounded bg-white"
            >
              {/* Ground */}
              <line
                x1={0}
                y1={blockY}
                x2={svgWidth}
                y2={blockY}
                stroke="#888"
                strokeWidth={2}
              />
              {/* Block */}
              <rect
                x={blockX}
                y={blockY - blockH}
                width={blockW}
                height={blockH}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth={2}
                rx={4}
              />
              <text
                x={blockX + blockW / 2}
                y={blockY - blockH / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill="#fff"
              >
                m
              </text>
              {/* Force arrow */}
              <line
                x1={arrowStartX}
                y1={arrowStartY}
                x2={arrowEndX}
                y2={arrowEndY}
                stroke="#dc2626"
                strokeWidth={3}
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth={10}
                  markerHeight={7}
                  refX={10}
                  refY={3.5}
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                </marker>
              </defs>
              {/* Angle arc */}
              {angle > 0 && (
                <path
                  d={`M ${arrowStartX + 30} ${arrowStartY} A 30 30 0 0 0 ${arrowStartX + 30 * Math.cos(angleRad)} ${arrowStartY - 30 * Math.sin(angleRad)}`}
                  fill="none"
                  stroke="#666"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
              )}
              <text x={arrowEndX + 5} y={arrowEndY - 5} fontSize={14} fill="#dc2626" fontWeight="bold">
                F = {force} N
              </text>
              {/* Displacement arrow */}
              <line
                x1={blockX}
                y1={blockY + 20}
                x2={blockX + distance * 20}
                y2={blockY + 20}
                stroke="#2563eb"
                strokeWidth={2}
                markerEnd="url(#arrowBlue)"
              />
              <defs>
                <marker
                  id="arrowBlue"
                  markerWidth={10}
                  markerHeight={7}
                  refX={10}
                  refY={3.5}
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                </marker>
              </defs>
              <text
                x={blockX + (distance * 20) / 2}
                y={blockY + 40}
                textAnchor="middle"
                fontSize={12}
                fill="#2563eb"
              >
                d = {distance} m
              </text>
              {/* Result */}
              <text x={svgWidth - 10} y={25} textAnchor="end" fontSize={16} fontWeight="bold" fill="#16a34a">
                W = {work.toFixed(1)} J
              </text>
            </svg>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Force: {force} N
              </label>
              <Slider
                value={[force]}
                onValueChange={(v) => setForce(v[0])}
                min={0}
                max={50}
                step={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Distance: {distance} m
              </label>
              <Slider
                value={[distance]}
                onValueChange={(v) => setDistance(v[0])}
                min={0}
                max={15}
                step={0.5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Angle: {angle}&deg;
              </label>
              <Slider
                value={[angle]}
                onValueChange={(v) => setAngle(v[0])}
                min={0}
                max={90}
                step={1}
              />
            </div>
          </div>

          <Separator />

          {/* FAQ */}
          <Accordion>
            <AccordionItem value="q1">
              <AccordionTrigger>
                Can work be negative?
              </AccordionTrigger>
              <AccordionContent>
                Yes. When the angle between force and displacement is greater
                than 90&deg;, cos&theta; is negative, so the work done is
                negative. This means the force opposes the motion (e.g.,
                friction).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>
                What if the force is perpendicular to displacement?
              </AccordionTrigger>
              <AccordionContent>
                When &theta; = 90&deg;, cos 90&deg; = 0, so no work is done.
                A common example is a centripetal force in circular motion&mdash;it
                changes direction but does no work.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>
                What are the units of work?
              </AccordionTrigger>
              <AccordionContent>
                Work is measured in joules (J). 1 J = 1 N&middot;m = 1
                kg&middot;m&sup2;/s&sup2;.
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
