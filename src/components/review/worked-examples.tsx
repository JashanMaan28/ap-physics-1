"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  title: string;
  /** LaTeX string for the governing equation */
  equation: string;
  /** Plain-text knowns list (may include simple inline LaTeX via KnownItem) */
  knowns: string[];
  /** LaTeX string for the substitution step */
  substitution: string;
  /** LaTeX string for the result */
  result: string;
  /** Plain-text explanation (prose) */
  explanation: string;
}

interface Problem {
  id: number;
  topic: string;
  badgeColor: string;
  title: string;
  question: React.ReactNode;
  diagram: React.ReactNode;
  steps: Step[];
}

// ─── SVG Diagrams ─────────────────────────────────────────────────────────────

const UTubeDiagram = () => (
  <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto" aria-label="U-tube manometer diagram">
    {/* Left arm */}
    <rect x="40" y="20" width="30" height="120" fill="none" stroke="#64748b" strokeWidth="2" />
    {/* Right arm */}
    <rect x="150" y="20" width="30" height="120" fill="none" stroke="#64748b" strokeWidth="2" />
    {/* Bottom connector */}
    <rect x="40" y="138" width="140" height="4" fill="#64748b" />
    {/* Left fluid (oil) - lighter, higher column */}
    <rect x="42" y="50" width="26" height="90" fill="#fbbf24" opacity="0.7" />
    {/* Right fluid (mercury) - denser, lower column */}
    <rect x="152" y="90" width="26" height="50" fill="#94a3b8" opacity="0.9" />
    {/* Labels */}
    <text x="55" y="45" textAnchor="middle" fontSize="11" fill="#d97706" fontWeight="bold">Oil</text>
    <text x="165" y="85" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="bold">Hg</text>
    {/* Height arrows */}
    <line x1="85" y1="50" x2="85" y2="138" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <line x1="85" y1="138" x2="85" y2="50" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <text x="98" y="100" fontSize="10" fill="#ef4444">h₁=0.12m</text>
    <line x1="135" y1="90" x2="135" y2="138" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="100" y="120" fontSize="10" fill="#3b82f6">h₂=0.05m</text>
    <defs>
      <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
      </marker>
    </defs>
    {/* P_unknown label */}
    <text x="55" y="38" textAnchor="middle" fontSize="10" fill="#7c3aed">P = ?</text>
    <text x="165" y="18" textAnchor="middle" fontSize="10" fill="#475569">P_atm</text>
  </svg>
);

const HydraulicLiftDiagram = () => (
  <svg viewBox="0 0 240 160" className="w-full max-w-xs mx-auto" aria-label="Hydraulic lift diagram">
    {/* Fluid base */}
    <rect x="10" y="100" width="220" height="40" fill="#bfdbfe" rx="2" />
    {/* Small piston */}
    <rect x="20" y="70" width="40" height="32" fill="#60a5fa" rx="2" />
    <rect x="25" y="50" width="30" height="22" fill="#93c5fd" rx="2" />
    <text x="40" y="45" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight="bold">A₁=0.01m²</text>
    <text x="40" y="155" textAnchor="middle" fontSize="9" fill="#1e40af">F₁=250 N</text>
    {/* Arrow down on small piston */}
    <line x1="40" y1="45" x2="40" y2="52" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed)" />
    {/* Large piston */}
    <rect x="150" y="30" width="70" height="72" fill="#60a5fa" rx="2" />
    <rect x="160" y="10" width="50" height="22" fill="#93c5fd" rx="2" />
    <text x="185" y="8" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight="bold">A₂=0.5m²</text>
    <text x="185" y="155" textAnchor="middle" fontSize="9" fill="#1e40af">F₂=?</text>
    {/* Car on top */}
    <rect x="158" y="0" width="54" height="12" fill="#374151" rx="3" />
    <text x="185" y="9" textAnchor="middle" fontSize="8" fill="white">CAR</text>
    <defs>
      <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626" />
      </marker>
    </defs>
  </svg>
);

const FloatingCubeDiagram = () => (
  <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto" aria-label="Floating cube diagram">
    {/* Water */}
    <rect x="20" y="70" width="160" height="80" fill="#bfdbfe" rx="4" opacity="0.8" />
    <text x="100" y="145" textAnchor="middle" fontSize="10" fill="#1d4ed8">ρ_water = 1000 kg/m³</text>
    {/* Cube - partially submerged */}
    <rect x="70" y="45" width="60" height="60" fill="#d97706" opacity="0.85" rx="2" stroke="#92400e" strokeWidth="1.5" />
    {/* Waterline */}
    <line x1="20" y1="70" x2="180" y2="70" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3" />
    <text x="22" y="67" fontSize="9" fill="#3b82f6">waterline</text>
    {/* Submerged portion label */}
    <text x="100" y="105" textAnchor="middle" fontSize="9" fill="#1d4ed8">60% submerged</text>
    {/* Weight arrow */}
    <line x1="100" y1="110" x2="100" y2="130" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowDown)" />
    <text x="108" y="125" fontSize="9" fill="#dc2626">W</text>
    {/* Buoyancy arrow */}
    <line x1="85" y1="85" x2="85" y2="60" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrowUp)" />
    <text x="65" y="60" fontSize="9" fill="#16a34a">F_b</text>
    <defs>
      <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626" />
      </marker>
      <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#16a34a" />
      </marker>
    </defs>
    <text x="100" y="40" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">Wood cube, L=0.2m</text>
  </svg>
);

