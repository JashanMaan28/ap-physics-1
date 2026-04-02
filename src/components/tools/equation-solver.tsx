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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Tex } from "@/components/ui/math";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SolutionStep {
  label: string;
  content: string;
  highlight?: boolean;
}

interface SolveResult {
  steps: SolutionStep[];
  answer: number | null;
  unit: string;
  variable: string;
  error?: string;
}

// ─── Equation Solvers ─────────────────────────────────────────────────────────

/** P = P₀ + ρgh  — Hydrostatic Pressure */
function solveHydrostaticPressure(
  solveFor: string,
  vals: Record<string, string>
): SolveResult {
  const P = parseFloat(vals.P);
  const P0 = parseFloat(vals.P0);
  const rho = parseFloat(vals.rho);
  const g = parseFloat(vals.g);
  const h = parseFloat(vals.h);

  const EQ = "P = P_0 + \\rho g h";

  if (solveFor === "P") {
    if ([P0, rho, g, h].some(isNaN))
      return { steps: [], answer: null, unit: "Pa", variable: "P", error: "Please fill in all known values: P₀, ρ, g, h." };
    const ans = P0 + rho * g * h;
    return {
      variable: "P", unit: "Pa", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₀ = ${vals.P0} Pa,  ρ = ${vals.rho} kg/m³,  g = ${vals.g} m/s²,  h = ${vals.h} m` },
        { label: "Substitute values", content: `P = ${vals.P0} + (${vals.rho})(${vals.g})(${vals.h})` },
        { label: "Solve algebraically", content: `P = ${vals.P0} + ${(rho * g * h).toFixed(4)}` },
        { label: "Final answer", content: `P = ${ans.toFixed(4)} \\text{ Pa}`, highlight: true },
      ],
    };
  }
  if (solveFor === "P0") {
    if ([P, rho, g, h].some(isNaN))
      return { steps: [], answer: null, unit: "Pa", variable: "P₀", error: "Please fill in all known values: P, ρ, g, h." };
    const ans = P - rho * g * h;
    return {
      variable: "P₀", unit: "Pa", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P = ${vals.P} Pa,  ρ = ${vals.rho} kg/m³,  g = ${vals.g} m/s²,  h = ${vals.h} m` },
        { label: "Substitute values", content: `P_0 = P - \\rho g h = ${vals.P} - (${vals.rho})(${vals.g})(${vals.h})` },
        { label: "Solve algebraically", content: `P_0 = ${vals.P} - ${(rho * g * h).toFixed(4)}` },
        { label: "Final answer", content: `P_0 = ${ans.toFixed(4)} \\text{ Pa}`, highlight: true },
      ],
    };
  }
  if (solveFor === "rho") {
    if ([P, P0, g, h].some(isNaN))
      return { steps: [], answer: null, unit: "kg/m³", variable: "ρ", error: "Please fill in all known values: P, P₀, g, h." };
    if (g * h === 0) return { steps: [], answer: null, unit: "kg/m³", variable: "ρ", error: "g × h cannot be zero." };
    const ans = (P - P0) / (g * h);
    return {
      variable: "ρ", unit: "kg/m³", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P = ${vals.P} Pa,  P₀ = ${vals.P0} Pa,  g = ${vals.g} m/s²,  h = ${vals.h} m` },
        { label: "Substitute values", content: `\\rho = \\frac{P - P_0}{gh} = \\frac{${vals.P} - ${vals.P0}}{(${vals.g})(${vals.h})}` },
        { label: "Solve algebraically", content: `\\rho = \\frac{${(P - P0).toFixed(4)}}{${(g * h).toFixed(4)}}` },
        { label: "Final answer", content: `\\rho = ${ans.toFixed(4)} \\text{ kg/m}^3`, highlight: true },
      ],
    };
  }
  if (solveFor === "h") {
    if ([P, P0, rho, g].some(isNaN))
      return { steps: [], answer: null, unit: "m", variable: "h", error: "Please fill in all known values: P, P₀, ρ, g." };
    if (rho * g === 0) return { steps: [], answer: null, unit: "m", variable: "h", error: "ρ × g cannot be zero." };
    const ans = (P - P0) / (rho * g);
    return {
      variable: "h", unit: "m", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P = ${vals.P} Pa,  P₀ = ${vals.P0} Pa,  ρ = ${vals.rho} kg/m³,  g = ${vals.g} m/s²` },
        { label: "Substitute values", content: `h = \\frac{P - P_0}{\\rho g} = \\frac{${vals.P} - ${vals.P0}}{(${vals.rho})(${vals.g})}` },
        { label: "Solve algebraically", content: `h = \\frac{${(P - P0).toFixed(4)}}{${(rho * g).toFixed(4)}}` },
        { label: "Final answer", content: `h = ${ans.toFixed(4)} \\text{ m}`, highlight: true },
      ],
    };
  }
  return { steps: [], answer: null, unit: "", variable: "", error: "Unknown variable selection." };
}

