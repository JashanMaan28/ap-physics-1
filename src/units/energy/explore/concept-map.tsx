"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConceptMap() {
  const svgWidth = 700;
  const svgHeight = 500;

  const nodes = [
    { id: "energy", label: "Energy", x: 350, y: 40, color: "#f59e0b" },
    { id: "ke", label: "Kinetic\nEnergy", x: 180, y: 140, color: "#dc2626" },
    { id: "pe", label: "Potential\nEnergy", x: 520, y: 140, color: "#2563eb" },
    { id: "work", label: "Work", x: 80, y: 260, color: "#16a34a" },
    { id: "power", label: "Power", x: 80, y: 380, color: "#7c3aed" },
    { id: "pe-grav", label: "Gravitational\nPE = mgh", x: 440, y: 260, color: "#2563eb" },
    { id: "pe-spring", label: "Elastic\nPE = \u00bdkx\u00b2", x: 600, y: 260, color: "#2563eb" },
    { id: "wet", label: "Work-Energy\nTheorem", x: 250, y: 260, color: "#16a34a" },
    { id: "conserv", label: "Conservation\nof Energy", x: 350, y: 380, color: "#f59e0b" },
    { id: "friction", label: "Friction\n(Non-conservative)", x: 550, y: 420, color: "#666" },
  ];

  const edges = [
    { from: "energy", to: "ke", label: "motion" },
    { from: "energy", to: "pe", label: "position" },
    { from: "pe", to: "pe-grav", label: "" },
    { from: "pe", to: "pe-spring", label: "" },
    { from: "work", to: "wet", label: "W_net = \u0394KE" },
    { from: "wet", to: "ke", label: "" },
    { from: "work", to: "power", label: "P = W/t" },
    { from: "ke", to: "conserv", label: "" },
    { from: "pe", to: "conserv", label: "" },
    { from: "conserv", to: "friction", label: "breaks if present" },
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Concept Map: Work, Energy, and Power</CardTitle>
          <CardDescription>
            Visual overview of how energy concepts connect to each other.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="border rounded bg-white w-full"
          >
            <defs>
              <marker
                id="cmArrow"
                markerWidth={8}
                markerHeight={6}
                refX={8}
                refY={3}
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#999" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => {
              const from = getNode(e.from);
              const to = getNode(e.to);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y + 20}
                    x2={to.x}
                    y2={to.y - 20}
                    stroke="#ccc"
                    strokeWidth={2}
                    markerEnd="url(#cmArrow)"
                  />
                  {e.label && (
                    <text
                      x={mx}
                      y={my}
                      textAnchor="middle"
                      fontSize={9}
                      fill="#888"
                      fontStyle="italic"
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const lines = n.label.split("\n");
              return (
                <g key={n.id}>
                  <rect
                    x={n.x - 55}
                    y={n.y - 18}
                    width={110}
                    height={36}
                    fill={n.color}
                    rx={8}
                    opacity={0.9}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={n.x}
                      y={n.y + (li - (lines.length - 1) / 2) * 13 + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fill="#fff"
                      fontWeight="bold"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Relationships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge className="bg-green-600 shrink-0">Work &rarr; KE</Badge>
            <p className="text-sm">Net work changes an object&apos;s kinetic energy (work-energy theorem).</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-amber-600 shrink-0">KE &harr; PE</Badge>
            <p className="text-sm">Energy transforms between kinetic and potential forms while total is conserved.</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-purple-600 shrink-0">Work &rarr; Power</Badge>
            <p className="text-sm">Power measures how quickly work is done (rate of energy transfer).</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-gray-600 shrink-0">Friction</Badge>
            <p className="text-sm">Non-conservative forces convert mechanical energy to thermal energy.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