const ContinuityDiagram = () => (
  <svg viewBox="0 0 260 120" className="w-full max-w-sm mx-auto" aria-label="Pipe narrowing diagram">
    {/* Wide pipe left */}
    <path d="M10,35 L100,35 L100,85 L10,85 Z" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
    {/* Narrowing section */}
    <path d="M100,35 L170,50 L170,70 L100,85 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
    {/* Narrow pipe right */}
    <path d="M170,50 L250,50 L250,70 L170,70 Z" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
    {/* Flow arrows */}
    <line x1="30" y1="60" x2="70" y2="60" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrowBlue)" />
    <line x1="185" y1="60" x2="225" y2="60" stroke="#1d4ed8" strokeWidth="2" markerEnd="url(#arrowBlue)" />
    {/* Labels */}
    <text x="55" y="30" textAnchor="middle" fontSize="10" fill="#1e40af">A₁=0.04m²</text>
    <text x="55" y="95" textAnchor="middle" fontSize="10" fill="#1e40af">v₁=2 m/s</text>
    <text x="210" y="45" textAnchor="middle" fontSize="10" fill="#1e40af">A₂=0.01m²</text>
    <text x="210" y="80" textAnchor="middle" fontSize="10" fill="#1e40af">v₂=?</text>
    {/* Height labels */}
    <text x="55" y="108" textAnchor="middle" fontSize="9" fill="#6b7280">h₁=3m</text>
    <text x="210" y="108" textAnchor="middle" fontSize="9" fill="#6b7280">h₂=0m</text>
    <defs>
      <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#1d4ed8" />
      </marker>
    </defs>
  </svg>
);

const TankHoleDiagram = () => (
  <svg viewBox="0 0 180 200" className="w-full max-w-xs mx-auto" aria-label="Tank with hole diagram">
    {/* Tank walls */}
    <rect x="30" y="20" width="120" height="150" fill="none" stroke="#64748b" strokeWidth="3" />
    {/* Water fill */}
    <rect x="33" y="23" width="114" height="90" fill="#bfdbfe" opacity="0.8" />
    {/* Height h label */}
    <line x1="18" y1="23" x2="18" y2="113" stroke="#dc2626" strokeWidth="1.5" />
    <line x1="13" y1="23" x2="23" y2="23" stroke="#dc2626" strokeWidth="1.5" />
    <line x1="13" y1="113" x2="23" y2="113" stroke="#dc2626" strokeWidth="1.5" />
    <text x="8" y="72" textAnchor="middle" fontSize="10" fill="#dc2626">h</text>
    <text x="8" y="82" textAnchor="middle" fontSize="10" fill="#dc2626">=4m</text>
    {/* Hole */}
    <circle cx="150" cy="113" r="5" fill="#dc2626" />
    {/* Water jet */}
    <path d="M155,113 Q185,113 200,130" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
    {/* P_atm labels */}
    <text x="90" y="18" textAnchor="middle" fontSize="10" fill="#6b7280">P_atm (open top)</text>
    <text x="164" y="107" fontSize="9" fill="#dc2626">hole</text>
    {/* v arrow */}
    <line x1="155" y1="113" x2="175" y2="113" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrowGreen)" />
    <text x="178" y="110" fontSize="10" fill="#16a34a">v=?</text>
    <defs>
      <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#16a34a" />
      </marker>
    </defs>
  </svg>
);

const ApparentWeightDiagram = () => (
  <svg viewBox="0 0 220 180" className="w-full max-w-xs mx-auto" aria-label="Object weighed in water diagram">
    {/* Scale/spring in air (left) */}
    <line x1="60" y1="10" x2="60" y2="40" stroke="#64748b" strokeWidth="2" />
    <rect x="40" y="10" width="40" height="14" fill="#e2e8f0" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
    <text x="60" y="21" textAnchor="middle" fontSize="9" fill="#374151">Scale</text>
    {/* String */}
    <line x1="60" y1="40" x2="60" y2="70" stroke="#374151" strokeWidth="1.5" strokeDasharray="3,2" />
    {/* Object in air */}
    <rect x="42" y="70" width="36" height="36" fill="#f59e0b" rx="3" stroke="#d97706" strokeWidth="1.5" />
    <text x="60" y="92" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">m</text>
    <text x="60" y="120" textAnchor="middle" fontSize="10" fill="#374151">W = 9.8 N</text>
    <text x="60" y="133" textAnchor="middle" fontSize="9" fill="#6b7280">(in air)</text>

    {/* Scale/spring in water (right) */}
    <line x1="160" y1="10" x2="160" y2="40" stroke="#64748b" strokeWidth="2" />
    <rect x="140" y="10" width="40" height="14" fill="#e2e8f0" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
    <text x="160" y="21" textAnchor="middle" fontSize="9" fill="#374151">Scale</text>
    {/* String */}
    <line x1="160" y1="40" x2="160" y2="70" stroke="#374151" strokeWidth="1.5" strokeDasharray="3,2" />
    {/* Water tank */}
    <rect x="128" y="70" width="64" height="80" fill="#bfdbfe" opacity="0.7" rx="3" stroke="#3b82f6" strokeWidth="1.5" />
    {/* Object in water */}
    <rect x="142" y="80" width="36" height="36" fill="#f59e0b" rx="3" stroke="#d97706" strokeWidth="1.5" />
    <text x="160" y="102" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">m</text>
    <text x="160" y="162" textAnchor="middle" fontSize="10" fill="#374151">W_app = 7.35 N</text>
    <text x="160" y="175" textAnchor="middle" fontSize="9" fill="#6b7280">(in water)</text>
  </svg>
);

