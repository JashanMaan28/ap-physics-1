"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScenarioId =
  // Kinematics
  | "kin_freefall"
  | "kin_horizontal"
  | "kin_projectile"
  // Dynamics / Energy / Momentum (shared mechanical scenarios)
  | "dyn_horizontal_friction"
  | "dyn_incline_smooth"
  | "dyn_incline_friction"
  | "dyn_hanging_rope"
  | "dyn_elevator"
  // Oscillations
  | "osc_spring_horizontal"
  | "osc_spring_vertical"
  | "osc_pendulum"
  // Rotating systems / Torque
  | "rot_rolling_incline"
  | "trq_beam"
  // Fluids
  | "floating"
  | "sinking"
  | "submerged_string"
  | "hydraulic"
  | "surface";

type ForceId =
  | "weight"
  | "buoyant"
  | "normal"
  | "tension"
  | "applied"
  | "friction"
  | "spring";

interface Force {
  id: ForceId;
  label: string;
  symbol: string;
  color: string;
  description: string;
}

type Direction = "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right";

interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  units: string[];
  expectedForces: ForceId[];
  /** Direction each force points in this scenario (for diagram rendering). */
  directions: Partial<Record<ForceId, Direction>>;
  note: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const G = 9.8;

const FORCES: Record<ForceId, Force> = {
  weight: {
    id: "weight",
    label: "Weight",
    symbol: "mg",
    color: "#ef4444",
    description: "Gravitational force pulling the object toward Earth's center.",
  },
  buoyant: {
    id: "buoyant",
    label: "Buoyant Force",
    symbol: "Fb",
    color: "#3b82f6",
    description: "Upward force from fluid equal to weight of displaced fluid.",
  },
  normal: {
    id: "normal",
    label: "Normal Force",
    symbol: "N",
    color: "#22c55e",
    description: "Contact force perpendicular to the supporting surface.",
  },
  tension: {
    id: "tension",
    label: "Tension",
    symbol: "T",
    color: "#a855f7",
    description: "Pulling force from a string, rope, or cable along its length.",
  },
  applied: {
    id: "applied",
    label: "Applied Force",
    symbol: "F_app",
    color: "#f97316",
    description: "External push or pull applied to the object.",
  },
  friction: {
    id: "friction",
    label: "Friction",
    symbol: "f",
    color: "#eab308",
    description: "Contact force opposing relative motion or motion tendency.",
  },
  spring: {
    id: "spring",
    label: "Spring Force",
    symbol: "F_s",
    color: "#ec4899",
    description: "Restoring force from a spring, F = -kx toward equilibrium.",
  },
};

