"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  glow: string;
  formula: string;
  explanation: string;
  related: string[];
  category: "foundation" | "principle" | "law" | "application";
}

interface EdgeData {
  from: string;
  to: string;
  label: string;
  dashed?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NODES: NodeData[] = [
  {
    id: "density",
    label: "Density",
    x: 120,
    y: 80,
    color: "#22d3ee",
    glow: "#22d3ee",
    formula: "ρ = m/V",
    explanation: "Mass per unit volume; determines whether an object sinks or floats.",
    related: ["buoyancy", "pressure"],
    category: "foundation",
  },
  {
    id: "pressure",
    label: "Pressure",
    x: 360,
    y: 60,
    color: "#a78bfa",
    glow: "#a78bfa",
    formula: "P = F/A  |  P = P₀ + ρgh",
    explanation: "Force per unit area; increases with depth in a fluid.",
    related: ["pascal", "buoyancy", "bernoulli"],
    category: "foundation",
  },
  {
    id: "force",
    label: "Force",
    x: 600,
    y: 80,
    color: "#fb923c",
    glow: "#fb923c",
    formula: "F = PA",
    explanation: "Pressure multiplied by area gives the net fluid force on a surface.",
    related: ["pressure", "pascal", "buoyancy"],
    category: "foundation",
  },
  {
    id: "pascal",
    label: "Pascal's Law",
    x: 480,
    y: 220,
    color: "#f472b6",
    glow: "#f472b6",
    formula: "ΔP₁ = ΔP₂",
    explanation: "Pressure applied to an enclosed fluid is transmitted equally in all directions.",
    related: ["pressure", "force"],
    category: "law",
  },
  {
    id: "buoyancy",
    label: "Buoyancy",
    x: 180,
    y: 260,
    color: "#34d399",
    glow: "#34d399",
    formula: "F_b = ρ_fluid · V_displaced · g",
    explanation: "Upward force from pressure difference; equals weight of fluid displaced (Archimedes).",
    related: ["density", "pressure", "force"],
    category: "application",
  },
  {
    id: "energy",
    label: "Energy\nConservation",
    x: 100,
    y: 420,
    color: "#fbbf24",
    glow: "#fbbf24",
    formula: "KE + PE + W = const",
    explanation: "Total mechanical energy in a fluid system is conserved along a streamline.",
    related: ["bernoulli"],
    category: "principle",
  },
  {
    id: "flowrate",
    label: "Flow Rate",
    x: 340,
    y: 390,
    color: "#60a5fa",
    glow: "#60a5fa",
    formula: "Q = Av  (m³/s)",
    explanation: "Volume of fluid passing a cross-section per second; constant in an ideal flow.",
    related: ["continuity"],
    category: "foundation",
  },
  {
    id: "continuity",
    label: "Continuity",
    x: 540,
    y: 360,
    color: "#4ade80",
    glow: "#4ade80",
    formula: "A₁v₁ = A₂v₂",
    explanation: "Mass conservation: where a pipe narrows, fluid must speed up.",
    related: ["flowrate", "bernoulli"],
    category: "law",
  },
  {
    id: "bernoulli",
    label: "Bernoulli's\nPrinciple",
    x: 360,
    y: 520,
    color: "#f87171",
    glow: "#f87171",
    formula: "P + ½ρv² + ρgh = const",
    explanation: "Energy per unit volume is constant along a streamline; faster flow ⟹ lower pressure.",
    related: ["continuity", "energy", "pressure"],
    category: "application",
  },
];

const EDGES: EdgeData[] = [
  { from: "density",   to: "buoyancy",   label: "determines if\nobject floats" },
  { from: "pressure",  to: "pascal",     label: "transmitted equally\nin enclosed fluids" },
  { from: "pressure",  to: "buoyancy",   label: "pressure difference\ncreates upward force", dashed: true },
  { from: "force",     to: "pascal",     label: "uses", dashed: true },
  { from: "force",     to: "buoyancy",   label: "net upward\nfluid force", dashed: true },
  { from: "energy",    to: "bernoulli",  label: "Bernoulli = energy\nconservation per unit vol" },
  { from: "flowrate",  to: "continuity", label: "Q = Av = constant" },
  { from: "continuity",to: "bernoulli",  label: "use continuity to\nfind v, then apply" },
  { from: "pressure",  to: "bernoulli",  label: "is a special\ncase of", dashed: true },
];

// ─── Category styling ─────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<NodeData["category"], string> = {
  foundation: "Foundation",
  principle:  "Principle",
  law:        "Law",
  application:"Application",
};

