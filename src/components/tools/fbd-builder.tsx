"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScenarioId =
  | "floating"
  | "sinking"
  | "submerged_string"
  | "hydraulic"
  | "surface";

type ForceId = "weight" | "buoyant" | "normal" | "tension" | "applied";

interface Force {
  id: ForceId;
  label: string;
  symbol: string;
  color: string;
  direction: "up" | "down" | "left" | "right";
  description: string;
}

interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  expectedForces: ForceId[];
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
    direction: "down",
    description: "Gravitational force pulling object toward Earth's center",
  },
  buoyant: {
    id: "buoyant",
    label: "Buoyant Force",
    symbol: "ρVg",
    color: "#3b82f6",
    direction: "up",
    description: "Upward force exerted by fluid equal to weight of displaced fluid",
  },
  normal: {
    id: "normal",
    label: "Normal Force",
    symbol: "N",
    color: "#22c55e",
    direction: "up",
    description: "Contact force perpendicular to the surface supporting the object",
  },
  tension: {
    id: "tension",
    label: "Tension",
    symbol: "T",
    color: "#a855f7",
    direction: "up",
    description: "Force from string/rope pulling object upward",
  },
  applied: {
    id: "applied",
    label: "Applied Force",
    symbol: "F_app",
    color: "#f97316",
    direction: "down",
    description: "External force applied to the piston or object",
  },
};

const SCENARIOS: Scenario[] = [
  {
    id: "floating",
    title: "Object Floating in Fluid",
    description: "Object at rest partially submerged on the fluid surface",
    expectedForces: ["weight", "buoyant"],
    note: "Net force = 0. Buoyant force exactly equals weight. Object is partially submerged.",
  },
  {
    id: "sinking",
    title: "Object Sinking in Fluid",
    description: "Dense object accelerating downward through fluid",
    expectedForces: ["weight", "buoyant"],
    note: "Net force ≠ 0. Weight > Buoyant force. Object accelerates downward.",
  },
  {
    id: "submerged_string",
    title: "Object Submerged (Held by String)",
    description: "Object fully submerged, anchored to the floor by a string",
    expectedForces: ["weight", "buoyant", "tension"],
    note: "Net force = 0. Buoyant > Weight, so string pulls DOWN to keep object in place.",
  },
  {
    id: "hydraulic",
    title: "Hydraulic Piston",
    description: "Force applied to small piston transmits through fluid",
    expectedForces: ["weight", "normal", "applied"],
    note: "Pascal's Principle: P = F/A is constant throughout fluid.",
  },
  {
    id: "surface",
    title: "Object on Fluid Surface",
    description: "Object resting on a solid surface at the bottom of a fluid",
    expectedForces: ["weight", "buoyant", "normal"],
    note: "Net force = 0. Normal force + Buoyant force = Weight.",
  },
];

// ─── SVG Diagram ──────────────────────────────────────────────────────────────

function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      markerWidth="10"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill={color} />
    </marker>
  );
}

interface ForceArrowProps {
  cx: number;
  cy: number;
  direction: "up" | "down" | "left" | "right";
  color: string;
  label: string;
  magnitude: string;
  markerId: string;
  index: number;
}

function ForceArrow({ cx, cy, direction, color, label, magnitude, markerId, index }: ForceArrowProps) {
  const length = 60;
  const offset = index * 18;

  let x1 = cx + offset;
  let y1 = cy;
  let x2 = cx + offset;
  let y2 = cy;

  if (direction === "up") {
    y1 = cy;
    y2 = cy - length;
  } else if (direction === "down") {
    y1 = cy;
    y2 = cy + length;
  } else if (direction === "left") {
    x1 = cx;
    x2 = cx - length;
    y1 = cy + offset;
    y2 = cy + offset;
  } else {
    x1 = cx;
    x2 = cx + length;
    y1 = cy + offset;
    y2 = cy + offset;
  }

  const labelX = direction === "up" || direction === "down" ? x2 + 6 : x2;
  const labelY = direction === "up" ? y2 - 4 : direction === "down" ? y2 + 14 : y2 - 4;

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
      <text x={labelX} y={labelY} fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold">
        {label}
      </text>
      <text x={labelX} y={labelY + 11} fill={color} fontSize="9" fontFamily="monospace" opacity="0.8">
        {magnitude}
      </text>
    </g>
  );
}

interface ScenarioDiagramProps {
  scenario: ScenarioId;
  activeForces: Set<ForceId>;
  forceValues: Record<ForceId, number>;
}

