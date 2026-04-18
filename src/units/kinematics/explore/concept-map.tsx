"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";
import { toLatex } from "@/lib/latex";

interface Node { id: string; label: string; x: number; y: number; color: string; formula: string; explanation: string; }
interface Edge { from: string; to: string; label: string; }

const NODES: Node[] = [
  { id: "position", label: "Position", x: 100, y: 80, color: "#3b82f6", formula: "x (meters)", explanation: "Location relative to origin. A scalar with sign indicating direction in 1D." },
  { id: "displacement", label: "Displacement", x: 300, y: 60, color: "#8b5cf6", formula: "Δx = x_f − x_i", explanation: "Change in position. A vector quantity — has magnitude and direction." },
  { id: "velocity", label: "Velocity", x: 500, y: 80, color: "#10b981", formula: "v = Δx/Δt", explanation: "Rate of change of position. Slope of x-t graph. Vector quantity." },
  { id: "acceleration", label: "Acceleration", x: 400, y: 200, color: "#f59e0b", formula: "a = Δv/Δt", explanation: "Rate of change of velocity. Slope of v-t graph. Constant in all kinematic equations." },
  { id: "kinematic-eq", label: "Kinematic Equations", x: 200, y: 220, color: "#ef4444", formula: "v=v₀+at, x=x₀+v₀t+½at²", explanation: "Four equations relating position, velocity, acceleration, and time under constant acceleration." },
  { id: "projectile", label: "Projectile Motion", x: 500, y: 320, color: "#ec4899", formula: "aₓ=0, aᵧ=−g", explanation: "2D motion under gravity. Horizontal and vertical components are independent." },
  { id: "freefall", label: "Free Fall", x: 150, y: 340, color: "#06b6d4", formula: "a = g = 9.8 m/s²", explanation: "Special case: only gravity acts. All objects fall at the same rate regardless of mass." },
];

const EDGES: Edge[] = [
  { from: "position", to: "displacement", label: "change in" },
  { from: "displacement", to: "velocity", label: "÷ time" },
  { from: "velocity", to: "acceleration", label: "change in / time" },
  { from: "acceleration", to: "kinematic-eq", label: "constant a" },
  { from: "kinematic-eq", to: "projectile", label: "2D with g" },
  { from: "acceleration", to: "freefall", label: "a = g" },
  { from: "kinematic-eq", to: "freefall", label: "1D special case" },
];

export function ConceptMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const node = NODES.find(n => n.id === selected);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Kinematics Concept Map</CardTitle>
          <CardDescription>Click any concept to see details</CardDescription>
        </CardHeader>
        <CardContent>
          <svg viewBox="0 0 650 400" className="w-full rounded-lg border bg-muted/30">
            {EDGES.map((e, i) => {
              const from = NODES.find(n => n.id === e.from)!;
              const to = NODES.find(n => n.id === e.to)!;
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="currentColor" strokeWidth="1" opacity="0.2" />
                  <text x={mx} y={my - 5} textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.4">{e.label}</text>
                </g>
              );
            })}
            {NODES.map(n => (
              <g key={n.id} onClick={() => setSelected(n.id)} className="cursor-pointer">
                <circle cx={n.x} cy={n.y} r={selected === n.id ? 32 : 28} fill={n.color} opacity={selected === n.id ? 1 : 0.8} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{n.label}</text>
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      {node && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base" style={{ color: node.color }}>{node.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm font-bold"><Tex>{toLatex(node.formula)}</Tex></div>
            <p className="text-sm text-muted-foreground">{node.explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