// ─── Problem Data ─────────────────────────────────────────────────────────────

const PROBLEMS: Problem[] = [
  {
    id: 1,
    topic: "Pressure & Manometry",
    badgeColor: "bg-purple-100 text-purple-800",
    title: "U-Tube Manometer",
    question: (
      <>
        A U-tube manometer contains oil (<Tex>{String.raw`\rho = 800\ \text{kg/m}^3`}</Tex>) in the left arm
        and mercury (<Tex>{String.raw`\rho = 13{,}600\ \text{kg/m}^3`}</Tex>) in the right arm, which is open
        to the atmosphere (<Tex>{String.raw`P_{atm} = 101{,}325\ \text{Pa}`}</Tex>). The oil column stands{" "}
        <Tex>{String.raw`h_1 = 0.12\ \text{m}`}</Tex> above the mercury interface, and the mercury column
        stands <Tex>{String.raw`h_2 = 0.05\ \text{m}`}</Tex> above the interface. Find the gauge pressure of
        the gas connected to the left arm.
      </>
    ),
    diagram: <UTubeDiagram />,
    steps: [
      {
        title: "Write the relevant equation",
        equation: "P_{gas} + \\rho_{oil}\\, g\\, h_1 = P_{atm} + \\rho_{Hg}\\, g\\, h_2",
        knowns: [
          "\\rho_{oil} = 800\\ \\text{kg/m}^3",
          "\\rho_{Hg} = 13{,}600\\ \\text{kg/m}^3",
          "g = 9.8\\ \\text{m/s}^2",
          "h_1 = 0.12\\ \\text{m (oil column above interface)}",
          "h_2 = 0.05\\ \\text{m (mercury column above interface)}",
          "P_{atm} = 101{,}325\\ \\text{Pa}",
        ],
        substitution:
          "P_{gas} = P_{atm} + \\rho_{Hg}\\,g\\,h_2 - \\rho_{oil}\\,g\\,h_1",
        result:
          "P_{gas} = 101{,}325 + (13{,}600)(9.8)(0.05) - (800)(9.8)(0.12)",
        explanation:
          "At the bottom of the U-tube (the interface), pressure from both arms must be equal. We trace pressure from the open right side down and then up the left side to find the unknown gas pressure.",
      },
      {
        title: "Calculate each pressure term",
        equation: "P = \\rho g h",
        knowns: [
          "\\text{Mercury term: }\\rho_{Hg}\\,g\\,h_2 = 13{,}600 \\times 9.8 \\times 0.05",
          "\\text{Oil term: }\\rho_{oil}\\,g\\,h_1 = 800 \\times 9.8 \\times 0.12",
        ],
        substitution:
          "\\text{Mercury term} = 6{,}664\\ \\text{Pa} \\qquad \\text{Oil term} = 940.8\\ \\text{Pa}",
        result: "P_{gas} = 101{,}325 + 6{,}664 - 941 \\approx 107{,}048\\ \\text{Pa}",
        explanation:
          "Each ρgh term is the hydrostatic pressure added by that fluid column. Mercury adds more pressure per meter because its density is ~17× that of oil.",
      },
      {
        title: "State gauge pressure and check units",
        equation: "P_{gauge} = P_{gas} - P_{atm}",
        knowns: [
          "P_{gas} \\approx 107{,}048\\ \\text{Pa}",
          "P_{atm} = 101{,}325\\ \\text{Pa}",
        ],
        substitution: "P_{gauge} = 107{,}048 - 101{,}325",
        result: "P_{gauge} \\approx 5{,}723\\ \\text{Pa} \\approx 5.7\\ \\text{kPa}",
        explanation:
          "Units check: [kg/m³][m/s²][m] = kg/(m²·s²) = Pa. The result is positive, meaning the gas is at a slightly higher pressure than atmosphere — physically reasonable for a pressurized gas line.",
      },
    ],
  },
  {
    id: 2,
    topic: "Pascal's Law",
    badgeColor: "bg-blue-100 text-blue-800",
    title: "Hydraulic Car Lift",
    question: (
      <>
        A hydraulic car lift has a small piston of area <Tex>{String.raw`A_1 = 0.01\ \text{m}^2`}</Tex> and a
        large piston of area <Tex>{String.raw`A_2 = 0.50\ \text{m}^2`}</Tex>. A mechanic applies a force of{" "}
        <Tex>{String.raw`F_1 = 250\ \text{N}`}</Tex> to the small piston. (a) What force is exerted on the
        large piston? (b) If the large piston moves down <Tex>{String.raw`0.02\ \text{m}`}</Tex>, how far does
        the small piston move up?
      </>
    ),
    diagram: <HydraulicLiftDiagram />,
    steps: [
      {
        title: "Apply Pascal's Law for force",
        equation: "\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\implies F_2 = F_1 \\cdot \\frac{A_2}{A_1}",
        knowns: [
          "F_1 = 250\\ \\text{N}",
          "A_1 = 0.01\\ \\text{m}^2",
          "A_2 = 0.50\\ \\text{m}^2",
        ],
        substitution: "F_2 = 250 \\times \\frac{0.50}{0.01}",
        result: "F_2 = 250 \\times 50 = 12{,}500\\ \\text{N}",
        explanation:
          "Pascal's Law states that pressure is transmitted equally through a fluid. P = F/A, so a small force on a small area creates the same pressure as a large force on a large area. Mechanical advantage = A₂/A₁ = 50.",
      },
      {
        title: "Apply conservation of volume (incompressible fluid)",
        equation: "A_1\\,d_1 = A_2\\,d_2 \\implies d_1 = d_2 \\cdot \\frac{A_2}{A_1}",
        knowns: [
          "A_1 = 0.01\\ \\text{m}^2",
          "A_2 = 0.50\\ \\text{m}^2",
          "d_2 = 0.02\\ \\text{m}",
        ],
        substitution: "d_1 = 0.02 \\times \\frac{0.50}{0.01}",
        result: "d_1 = 0.02 \\times 50 = 1.0\\ \\text{m}",
        explanation:
          "Fluid is incompressible, so volume displaced by one piston equals volume received by the other. You gain force but sacrifice distance — this is a direct trade-off. Work in = Work out (ideal case): F₁d₁ = 250×1.0 = 250 J = F₂d₂ = 12,500×0.02 = 250 J. ✓",
      },
    ],
  },
  {
    id: 3,
    topic: "Buoyancy",
    badgeColor: "bg-amber-100 text-amber-800",
    title: "Floating Wood Cube — Find Density",
    question: (
      <>
        A cube of wood with side length <Tex>{String.raw`L = 0.20\ \text{m}`}</Tex> floats in water with
        exactly 60% of its volume submerged. Find (a) the density of the wood and (b) the buoyant
        force acting on it.
      </>
    ),
    diagram: <FloatingCubeDiagram />,
    steps: [
      {
        title: "Apply the floating equilibrium condition",
        equation:
          "F_{buoy} = W \\implies \\rho_{fluid}\\,V_{sub}\\,g = \\rho_{obj}\\,V_{total}\\,g",
        knowns: [
          "\\rho_{water} = 1000\\ \\text{kg/m}^3",
          "V_{sub} = 0.60 \\times V_{total}",
          "L = 0.20\\ \\text{m} \\implies V_{total} = L^3 = 0.008\\ \\text{m}^3",
        ],
        substitution:
          "\\rho_{water} \\cdot (0.60\\,V_{total})\\,g = \\rho_{wood}\\,V_{total}\\,g",
        result: "\\rho_{wood} = 0.60 \\times \\rho_{water} = 0.60 \\times 1000 = 600\\ \\text{kg/m}^3",
        explanation:
          "At equilibrium, buoyant force equals weight. The g and V_total cancel, leaving a beautifully simple result: the fraction submerged equals the ratio of densities. Wood floats because ρ_wood < ρ_water.",
      },
      {
        title: "Calculate the buoyant force",
        equation: "F_b = \\rho_{fluid}\\,g\\,V_{sub}",
        knowns: [
          "\\rho_{water} = 1000\\ \\text{kg/m}^3",
          "g = 9.8\\ \\text{m/s}^2",
          "V_{sub} = 0.60 \\times 0.008\\ \\text{m}^3 = 0.0048\\ \\text{m}^3",
        ],
        substitution: "F_b = 1000 \\times 9.8 \\times 0.0048",
        result: "F_b = 47.04\\ \\text{N} \\approx 47\\ \\text{N}",
        explanation:
          "This also equals the weight of the wood: W = ρ_wood · V · g = 600 × 0.008 × 9.8 = 47.04 N. ✓ Units: [kg/m³][m/s²][m³] = kg·m/s² = N.",
      },
    ],
  },
  {
    id: 4,
    topic: "Continuity + Bernoulli",
    badgeColor: "bg-cyan-100 text-cyan-800",
    title: "Water Flowing Through a Narrowing Pipe",
    question: (
      <>
        Water flows through a horizontal pipe that narrows from cross-section{" "}
        <Tex>{String.raw`A_1 = 0.04\ \text{m}^2`}</Tex> to <Tex>{String.raw`A_2 = 0.01\ \text{m}^2`}</Tex>. At the wide
        section, the water speed is <Tex>{String.raw`v_1 = 2\ \text{m/s}`}</Tex> and the gauge pressure is{" "}
        <Tex>{String.raw`P_1 = 40{,}000\ \text{Pa}`}</Tex>. Find (a) the speed <Tex>v_2</Tex> at the narrow
        section and (b) the gauge pressure <Tex>P_2</Tex> at the narrow section.
      </>
    ),
    diagram: <ContinuityDiagram />,
    steps: [
      {
        title: "Apply the Continuity Equation to find v₂",
        equation: "A_1 v_1 = A_2 v_2 \\implies v_2 = v_1\\,\\frac{A_1}{A_2}",
        knowns: [
          "A_1 = 0.04\\ \\text{m}^2",
          "A_2 = 0.01\\ \\text{m}^2",
          "v_1 = 2\\ \\text{m/s}",
        ],
        substitution: "v_2 = 2 \\times \\frac{0.04}{0.01} = 2 \\times 4",
        result: "v_2 = 8\\ \\text{m/s}",
        explanation:
          "Conservation of mass for incompressible flow: the same volume per second must pass every cross-section. A smaller area means a higher speed. The fluid speeds up by exactly the ratio of the areas.",
      },
      {
        title: "Apply Bernoulli's Equation to find P₂",
        equation:
          "P_1 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g h_2",
        knowns: [
          "P_1 = 40{,}000\\ \\text{Pa}",
          "v_1 = 2\\ \\text{m/s}",
          "v_2 = 8\\ \\text{m/s}",
          "\\rho_{water} = 1000\\ \\text{kg/m}^3",
          "h_1 = h_2\\ (\\text{horizontal pipe, so }\\rho g h\\text{ terms cancel})",
        ],
        substitution:
          "P_2 = P_1 + \\tfrac{1}{2}\\rho(v_1^2 - v_2^2) = 40{,}000 + \\tfrac{1}{2}(1000)(4 - 64)",
        result: "P_2 = 40{,}000 + 500(-60) = 40{,}000 - 30{,}000 = 10{,}000\\ \\text{Pa}",
        explanation:
          "Bernoulli shows the speed-pressure trade-off: faster flow = lower pressure. This is the Venturi effect. P₂ > 0 (gauge), so the water doesn't cavitate. Always check this — if P_absolute drops below ~2,300 Pa, cavitation occurs.",
      },
    ],
  },
  {
    id: 5,
    topic: "Torricelli's Theorem",
    badgeColor: "bg-green-100 text-green-800",
    title: "Hole in a Water Tank",
    question: (
      <>
        A large open tank of water has a small hole punched in its side,{" "}
        <Tex>{String.raw`h = 4.0\ \text{m}`}</Tex> below the water surface. Both the top of the tank and the
        hole are open to the atmosphere. Find the speed of water exiting the hole. (Assume the tank
        is large so the water level drops negligibly slowly.)
      </>
    ),
    diagram: <TankHoleDiagram />,
    steps: [
      {
        title: "Set up Bernoulli between the surface (point 1) and the hole (point 2)",
        equation:
          "P_1 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g h_2",
        knowns: [
          "P_1 = P_{atm}\\ (\\text{open top})",
          "P_2 = P_{atm}\\ (\\text{open hole})",
          "v_1 \\approx 0\\ (\\text{large tank, surface drops slowly})",
          "h_1 - h_2 = h = 4.0\\ \\text{m}\\ (\\text{take hole as reference }h=0)",
        ],
        substitution:
          "P_{atm} + 0 + \\rho g h = P_{atm} + \\tfrac{1}{2}\\rho v_2^2 + 0",
        result: "\\rho g h = \\tfrac{1}{2}\\rho v_2^2",
        explanation:
          "Both P_atm terms cancel. The v₁ ≈ 0 approximation is valid when the tank's cross-section is much larger than the hole. The height difference is the only driver of flow.",
      },
      {
        title: "Solve for exit velocity (Torricelli's Result)",
        equation: "v_2 = \\sqrt{2gh}",
        knowns: [
          "g = 9.8\\ \\text{m/s}^2",
          "h = 4.0\\ \\text{m}",
        ],
        substitution: "v_2 = \\sqrt{2 \\times 9.8 \\times 4.0} = \\sqrt{78.4}",
        result: "v_2 \\approx 8.85\\ \\text{m/s}",
        explanation:
          "This is Torricelli's theorem: exit speed equals the free-fall speed from height h. It's as if the water 'fell' h meters from the surface to the hole. Units: √[m/s² · m] = √[m²/s²] = m/s. ✓ Reasonableness: ~9 m/s is close to the speed after falling 4 m under gravity.",
      },
    ],
  },
  {
    id: 6,
    topic: "Apparent Weight",
    badgeColor: "bg-rose-100 text-rose-800",
    title: "Object Weighed in Air and Water",
    question: (
      <>
        An object weighs <Tex>{String.raw`W = 9.80\ \text{N}`}</Tex> when weighed in air. When fully submerged
        in water (<Tex>{String.raw`\rho = 1000\ \text{kg/m}^3`}</Tex>), a scale reads{" "}
        <Tex>{String.raw`W_{app} = 7.35\ \text{N}`}</Tex>. Find (a) the buoyant force, (b) the volume of the
        object, and (c) the density of the object.
      </>
    ),
    diagram: <ApparentWeightDiagram />,
    steps: [
      {
        title: "Find the buoyant force from the weight difference",
        equation: "F_b = W_{air} - W_{apparent}",
        knowns: [
          "W_{air} = 9.80\\ \\text{N}",
          "W_{apparent} = 7.35\\ \\text{N}",
        ],
        substitution: "F_b = 9.80 - 7.35",
        result: "F_b = 2.45\\ \\text{N}",
        explanation:
          "The scale reads less in water because the buoyant force partially supports the object. The 'lost' weight is exactly the buoyant force (Archimedes' principle). Think of it as: T + F_b = W, so F_b = W − T.",
      },
      {
        title: "Find the volume of the object using Archimedes' Principle",
        equation: "F_b = \\rho_{fluid}\\,g\\,V \\implies V = \\frac{F_b}{\\rho_{fluid}\\,g}",
        knowns: [
          "F_b = 2.45\\ \\text{N}",
          "\\rho_{water} = 1000\\ \\text{kg/m}^3",
          "g = 9.8\\ \\text{m/s}^2",
        ],
        substitution: "V = \\frac{2.45}{1000 \\times 9.8}",
        result: "V = \\frac{2.45}{9800} = 2.5 \\times 10^{-4}\\ \\text{m}^3 = 250\\ \\text{cm}^3",
        explanation:
          "The buoyant force equals the weight of displaced fluid. Solving for V gives the object's volume regardless of what the object is made of — a clever way to measure volume of irregular shapes.",
      },
      {
        title: "Find the density of the object",
        equation: "\\rho_{obj} = \\frac{m}{V} = \\frac{W/g}{V}",
        knowns: [
          "W = 9.80\\ \\text{N} \\implies m = W/g = 9.80/9.8 = 1.0\\ \\text{kg}",
          "V = 2.5 \\times 10^{-4}\\ \\text{m}^3",
        ],
        substitution: "\\rho_{obj} = \\frac{1.0}{2.5 \\times 10^{-4}}",
        result: "\\rho_{obj} = 4000\\ \\text{kg/m}^3",
        explanation:
          "ρ_object / ρ_water = 4000/1000 = 4.0. Since this ratio > 1, the object sinks (consistent with being fully submerged). This density is close to titanium (~4500 kg/m³). Units: kg/m³. ✓",
      },
    ],
  },
  {
    id: 7,
    topic: "Pressure at Depth",
    badgeColor: "bg-indigo-100 text-indigo-800",
    title: "Pressure on a Submarine Hatch",
    question: (
      <>
        A submarine is at a depth of <Tex>{String.raw`d = 200\ \text{m}`}</Tex> below the ocean surface (
        <Tex>{String.raw`\rho_{seawater} = 1025\ \text{kg/m}^3`}</Tex>,{" "}
        <Tex>{String.raw`P_{atm} = 101{,}325\ \text{Pa}`}</Tex>). Find (a) the absolute pressure at this depth
        and (b) the net force on a circular hatch of diameter <Tex>{String.raw`D = 0.60\ \text{m}`}</Tex> that
        is sealed at this depth (interior is at <Tex>{String.raw`P_{atm}`}</Tex>).
      </>
    ),
    diagram: (
      <svg viewBox="0 0 200 160" className="w-full max-w-xs mx-auto" aria-label="Submarine depth diagram">
        {/* Ocean */}
        <rect x="0" y="0" width="200" height="160" fill="#bfdbfe" opacity="0.5" />
        {/* Surface */}
        <line x1="0" y1="20" x2="200" y2="20" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="100" y="15" textAnchor="middle" fontSize="10" fill="#1d4ed8">Ocean Surface (P_atm)</text>
        {/* Depth arrow */}
        <line x1="25" y1="20" x2="25" y2="120" stroke="#dc2626" strokeWidth="1.5" />
        <line x1="20" y1="20" x2="30" y2="20" stroke="#dc2626" strokeWidth="1.5" />
        <line x1="20" y1="120" x2="30" y2="120" stroke="#dc2626" strokeWidth="1.5" />
        <text x="12" y="75" fontSize="10" fill="#dc2626">d</text>
        <text x="5" y="85" fontSize="10" fill="#dc2626">=200m</text>
        {/* Submarine */}
        <ellipse cx="120" cy="120" rx="60" ry="25" fill="#475569" />
        <ellipse cx="80" cy="112" rx="10" ry="10" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
        <text x="80" y="115" textAnchor="middle" fontSize="8" fill="white">hatch</text>
        <text x="120" y="148" textAnchor="middle" fontSize="9" fill="#374151">D = 0.60 m</text>
      </svg>
    ),
    steps: [
      {
        title: "Calculate absolute pressure at depth",
        equation: "P = P_{atm} + \\rho\\,g\\,d",
        knowns: [
          "P_{atm} = 101{,}325\\ \\text{Pa}",
          "\\rho = 1025\\ \\text{kg/m}^3",
          "g = 9.8\\ \\text{m/s}^2",
          "d = 200\\ \\text{m}",
        ],
        substitution: "P = 101{,}325 + (1025)(9.8)(200)",
        result: "P = 101{,}325 + 2{,}009{,}000 = 2{,}110{,}325\\ \\text{Pa} \\approx 2.11\\ \\text{MPa}\\ (\\approx 20.8\\ \\text{atm})",
        explanation:
          "For every ~10 m of depth in seawater, pressure increases by roughly 1 atm. At 200 m, we expect ~20 atm plus 1 atm = ~21 atm. Our answer of 20.8 atm is consistent. ✓",
      },
      {
        title: "Calculate area of the hatch",
        equation: "A = \\pi\\left(\\frac{D}{2}\\right)^2 = \\frac{\\pi D^2}{4}",
        knowns: [
          "D = 0.60\\ \\text{m} \\implies r = 0.30\\ \\text{m}",
        ],
        substitution: "A = \\pi(0.30)^2 = \\pi \\times 0.09",
        result: "A = 0.2827\\ \\text{m}^2",
        explanation:
          "The hatch is circular. Always convert diameter to radius for area calculations. Keep extra significant figures to avoid rounding error in the final answer.",
      },
      {
        title: "Calculate net force on the hatch",
        equation: "F_{net} = (P_{outside} - P_{inside}) \\cdot A = P_{gauge} \\cdot A",
        knowns: [
          "P_{outside} = 2{,}110{,}325\\ \\text{Pa}",
          "P_{inside} = P_{atm} = 101{,}325\\ \\text{Pa}",
          "A = 0.2827\\ \\text{m}^2",
        ],
        substitution: "F_{net} = (2{,}110{,}325 - 101{,}325) \\times 0.2827 = 2{,}009{,}000 \\times 0.2827",
        result: "F_{net} \\approx 567{,}943\\ \\text{N} \\approx 568\\ \\text{kN}",
        explanation:
          "Only the pressure difference (gauge pressure) matters for net force because P_atm acts inward. 568 kN ≈ 57,900 kg-force — about the weight of 8 fully loaded pickup trucks pressing on one small hatch. This is why submarines are engineered with such thick hulls.",
      },
    ],
  },
  {
    id: 8,
    topic: "Bernoulli — Lift",
    badgeColor: "bg-teal-100 text-teal-800",
    title: "Lift on an Airplane Wing (Simplified)",
    question: (
      <>
        Air (<Tex>{String.raw`\rho = 1.20\ \text{kg/m}^3`}</Tex>) flows over the top of a wing at{" "}
        <Tex>{String.raw`v_{top} = 85\ \text{m/s}`}</Tex> and under the bottom at{" "}
        <Tex>{String.raw`v_{bot} = 75\ \text{m/s}`}</Tex>. The wing has an area <Tex>{String.raw`A = 30\ \text{m}^2`}</Tex>
        . Assuming the air is at the same height on both sides, find the net upward lift force on
        the wing.
      </>
    ),
    diagram: (
      <svg viewBox="0 0 260 130" className="w-full max-w-sm mx-auto" aria-label="Airplane wing lift diagram">
        {/* Wing cross-section (airfoil shape) */}
        <path d="M20,70 Q80,30 200,65 Q240,70 200,80 Q100,100 20,70 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
        {/* Top flow arrows (faster, curved) */}
        <path d="M10,45 Q100,20 220,55" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowB)" strokeDasharray="6,2" />
        <path d="M10,38 Q100,13 220,48" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowB)" strokeDasharray="6,2" />
        <text x="110" y="18" fontSize="10" fill="#1d4ed8" fontWeight="bold">v_top = 85 m/s (LOWER P)</text>
        {/* Bottom flow arrows (slower) */}
        <path d="M10,92 L220,92" fill="none" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowG)" strokeDasharray="6,2" />
        <path d="M10,100 L220,100" fill="none" stroke="#059669" strokeWidth="1.5" markerEnd="url(#arrowG)" strokeDasharray="6,2" />
        <text x="110" y="115" fontSize="10" fill="#059669" fontWeight="bold">v_bot = 75 m/s (HIGHER P)</text>
        {/* Lift arrow */}
        <line x1="135" y1="70" x2="135" y2="30" stroke="#dc2626" strokeWidth="3" markerEnd="url(#arrowR)" />
        <text x="142" y="52" fontSize="11" fill="#dc2626" fontWeight="bold">LIFT</text>
        <defs>
          <marker id="arrowB" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6" />
          </marker>
          <marker id="arrowG" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#059669" />
          </marker>
          <marker id="arrowR" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626" />
          </marker>
        </defs>
      </svg>
    ),
    steps: [
      {
        title: "Apply Bernoulli to find the pressure difference",
        equation:
          "P_{bot} + \\tfrac{1}{2}\\rho v_{bot}^2 = P_{top} + \\tfrac{1}{2}\\rho v_{top}^2 \\implies \\Delta P = P_{bot} - P_{top} = \\tfrac{1}{2}\\rho(v_{top}^2 - v_{bot}^2)",
        knowns: [
          "\\rho_{air} = 1.20\\ \\text{kg/m}^3",
          "v_{top} = 85\\ \\text{m/s}",
          "v_{bot} = 75\\ \\text{m/s}",
          "\\text{Same height, so }\\rho g h\\text{ terms cancel}",
        ],
        substitution:
          "\\Delta P = \\tfrac{1}{2} \\times 1.20 \\times (85^2 - 75^2) = 0.60 \\times (7225 - 5625)",
        result: "\\Delta P = 0.60 \\times 1600 = 960\\ \\text{Pa}",
        explanation:
          "Faster air over the top → lower pressure on top. The pressure difference creates a net upward force. Note: 85² − 75² = (85+75)(85−75) = 160 × 10 = 1600 — using difference of squares is a useful shortcut.",
      },
      {
        title: "Calculate the lift force",
        equation: "F_{lift} = \\Delta P \\times A",
        knowns: [
          "\\Delta P = 960\\ \\text{Pa}",
          "A = 30\\ \\text{m}^2",
        ],
        substitution: "F_{lift} = 960 \\times 30",
        result: "F_{lift} = 28{,}800\\ \\text{N} \\approx 28.8\\ \\text{kN}",
        explanation:
          "Units: Pa × m² = (N/m²) × m² = N. ✓ 28.8 kN ≈ 2,940 kg-force of lift. This simplified model ignores angle of attack, viscosity, and wing geometry, but illustrates the Bernoulli mechanism. Real lift is more complex.",
      },
    ],
  },
];

