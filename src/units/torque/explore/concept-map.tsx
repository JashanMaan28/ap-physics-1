"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
}

const nodes: Node[] = [
  { id: "torque", label: "Torque (\u03C4)", x: 300, y: 50, color: "#ec4899" },
  { id: "force", label: "Force (F)", x: 100, y: 50, color: "#3b82f6" },
  { id: "leverarm", label: "Lever Arm (r)", x: 500, y: 50, color: "#3b82f6" },
  { id: "equilibrium", label: "Rotational\nEquilibrium", x: 100, y: 170, color: "#22c55e" },
  { id: "moi", label: "Moment of\nInertia (I)", x: 500, y: 170, color: "#f97316" },
  { id: "newton2", label: "\u03C4 = I\u03B1", x: 300, y: 170, color: "#ec4899" },
  { id: "alpha", label: "Angular\nAcceleration (\u03B1)", x: 300, y: 290, color: "#a855f7" },
  { id: "omega", label: "Angular\nVelocity (\u03C9)", x: 150, y: 360, color: "#a855f7" },
  { id: "theta", label: "Angular\nDisplacement (\u03B8)", x: 450, y: 360, color: "#a855f7" },
  { id: "kinematics", label: "Angular\nKinematics", x: 300, y: 430, color: "#06b6d4" },
  { id: "linear", label: "Linear Motion\nAnalogs", x: 550, y: 430, color: "#64748b" },
];

const edges: Edge[] = [
  { from: "force", to: "torque", label: "\u03C4 = rF sin\u03B8" },
  { from: "leverarm", to: "torque", label: "distance from axis" },
  { from: "torque", to: "newton2", label: "net torque" },
  { from: "moi", to: "newton2", label: "resistance" },
  { from: "newton2", to: "alpha", label: "\u03B1 = \u03C4/I" },
  { from: "torque", to: "equilibrium", label: "\u03A3\u03C4 = 0" },
  { from: "alpha", to: "omega", label: "\u03C9 = \u03C9\u2080 + \u03B1t" },
  { from: "alpha", to: "theta", label: "\u03B8 = \u03C9\u2080t + \u00BD\u03B1t\u00B2" },
  { from: "omega", to: "kinematics", label: "" },
  { from: "theta", to: "kinematics", label: "" },
  { from: "kinematics", to: "linear", label: "v\u2194\u03C9, a\u2194\u03B1, x\u2194\u03B8" },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

export function ConceptMap() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Concept Map: Torque & Rotational Dynamics</CardTitle>
          <CardDescription>
            How the key ideas in this unit connect to each other
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center overflow-x-auto">
            <svg viewBox="0 0 650 500" className="w-full max-w-2xl">
              {/* Edges */}
              {edges.map((edge, i) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                return (
                  <g key={i}>
                    <line
                      x1={from.x}
                      y1={from.y + 20}
                      x2={to.x}
                      y2={to.y - 10}
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      opacity={0.5}
                      markerEnd="url(#edgeArrow)"
                    />
                    {edge.label && (
                      <text x={mx} y={my} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="bold">
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  <rect
                    x={node.x - 50}
                    y={node.y - 15}
                    width={100}
                    height={35}
                    rx={8}
                    fill={node.color}
                    opacity={0.15}
                    stroke={node.color}
                    strokeWidth={2}
                  />
                  {node.label.split("\n").map((line, li) => (
                    <text
                      key={li}
                      x={node.x}
                      y={node.y + li * 13}
                      textAnchor="middle"
                      fontSize="10"
                      fill={node.color}
                      fontWeight="bold"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              ))}

              <defs>
                <marker id="edgeArrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Big Picture</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground space-y-3">
          <p>
            Every concept in linear dynamics has a rotational twin. Force becomes torque,
            mass becomes moment of inertia, and acceleration becomes angular acceleration.
          </p>
          <p>
            The central equation <strong>\u03C4 = I\u03B1</strong> connects torque to angular acceleration
            just as F = ma connects force to linear acceleration. From \u03B1, the angular kinematic
            equations give you \u03C9 and \u03B8 as functions of time.
          </p>
          <p>
            Rotational equilibrium (\u03A3\u03C4 = 0) is the special case where \u03B1 = 0, used in statics
            problems like beams, bridges, and seesaws.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