const SCENARIOS: Scenario[] = [
  // ── Kinematics ──────────────────────────────────────────────────────────
  {
    id: "kin_horizontal",
    title: "Object on Flat Surface",
    description: "Block resting on a horizontal frictionless surface.",
    units: ["kinematics", "dynamics", "energy", "momentum"],
    expectedForces: ["weight", "normal"],
    directions: { weight: "down", normal: "up" },
    note: "Net force = 0. Normal balances weight. No horizontal forces, so no horizontal acceleration.",
  },
  {
    id: "kin_freefall",
    title: "Free Fall (No Air)",
    description: "Object released from rest and falling under gravity only.",
    units: ["kinematics", "dynamics", "energy"],
    expectedForces: ["weight"],
    directions: { weight: "down" },
    note: "Only gravity acts. a = g downward; speed grows linearly with time.",
  },
  {
    id: "kin_projectile",
    title: "Projectile Mid-Flight",
    description: "Object in the air after launch, ignoring air resistance.",
    units: ["kinematics"],
    expectedForces: ["weight"],
    directions: { weight: "down" },
    note: "Horizontal velocity is constant. Vertical acceleration is g downward throughout the flight.",
  },
  // ── Dynamics / shared mechanical ────────────────────────────────────────
  {
    id: "dyn_horizontal_friction",
    title: "Pushed Block with Friction",
    description: "A horizontal push on a block on a rough floor.",
    units: ["dynamics", "energy", "momentum"],
    expectedForces: ["weight", "normal", "applied", "friction"],
    directions: { weight: "down", normal: "up", applied: "right", friction: "left" },
    note: "Friction opposes motion. Net horizontal force = F_app − f.",
  },
  {
    id: "dyn_incline_smooth",
    title: "Block on Smooth Incline",
    description: "Block sliding on a frictionless ramp.",
    units: ["dynamics", "energy"],
    expectedForces: ["weight", "normal"],
    directions: { weight: "down", normal: "up-left" },
    note: "Weight components: mg sinθ down the ramp, mg cosθ into the ramp. Normal = mg cosθ.",
  },
  {
    id: "dyn_incline_friction",
    title: "Block on Rough Incline",
    description: "Block on a ramp with friction.",
    units: ["dynamics", "energy"],
    expectedForces: ["weight", "normal", "friction"],
    directions: { weight: "down", normal: "up-left", friction: "up-right" },
    note: "Friction acts up the ramp if the block slides down. Net = mg sinθ − f.",
  },
  {
    id: "dyn_hanging_rope",
    title: "Object Hanging from Rope",
    description: "Mass suspended vertically at rest by a string or rope.",
    units: ["dynamics", "oscillations", "momentum"],
    expectedForces: ["weight", "tension"],
    directions: { weight: "down", tension: "up" },
    note: "At rest: T = mg. During oscillation, T varies with the motion.",
  },
  {
    id: "dyn_elevator",
    title: "Rider in Elevator",
    description: "Person standing in an elevator (moving or at rest).",
    units: ["dynamics", "energy"],
    expectedForces: ["weight", "normal"],
    directions: { weight: "down", normal: "up" },
    note: "Apparent weight = N. When the elevator accelerates upward, N > mg.",
  },
  // ── Oscillations ────────────────────────────────────────────────────────
  {
    id: "osc_spring_horizontal",
    title: "Mass on Horizontal Spring",
    description: "Block attached to a spring on a frictionless horizontal surface.",
    units: ["oscillations"],
    expectedForces: ["weight", "normal", "spring"],
    directions: { weight: "down", normal: "up", spring: "left" },
    note: "Spring force F = −kx provides the restoring force. Vertical forces cancel.",
  },
  {
    id: "osc_spring_vertical",
    title: "Mass on Vertical Spring",
    description: "Mass hanging from a vertical spring at rest or oscillating.",
    units: ["oscillations"],
    expectedForces: ["weight", "spring"],
    directions: { weight: "down", spring: "up" },
    note: "At equilibrium: F_s = mg. Motion about equilibrium is SHM with ω = √(k/m).",
  },
  {
    id: "osc_pendulum",
    title: "Simple Pendulum Bob",
    description: "Pendulum swinging on a light string.",
    units: ["oscillations"],
    expectedForces: ["weight", "tension"],
    directions: { weight: "down", tension: "up-left" },
    note: "The tangential component of weight mg sinθ drives the SHM-like motion for small angles.",
  },
  // ── Rotating systems / Torque ───────────────────────────────────────────
  {
    id: "rot_rolling_incline",
    title: "Ball Rolling on Incline",
    description: "Sphere rolling without slipping down a ramp.",
    units: ["rotating-systems", "torque"],
    expectedForces: ["weight", "normal", "friction"],
    directions: { weight: "down", normal: "up-left", friction: "up-right" },
    note: "Static friction causes the torque that produces angular acceleration without slipping.",
  },
  {
    id: "trq_beam",
    title: "Loaded Beam on Supports",
    description: "Uniform beam resting on two supports with a hanging load.",
    units: ["torque"],
    expectedForces: ["weight", "normal", "tension"],
    directions: { weight: "down", normal: "up", tension: "down" },
    note: "Rotational equilibrium requires Στ = 0 about any pivot. Solve for support normal forces.",
  },
  // ── Fluids (existing) ───────────────────────────────────────────────────
  {
    id: "floating",
    title: "Object Floating in Fluid",
    description: "Object at rest partially submerged on the fluid surface.",
    units: ["fluids"],
    expectedForces: ["weight", "buoyant"],
    directions: { weight: "down", buoyant: "up" },
    note: "Net force = 0. Buoyant force exactly equals weight. Object is partially submerged.",
  },
  {
    id: "sinking",
    title: "Object Sinking in Fluid",
    description: "Dense object accelerating downward through fluid.",
    units: ["fluids"],
    expectedForces: ["weight", "buoyant"],
    directions: { weight: "down", buoyant: "up" },
    note: "Net force ≠ 0. Weight > Buoyant force. Object accelerates downward.",
  },
  {
    id: "submerged_string",
    title: "Object Submerged (Held by String)",
    description: "Object fully submerged, anchored to the floor by a string.",
    units: ["fluids"],
    expectedForces: ["weight", "buoyant", "tension"],
    directions: { weight: "down", buoyant: "up", tension: "down" },
    note: "Net force = 0. Buoyant > Weight, so string pulls DOWN to keep object in place.",
  },
  {
    id: "hydraulic",
    title: "Hydraulic Piston",
    description: "Force applied to small piston transmits through fluid.",
    units: ["fluids"],
    expectedForces: ["weight", "normal", "applied"],
    directions: { weight: "down", normal: "up", applied: "down" },
    note: "Pascal's Principle: P = F/A is constant throughout the fluid.",
  },
  {
    id: "surface",
    title: "Object on Floor of Fluid",
    description: "Object resting on a solid surface at the bottom of a fluid.",
    units: ["fluids"],
    expectedForces: ["weight", "buoyant", "normal"],
    directions: { weight: "down", buoyant: "up", normal: "up" },
    note: "Net force = 0. Normal force + Buoyant force = Weight.",
  },
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill={color} />
    </marker>
  );
}

