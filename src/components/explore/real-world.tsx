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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Topic =
  | "All"
  | "Pascal's Law"
  | "Bernoulli"
  | "Buoyancy"
  | "Continuity"
  | "Pressure";

interface Example {
  title: string;
  topic: Exclude<Topic, "All">;
  description: string;
  principle: string;
  formula: string;
  illustration: React.ReactNode;
}

const TOPICS: Topic[] = [
  "All",
  "Pascal's Law",
  "Bernoulli",
  "Buoyancy",
  "Continuity",
  "Pressure",
];

const TOPIC_COLORS: Record<Exclude<Topic, "All">, string> = {
  "Pascal's Law": "bg-purple-100/90 text-purple-900 border-purple-300 dark:bg-purple-500/20 dark:text-purple-100 dark:border-purple-400/40",
  Bernoulli: "bg-blue-100/90 text-blue-900 border-blue-300 dark:bg-blue-500/20 dark:text-blue-100 dark:border-blue-400/40",
  Buoyancy: "bg-teal-100/90 text-teal-900 border-teal-300 dark:bg-teal-500/20 dark:text-teal-100 dark:border-teal-400/40",
  Continuity: "bg-orange-100/90 text-orange-900 border-orange-300 dark:bg-orange-500/20 dark:text-orange-100 dark:border-orange-400/40",
  Pressure: "bg-green-100/90 text-green-900 border-green-300 dark:bg-green-500/20 dark:text-green-100 dark:border-green-400/40",
};

// ── SVG Illustrations ────────────────────────────────────────────────────────

function HydraulicBrakeSVG() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-28" aria-label="Hydraulic brake diagram">
      {/* Pedal cylinder (small) */}
      <rect x="10" y="35" width="30" height="30" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <text x="25" y="52" textAnchor="middle" fontSize="7" fill="#1e293b">Small</text>
      <text x="25" y="61" textAnchor="middle" fontSize="7" fill="#1e293b">piston</text>
      {/* Pipe */}
      <rect x="40" y="47" width="80" height="6" fill="#60a5fa" />
      {/* Fluid label */}
      <text x="80" y="44" textAnchor="middle" fontSize="7" fill="#2563eb">fluid</text>
      {/* Caliper cylinder (large) */}
      <rect x="120" y="20" width="50" height="60" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
      <text x="145" y="52" textAnchor="middle" fontSize="7" fill="#1e293b">Large</text>
      <text x="145" y="61" textAnchor="middle" fontSize="7" fill="#1e293b">piston</text>
      {/* Force arrows */}
      <line x1="4" y1="50" x2="10" y2="50" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arr)" />
      <text x="2" y="46" fontSize="6" fill="#ef4444">F₁</text>
      <line x1="170" y1="50" x2="176" y2="50" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arr)" />
      <text x="177" y="46" fontSize="6" fill="#ef4444">F₂</text>
      <defs>
        <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function DamSVG() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-28" aria-label="Dam cross-section diagram">
      {/* Water */}
      <rect x="0" y="10" width="90" height="90" fill="#bfdbfe" />
      <text x="45" y="30" textAnchor="middle" fontSize="9" fill="#1d4ed8">Water</text>
      {/* Dam (trapezoid — wider at bottom) */}
      <polygon points="90,10 110,10 150,100 90,100" fill="#78716c" stroke="#57534e" strokeWidth="1.5" />
      {/* Pressure arrows (increasing with depth) */}
      {[20, 40, 60, 80].map((y, i) => (
        <line
          key={y}
          x1={90 - (i + 1) * 6}
          y1={y}
          x2={90}
          y2={y}
          stroke="#2563eb"
          strokeWidth={1 + i * 0.5}
          markerEnd="url(#barr)"
        />
      ))}
      <text x="140" y="55" textAnchor="middle" fontSize="7" fill="#1e293b" transform="rotate(10,140,55)">thicker</text>
      <text x="140" y="64" textAnchor="middle" fontSize="7" fill="#1e293b" transform="rotate(10,140,64)">at base</text>
      <defs>
        <marker id="barr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#2563eb" />
        </marker>
      </defs>
    </svg>
  );
}