/** F₁/A₁ = F₂/A₂  — Pascal's Law */
function solvePascal(solveFor: string, vals: Record<string, string>): SolveResult {
  const F1 = parseFloat(vals.F1);
  const A1 = parseFloat(vals.A1);
  const F2 = parseFloat(vals.F2);
  const A2 = parseFloat(vals.A2);
  const EQ = "\\frac{F_1}{A_1} = \\frac{F_2}{A_2}";

  if (solveFor === "F1") {
    if ([A1, F2, A2].some(isNaN))
      return { steps: [], answer: null, unit: "N", variable: "F₁", error: "Please fill in A₁, F₂, A₂." };
    if (A2 === 0) return { steps: [], answer: null, unit: "N", variable: "F₁", error: "A₂ cannot be zero." };
    const ans = (F2 * A1) / A2;
    return {
      variable: "F₁", unit: "N", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `A₁ = ${vals.A1} m²,  F₂ = ${vals.F2} N,  A₂ = ${vals.A2} m²` },
        { label: "Substitute values", content: `F_1 = F_2 \\cdot \\frac{A_1}{A_2} = ${vals.F2} \\cdot \\frac{${vals.A1}}{${vals.A2}}` },
        { label: "Solve algebraically", content: `F_1 = ${vals.F2} \\times ${(A1 / A2).toFixed(6)}` },
        { label: "Final answer", content: `F_1 = ${ans.toFixed(4)} \\text{ N}`, highlight: true },
      ],
    };
  }
  if (solveFor === "A1") {
    if ([F1, F2, A2].some(isNaN))
      return { steps: [], answer: null, unit: "m²", variable: "A₁", error: "Please fill in F₁, F₂, A₂." };
    if (F2 === 0) return { steps: [], answer: null, unit: "m²", variable: "A₁", error: "F₂ cannot be zero." };
    const ans = (F1 * A2) / F2;
    return {
      variable: "A₁", unit: "m²", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `F₁ = ${vals.F1} N,  F₂ = ${vals.F2} N,  A₂ = ${vals.A2} m²` },
        { label: "Substitute values", content: `A_1 = F_1 \\cdot \\frac{A_2}{F_2} = ${vals.F1} \\cdot \\frac{${vals.A2}}{${vals.F2}}` },
        { label: "Solve algebraically", content: `A_1 = ${vals.F1} \\times ${(A2 / F2).toFixed(6)}` },
        { label: "Final answer", content: `A_1 = ${ans.toFixed(6)} \\text{ m}^2`, highlight: true },
      ],
    };
  }
  if (solveFor === "F2") {
    if ([F1, A1, A2].some(isNaN))
      return { steps: [], answer: null, unit: "N", variable: "F₂", error: "Please fill in F₁, A₁, A₂." };
    if (A1 === 0) return { steps: [], answer: null, unit: "N", variable: "F₂", error: "A₁ cannot be zero." };
    const ans = (F1 * A2) / A1;
    return {
      variable: "F₂", unit: "N", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `F₁ = ${vals.F1} N,  A₁ = ${vals.A1} m²,  A₂ = ${vals.A2} m²` },
        { label: "Substitute values", content: `F_2 = F_1 \\cdot \\frac{A_2}{A_1} = ${vals.F1} \\cdot \\frac{${vals.A2}}{${vals.A1}}` },
        { label: "Solve algebraically", content: `F_2 = ${vals.F1} \\times ${(A2 / A1).toFixed(6)}` },
        { label: "Final answer", content: `F_2 = ${ans.toFixed(4)} \\text{ N}`, highlight: true },
      ],
    };
  }
  if (solveFor === "A2") {
    if ([F1, A1, F2].some(isNaN))
      return { steps: [], answer: null, unit: "m²", variable: "A₂", error: "Please fill in F₁, A₁, F₂." };
    if (F1 === 0) return { steps: [], answer: null, unit: "m²", variable: "A₂", error: "F₁ cannot be zero." };
    const ans = (F2 * A1) / F1;
    return {
      variable: "A₂", unit: "m²", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `F₁ = ${vals.F1} N,  A₁ = ${vals.A1} m²,  F₂ = ${vals.F2} N` },
        { label: "Substitute values", content: `A_2 = F_2 \\cdot \\frac{A_1}{F_1} = ${vals.F2} \\cdot \\frac{${vals.A1}}{${vals.F1}}` },
        { label: "Solve algebraically", content: `A_2 = ${vals.F2} \\times ${(A1 / F1).toFixed(6)}` },
        { label: "Final answer", content: `A_2 = ${ans.toFixed(6)} \\text{ m}^2`, highlight: true },
      ],
    };
  }
  return { steps: [], answer: null, unit: "", variable: "", error: "Unknown variable." };
}