interface ArrowProps {
  cx: number;
  cy: number;
  direction: Direction;
  color: string;
  label: string;
  magnitude: string;
  markerId: string;
  length?: number;
  offsetIndex?: number;
}

function directionToDelta(direction: Direction, length: number): { dx: number; dy: number } {
  const diag = length / Math.SQRT2;
  switch (direction) {
    case "up":       return { dx: 0,      dy: -length };
    case "down":     return { dx: 0,      dy:  length };
    case "left":     return { dx: -length, dy: 0 };
    case "right":    return { dx:  length, dy: 0 };
    case "up-left":  return { dx: -diag,   dy: -diag };
    case "up-right": return { dx:  diag,   dy: -diag };
    case "down-left":return { dx: -diag,   dy:  diag };
    case "down-right":return{ dx:  diag,   dy:  diag };
  }
}

function Arrow({ cx, cy, direction, color, label, magnitude, markerId, length = 60, offsetIndex = 0 }: ArrowProps) {
  const { dx, dy } = directionToDelta(direction, length);
  // small parallel offset so multiple arrows in the same direction don't overlap
  const offset = offsetIndex * 10;
  const perpDx = direction === "up" || direction === "down" ? offset : 0;
  const perpDy = direction === "left" || direction === "right" ? offset : 0;

  const x1 = cx + perpDx;
  const y1 = cy + perpDy;
  const x2 = x1 + dx;
  const y2 = y1 + dy;

  const labelX = x2 + (dx === 0 ? 6 : dx > 0 ? 4 : -4);
  const labelY = y2 + (dy === 0 ? -4 : dy > 0 ? 12 : -4);

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="2.5"
        markerEnd={`url(#${markerId})`}
        strokeLinecap="round"
      />
      <text
        x={labelX}
        y={labelY}
        fill={color}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor={dx < 0 ? "end" : "start"}
      >
        {label}
      </text>
      <text
        x={labelX}
        y={labelY + 11}
        fill={color}
        fontSize="9"
        fontFamily="monospace"
        opacity="0.8"
        textAnchor={dx < 0 ? "end" : "start"}
      >
        {magnitude}
      </text>
    </g>
  );
}

// ─── Diagram (routes to specialized scene per scenario id) ────────────────────

interface DiagramProps {
  scenario: Scenario;
  activeForces: Set<ForceId>;
  forceValues: Record<ForceId, number>;
}

