"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ConceptMap({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const svgWidth = 700;
  const svgHeight = 500;
  const chartSurfaceClassName = "w-full rounded border border-border bg-background";
  const edgeColor = "var(--border)";

  const nodes = [
    { id: "shm", label: "Simple\nHarmonic\nMotion", x: 350, y: 50, color: "#06b6d4" },
    { id: "spring", label: "Spring-Mass\nSystem", x: 150, y: 170, color: "#0ea5e9" },
    { id: "pendulum", label: "Simple\nPendulum", x: 550, y: 170, color: "#0ea5e9" },
    { id: "hooke", label: "Hooke's Law\nF = -kx", x: 50, y: 310, color: "#f59e0b" },
    { id: "period-s", label: "T = 2pi\nsqrt(m/k)", x: 230, y: 310, color: "#f59e0b" },
    { id: "period-p", label: "T = 2pi\nsqrt(L/g)", x: 470, y: 310, color: "#f59e0b" },
    { id: "gravity", label: "Gravity as\nRestoring Force", x: 630, y: 310, color: "#f59e0b" },
    { id: "energy", label: "Energy\nConservation", x: 350, y: 250, color: "#16a34a" },
    { id: "ke", label: "KE = 1/2 mv^2\nMax at x=0", x: 230, y: 400, color: "#84cc16" },
    { id: "pe", label: "PE = 1/2 kx^2\nMax at x=A", x: 470, y: 400, color: "#84cc16" },
    { id: "graphs", label: "x(t), v(t), a(t)\nPhase Relations", x: 350, y: 460, color: "#8b5cf6" },
  ];

  const edges = [
    { from: "shm", to: "spring" },
    { from: "shm", to: "pendulum" },
    { from: "shm", to: "energy" },
    { from: "spring", to: "hooke" },
    { from: "spring", to: "period-s" },
    { from: "pendulum", to: "period-p" },
    { from: "pendulum", to: "gravity" },
    { from: "energy", to: "ke" },
    { from: "energy", to: "pe" },
    { from: "energy", to: "graphs" },
  ];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Concept Map: Oscillations</CardTitle>
            {isComplete && <Badge variant="secondary">Completed</Badge>}
          </div>
          <CardDescription>
            How the key oscillation concepts connect to each other.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className={chartSurfaceClassName}
          >
            {/* Edges */}
            {edges.map((e, i) => {
              const from = nodeMap.get(e.from)!;
              const to = nodeMap.get(e.to)!;
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y + 20}
                  x2={to.x}
                  y2={to.y - 20}
                  stroke={edgeColor}
                  strokeWidth={2}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const lines = n.label.split("\n");
              return (
                <g key={n.id}>
                  <rect
                    x={n.x - 60}
                    y={n.y - 20}
                    width={120}
                    height={40}
                    rx={8}
                    fill={n.color}
                    opacity={0.15}
                    stroke={n.color}
                    strokeWidth={2}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={n.x}
                      y={n.y - 5 + li * 14}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight="600"
                      fill={n.color}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>

          <Button onClick={onComplete} disabled={isComplete} className="w-full">
            {isComplete ? "Completed" : "Mark Complete"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