// ─── Single Problem Card ───────────────────────────────────────────────────────

interface ProblemCardProps {
  problem: Problem;
}

function ProblemCard({ problem }: ProblemCardProps) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [showDiagram, setShowDiagram] = useState(true);
  const totalSteps = problem.steps.length;
  const allRevealed = revealedSteps >= totalSteps;

  const showNext = () => setRevealedSteps((n) => Math.min(n + 1, totalSteps));
  const showAll = () => setRevealedSteps(totalSteps);
  const reset = () => setRevealedSteps(0);

  return (
    <Card className="w-full shadow-sm border border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Problem {problem.id}</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${problem.badgeColor}`}
            >
              {problem.topic}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {revealedSteps}/{totalSteps} steps
          </span>
        </div>
        <CardTitle className="text-base leading-snug mt-1">{problem.title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-600 mt-1">
          {problem.question}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Diagram */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
          <button
            className="text-xs text-slate-500 hover:text-slate-700 mb-2 underline underline-offset-2"
            onClick={() => setShowDiagram((v) => !v)}
          >
            {showDiagram ? "Hide diagram" : "Show diagram"}
          </button>
          {showDiagram && <div className="mt-1">{problem.diagram}</div>}
        </div>

        {/* Steps */}
        {revealedSteps > 0 && (
          <div className="space-y-3">
            {problem.steps.slice(0, revealedSteps).map((step, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{step.title}</span>
                </div>
                <div className="p-3 space-y-2.5">
                  {/* Equation */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Equation</p>
                    <div className="bg-slate-50 rounded px-2 py-1.5 text-slate-800 border border-slate-100">
                      <Tex display>{step.equation}</Tex>
                    </div>
                  </div>
                  <Separator className="my-1" />
                  {/* Knowns */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Knowns / Given</p>
                    <ul className="space-y-0.5">
                      {step.knowns.map((k, ki) => (
                        <li key={ki} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-slate-400 mt-0.5 shrink-0">→</span>
                          <Tex>{k}</Tex>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator className="my-1" />
                  {/* Substitution */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Substitution</p>
                    <div className="bg-blue-50 rounded px-2 py-1.5 text-blue-900 border border-blue-100">
                      <Tex display>{step.substitution}</Tex>
                    </div>
                  </div>
                  {/* Result */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Result</p>
                    <div className="font-bold bg-emerald-50 rounded px-2 py-1.5 text-emerald-800 border border-emerald-200">
                      <Tex display>{step.result}</Tex>
                    </div>
                  </div>
                  {/* Explanation */}
                  <div className="rounded bg-amber-50 border border-amber-100 px-3 py-2">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Why / Check</p>
                    <p className="text-xs text-amber-900 leading-relaxed">{step.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 pt-1">
          {!allRevealed && (
            <Button size="sm" onClick={showNext} className="bg-slate-800 hover:bg-slate-700 text-white">
              {revealedSteps === 0 ? "Start Solution" : "Show Next Step"}
            </Button>
          )}
          {!allRevealed && revealedSteps > 0 && (
            <Button size="sm" variant="outline" onClick={showAll}>
              Show All Steps
            </Button>
          )}
          {revealedSteps > 0 && (
            <Button size="sm" variant="ghost" onClick={reset} className="text-slate-500 hover:text-slate-700">
              Reset / Hide All
            </Button>
          )}
          {allRevealed && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
              Complete
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function WorkedExamples() {
  const [filter, setFilter] = useState<string>("All");
  const topics = ["All", ...Array.from(new Set(PROBLEMS.map((p) => p.topic)))];

  const visible =
    filter === "All" ? PROBLEMS : PROBLEMS.filter((p) => p.topic === filter);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Worked Examples — AP Physics 1 Fluids
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          FRQ-style problems with step-by-step solutions. Reveal one step at a time to practice,
          or show all at once to review.
        </p>
      </div>

      <Separator />

      {/* Topic filter */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === t
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Problem cards */}
      <div className="space-y-6">
        {visible.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      <p className="text-xs text-center text-slate-400 pt-2">
        {visible.length} problem{visible.length !== 1 ? "s" : ""} shown
        {filter !== "All" && ` · filtered by "${filter}"`}
      </p>
    </div>
  );
}