/** Fb = ρVg  — Buoyancy */
function solveBuoyancy(solveFor: string, vals: Record<string, string>): SolveResult {
  const Fb = parseFloat(vals.Fb);
  const rho = parseFloat(vals.rho);
  const V = parseFloat(vals.V);
  const g = parseFloat(vals.g);
  const EQ = "F_b = \\rho_{fluid} \\cdot V_{displaced} \\cdot g";

  if (solveFor === "Fb") {
    if ([rho, V, g].some(isNaN))
      return { steps: [], answer: null, unit: "N", variable: "F_b", error: "Please fill in ρ, V, g." };
    const ans = rho * V * g;
    return {
      variable: "F_b", unit: "N", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `ρ = ${vals.rho} kg/m³,  V = ${vals.V} m³,  g = ${vals.g} m/s²` },
        { label: "Substitute values", content: `F_b = (${vals.rho})(${vals.V})(${vals.g})` },
        { label: "Solve algebraically", content: `F_b = ${(rho * V).toFixed(6)} \\times ${vals.g}` },
        { label: "Final answer", content: `F_b = ${ans.toFixed(4)} \\text{ N}`, highlight: true },
      ],
    };
  }
  if (solveFor === "rho") {
    if ([Fb, V, g].some(isNaN))
      return { steps: [], answer: null, unit: "kg/m³", variable: "ρ", error: "Please fill in F_b, V, g." };
    if (V * g === 0) return { steps: [], answer: null, unit: "kg/m³", variable: "ρ", error: "V × g cannot be zero." };
    const ans = Fb / (V * g);
    return {
      variable: "ρ", unit: "kg/m³", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `F_b = ${vals.Fb} N,  V = ${vals.V} m³,  g = ${vals.g} m/s²` },
        { label: "Substitute values", content: `\\rho = \\frac{F_b}{Vg} = \\frac{${vals.Fb}}{(${vals.V})(${vals.g})}` },
        { label: "Solve algebraically", content: `\\rho = \\frac{${vals.Fb}}{${(V * g).toFixed(6)}}` },
        { label: "Final answer", content: `\\rho = ${ans.toFixed(4)} \\text{ kg/m}^3`, highlight: true },
      ],
    };
  }
  if (solveFor === "V") {
    if ([Fb, rho, g].some(isNaN))
      return { steps: [], answer: null, unit: "m³", variable: "V", error: "Please fill in F_b, ρ, g." };
    if (rho * g === 0) return { steps: [], answer: null, unit: "m³", variable: "V", error: "ρ × g cannot be zero." };
    const ans = Fb / (rho * g);
    return {
      variable: "V", unit: "m³", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `F_b = ${vals.Fb} N,  ρ = ${vals.rho} kg/m³,  g = ${vals.g} m/s²` },
        { label: "Substitute values", content: `V = \\frac{F_b}{\\rho g} = \\frac{${vals.Fb}}{(${vals.rho})(${vals.g})}` },
        { label: "Solve algebraically", content: `V = \\frac{${vals.Fb}}{${(rho * g).toFixed(4)}}` },
        { label: "Final answer", content: `V = ${ans.toFixed(6)} \\text{ m}^3`, highlight: true },
      ],
    };
  }
  return { steps: [], answer: null, unit: "", variable: "", error: "Unknown variable." };
}