const CATEGORY_COLORS: Record<NodeData["category"], string> = {
  foundation: "bg-cyan-950 text-cyan-300 border-cyan-700",
  principle:  "bg-yellow-950 text-yellow-300 border-yellow-700",
  law:        "bg-purple-950 text-purple-300 border-purple-700",
  application:"bg-rose-950  text-rose-300  border-rose-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NODE_R = 38; // node radius

function getNodeById(id: string): NodeData | undefined {
  return NODES.find((n) => n.id === id);
}

/** Compute the point on the edge of a circle closest to a target point */
function edgePoint(cx: number, cy: number, tx: number, ty: number, r: number) {
  const angle = Math.atan2(ty - cy, tx - cx);
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/** Mid-point with a slight perpendicular offset for label placement */
function edgeMid(x1: number, y1: number, x2: number, y2: number, offset = 0) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  if (offset === 0) return { x: mx, y: my };
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: mx + (-dy / len) * offset, y: my + (dx / len) * offset };
}

// ─── SVG Arrow marker defs ────────────────────────────────────────────────────

function Defs() {
  return (
    <defs>
      {/* Grid pattern */}
      <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a5f" strokeWidth="0.4" />
      </pattern>
      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#smallGrid)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1e3a5f" strokeWidth="0.8" />
      </pattern>

      {/* Arrow heads */}
      {NODES.map((n) => (
        <marker
          key={n.id}
          id={`arrow-${n.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={n.color} opacity="0.8" />
        </marker>
      ))}

      {/* Glow filters */}
      {NODES.map((n) => (
        <filter key={n.id} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}

      <filter id="label-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// ─── Edge component ───────────────────────────────────────────────────────────

function Edge({
  edge,
  active,
  dimmed,
}: {
  edge: EdgeData;
  active: boolean;
  dimmed: boolean;
}) {
  const from = getNodeById(edge.from);
  const to   = getNodeById(edge.to);
  if (!from || !to) return null;

  const start = edgePoint(from.x, from.y, to.x, to.y, NODE_R);
  const end   = edgePoint(to.x, to.y, from.x, from.y, NODE_R + 6);
  const mid   = edgeMid(start.x, start.y, end.x, end.y, 14);

  const toNode = to;
  const strokeColor = active ? toNode.color : "#334155";
  const opacity = dimmed ? 0.15 : active ? 1 : 0.55;

  // Split label on \n
  const lines = edge.label.split("\n");

  return (
    <g style={{ transition: "opacity 0.25s" }} opacity={opacity}>
      <path
        d={`M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={active ? 2 : 1.2}
        strokeDasharray={edge.dashed ? "5 3" : undefined}
        markerEnd={`url(#arrow-${to.id})`}
        style={{ transition: "stroke 0.25s, stroke-width 0.2s" }}
      />
      {/* Label background + text */}
      {active && (
        <g>
          <rect
            x={mid.x - 52}
            y={mid.y - 11 * lines.length}
            width={104}
            height={14 * lines.length + 4}
            rx={3}
            fill="#0b1829"
            opacity={0.92}
            stroke={strokeColor}
            strokeWidth={0.5}
          />
          {lines.map((line, i) => (
            <text
              key={i}
              x={mid.x}
              y={mid.y - 11 * lines.length + 12 + i * 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              fill={strokeColor}
              letterSpacing="0.02em"
            >
              {line}
            </text>
          ))}
        </g>
      )}
    </g>
  );
}

// ─── Node component ───────────────────────────────────────────────────────────

function Node({
  node,
  selected,
  dimmed,
  onClick,
}: {
  node: NodeData;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  const lines = node.label.split("\n");
  const opacity = dimmed ? 0.2 : 1;

  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer", transition: "opacity 0.25s" }}
      opacity={opacity}
    >
      {/* Outer ring (pulse ring when selected) */}
      {selected && (
        <circle
          cx={node.x}
          cy={node.y}
          r={NODE_R + 10}
          fill="none"
          stroke={node.color}
          strokeWidth={1}
          opacity={0.35}
          className="animate-ping"
          style={{ animationDuration: "1.6s" }}
        />
      )}
      {/* Glow backdrop */}
      <circle
        cx={node.x}
        cy={node.y}
        r={NODE_R + 4}
        fill={node.color}
        opacity={selected ? 0.18 : 0.07}
        filter={`url(#glow-${node.id})`}
        style={{ transition: "opacity 0.25s" }}
      />
      {/* Main circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={NODE_R}
        fill={selected ? `${node.color}22` : "#0d1f33"}
        stroke={node.color}
        strokeWidth={selected ? 2.5 : 1.5}
        filter={selected ? `url(#glow-${node.id})` : undefined}
        style={{ transition: "fill 0.2s, stroke-width 0.2s" }}
      />
      {/* Label lines */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={node.x}
          y={node.y + (i - (lines.length - 1) / 2) * 14 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={lines.length > 1 ? "10" : "11"}
          fontWeight="600"
          fontFamily="'JetBrains Mono', monospace"
          fill={node.color}
          letterSpacing="0.04em"
          filter={selected ? "url(#label-glow)" : undefined}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  node,
  onClose,
  onNavigate,
}: {
  node: NodeData;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const relatedNodes = node.related.map(getNodeById).filter(Boolean) as NodeData[];

  return (
    <div
      className="absolute top-4 right-4 w-72 z-10 animate-in slide-in-from-right-4 fade-in duration-300"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <Card
        className="border-0 shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)",
          borderLeft: `3px solid ${node.color}`,
          boxShadow: `0 0 40px ${node.color}22, 0 20px 60px #00000088`,
        }}
      >
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle
                className="text-lg leading-tight"
                style={{ color: node.color, textShadow: `0 0 12px ${node.color}88` }}
              >
                {node.label.replace("\n", " ")}
              </CardTitle>
              <CardDescription className="mt-1">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono px-1.5 py-0 ${CATEGORY_COLORS[node.category]}`}
                >
                  {CATEGORY_LABELS[node.category]}
                </Badge>
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5 text-lg leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 space-y-3">
          {/* Formula block */}
          <div
            className="rounded-md px-3 py-2 border"
            style={{
              background: `${node.color}0d`,
              borderColor: `${node.color}40`,
            }}
          >
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Key Formula</p>
            <p
              className="text-sm font-bold tracking-wider"
              style={{ color: node.color }}
            >
              {node.formula}
            </p>
          </div>

          {/* Explanation */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {node.explanation}
          </p>

          <Separator className="bg-slate-700/50" />

          {/* Related nodes */}
          {relatedNodes.length > 0 && (
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">
                Connected Concepts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relatedNodes.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onNavigate(rel.id)}
                    className="text-[10px] px-2 py-0.5 rounded-full border transition-all hover:scale-105 active:scale-95"
                    style={{
                      borderColor: rel.color,
                      color: rel.color,
                      background: `${rel.color}10`,
                    }}
                  >
                    {rel.label.replace("\n", " ")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const cats: Array<[NodeData["category"], string, string]> = [
    ["foundation",  "Foundation",  "#22d3ee"],
    ["principle",   "Principle",   "#fbbf24"],
    ["law",         "Law",         "#a78bfa"],
    ["application", "Application", "#f87171"],
  ];

  return (
    <div
      className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-10"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {cats.map(([, label, color]) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full border"
            style={{ borderColor: color, background: `${color}22`, boxShadow: `0 0 4px ${color}66` }}
          />
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2">
        <div className="w-5 h-px bg-slate-500" />
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Direct</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-px border-t border-dashed border-slate-500" />
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">Derived</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConceptMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNodeClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const selectedNode = selectedId ? getNodeById(selectedId) : null;

  // Determine which nodes / edges are "active" given a selection
  const activeNodeIds = selectedNode
    ? new Set([selectedNode.id, ...selectedNode.related])
    : null;

  const activeEdges = selectedNode
    ? new Set(
        EDGES.filter(
          (e) =>
            e.from === selectedNode.id ||
            e.to   === selectedNode.id
        ).map((e) => `${e.from}-${e.to}`)
      )
    : null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        background: "linear-gradient(160deg, #060e1a 0%, #0a1628 60%, #0b1e30 100%)",
        minHeight: 620,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Header */}
      <div className="relative z-10 px-6 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h2
            className="text-base font-bold tracking-[0.15em] uppercase"
            style={{ color: "#7dd3fc", textShadow: "0 0 16px #7dd3fc66" }}
          >
            AP Physics 1 — Fluids
          </h2>
          <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5">
            Concept Dependency Map · Click a node to explore
          </p>
        </div>
        <div
          className="text-[9px] text-slate-600 tracking-widest uppercase border border-slate-700 rounded px-2 py-1"
          style={{ background: "#0d1f3322" }}
        >
          {NODES.length} concepts · {EDGES.length} connections
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          viewBox="0 0 740 620"
          className="w-full"
          style={{ minHeight: 500 }}
        >
          <Defs />

          {/* Blueprint grid background */}
          <rect width="740" height="620" fill="url(#grid)" />

          {/* Corner tick marks */}
          {[
            [10, 10], [730, 10], [10, 610], [730, 610],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#1e3a5f" strokeWidth="1" />
              <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="#1e3a5f" strokeWidth="1" />
            </g>
          ))}

          {/* Edges (render first so nodes sit on top) */}
          {EDGES.map((edge) => {
            const key = `${edge.from}-${edge.to}`;
            const isActive = activeEdges ? activeEdges.has(key) : false;
            const isDimmed  = activeEdges ? !isActive : false;
            return (
              <Edge
                key={key}
                edge={edge}
                active={isActive}
                dimmed={isDimmed}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const isSelected = node.id === selectedId;
            const isDimmed   = activeNodeIds ? !activeNodeIds.has(node.id) : false;
            return (
              <Node
                key={node.id}
                node={node}
                selected={isSelected}
                dimmed={isDimmed}
                onClick={() => handleNodeClick(node.id)}
              />
            );
          })}
        </svg>

        {/* Detail panel */}
        {selectedNode && (
          <DetailPanel
            node={selectedNode}
            onClose={() => setSelectedId(null)}
            onNavigate={(id) => setSelectedId(id)}
          />
        )}

        {/* Legend */}
        <Legend />
      </div>

      {/* Scanline overlay for blueprint feel */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
        }}
      />
    </div>
  );
}