function AirplaneSVG() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-28" aria-label="Airplane wing airflow diagram">
      {/* Wing cross-section */}
      <path d="M30,55 Q100,20 170,50 Q100,60 30,55 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      {/* Fast flow (top) */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M${20 + i * 10},${28 - i * 2} Q100,${15 - i} ${175 + i * 5},${38 - i * 2}`}
          fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="4 2" />
      ))}
      <text x="100" y="12" textAnchor="middle" fontSize="7" fill="#1d4ed8">Fast → Low P</text>
      {/* Slow flow (bottom) */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M${20 + i * 5},${65 + i} Q100,${70 + i} ${175 + i * 3},${60 + i}`}
          fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 2" />
      ))}
      <text x="100" y="84" textAnchor="middle" fontSize="7" fill="#475569">Slow → High P</text>
      {/* Lift arrow */}
      <line x1="100" y1="56" x2="100" y2="38" stroke="#ef4444" strokeWidth="2" markerEnd="url(#larr)" />
      <text x="108" y="48" fontSize="7" fill="#ef4444">Lift</text>
      <defs>
        <marker id="larr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function ShipSVG() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-28" aria-label="Ship buoyancy diagram">
      {/* Water */}
      <rect x="0" y="60" width="200" height="50" fill="#bfdbfe" />
      <text x="10" y="90" fontSize="7" fill="#1d4ed8">water</text>
      {/* Hull */}
      <path d="M40,40 L160,40 L175,70 L25,70 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
      <rect x="70" y="20" width="60" height="22" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      {/* Air inside */}
      <text x="100" y="58" textAnchor="middle" fontSize="7" fill="#e2e8f0">hollow</text>
      {/* Buoyancy arrow */}
      <line x1="100" y1="75" x2="100" y2="55" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#sarr)" />
      <text x="108" y="67" fontSize="6" fill="#0ea5e9">F_b</text>
      {/* Weight arrow */}
      <line x1="100" y1="38" x2="100" y2="55" stroke="#ef4444" strokeWidth="2" markerEnd="url(#sarr2)" />
      <text x="108" y="44" fontSize="6" fill="#ef4444">mg</text>
      <defs>
        <marker id="sarr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#0ea5e9" />
        </marker>
        <marker id="sarr2" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function BloodCirculationSVG() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-28" aria-label="Blood circulation continuity diagram">
      {/* Large artery */}
      <rect x="10" y="35" width="50" height="30" rx="15" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.5" />
      <text x="35" y="54" textAnchor="middle" fontSize="7" fill="#7f1d1d">Artery</text>
      {/* Arrow fast */}
      <line x1="60" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#carr)" />
      <text x="70" y="43" textAnchor="middle" fontSize="6" fill="#ef4444">fast v</text>
      {/* Capillaries (many small) */}
      {[-20, -10, 0, 10, 20].map((offset, i) => (
        <rect key={i} x="85" y={45 + offset} width="30" height="5" rx="2" fill="#fda4af" stroke="#f43f5e" strokeWidth="0.8" />
      ))}
      <text x="100" y="78" textAnchor="middle" fontSize="6" fill="#9f1239">capillaries</text>
      {/* Arrow slow */}
      <line x1="120" y1="50" x2="140" y2="50" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#carr)" />
      <text x="130" y="43" textAnchor="middle" fontSize="6" fill="#ef4444">slow v</text>
      {/* Vein */}
      <rect x="140" y="38" width="50" height="24" rx="12" fill="#fca5a5" stroke="#dc2626" strokeWidth="1.5" />
      <text x="165" y="52" textAnchor="middle" fontSize="7" fill="#7f1d1d">Vein</text>
      <defs>
        <marker id="carr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function StrawSVG() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-28" aria-label="Drinking straw pressure diagram">
      {/* Cup */}
      <path d="M50,40 L70,100 L140,100 L160,40 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
      {/* Liquid */}
      <path d="M57,70 L68,100 L140,100 L151,70 Z" fill="#7dd3fc" />
      {/* Straw */}
      <rect x="92" y="10" width="16" height="85" rx="7" fill="none" stroke="#f97316" strokeWidth="2" />
      {/* Liquid rising in straw */}
      <rect x="93" y="50" width="14" height="45" rx="6" fill="#7dd3fc" opacity="0.7" />
      {/* Low pressure at top */}
      <text x="100" y="8" textAnchor="middle" fontSize="7" fill="#7c3aed">Low P</text>
      <line x1="100" y1="9" x2="100" y2="13" stroke="#7c3aed" strokeWidth="1" />
      {/* Atm pressure arrows */}
      <line x1="25" y1="60" x2="50" y2="70" stroke="#059669" strokeWidth="1.5" markerEnd="url(#prarr)" />
      <text x="15" y="57" fontSize="6" fill="#059669">Patm</text>
      <defs>
        <marker id="prarr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#059669" />
        </marker>
      </defs>
    </svg>
  );
}

function SubmarineSVG() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-28" aria-label="Submarine ballast diagram">
      {/* Water */}
      <rect x="0" y="0" width="200" height="110" fill="#dbeafe" />
      {/* Sub body */}
      <ellipse cx="100" cy="60" rx="70" ry="22" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <rect x="80" y="38" width="30" height="16" rx="4" fill="#64748b" stroke="#475569" strokeWidth="1" />
      {/* Ballast tanks */}
      <rect x="42" y="52" width="28" height="16" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
      <rect x="128" y="52" width="28" height="16" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
      <text x="56" y="63" textAnchor="middle" fontSize="5.5" fill="#0c4a6e">ballast</text>
      <text x="142" y="63" textAnchor="middle" fontSize="5.5" fill="#0c4a6e">ballast</text>
      {/* Labels */}
      <text x="100" y="100" textAnchor="middle" fontSize="7" fill="#1d4ed8">Fill tanks → sink | Empty → rise</text>
    </svg>
  );
}

function IVDripSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-28" aria-label="IV drip bag height pressure diagram">
      {/* IV bag */}
      <path d="M70,8 Q100,4 130,8 L135,45 Q100,52 65,45 Z" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
      <text x="100" y="30" textAnchor="middle" fontSize="7" fill="#065f46">IV Bag</text>
      {/* Tube */}
      <line x1="100" y1="50" x2="100" y2="105" stroke="#6ee7b7" strokeWidth="3" />
      {/* Height brace */}
      <line x1="115" y1="50" x2="115" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="110" y1="50" x2="120" y2="50" stroke="#94a3b8" strokeWidth="1" />
      <line x1="110" y1="105" x2="120" y2="105" stroke="#94a3b8" strokeWidth="1" />
      <text x="130" y="78" fontSize="7" fill="#374151">h</text>
      {/* Needle/vein */}
      <rect x="85" y="105" width="30" height="8" rx="3" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
      <text x="100" y="113" textAnchor="middle" fontSize="6" fill="#7f1d1d">vein</text>
      {/* P arrow */}
      <line x1="60" y1="78" x2="85" y2="78" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#ivarr)" />
      <text x="32" y="81" fontSize="6" fill="#7c3aed">P=ρgh</text>
      <defs>
        <marker id="ivarr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#7c3aed" />
        </marker>
      </defs>
    </svg>
  );
}

function CarburetorSVG() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-28" aria-label="Venturi carburetor diagram">
      {/* Pipe with venturi narrowing */}
      <path d="M10,35 L70,35 L90,45 L110,45 L130,35 L190,35 L190,65 L130,65 L110,55 L90,55 L70,65 L10,65 Z"
        fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
      {/* Air flow arrows */}
      {[42, 50, 58].map((y, i) => (
        <line key={i} x1="15" y1={y} x2="75" y2={y} stroke="#2563eb" strokeWidth={i === 1 ? 2 : 1}
          markerEnd="url(#vnarr)" strokeDasharray="5 2" />
      ))}
      {/* Narrow section arrows (faster) */}
      <line x1="90" y1="50" x2="110" y2="50" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#vnarr)" />
      <text x="100" y="43" textAnchor="middle" fontSize="6" fill="#1d4ed8">Fast → Low P</text>
      {/* Fuel tube */}
      <line x1="100" y1="55" x2="100" y2="95" stroke="#f97316" strokeWidth="2.5" />
      <rect x="85" y="90" width="30" height="10" rx="3" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
      <text x="100" y="98" textAnchor="middle" fontSize="6" fill="#7c2d12">fuel</text>
      <text x="100" y="82" textAnchor="middle" fontSize="6" fill="#ea580c">↑ sucked up</text>
      <defs>
        <marker id="vnarr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#2563eb" />
        </marker>
      </defs>
    </svg>
  );
}

function BalloonSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-28" aria-label="Hot air balloon buoyancy diagram">
      {/* Sky */}
      <rect x="0" y="0" width="200" height="120" fill="#dbeafe" />
      {/* Balloon envelope */}
      <ellipse cx="100" cy="45" rx="45" ry="38" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
      {/* Hot air inside */}
      <text x="100" y="40" textAnchor="middle" fontSize="7" fill="#92400e">Hot air</text>
      <text x="100" y="50" textAnchor="middle" fontSize="6.5" fill="#b45309">low ρ</text>
      {/* Basket */}
      <rect x="82" y="83" width="36" height="18" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
      <line x1="88" y1="83" x2="90" y2="76" stroke="#78350f" strokeWidth="1.2" />
      <line x1="112" y1="83" x2="110" y2="76" stroke="#78350f" strokeWidth="1.2" />
      {/* Buoyancy arrow */}
      <line x1="155" y1="65" x2="155" y2="38" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#barr2)" />
      <text x="160" y="53" fontSize="6" fill="#0ea5e9">F_b</text>
      <text x="100" y="115" textAnchor="middle" fontSize="6.5" fill="#1d4ed8">Surrounding cool air is denser → net upward force</text>
      <defs>
        <marker id="barr2" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#0ea5e9" />
        </marker>
      </defs>
    </svg>
  );
}

function WaterTowerSVG() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-28" aria-label="Water tower pressure diagram">
      {/* Tank */}
      <ellipse cx="100" cy="22" rx="42" ry="14" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="58" y="22" width="84" height="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
      <ellipse cx="100" cy="62" rx="42" ry="14" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="100" y="46" textAnchor="middle" fontSize="7" fill="#1d4ed8">water</text>
      {/* Legs */}
      <line x1="72" y1="76" x2="72" y2="115" stroke="#94a3b8" strokeWidth="3" />
      <line x1="128" y1="76" x2="128" y2="115" stroke="#94a3b8" strokeWidth="3" />
      <line x1="60" y1="90" x2="140" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Height label */}
      <line x1="148" y1="62" x2="148" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
      <text x="162" y="90" fontSize="7" fill="#475569">h</text>
      {/* Pipe at bottom */}
      <line x1="100" y1="115" x2="100" y2="120" stroke="#3b82f6" strokeWidth="4" />
      <text x="100" y="130" textAnchor="middle" fontSize="6.5" fill="#2563eb">P = ρgh at base</text>
    </svg>
  );
}

function SprayBottleSVG() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-28" aria-label="Spray bottle Bernoulli diagram">
      {/* Bottle body */}
      <rect x="50" y="55" width="60" height="50" rx="8" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
      {/* Liquid in bottle */}
      <rect x="51" y="80" width="58" height="24" rx="6" fill="#6ee7b7" />
      <text x="80" y="93" textAnchor="middle" fontSize="6.5" fill="#065f46">liquid</text>
      {/* Nozzle horizontal */}
      <rect x="110" y="35" width="60" height="12" rx="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
      {/* Straw up from bottle */}
      <line x1="80" y1="55" x2="80" y2="41" stroke="#34d399" strokeWidth="2.5" />
      <line x1="80" y1="41" x2="110" y2="41" stroke="#34d399" strokeWidth="2.5" />
      {/* Fast air arrows */}
      <line x1="115" y1="41" x2="135" y2="41" stroke="#2563eb" strokeWidth="2" markerEnd="url(#sparr)" />
      <line x1="115" y1="37" x2="145" y2="37" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#sparr)" />
      <text x="170" y="39" fontSize="6.5" fill="#1d4ed8">fast air</text>
      <text x="170" y="47" fontSize="6" fill="#7c3aed">Low P</text>
      {/* Liquid rise arrow */}
      <line x1="80" y1="75" x2="80" y2="55" stroke="#f97316" strokeWidth="1.5" markerEnd="url(#sparr2)" />
      <text x="30" y="65" fontSize="6" fill="#ea580c">liquid</text>
      <text x="30" y="72" fontSize="6" fill="#ea580c">drawn up</text>
      <defs>
        <marker id="sparr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#2563eb" />
        </marker>
        <marker id="sparr2" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#ea580c" />
        </marker>
      </defs>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    title: "Hydraulic Car Brakes",
    topic: "Pascal's Law",
    description:
      "A small force on the brake pedal pushes fluid through a narrow cylinder. Pascal's Law transmits that pressure equally throughout the fluid, producing a much larger force at the wide brake caliper cylinders.",
    principle: "Pascal's Law: pressure applied to an enclosed fluid is transmitted equally in all directions.",
    formula: "P = F₁/A₁ = F₂/A₂  →  F₂ = F₁(A₂/A₁)",
    illustration: <HydraulicBrakeSVG />,
  },
  {
    title: "Dam Design",
    topic: "Pressure",
    description:
      "The water pressure acting on a dam increases linearly with depth. Engineers make dams much thicker at the base than at the top so the structure can withstand the enormous pressure forces deep underwater.",
    principle: "Hydrostatic pressure increases with depth.",
    formula: "P = P₀ + ρgh",
    illustration: <DamSVG />,
  },
  {
    title: "Airplane Wings",
    topic: "Bernoulli",
    description:
      "The curved upper surface of a wing forces air to travel a longer path, so it moves faster. Faster flow means lower pressure above the wing. The higher pressure below creates a net upward lift force.",
    principle: "Bernoulli's Principle: in a steady flow, higher speed → lower pressure.",
    formula: "P + ½ρv² + ρgh = const",
    illustration: <AirplaneSVG />,
  },
  {
    title: "Ships Floating",
    topic: "Buoyancy",
    description:
      "A steel hull is hollow, so the ship's average density is much less than water. The volume of water displaced equals the hull volume below the waterline. Archimedes' principle says the upward buoyant force equals the weight of that displaced water.",
    principle: "Archimedes' Principle: buoyant force equals weight of displaced fluid.",
    formula: "F_b = ρ_fluid · V_displaced · g",
    illustration: <ShipSVG />,
  },
  {
    title: "Blood Circulation",
    topic: "Continuity",
    description:
      "Blood flows quickly through arteries (small cross-section). As it branches into the vast network of capillaries, the total cross-sectional area increases enormously. The continuity equation demands the velocity drop dramatically, allowing time for gas exchange.",
    principle: "Continuity Equation: flow rate is conserved in an incompressible fluid.",
    formula: "A₁v₁ = A₂v₂",
    illustration: <BloodCirculationSVG />,
  },
  {
    title: "Drinking Straw",
    topic: "Pressure",
    description:
      "When you suck on a straw you reduce the air pressure above the liquid inside. Atmospheric pressure acting on the liquid surface outside pushes the liquid up the straw and into your mouth.",
    principle: "Net pressure difference drives fluid flow from high to low pressure regions.",
    formula: "ΔP = P_atm − P_mouth → fluid rises height h = ΔP/(ρg)",
    illustration: <StrawSVG />,
  },
  {
    title: "Submarine Ballast Tanks",
    topic: "Buoyancy",
    description:
      "A submarine controls its average density by flooding ballast tanks with seawater (to sink) or blowing compressed air into them (to rise). When average density equals seawater density the sub hovers at constant depth.",
    principle: "Floating/sinking depends on average density relative to the surrounding fluid.",
    formula: "ρ_avg = m_total / V_total  vs  ρ_fluid",
    illustration: <SubmarineSVG />,
  },
  {
    title: "IV Drip Bags",
    topic: "Pressure",
    description:
      "IV bags are hung well above a patient. The height difference creates a hydrostatic pressure greater than venous blood pressure. This pressure difference pushes fluid through the needle and into the vein without a pump.",
    principle: "Hydrostatic pressure due to height drives flow.",
    formula: "P = ρgh  (h = height of bag above vein)",
    illustration: <IVDripSVG />,
  },
  {
    title: "Venturi Effect in Carburetors",
    topic: "Bernoulli",
    description:
      "Air is forced through a narrow venturi throat. The reduced cross-section increases air speed, which by Bernoulli's principle lowers pressure below atmospheric. This pressure drop sucks fuel from the float bowl into the airstream, creating an air–fuel mixture.",
    principle: "Bernoulli: faster flow in a constriction creates low pressure.",
    formula: "P₁ + ½ρv₁² = P₂ + ½ρv₂²  (v₂ > v₁ → P₂ < P₁)",
    illustration: <CarburetorSVG />,
  },
  {
    title: "Hot Air Balloons",
    topic: "Buoyancy",
    description:
      "Heating the air inside the envelope lowers its density. The cooler, denser surrounding air exerts a buoyant force on the balloon. When the buoyant force exceeds the total weight, the balloon rises.",
    principle: "Buoyancy applies to gases as well as liquids.",
    formula: "F_b = ρ_cool · V · g  >  m_total · g  →  ascent",
    illustration: <BalloonSVG />,
  },
  {
    title: "Water Towers",
    topic: "Pressure",
    description:
      "Cities store water in elevated tanks. The height of the water column creates a constant hydrostatic pressure at street level. This passive pressure—no pump needed at the point of delivery—drives water into homes and fire hydrants.",
    principle: "Gravitational potential energy stored as pressure head.",
    formula: "P_gauge = ρgh",
    illustration: <WaterTowerSVG />,
  },
  {
    title: "Spray Bottles",
    topic: "Bernoulli",
    description:
      "Squeezing the trigger forces air rapidly across the tip of a vertical tube dipped into liquid. The high-speed air stream creates low pressure at the tube opening. Atmospheric pressure on the liquid surface pushes liquid up the tube where it is atomized.",
    principle: "Bernoulli: fast moving air above a tube creates low pressure, drawing liquid up.",
    formula: "P_atm − P_low = ρ_liquid · g · h",
    illustration: <SprayBottleSVG />,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function RealWorldExamples() {
  const [activeFilter, setActiveFilter] = useState<Topic>("All");

  const filtered =
    activeFilter === "All"
      ? EXAMPLES
      : EXAMPLES.filter((ex) => ex.topic === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Real-World Fluid Mechanics
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          12 everyday applications — hover over a card to see the physics in action.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <Button
            key={topic}
            variant={activeFilter === topic ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(topic)}
            className="text-xs"
          >
            {topic}
          </Button>
        ))}
      </div>

      <Separator />

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((ex) => (
          <Card
            key={ex.title}
            className="flex flex-col overflow-hidden border border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold leading-tight text-foreground">
                  {ex.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs font-medium ${TOPIC_COLORS[ex.topic]}`}
                >
                  {ex.topic}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 pt-0">
              {/* Illustration */}
              <div className="rounded-md bg-slate-50 p-2 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-700/60 dark:bg-slate-500/10">
                {ex.illustration}
              </div>

              {/* Description */}
              <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                {ex.description}
              </CardDescription>

              <Separator className="my-1" />

              {/* Physics box */}
              <div className="rounded-md bg-indigo-50 p-2.5 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:ring-indigo-400/30">
                <p className="text-xs font-medium text-indigo-900 dark:text-indigo-100 dark:text-indigo-200">{ex.principle}</p>
                <p className="mt-1 font-mono text-xs text-indigo-800 dark:text-indigo-200 dark:text-indigo-300">{ex.formula}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No examples match the selected filter.
        </p>
      )}
    </div>
  );
}