/** A₁v₁ = A₂v₂  — Continuity */
function solveContinuity(solveFor: string, vals: Record<string, string>): SolveResult {
  const A1 = parseFloat(vals.A1);
  const v1 = parseFloat(vals.v1);
  const A2 = parseFloat(vals.A2);
  const v2 = parseFloat(vals.v2);
  const EQ = "A_1 v_1 = A_2 v_2";

  if (solveFor === "A1") {
    if ([v1, A2, v2].some(isNaN))
      return { steps: [], answer: null, unit: "m²", variable: "A₁", error: "Please fill in v₁, A₂, v₂." };
    if (v1 === 0) return { steps: [], answer: null, unit: "m²", variable: "A₁", error: "v₁ cannot be zero." };
    const ans = (A2 * v2) / v1;
    return {
      variable: "A₁", unit: "m²", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `v₁ = ${vals.v1} m/s,  A₂ = ${vals.A2} m²,  v₂ = ${vals.v2} m/s` },
        { label: "Substitute values", content: `A_1 = \\frac{A_2 \\cdot v_2}{v_1} = \\frac{${vals.A2} \\times ${vals.v2}}{${vals.v1}}` },
        { label: "Solve algebraically", content: `A_1 = \\frac{${(A2 * v2).toFixed(6)}}{${vals.v1}}` },
        { label: "Final answer", content: `A_1 = ${ans.toFixed(6)} \\text{ m}^2`, highlight: true },
      ],
    };
  }
  if (solveFor === "v1") {
    if ([A1, A2, v2].some(isNaN))
      return { steps: [], answer: null, unit: "m/s", variable: "v₁", error: "Please fill in A₁, A₂, v₂." };
    if (A1 === 0) return { steps: [], answer: null, unit: "m/s", variable: "v₁", error: "A₁ cannot be zero." };
    const ans = (A2 * v2) / A1;
    return {
      variable: "v₁", unit: "m/s", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `A₁ = ${vals.A1} m²,  A₂ = ${vals.A2} m²,  v₂ = ${vals.v2} m/s` },
        { label: "Substitute values", content: `v_1 = \\frac{A_2 \\cdot v_2}{A_1} = \\frac{${vals.A2} \\times ${vals.v2}}{${vals.A1}}` },
        { label: "Solve algebraically", content: `v_1 = \\frac{${(A2 * v2).toFixed(6)}}{${vals.A1}}` },
        { label: "Final answer", content: `v_1 = ${ans.toFixed(4)} \\text{ m/s}`, highlight: true },
      ],
    };
  }
  if (solveFor === "A2") {
    if ([A1, v1, v2].some(isNaN))
      return { steps: [], answer: null, unit: "m²", variable: "A₂", error: "Please fill in A₁, v₁, v₂." };
    if (v2 === 0) return { steps: [], answer: null, unit: "m²", variable: "A₂", error: "v₂ cannot be zero." };
    const ans = (A1 * v1) / v2;
    return {
      variable: "A₂", unit: "m²", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `A₁ = ${vals.A1} m²,  v₁ = ${vals.v1} m/s,  v₂ = ${vals.v2} m/s` },
        { label: "Substitute values", content: `A_2 = \\frac{A_1 \\cdot v_1}{v_2} = \\frac{${vals.A1} \\times ${vals.v1}}{${vals.v2}}` },
        { label: "Solve algebraically", content: `A_2 = \\frac{${(A1 * v1).toFixed(6)}}{${vals.v2}}` },
        { label: "Final answer", content: `A_2 = ${ans.toFixed(6)} \\text{ m}^2`, highlight: true },
      ],
    };
  }
  if (solveFor === "v2") {
    if ([A1, v1, A2].some(isNaN))
      return { steps: [], answer: null, unit: "m/s", variable: "v₂", error: "Please fill in A₁, v₁, A₂." };
    if (A2 === 0) return { steps: [], answer: null, unit: "m/s", variable: "v₂", error: "A₂ cannot be zero." };
    const ans = (A1 * v1) / A2;
    return {
      variable: "v₂", unit: "m/s", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `A₁ = ${vals.A1} m²,  v₁ = ${vals.v1} m/s,  A₂ = ${vals.A2} m²` },
        { label: "Substitute values", content: `v_2 = \\frac{A_1 \\cdot v_1}{A_2} = \\frac{${vals.A1} \\times ${vals.v1}}{${vals.A2}}` },
        { label: "Solve algebraically", content: `v_2 = \\frac{${(A1 * v1).toFixed(6)}}{${vals.A2}}` },
        { label: "Final answer", content: `v_2 = ${ans.toFixed(4)} \\text{ m/s}`, highlight: true },
      ],
    };
  }
  return { steps: [], answer: null, unit: "", variable: "", error: "Unknown variable." };
}