function ScenarioDiagram({ scenario, activeForces, forceValues }: ScenarioDiagramProps) {
  const W = 280;
  const H = 220;
  const cx = 140;

  // Shared arrow markers
  const markers = Object.values(FORCES).map((f) => (
    <ArrowMarker key={f.id} id={`arrow-${f.id}`} color={f.color} />
  ));

  const renderForce = (id: ForceId, arrowCx: number, arrowCy: number, idx: number) => {
    if (!activeForces.has(id)) return null;
    const f = FORCES[id];
    const val = forceValues[id];
    return (
      <ForceArrow
        key={id}
        cx={arrowCx}
        cy={arrowCy}
        direction={f.direction}
        color={f.color}
        label={f.symbol}
        magnitude={`${val.toFixed(1)}N`}
        markerId={`arrow-${id}`}
        index={idx}
      />
    );
  };

  if (scenario === "floating") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        {/* fluid */}
        <rect x={20} y={110} width={240} height={90} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={126} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        {/* surface line */}
        <line x1={20} y1={110} x2={260} y2={110} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />
        {/* object — half submerged */}
        <rect x={cx - 25} y={90} width={50} height={40} fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" rx="3" />
        <text x={cx} y={115} fill="#1e293b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {/* forces from center of object */}
        {renderForce("weight", cx + 12, 130, 0)}
        {renderForce("buoyant", cx - 12, 90, 0)}
      </svg>
    );
  }

  if (scenario === "sinking") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={30} width={240} height={170} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={46} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        {/* sinking object */}
        <rect x={cx - 22} y={90} width={44} height={44} fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" rx="3" />
        <text x={cx} y={116} fill="#fef3c7" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {/* motion arrow */}
        <line x1={cx + 35} y1={100} x2={cx + 35} y2={130} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#arrow-weight)" opacity="0.4" />
        <text x={cx + 40} y={118} fill="#94a3b8" fontSize="8" fontFamily="monospace">v↓</text>
        {renderForce("weight", cx + 10, 134, 0)}
        {renderForce("buoyant", cx - 10, 90, 0)}
      </svg>
    );
  }

  if (scenario === "submerged_string") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        <rect x={20} y={20} width={240} height={180} fill="#1e3a5f" opacity="0.5" rx="2" />
        <text x={24} y={36} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
        {/* floor */}
        <rect x={20} y={195} width={240} height={5} fill="#475569" />
        {/* string */}
        <line x1={cx} y1={155} x2={cx} y2={195} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2" />
        {/* object */}
        <rect x={cx - 24} y={110} width={48} height={45} fill="#0f766e" stroke="#5eead4" strokeWidth="1.5" rx="3" />
        <text x={cx} y={137} fill="#ccfbf1" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
        {/* note: tension points DOWN (string anchors object to floor) */}
        {renderForce("weight", cx + 14, 155, 0)}
        {renderForce("buoyant", cx - 14, 110, 0)}
        {/* tension arrow points DOWN toward floor */}
        {activeForces.has("tension") && (
          <g>
            <line x1={cx} y1={155} x2={cx} y2={155 + 55} stroke={FORCES.tension.color} strokeWidth="2.5" markerEnd={`url(#arrow-tension)`} />
            <text x={cx + 6} y={182} fill={FORCES.tension.color} fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
            <text x={cx + 6} y={193} fill={FORCES.tension.color} fontSize="9" fontFamily="monospace" opacity="0.8">{forceValues.tension.toFixed(1)}N</text>
          </g>
        )}
      </svg>
    );
  }

  if (scenario === "hydraulic") {
    return (
      <svg width={W} height={H} className="w-full">
        <defs>{markers}</defs>
        {/* fluid chamber */}
        <rect x={30} y={90} width={220} height={90} fill="#1e3a5f" opacity="0.6" rx="2" />
        <text x={110} y={140} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7" textAnchor="middle">Pascal&apos;s fluid</text>
        {/* left piston (small) */}
        <rect x={50} y={60} width={40} height={35} fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
        <rect x={55} y={88} width={30} height={6} fill="#64748b" />
        <text x={70} y={79} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">A₁</text>
        {/* right piston (large) */}
        <rect x={180} y={50} width={60} height={45} fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
        <rect x={185} y={88} width={50} height={6} fill="#64748b" />
        <text x={210} y={71} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">A₂</text>
        <text x={210} y={82} fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">(larger)</text>
        {/* pressure transmission arrow */}
        <line x1={105} y1={135} x2={175} y2={135} stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrow-buoyant)" opacity="0.5" />
        <text x={138} y={128} fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">P₁ = P₂</text>
        {/* forces on left piston */}
        {renderForce("weight", 70, 95, 0)}
        {renderForce("normal", 70, 60, 0)}
        {renderForce("applied", 70, 60, 0)}
      </svg>
    );
  }

  // surface scenario
  return (
    <svg width={W} height={H} className="w-full">
      <defs>{markers}</defs>
      {/* fluid */}
      <rect x={20} y={50} width={240} height={150} fill="#1e3a5f" opacity="0.5" rx="2" />
      <text x={24} y={66} fill="#60a5fa" fontSize="9" fontFamily="monospace" opacity="0.7">fluid (ρ)</text>
      {/* floor surface */}
      <rect x={20} y={188} width={240} height={12} fill="#334155" stroke="#475569" strokeWidth="1" />
      <text x={cx} y={197} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">surface</text>
      {/* object resting on floor */}
      <rect x={cx - 26} y={142} width={52} height={46} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="1.5" rx="3" />
      <text x={cx} y={169} fill="#ede9fe" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">m</text>
      {renderForce("weight", cx + 14, 188, 0)}
      {renderForce("buoyant", cx - 8, 142, 0)}
      {renderForce("normal", cx + 6, 142, 0)}
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function FBDBuilder() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("floating");
  const [activeForces, setActiveForces] = useState<Set<ForceId>>(new Set());
  const [mass, setMass] = useState(2);         // kg
  const [volume, setVolume] = useState(0.001);  // m³  (1 L)
  const [fluidDensity, setFluidDensity] = useState(1000); // kg/m³ (water)
  const [checkResult, setCheckResult] = useState<null | "correct" | "incorrect">(null);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenario)!;

  // Computed force values
  const forceValues = useMemo<Record<ForceId, number>>(() => {
    const weight = mass * G;
    const buoyant = fluidDensity * volume * G;
    const tension = Math.max(0, buoyant - weight);
    const normal = Math.max(0, weight - buoyant);
    return {
      weight,
      buoyant,
      normal,
      tension,
      applied: mass * G * 0.5,
    };
  }, [mass, volume, fluidDensity]);

  const netForce = useMemo(() => {
    let net = 0;
    activeForces.forEach((id) => {
      const f = FORCES[id];
      const val = forceValues[id];
      if (f.direction === "up" || f.direction === "right") net += val;
      else net -= val;
    });
    return net;
  }, [activeForces, forceValues]);

  const toggleForce = (id: ForceId) => {
    setActiveForces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setCheckResult(null);
  };

  const handleCheck = () => {
    const expected = new Set(scenario.expectedForces);
    const isCorrect =
      activeForces.size === expected.size &&
      [...activeForces].every((f) => expected.has(f));
    setCheckResult(isCorrect ? "correct" : "incorrect");
  };

  const handleReset = () => {
    setActiveForces(new Set());
    setCheckResult(null);
  };

  // Forces relevant to current scenario (all forces are potentially toggleable)
  const toggleableForces: ForceId[] = ["weight", "buoyant", "normal", "tension", "applied"];

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
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs tracking-[0.3em] uppercase text-teal-400 opacity-80">AP Physics 1 · Fluids</span>
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
          Select forces acting on the object, then verify your diagram.
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
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      setActiveForces(new Set());
                      setCheckResult(null);
                    }}
                    className={`text-left p-3 rounded-md border transition-all duration-150 ${
                      selectedScenario === s.id
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
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-slate-600 text-slate-400"
                >
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
                <ScenarioDiagram
                  scenario={selectedScenario}
                  activeForces={activeForces}
                  forceValues={forceValues}
                />
              </div>

              {/* Net force display */}
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-slate-400 text-xs font-mono">Net Force (Σ F)</span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{
                      color: Math.abs(netForce) < 0.01 ? "#22c55e" : "#f97316",
                    }}
                  >
                    {netForce >= 0 ? "+" : ""}{netForce.toFixed(2)} N
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono"
                    style={{
                      borderColor: Math.abs(netForce) < 0.01 ? "#22c55e" : "#f97316",
                      color: Math.abs(netForce) < 0.01 ? "#22c55e" : "#f97316",
                    }}
                  >
                    {Math.abs(netForce) < 0.01 ? "equilibrium" : "accelerating"}
                  </Badge>
                </div>
              </div>

              {/* Scenario note */}
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
              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  className="flex-1 text-xs font-mono bg-teal-700 hover:bg-teal-600 text-white border-0 tracking-wider"
                >
                  CHECK DIAGRAM
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
                        Hint: consider which forces are actually present in this scenario.
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

          {/* Force Toggles */}
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
                        {/* Color swatch */}
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
                            <span className="text-[10px] text-slate-600 font-mono">({f.symbol})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{f.direction} ·{" "}
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
                    {i < toggleableForces.length - 1 && (
                      <Separator className="mt-3 bg-slate-800" />
                    )}
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
                <Slider
                  min={0.1}
                  max={20}
                  step={0.1}
                  value={[mass]}
                  onValueChange={([v]) => setMass(v)}
                  className="[&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-400"
                />
                <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                  <span>0.1 kg</span><span>20 kg</span>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Volume */}
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
                  className="[&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-400"
                />
                <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                  <span>0.1 L</span><span>10 L</span>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* Fluid Density */}
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
                  className="[&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-400"
                />
                <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                  <span>500</span><span>14000</span>
                </div>
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

              <Separator className="bg-slate-800" />

              {/* Derived values */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Derived</div>
                {[
                  { label: "Weight (mg)", val: `${(mass * G).toFixed(2)} N` },
                  { label: "Buoyant (ρVg)", val: `${(fluidDensity * volume * G).toFixed(2)} N` },
                  { label: "Object density", val: `${(mass / volume).toFixed(0)} kg/m³` },
                  {
                    label: "Floats?",
                    val: mass / volume < fluidDensity ? "Yes" : "No",
                    highlight: mass / volume < fluidDensity,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono">{row.label}</span>
                    <span
                      className="text-[10px] font-bold font-mono"
                      style={{
                        color: "highlight" in row
                          ? row.highlight ? "#22c55e" : "#ef4444"
                          : "#94a3b8",
                      }}
                    >
                      {row.val}
                    </span>
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
