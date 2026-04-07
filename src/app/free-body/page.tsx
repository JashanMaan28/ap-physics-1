"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface Force {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  label: string;
}

const FORCE_PRESETS = [
  { label: "Weight (mg)", dx: 0, dy: 80, color: "#ef4444" },
  { label: "Normal (N)", dx: 0, dy: -80, color: "#22c55e" },
  { label: "Friction (f)", dx: -60, dy: 0, color: "#f59e0b" },
  { label: "Applied (F)", dx: 60, dy: 0, color: "#3b82f6" },
  { label: "Tension (T)", dx: 0, dy: -60, color: "#a855f7" },
];

let nextId = 0;

export default function FreeBodyPage() {
  const [forces, setForces] = useState<Force[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cx = 300;
  const cy = 250;

  const addForce = useCallback((preset: typeof FORCE_PRESETS[number]) => {
    setForces((prev) => [
      ...prev,
      { id: nextId++, x: cx, y: cy, dx: preset.dx, dy: preset.dy, color: preset.color, label: preset.label },
    ]);
  }, []);

  const handlePointerDown = useCallback((id: number) => {
    setDragging(id);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setForces((prev) =>
        prev.map((f) =>
          f.id === dragging ? { ...f, dx: mx - f.x, dy: my - f.y } : f
        )
      );
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const removeForce = useCallback((id: number) => {
    setForces((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Calculate net force
  const netFx = forces.reduce((sum, f) => sum + f.dx, 0);
  const netFy = forces.reduce((sum, f) => sum + f.dy, 0);
  const netMag = Math.sqrt(netFx * netFx + netFy * netFy);

  return (
    <div className="min-h-dvh bg-background text-foreground p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Free-Body Diagram Sandbox</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add forces, drag the arrowheads to adjust, double-click to remove
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          {/* Canvas */}
          <div className="rounded-2xl border bg-card overflow-hidden">
            <svg
              ref={svgRef}
              width="100%"
              viewBox="0 0 600 500"
              className="bg-card"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
                </pattern>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
              <rect width="600" height="500" fill="url(#grid)" />

              {/* Object */}
              <circle cx={cx} cy={cy} r="24" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.3" fontFamily="monospace">
                obj
              </text>

              {/* Forces */}
              {forces.map((f) => (
                <g key={f.id}>
                  <line
                    x1={f.x}
                    y1={f.y}
                    x2={f.x + f.dx}
                    y2={f.y + f.dy}
                    stroke={f.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#arrowhead)"
                    style={{ color: f.color }}
                  />
                  {/* Draggable tip */}
                  <circle
                    cx={f.x + f.dx}
                    cy={f.y + f.dy}
                    r="8"
                    fill={f.color}
                    fillOpacity="0.3"
                    stroke={f.color}
                    strokeWidth="2"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={() => handlePointerDown(f.id)}
                    onDoubleClick={() => removeForce(f.id)}
                  />
                  {/* Label */}
                  <text
                    x={f.x + f.dx * 0.5}
                    y={f.y + f.dy * 0.5 - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={f.color}
                    fontFamily="monospace"
                  >
                    {f.label}
                  </text>
                </g>
              ))}

              {/* Net force (dashed) */}
              {forces.length >= 2 && netMag > 5 && (
                <g>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + netFx}
                    y2={cy + netFy}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeOpacity="0.6"
                    markerEnd="url(#arrowhead)"
                    style={{ color: "#ffffff" }}
                  />
                  <text
                    x={cx + netFx * 0.5}
                    y={cy + netFy * 0.5 - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    fillOpacity="0.5"
                    fontFamily="monospace"
                  >
                    ΣF = {netMag.toFixed(0)}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Add Forces</h3>
              <div className="space-y-2">
                {FORCE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => addForce(preset)}
                    className="w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.color }} />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <h3 className="text-sm font-semibold mb-2">Net Force</h3>
              <div className="space-y-1 text-xs font-mono text-muted-foreground">
                <p>ΣFx = {netFx.toFixed(1)}</p>
                <p>ΣFy = {netFy.toFixed(1)}</p>
                <p className="text-foreground font-semibold">|ΣF| = {netMag.toFixed(1)}</p>
                {netMag < 2 && forces.length >= 2 && (
                  <p className="text-emerald-500 font-semibold mt-2">Equilibrium! ΣF ≈ 0</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setForces([])}
              className="w-full rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Clear All
            </button>

            <p className="text-[10px] text-muted-foreground/50 text-center">
              You found the secret sandbox! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