/** P + ½ρv² + ρgh = const  — Bernoulli (between two points) */
function solveBernoulli(solveFor: string, vals: Record<string, string>): SolveResult {
  const P1 = parseFloat(vals.P1);
  const rho = parseFloat(vals.rho);
  const v1 = parseFloat(vals.v1);
  const g = parseFloat(vals.g);
  const h1 = parseFloat(vals.h1);
  const P2 = parseFloat(vals.P2);
  const v2 = parseFloat(vals.v2);
  const h2 = parseFloat(vals.h2);
  const EQ = "P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2";

  if (solveFor === "P1") {
    if ([rho, v1, g, h1, P2, v2, h2].some(isNaN))
      return { steps: [], answer: null, unit: "Pa", variable: "P₁", error: "Please fill in all other variables." };
    const ans = P2 + 0.5 * rho * v2 * v2 + rho * g * h2 - 0.5 * rho * v1 * v1 - rho * g * h1;
    const lhs2 = P2 + 0.5 * rho * v2 * v2 + rho * g * h2;
    const sub1 = 0.5 * rho * v1 * v1 + rho * g * h1;
    return {
      variable: "P₁", unit: "Pa", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `ρ=${vals.rho} kg/m³,  v₁=${vals.v1} m/s,  h₁=${vals.h1} m,  P₂=${vals.P2} Pa,  v₂=${vals.v2} m/s,  h₂=${vals.h2} m,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `P_1 = P_2 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g h_2 - \\tfrac{1}{2}\\rho v_1^2 - \\rho g h_1` },
        { label: "Solve algebraically", content: `P_1 = ${lhs2.toFixed(4)} - ${sub1.toFixed(4)}` },
        { label: "Final answer", content: `P_1 = ${ans.toFixed(4)} \\text{ Pa}`, highlight: true },
      ],
    };
  }
  if (solveFor === "P2") {
    if ([P1, rho, v1, g, h1, v2, h2].some(isNaN))
      return { steps: [], answer: null, unit: "Pa", variable: "P₂", error: "Please fill in all other variables." };
    const ans = P1 + 0.5 * rho * v1 * v1 + rho * g * h1 - 0.5 * rho * v2 * v2 - rho * g * h2;
    const lhs1 = P1 + 0.5 * rho * v1 * v1 + rho * g * h1;
    const sub2 = 0.5 * rho * v2 * v2 + rho * g * h2;
    return {
      variable: "P₂", unit: "Pa", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₁=${vals.P1} Pa,  ρ=${vals.rho} kg/m³,  v₁=${vals.v1} m/s,  h₁=${vals.h1} m,  v₂=${vals.v2} m/s,  h₂=${vals.h2} m,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `P_2 = P_1 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g h_1 - \\tfrac{1}{2}\\rho v_2^2 - \\rho g h_2` },
        { label: "Solve algebraically", content: `P_2 = ${lhs1.toFixed(4)} - ${sub2.toFixed(4)}` },
        { label: "Final answer", content: `P_2 = ${ans.toFixed(4)} \\text{ Pa}`, highlight: true },
      ],
    };
  }
  if (solveFor === "v1") {
    if ([P1, rho, g, h1, P2, v2, h2].some(isNaN))
      return { steps: [], answer: null, unit: "m/s", variable: "v₁", error: "Please fill in all other variables." };
    const inner = (2 / rho) * (P2 - P1 + 0.5 * rho * v2 * v2 + rho * g * (h2 - h1));
    if (inner < 0) return { steps: [], answer: null, unit: "m/s", variable: "v₁", error: "No real solution — check your inputs (expression under square root is negative)." };
    const ans = Math.sqrt(inner);
    return {
      variable: "v₁", unit: "m/s", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₁=${vals.P1} Pa,  ρ=${vals.rho} kg/m³,  h₁=${vals.h1} m,  P₂=${vals.P2} Pa,  v₂=${vals.v2} m/s,  h₂=${vals.h2} m,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `\\tfrac{1}{2}\\rho v_1^2 = P_2 - P_1 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g(h_2 - h_1) \\implies v_1 = \\sqrt{\\frac{2}{\\rho}\\left(P_2 - P_1 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g(h_2 - h_1)\\right)}` },
        { label: "Solve algebraically", content: `v_1 = \\sqrt{${inner.toFixed(6)}}` },
        { label: "Final answer", content: `v_1 = ${ans.toFixed(4)} \\text{ m/s}`, highlight: true },
      ],
    };
  }
  if (solveFor === "v2") {
    if ([P1, rho, v1, g, h1, P2, h2].some(isNaN))
      return { steps: [], answer: null, unit: "m/s", variable: "v₂", error: "Please fill in all other variables." };
    const inner = (2 / rho) * (P1 - P2 + 0.5 * rho * v1 * v1 + rho * g * (h1 - h2));
    if (inner < 0) return { steps: [], answer: null, unit: "m/s", variable: "v₂", error: "No real solution — check your inputs (expression under square root is negative)." };
    const ans = Math.sqrt(inner);
    return {
      variable: "v₂", unit: "m/s", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₁=${vals.P1} Pa,  ρ=${vals.rho} kg/m³,  v₁=${vals.v1} m/s,  h₁=${vals.h1} m,  P₂=${vals.P2} Pa,  h₂=${vals.h2} m,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `\\tfrac{1}{2}\\rho v_2^2 = P_1 - P_2 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g(h_1 - h_2) \\implies v_2 = \\sqrt{\\frac{2}{\\rho}\\left(P_1 - P_2 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g(h_1 - h_2)\\right)}` },
        { label: "Solve algebraically", content: `v_2 = \\sqrt{${inner.toFixed(6)}}` },
        { label: "Final answer", content: `v_2 = ${ans.toFixed(4)} \\text{ m/s}`, highlight: true },
      ],
    };
  }
  if (solveFor === "h1") {
    if ([P1, rho, v1, g, P2, v2, h2].some(isNaN))
      return { steps: [], answer: null, unit: "m", variable: "h₁", error: "Please fill in all other variables." };
    if (rho * g === 0) return { steps: [], answer: null, unit: "m", variable: "h₁", error: "ρ × g cannot be zero." };
    const ans = (P2 - P1 + 0.5 * rho * (v2 * v2 - v1 * v1) + rho * g * h2) / (rho * g);
    return {
      variable: "h₁", unit: "m", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₁=${vals.P1} Pa,  ρ=${vals.rho} kg/m³,  v₁=${vals.v1} m/s,  P₂=${vals.P2} Pa,  v₂=${vals.v2} m/s,  h₂=${vals.h2} m,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `\\rho g h_1 = P_2 - P_1 + \\tfrac{1}{2}\\rho(v_2^2 - v_1^2) + \\rho g h_2 \\implies h_1 = \\frac{P_2 - P_1 + \\tfrac{1}{2}\\rho(v_2^2 - v_1^2) + \\rho g h_2}{\\rho g}` },
        { label: "Solve algebraically", content: `h_1 = \\frac{${(P2 - P1 + 0.5 * rho * (v2 * v2 - v1 * v1) + rho * g * h2).toFixed(4)}}{${(rho * g).toFixed(4)}}` },
        { label: "Final answer", content: `h_1 = ${ans.toFixed(4)} \\text{ m}`, highlight: true },
      ],
    };
  }
  if (solveFor === "h2") {
    if ([P1, rho, v1, g, h1, P2, v2].some(isNaN))
      return { steps: [], answer: null, unit: "m", variable: "h₂", error: "Please fill in all other variables." };
    if (rho * g === 0) return { steps: [], answer: null, unit: "m", variable: "h₂", error: "ρ × g cannot be zero." };
    const ans = (P1 - P2 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * h1) / (rho * g);
    return {
      variable: "h₂", unit: "m", answer: ans,
      steps: [
        { label: "Write the equation", content: EQ },
        { label: "Identify knowns", content: `P₁=${vals.P1} Pa,  ρ=${vals.rho} kg/m³,  v₁=${vals.v1} m/s,  h₁=${vals.h1} m,  P₂=${vals.P2} Pa,  v₂=${vals.v2} m/s,  g=${vals.g} m/s²` },
        { label: "Substitute values", content: `\\rho g h_2 = P_1 - P_2 + \\tfrac{1}{2}\\rho(v_1^2 - v_2^2) + \\rho g h_1 \\implies h_2 = \\frac{P_1 - P_2 + \\tfrac{1}{2}\\rho(v_1^2 - v_2^2) + \\rho g h_1}{\\rho g}` },
        { label: "Solve algebraically", content: `h_2 = \\frac{${(P1 - P2 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * h1).toFixed(4)}}{${(rho * g).toFixed(4)}}` },
        { label: "Final answer", content: `h_2 = ${ans.toFixed(4)} \\text{ m}`, highlight: true },
      ],
    };
  }
  return { steps: [], answer: null, unit: "", variable: "", error: "Unknown variable." };
}

// ─── Sub-component: Step Panel ────────────────────────────────────────────────

function StepPanel({ result }: { result: SolveResult | null }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 mt-4">
        <p className="text-sm text-destructive font-medium">{result.error}</p>
      </div>
    );
  }

  const stepIcons = ["①", "②", "③", "④", "⑤"];

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Step-by-Step Solution
        </span>
        <div className="flex-1 h-px bg-border" />
        <Badge variant="secondary" className="font-mono text-xs">
          AP Rubric Format
        </Badge>
      </div>

      {result.steps.map((step, i) => (
        <div
          key={i}
          className={
            step.highlight
              ? "key-concept flex gap-3 items-start border-primary/40 bg-primary/10"
              : "flex gap-3 items-start rounded-lg border border-border/60 bg-muted/30 p-4"
          }
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="text-lg leading-none mt-0.5 text-primary select-none shrink-0">
            {stepIcons[i]}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide uppercase">
              {step.label}
            </p>
            {step.label === "Identify knowns" ? (
              <p
                className={`font-mono text-sm break-words ${
                  step.highlight ? "text-primary font-bold text-base" : "text-foreground"
                }`}
              >
                {step.content}
              </p>
            ) : (
              <div
                className={`text-sm break-words ${
                  step.highlight ? "text-primary font-bold text-base" : "text-foreground"
                }`}
              >
                <Tex display>{step.content}</Tex>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  id,
  label,
  unit,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className={`text-sm font-medium font-mono ${disabled ? "text-muted-foreground/50" : ""}`}
      >
        {label}
      </Label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? "enter value"}
          className={`w-full rounded-lg border px-3 py-2 pr-14 text-sm font-mono bg-background transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
            disabled:opacity-30 disabled:cursor-not-allowed
            ${disabled ? "border-border/40 bg-muted/20" : "border-border hover:border-primary/40"}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── Equation Panels ──────────────────────────────────────────────────────────

function HydrostaticPanel() {
  const [solveFor, setSolveFor] = useState("P");
  const [vals, setVals] = useState<Record<string, string>>({ P: "", P0: "", rho: "", g: "9.8", h: "" });
  const [result, setResult] = useState<SolveResult | null>(null);

  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const fields: { key: string; label: string; unit: string }[] = [
    { key: "P", label: "P  (pressure)", unit: "Pa" },
    { key: "P0", label: "P₀ (surface pressure)", unit: "Pa" },
    { key: "rho", label: "ρ  (fluid density)", unit: "kg/m³" },
    { key: "g", label: "g  (gravity)", unit: "m/s²" },
    { key: "h", label: "h  (depth)", unit: "m" },
  ];

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>P = P_0 + \rho g h</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Pressure at depth <Tex>h</Tex> in a static fluid equals surface pressure plus the weight per unit area of fluid above.
        </p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Solve for</Label>
        <select
          value={solveFor}
          onChange={(e) => { setSolveFor(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="P">P — pressure at depth</option>
          <option value="P0">P₀ — surface pressure</option>
          <option value="rho">ρ — fluid density</option>
          <option value="h">h — depth</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {fields.filter((f) => f.key !== solveFor).map((f) => (
          <Field key={f.key} id={`hp-${f.key}`} label={f.label} unit={f.unit} value={vals[f.key]} onChange={set(f.key)} />
        ))}
      </div>

      <Button onClick={() => setResult(solveHydrostaticPressure(solveFor, vals))} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

function PascalPanel() {
  const [solveFor, setSolveFor] = useState("F2");
  const [vals, setVals] = useState<Record<string, string>>({ F1: "", A1: "", F2: "", A2: "" });
  const [result, setResult] = useState<SolveResult | null>(null);
  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "F1", label: "F₁ (input force)", unit: "N" },
    { key: "A1", label: "A₁ (input area)", unit: "m²" },
    { key: "F2", label: "F₂ (output force)", unit: "N" },
    { key: "A2", label: "A₂ (output area)", unit: "m²" },
  ];

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>{`\\frac{F_1}{A_1} = \\frac{F_2}{A_2}`}</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Pressure transmitted through an enclosed fluid is equal at all points — the basis of hydraulic systems.
        </p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Solve for</Label>
        <select
          value={solveFor}
          onChange={(e) => { setSolveFor(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {fields.filter((f) => f.key !== solveFor).map((f) => (
          <Field key={f.key} id={`pa-${f.key}`} label={f.label} unit={f.unit} value={vals[f.key]} onChange={set(f.key)} />
        ))}
      </div>

      <Button onClick={() => setResult(solvePascal(solveFor, vals))} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

function BuoyancyPanel() {
  const [solveFor, setSolveFor] = useState("Fb");
  const [vals, setVals] = useState<Record<string, string>>({ Fb: "", rho: "", V: "", g: "9.8" });
  const [result, setResult] = useState<SolveResult | null>(null);
  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "Fb", label: "F_b (buoyant force)", unit: "N" },
    { key: "rho", label: "ρ (fluid density)", unit: "kg/m³" },
    { key: "V", label: "V (displaced volume)", unit: "m³" },
    { key: "g", label: "g (gravity)", unit: "m/s²" },
  ];

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>{String.raw`F_b = \rho_{fluid} \cdot V_{displaced} \cdot g`}</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Archimedes' Principle: buoyant force equals the weight of displaced fluid.
        </p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Solve for</Label>
        <select
          value={solveFor}
          onChange={(e) => { setSolveFor(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="Fb">F_b — buoyant force</option>
          <option value="rho">ρ — fluid density</option>
          <option value="V">V — displaced volume</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {fields.filter((f) => f.key !== solveFor).map((f) => (
          <Field key={f.key} id={`bu-${f.key}`} label={f.label} unit={f.unit} value={vals[f.key]} onChange={set(f.key)} />
        ))}
      </div>

      <Button onClick={() => setResult(solveBuoyancy(solveFor, vals))} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

function ContinuityPanel() {
  const [solveFor, setSolveFor] = useState("v2");
  const [vals, setVals] = useState<Record<string, string>>({ A1: "", v1: "", A2: "", v2: "" });
  const [result, setResult] = useState<SolveResult | null>(null);
  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "A1", label: "A₁ (inlet area)", unit: "m²" },
    { key: "v1", label: "v₁ (inlet velocity)", unit: "m/s" },
    { key: "A2", label: "A₂ (outlet area)", unit: "m²" },
    { key: "v2", label: "v₂ (outlet velocity)", unit: "m/s" },
  ];

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>A_1 v_1 = A_2 v_2</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Conservation of mass for incompressible flow: volume flow rate is constant throughout a pipe.
        </p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Solve for</Label>
        <select
          value={solveFor}
          onChange={(e) => { setSolveFor(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {fields.filter((f) => f.key !== solveFor).map((f) => (
          <Field key={f.key} id={`co-${f.key}`} label={f.label} unit={f.unit} value={vals[f.key]} onChange={set(f.key)} />
        ))}
      </div>

      <Button onClick={() => setResult(solveContinuity(solveFor, vals))} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

function BernoulliPanel() {
  const [solveFor, setSolveFor] = useState("P2");
  const [vals, setVals] = useState<Record<string, string>>({
    P1: "", rho: "", v1: "", g: "9.8", h1: "",
    P2: "", v2: "", h2: "",
  });
  const [result, setResult] = useState<SolveResult | null>(null);
  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const allFields = [
    { key: "P1", label: "P₁ (pressure, pt 1)", unit: "Pa" },
    { key: "rho", label: "ρ (fluid density)", unit: "kg/m³" },
    { key: "v1", label: "v₁ (velocity, pt 1)", unit: "m/s" },
    { key: "g", label: "g (gravity)", unit: "m/s²" },
    { key: "h1", label: "h₁ (height, pt 1)", unit: "m" },
    { key: "P2", label: "P₂ (pressure, pt 2)", unit: "Pa" },
    { key: "v2", label: "v₂ (velocity, pt 2)", unit: "m/s" },
    { key: "h2", label: "h₂ (height, pt 2)", unit: "m" },
  ];

  const solveOptions = [
    { value: "P1", label: "P₁ — pressure at point 1" },
    { value: "P2", label: "P₂ — pressure at point 2" },
    { value: "v1", label: "v₁ — velocity at point 1" },
    { value: "v2", label: "v₂ — velocity at point 2" },
    { value: "h1", label: "h₁ — height at point 1" },
    { value: "h2", label: "h₂ — height at point 2" },
  ];

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>{`P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2`}</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Conservation of energy for steady, incompressible, non-viscous flow along a streamline.
        </p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Solve for</Label>
        <select
          value={solveFor}
          onChange={(e) => { setSolveFor(e.target.value); setResult(null); }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {solveOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {allFields.filter((f) => f.key !== solveFor).map((f) => (
          <Field key={f.key} id={`be-${f.key}`} label={f.label} unit={f.unit} value={vals[f.key]} onChange={set(f.key)} />
        ))}
      </div>

      <Button onClick={() => setResult(solveBernoulli(solveFor, vals))} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function EquationSolver() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="font-mono text-xs tracking-wider">AP Physics 1</Badge>
          <Badge variant="secondary" className="font-mono text-xs">Fluids</Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Equation Solver</h1>
        <p className="text-sm text-muted-foreground">
          Select an equation, enter known values, and get a step-by-step solution in AP exam format.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Equation Tabs */}
      <Tabs defaultValue="hydrostatic">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 p-1 bg-muted/40 rounded-xl">
          <TabsTrigger value="hydrostatic" className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            P=P₀+ρgh
          </TabsTrigger>
          <TabsTrigger value="pascal" className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            F₁/A₁=F₂/A₂
          </TabsTrigger>
          <TabsTrigger value="buoyancy" className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            F_b=ρVg
          </TabsTrigger>
          <TabsTrigger value="continuity" className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            A₁v₁=A₂v₂
          </TabsTrigger>
          <TabsTrigger value="bernoulli" className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Bernoulli
          </TabsTrigger>
        </TabsList>

        <Card className="border-border/60 shadow-sm">
          <TabsContent value="hydrostatic" className="mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hydrostatic Pressure</CardTitle>
              <CardDescription>Pressure in a static fluid column</CardDescription>
            </CardHeader>
            <CardContent>
              <HydrostaticPanel />
            </CardContent>
          </TabsContent>

          <TabsContent value="pascal" className="mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pascal&apos;s Law</CardTitle>
              <CardDescription>Hydraulic force transmission through enclosed fluid</CardDescription>
            </CardHeader>
            <CardContent>
              <PascalPanel />
            </CardContent>
          </TabsContent>

          <TabsContent value="buoyancy" className="mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Buoyancy — Archimedes&apos; Principle</CardTitle>
              <CardDescription>Upward force on a submerged or floating object</CardDescription>
            </CardHeader>
            <CardContent>
              <BuoyancyPanel />
            </CardContent>
          </TabsContent>

          <TabsContent value="continuity" className="mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Continuity Equation</CardTitle>
              <CardDescription>Conservation of mass for incompressible flow</CardDescription>
            </CardHeader>
            <CardContent>
              <ContinuityPanel />
            </CardContent>
          </TabsContent>

          <TabsContent value="bernoulli" className="mt-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bernoulli&apos;s Equation</CardTitle>
              <CardDescription>Energy conservation for ideal fluid flow between two points</CardDescription>
            </CardHeader>
            <CardContent>
              <BernoulliPanel />
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>

      {/* Reference Footer */}
      <div className="mt-6 rounded-xl border border-border/40 bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Reference</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground font-mono">
          <span>ρ_water = 1000 kg/m³</span>
          <span>g = 9.8 m/s²  (AP standard)</span>
          <span>1 atm = 101,325 Pa</span>
          <span>P_gauge = P_abs − P_atm</span>
        </div>
      </div>
    </div>
  );
}