function Diagram({ scenario, activeForces, forceValues }: DiagramProps) {
  const W = 320;
  const H = 220;
  const markers = Object.values(FORCES).map((f) => (
    <ArrowMarker key={f.id} id={`arrow-${f.id}`} color={f.color} />
  ));

  const renderForce = (id: ForceId, cx: number, cy: number, idx: number, overrideDir?: Direction) => {
    if (!activeForces.has(id)) return null;
    const f = FORCES[id];
    const direction = overrideDir ?? scenario.directions[id];
    if (!direction) return null;
    return (
      <Arrow
        key={id}
        cx={cx}
        cy={cy}
        direction={direction}
        color={f.color}
        label={f.symbol}
        magnitude={`${forceValues[id].toFixed(1)}N`}
        markerId={`arrow-${id}`}
        offsetIndex={idx}
      />
    );
  };

  // ── Fluids scenarios (keep legacy visuals) ─────────────────────────────
  const cx = W / 2;

  if (scenario.id === "floating") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={110} width={280} height={90} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={126} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        <line x1={20} y1={110} x2={300} y2={110} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
        <rect x={cx - 25} y={90} width={50} height={40} fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" rx="3" />
        <text x={cx} y={115} fill="#1e293b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 12, 130, 0)}
        {renderForce("buoyant", cx - 12, 90, 0)}
      </svg>
    );
  }

  if (scenario.id === "sinking") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={30} width={280} height={170} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={46} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        <rect x={cx - 22} y={90} width={44} height={44} fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" rx="3" />
        <text x={cx} y={116} fill="#fef3c7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 10, 134, 0)}
        {renderForce("buoyant", cx - 10, 90, 0)}
      </svg>
    );
  }

  if (scenario.id === "submerged_string") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={20} width={280} height={180} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={36} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        <rect x={20} y={195} width={280} height={5} fill="#475569" />
        <line x1={cx} y1={155} x2={cx} y2={195} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2" />
        <rect x={cx - 24} y={110} width={48} height={45} fill="#0f766e" stroke="#5eead4" strokeWidth="1.5" rx="3" />
        <text x={cx} y={137} fill="#ccfbf1" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 14, 155, 0)}
        {renderForce("buoyant", cx - 14, 110, 0)}
        {renderForce("tension", cx, 155, 1)}
      </svg>
    );
  }

  if (scenario.id === "hydraulic") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={30} y={90} width={260} height={90} fill="#1e3a5f" opacity="0.6" rx="2" />
        <text x={150} y={140} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7" textAnchor="middle">Pascal&apos;s fluid</text>
        <rect x={60} y={60} width={40} height={35} fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
        <rect x={65} y={88} width={30} height={6} fill="#64748b" />
        <text x={80} y={79} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">A₁</text>
        <rect x={210} y={50} width={60} height={45} fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
        <rect x={215} y={88} width={50} height={6} fill="#64748b" />
        <text x={240} y={71} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">A₂</text>
        {renderForce("weight", 80, 95, 0)}
        {renderForce("normal", 80, 60, 0)}
        {renderForce("applied", 80, 60, 1)}
      </svg>
    );
  }

  if (scenario.id === "surface") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={50} width={280} height={150} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={66} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        <rect x={20} y={188} width={280} height={12} fill="#334155" stroke="#475569" strokeWidth="1" />
        <rect x={cx - 26} y={142} width={52} height={46} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" rx="3" />
        <text x={cx} y={169} fill="#ede9fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 14, 188, 0)}
        {renderForce("buoyant", cx - 8, 142, 0)}
        {renderForce("normal", cx + 6, 142, 0, "up")}
      </svg>
    );
  }

  // ── Kinematics: projectile mid-flight ─────────────────────────────────
  if (scenario.id === "kin_projectile") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <path d="M 20 180 Q 160 40 300 180" stroke="#334155" strokeWidth="1" strokeDasharray="4,3" fill="none" opacity="0.5" />
        <text x={cx} y={36} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">trajectory</text>
        <rect x={cx - 18} y={95} width={36} height={36} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" rx="18" />
        <text x={cx} y={118} fill="#ede9fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx, 131, 0)}
      </svg>
    );
  }

  // ── Kinematics: free fall ─────────────────────────────────────────────
  if (scenario.id === "kin_freefall") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <line x1={cx} y1={20} x2={cx} y2={40} stroke="#334155" strokeWidth="1" strokeDasharray="2,3" opacity="0.6" />
        <rect x={cx - 24} y={70} width={48} height={48} fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="4" />
        <text x={cx} y={98} fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        <text x={cx + 40} y={94} fill="#94a3b8" fontSize="9" fontFamily="monospace">v ↓</text>
        {renderForce("weight", cx, 118, 0)}
      </svg>
    );
  }

  // ── Horizontal surface (shared: kin_horizontal, dyn_elevator) ─────────
  if (scenario.id === "kin_horizontal" || scenario.id === "dyn_elevator") {
    const isElevator = scenario.id === "dyn_elevator";
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        {isElevator && (
          <g>
            <rect x={40} y={30} width={240} height={170} fill="none" stroke="#64748b" strokeWidth="2" rx="4" />
            <line x1={40} y1={30} x2={280} y2={30} stroke="#94a3b8" strokeWidth="1.5" />
            <text x={cx} y={22} fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">elevator cabin</text>
          </g>
        )}
        <rect x={40} y={170} width={240} height={10} fill="#334155" stroke="#475569" strokeWidth="1" />
        <rect x={cx - 28} y={130} width={56} height={40} fill="#334155" stroke="#64748b" strokeWidth="1.5" rx="3" />
        <text x={cx} y={155} fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 10, 170, 0)}
        {renderForce("normal", cx - 10, 130, 0)}
      </svg>
    );
  }

  // ── Horizontal friction (dyn_horizontal_friction) ─────────────────────
  if (scenario.id === "dyn_horizontal_friction") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={160} width={280} height={10} fill="#334155" stroke="#475569" strokeWidth="1" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={26 + i * 30} y1={170} x2={20 + i * 30} y2={180} stroke="#475569" strokeWidth="1" />
        ))}
        <rect x={cx - 28} y={120} width={56} height={40} fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
        <text x={cx} y={145} fill="#dbeafe" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        <text x={cx + 40} y={115} fill="#94a3b8" fontSize="9" fontFamily="monospace">v →</text>
        {renderForce("weight", cx + 14, 160, 0)}
        {renderForce("normal", cx - 14, 120, 0)}
        {renderForce("applied", cx + 28, 140, 0)}
        {renderForce("friction", cx - 28, 150, 0)}
      </svg>
    );
  }

  // ── Incline scenes (smooth + friction + rolling) ──────────────────────
  if (
    scenario.id === "dyn_incline_smooth" ||
    scenario.id === "dyn_incline_friction" ||
    scenario.id === "rot_rolling_incline"
  ) {
    const isRolling = scenario.id === "rot_rolling_incline";
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <polygon points="40,190 280,190 280,70" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x={200} y={205} fill="#94a3b8" fontSize="9" fontFamily="monospace">θ</text>
        {isRolling ? (
          <>
            <circle cx={185} cy={118} r={22} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" />
            <text x={185} y={122} fill="#ede9fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
          </>
        ) : (
          <g transform="translate(185,120) rotate(-27)">
            <rect x={-22} y={-16} width={44} height={32} fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
            <text x={0} y={4} fill="#dbeafe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
          </g>
        )}
        {renderForce("weight", 185, 140, 0)}
        {renderForce("normal", 185, 118, 0)}
        {(scenario.id === "dyn_incline_friction" || isRolling) &&
          renderForce("friction", 185, 118, 1)}
      </svg>
    );
  }

  // ── Hanging rope (dyn_hanging_rope) ───────────────────────────────────
  if (scenario.id === "dyn_hanging_rope") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={cx - 60} y={20} width={120} height={8} fill="#475569" />
        <line x1={cx} y1={28} x2={cx} y2={100} stroke="#a855f7" strokeWidth="2" />
        <rect x={cx - 28} y={100} width={56} height={48} fill="#475569" stroke="#a855f7" strokeWidth="1.5" rx="4" />
        <text x={cx} y={128} fill="#e9d5ff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 10, 148, 0)}
        {renderForce("tension", cx - 10, 100, 0)}
      </svg>
    );
  }

  // ── Oscillations: horizontal spring ───────────────────────────────────
  if (scenario.id === "osc_spring_horizontal") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={150} width={280} height={10} fill="#334155" stroke="#475569" strokeWidth="1" />
        <rect x={20} y={90} width={12} height={70} fill="#475569" />
        {/* spring zig-zag */}
        <polyline
          points="32,128 55,118 75,138 95,118 115,138 135,118 155,138 175,128"
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
        />
        <rect x={175} y={110} width={50} height={40} fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" rx="3" />
        <text x={200} y={134} fill="#fbcfe8" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", 210, 150, 0)}
        {renderForce("normal", 190, 110, 0)}
        {renderForce("spring", 175, 130, 0)}
      </svg>
    );
  }

  // ── Oscillations: vertical spring ─────────────────────────────────────
  if (scenario.id === "osc_spring_vertical") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={cx - 40} y={20} width={80} height={8} fill="#475569" />
        <polyline
          points={`${cx},28 ${cx - 15},40 ${cx + 15},55 ${cx - 15},70 ${cx + 15},85 ${cx - 15},100 ${cx},115`}
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
        />
        <rect x={cx - 28} y={115} width={56} height={44} fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" rx="4" />
        <text x={cx} y={141} fill="#fbcfe8" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 12, 159, 0)}
        {renderForce("spring", cx - 12, 115, 0)}
      </svg>
    );
  }

  // ── Oscillations: pendulum bob ─────────────────────────────────────────
  if (scenario.id === "osc_pendulum") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={cx - 70} y={20} width={140} height={8} fill="#475569" />
        <line x1={cx} y1={28} x2={cx + 50} y2={140} stroke="#a855f7" strokeWidth="2" />
        <circle cx={cx + 50} cy={148} r={18} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" />
        <text x={cx + 50} y={152} fill="#ede9fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {renderForce("weight", cx + 50, 166, 0)}
        {renderForce("tension", cx + 50, 148, 0)}
      </svg>
    );
  }

  // ── Torque: beam with supports and load ────────────────────────────────
  if (scenario.id === "trq_beam") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={40} y={110} width={240} height={14} fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
        {/* supports */}
        <polygon points="65,124 55,150 75,150" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <polygon points="255,124 245,150 265,150" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        {/* hanging load */}
        <line x1={200} y1={124} x2={200} y2={160} stroke="#a855f7" strokeWidth="1.5" />
        <rect x={188} y={160} width={24} height={20} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1" rx="2" />
        <text x={cx} y={105} fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">uniform beam</text>
        {renderForce("weight", cx + 10, 124, 0)}
        {renderForce("normal", 65, 110, 0)}
        {renderForce("normal", 255, 110, 1, "up")}
        {renderForce("tension", 200, 124, 0)}
      </svg>
    );
  }

  // Fallback: generic centered object with arrows in declared directions
  return (
    <svg width={W} height={H} className="w-full">
      <defs>{markers}</defs>
      <rect x={cx - 30} y={100} width={60} height={50} fill="#334155" stroke="#64748b" strokeWidth="1.5" rx="4" />
      <text x={cx} y={128} fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
      {(Object.keys(scenario.directions) as ForceId[]).map((id, i) => renderForce(id, cx, 125, i))}
    </svg>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function FBDBuilder() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1] ?? "";

  const unitScenarios = useMemo(() => {
    const list = SCENARIOS.filter((s) => s.units.includes(slug));
    return list.length > 0 ? list : SCENARIOS;
  }, [slug]);

  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>(unitScenarios[0].id);
  const [activeForces, setActiveForces] = useState<Set<ForceId>>(new Set());
  const [history, setHistory] = useState<Set<ForceId>[]>([]);
  const [mass, setMass] = useState(2);
  const [volume, setVolume] = useState(0.001);
  const [fluidDensity, setFluidDensity] = useState(1000);
  const [appliedForce, setAppliedForce] = useState(15);
  const [friction, setFriction] = useState(6);
  const [springConst, setSpringConst] = useState(100);
  const [springStretch, setSpringStretch] = useState(0.1);
  const [inclineAngle, setInclineAngle] = useState(27);
  const [checkResult, setCheckResult] = useState<null | "correct" | "incorrect">(null);

  const scenario =
    unitScenarios.find((s) => s.id === selectedScenarioId) ?? unitScenarios[0];

  // Scenario type identifies which parameters are relevant
  const isFluidScenario = scenario.units.includes("fluids");
  const isInclineScenario =
    scenario.id === "dyn_incline_smooth" ||
    scenario.id === "dyn_incline_friction" ||
    scenario.id === "rot_rolling_incline";
  const hasFriction = scenario.expectedForces.includes("friction");
  const hasSpring = scenario.expectedForces.includes("spring");
  const hasApplied = scenario.expectedForces.includes("applied") && !isFluidScenario;

  // Force magnitude calculations tailored to the scenario
  const forceValues = useMemo<Record<ForceId, number>>(() => {
    const weight = mass * G;
    const buoyant = fluidDensity * volume * G;
    const rad = (inclineAngle * Math.PI) / 180;
    const weightParallel = weight * Math.sin(rad);
    const weightPerp = weight * Math.cos(rad);

    // Normal differs by scenario
    let normal = weight;
    if (isInclineScenario) normal = weightPerp;
    if (scenario.id === "dyn_horizontal_friction") normal = weight;
    if (scenario.id === "osc_spring_horizontal") normal = weight;
    if (scenario.id === "hydraulic") normal = weight;
    if (scenario.id === "surface") normal = Math.max(0, weight - buoyant);
    if (scenario.id === "trq_beam") normal = weight / 2; // per support for symmetric load

    // Tension scenarios
    let tension = weight;
    if (scenario.id === "submerged_string") tension = Math.max(0, buoyant - weight);
    if (scenario.id === "osc_pendulum") tension = weightPerp;
    if (scenario.id === "trq_beam") tension = weight * 0.5; // hanging sub-load

    // Friction (simplified — just a user-tunable value)
    const frictionVal = Math.min(friction, isInclineScenario ? weightParallel : weight);

    // Spring force
    const springVal = springConst * springStretch;

    return {
      weight,
      buoyant,
      normal,
      tension,
      applied: appliedForce,
      friction: frictionVal,
      spring: springVal,
    };
  }, [mass, volume, fluidDensity, appliedForce, friction, springConst, springStretch, inclineAngle, scenario.id, isInclineScenario]);

  // Net force estimate (horizontal + vertical total magnitude)
  const netForce = useMemo(() => {
    let nx = 0;
    let ny = 0;
    activeForces.forEach((id) => {
      const direction = scenario.directions[id];
      if (!direction) return;
      const val = forceValues[id];
      const { dx, dy } = directionToDelta(direction, 1);
      nx += dx * val;
      ny += dy * val;
    });
    return Math.hypot(nx, ny);
  }, [activeForces, forceValues, scenario.directions]);

  const toggleForce = (id: ForceId) => {
    setActiveForces((prev) => {
      setHistory((h) => [...h.slice(-19), new Set(prev)]);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setCheckResult(null);
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setActiveForces(new Set(prev));
      setCheckResult(null);
      return h.slice(0, -1);
    });
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCheck = () => {
    const expected = new Set(scenario.expectedForces);
    const isCorrect =
      activeForces.size === expected.size &&
      [...activeForces].every((f) => expected.has(f));
    setCheckResult(isCorrect ? "correct" : "incorrect");
  };

  const handleReset = () => {
    setHistory((h) => [...h.slice(-19), new Set(activeForces)]);
    setActiveForces(new Set());
    setCheckResult(null);
  };

  // Which forces can the user toggle? Offer every force that could conceivably be debated.
  const toggleableForces: ForceId[] = useMemo(() => {
    // Always offer weight, normal; offer context-appropriate extras
    const base: ForceId[] = ["weight", "normal", "tension", "applied", "friction"];
    if (isFluidScenario) base.push("buoyant");
    if (hasSpring || scenario.units.includes("oscillations")) base.push("spring");
    return Array.from(new Set(base));
  }, [isFluidScenario, hasSpring, scenario.units]);

  const unitLabel = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return (
    <div
      className="min-h-screen p-6 font-mono"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%),
          repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(148,163,184,0.03) 27px, rgba(148,163,184,0.03) 28px),
          repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(148,163,184,0.03) 27px, rgba(148,163,184,0.03) 28px)
        `,
      }}
    >
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs tracking-[0.3em] uppercase text-teal-400 opacity-80">
            AP Physics 1 · {unitLabel || "Mechanics"}
          </span>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            color: "#f1f5f9",
            fontFamily: "'Courier New', 'Lucida Console', monospace",
            textShadow: "0 0 30px rgba(20,184,166,0.3)",
          }}
        >
          Free Body Diagram Builder
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pick a scenario from this unit, toggle the forces you think act on the object, then verify.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Scenario Selector */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                01 — Select Scenario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unitScenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedScenarioId(s.id);
                      setActiveForces(new Set());
                      setCheckResult(null);
                    }}
                    className={`text-left p-3 rounded-md border transition-all duration-150 ${
                      selectedScenarioId === s.id
                        ? "border-teal-500 bg-teal-950/50 text-teal-100"
                        : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-500 hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{s.title}</div>
                    <div className="text-[10px] opacity-60 mt-0.5 leading-snug">{s.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SVG Canvas */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                  02 — Diagram
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-slate-600 text-slate-400">
                  {scenario.title}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-md overflow-hidden border border-slate-700/50"
                style={{
                  background: "radial-gradient(ellipse at center, #1a2744 0%, #0d1b2a 100%)",
                }}
              >
                <Diagram scenario={scenario} activeForces={activeForces} forceValues={forceValues} />
              </div>

              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-slate-400 text-xs font-mono">Net Force magnitude</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: Math.abs(netForce) < 0.1 ? "#22c55e" : "#f97316" }}
                  >
                    {netForce.toFixed(2)} N
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono"
                    style={{
                      borderColor: Math.abs(netForce) < 0.1 ? "#22c55e" : "#f97316",
                      color: Math.abs(netForce) < 0.1 ? "#22c55e" : "#f97316",
                    }}
                  >
                    {Math.abs(netForce) < 0.1 ? "equilibrium" : "accelerating"}
                  </Badge>
                </div>
              </div>

              <div className="mt-2 p-2 rounded bg-slate-800/60 border border-slate-700/40">
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{scenario.note}</p>
              </div>
            </CardContent>
          </Card>

          {/* Check answer */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                04 — Verify Diagram
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-mono">
                Toggle all forces you believe act on this object, then check.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCheck}
                  className="flex-1 min-w-[140px] text-xs font-mono bg-teal-700 hover:bg-teal-600 text-white border-0 tracking-wider"
                >
                  CHECK DIAGRAM
                </Button>
                <Button
                  onClick={undo}
                  disabled={history.length === 0}
                  variant="outline"
                  title="Undo last change (Ctrl+Z)"
                  className="text-xs font-mono border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400 tracking-wider disabled:opacity-40"
                >
                  UNDO
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="text-xs font-mono border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-400 tracking-wider"
                >
                  RESET
                </Button>
              </div>

              {checkResult && (
                <div
                  className={`mt-3 p-3 rounded-md border text-xs font-mono ${
                    checkResult === "correct"
                      ? "bg-green-950/50 border-green-600/50 text-green-300"
                      : "bg-red-950/50 border-red-600/50 text-red-300"
                  }`}
                >
                  {checkResult === "correct" ? (
                    <>
                      <div className="font-bold mb-1">✓ Correct!</div>
                      <div className="opacity-80">
                        Expected: {scenario.expectedForces.map((f) => FORCES[f].symbol).join(", ")}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold mb-1">✗ Not quite.</div>
                      <div className="opacity-80">
                        You selected: {[...activeForces].map((f) => FORCES[f].symbol).join(", ") || "none"}
                      </div>
                      <div className="opacity-80 mt-0.5">
                        Hint: think about every surface in contact and every tether attached.
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Force toggles */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                03 — Toggle Forces
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {toggleableForces.map((id, i) => {
                const f = FORCES[id];
                const isOn = activeForces.has(id);
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: f.color, boxShadow: isOn ? `0 0 6px ${f.color}` : "none" }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-xs font-bold font-mono"
                              style={{ color: isOn ? f.color : "#94a3b8" }}
                            >
                              {f.label}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono dark:text-slate-400">({f.symbol})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            <span style={{ color: isOn ? f.color : undefined }}>
                              {forceValues[id].toFixed(2)} N
                            </span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={isOn}
                        onCheckedChange={() => toggleForce(id)}
                        className="data-[state=checked]:bg-teal-600 flex-shrink-0"
                      />
                    </div>
                    {i < toggleableForces.length - 1 && <Separator className="mt-3 bg-slate-800" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                Parameters
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500 font-mono">
                Adjust values to update force magnitudes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mass */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-xs text-slate-300 font-mono">Mass (m)</Label>
                  <span className="text-xs font-bold font-mono text-teal-300">{mass.toFixed(1)} kg</span>
                </div>
                <Slider min={0.1} max={20} step={0.1} value={[mass]} onValueChange={([v]) => setMass(v)} />
              </div>

              {isFluidScenario && (
                <>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Volume (V)</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{(volume * 1000).toFixed(2)} L</span>
                    </div>
                    <Slider
                      min={0.0001}
                      max={0.01}
                      step={0.0001}
                      value={[volume]}
                      onValueChange={([v]) => setVolume(v)}
                    />
                  </div>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Fluid Density (ρ)</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{fluidDensity} kg/m³</span>
                    </div>
                    <Slider
                      min={500}
                      max={14000}
                      step={50}
                      value={[fluidDensity]}
                      onValueChange={([v]) => setFluidDensity(v)}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {[
                        { label: "Water", val: 1000 },
                        { label: "Seawater", val: 1025 },
                        { label: "Oil", val: 800 },
                        { label: "Mercury", val: 13600 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setFluidDensity(preset.val)}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                            fluidDensity === preset.val
                              ? "border-teal-500 text-teal-300 bg-teal-950/40"
                              : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {hasApplied && (
                <>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Applied Force</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{appliedForce.toFixed(1)} N</span>
                    </div>
                    <Slider
                      min={0}
                      max={80}
                      step={0.5}
                      value={[appliedForce]}
                      onValueChange={([v]) => setAppliedForce(v)}
                    />
                  </div>
                </>
              )}

              {hasFriction && (
                <>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Friction</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{friction.toFixed(1)} N</span>
                    </div>
                    <Slider
                      min={0}
                      max={40}
                      step={0.5}
                      value={[friction]}
                      onValueChange={([v]) => setFriction(v)}
                    />
                  </div>
                </>
              )}

              {hasSpring && (
                <>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Spring k</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{springConst} N/m</span>
                    </div>
                    <Slider
                      min={10}
                      max={500}
                      step={5}
                      value={[springConst]}
                      onValueChange={([v]) => setSpringConst(v)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Displacement x</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{(springStretch * 100).toFixed(1)} cm</span>
                    </div>
                    <Slider
                      min={0}
                      max={0.5}
                      step={0.005}
                      value={[springStretch]}
                      onValueChange={([v]) => setSpringStretch(v)}
                    />
                  </div>
                </>
              )}

              {isInclineScenario && (
                <>
                  <Separator className="bg-slate-800" />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs text-slate-300 font-mono">Incline angle θ</Label>
                      <span className="text-xs font-bold font-mono text-teal-300">{inclineAngle}°</span>
                    </div>
                    <Slider
                      min={5}
                      max={60}
                      step={1}
                      value={[inclineAngle]}
                      onValueChange={([v]) => setInclineAngle(v)}
                    />
                  </div>
                </>
              )}

              <Separator className="bg-slate-800" />

              {/* Derived values */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Derived</div>
                {[
                  { label: "Weight (mg)", val: `${(mass * G).toFixed(2)} N` },
                  ...(isFluidScenario
                    ? [
                        { label: "Buoyant (ρVg)", val: `${(fluidDensity * volume * G).toFixed(2)} N` },
                        { label: "Object density", val: `${(mass / volume).toFixed(0)} kg/m³` },
                      ]
                    : []),
                  ...(isInclineScenario
                    ? [
                        { label: "mg sinθ", val: `${(mass * G * Math.sin((inclineAngle * Math.PI) / 180)).toFixed(2)} N` },
                        { label: "mg cosθ", val: `${(mass * G * Math.cos((inclineAngle * Math.PI) / 180)).toFixed(2)} N` },
                      ]
                    : []),
                  ...(hasSpring
                    ? [{ label: "F_s = kx", val: `${(springConst * springStretch).toFixed(2)} N` }]
                    : []),
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">{row.label}</span>
                    <span className="text-[10px] font-bold font-mono text-slate-300">{row.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Force legend */}
          <Card className="bg-slate-900/80 border-slate-700/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm tracking-widest uppercase text-teal-400 font-mono">
                Force Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {toggleableForces.map((id) => {
                const f = FORCES[id];
                return (
                  <div key={id} className="flex gap-2 items-start">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: f.color }}
                    />
                    <div>
                      <span className="text-[10px] font-mono font-bold" style={{ color: f.color }}>
                        {f.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1">— {f.description}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
