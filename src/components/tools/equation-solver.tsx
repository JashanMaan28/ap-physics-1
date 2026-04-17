"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
  isMath?: boolean;
  highlight?: boolean;
}

interface SolveResult {
  steps: SolutionStep[];
  answer: number | null;
  unit: string;
  variable: string;
  error?: string;
}

interface VariableDef {
  key: string;
  label: string;
  unit: string;
  defaultValue?: string;
  solvable?: boolean;
}

interface SolverOutput {
  value: number;
  symbol: string;
  unit: string;
  /** LaTeX expression showing rearranged symbolic form. */
  symbolic: string;
  /** LaTeX expression with numbers substituted. */
  numeric: string;
  /** LaTeX expression showing arithmetic intermediate. */
  intermediate?: string;
  error?: string;
}

interface EquationDef {
  id: string;
  units: string[];
  title: string;
  description: string;
  shortLabel: string;
  formula: string;
  variables: VariableDef[];
  /** Per-variable closed-form solver. */
  solvers: Record<string, (vals: Record<string, number>) => SolverOutput>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseAll(keys: string[], vals: Record<string, string>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k of keys) out[k] = parseFloat(vals[k]);
  return out;
}

function fmt(n: number, digits = 4): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e-3 && abs < 1e7) return parseFloat(n.toPrecision(6)).toString();
  return n.toExponential(digits);
}

function buildResult(
  eq: EquationDef,
  solveFor: string,
  out: SolverOutput,
  valsRaw: Record<string, string>,
): SolveResult {
  if (out.error) {
    return { steps: [], answer: null, unit: out.unit, variable: out.symbol, error: out.error };
  }
  const knowns = eq.variables
    .filter((v) => v.key !== solveFor)
    .map((v) => `${v.label.split(" (")[0]} = ${valsRaw[v.key]} ${v.unit}`)
    .join(",  ");

  const steps: SolutionStep[] = [
    { label: "Write the equation", content: eq.formula, isMath: true },
    { label: "Identify knowns", content: knowns },
    { label: "Rearrange", content: out.symbolic, isMath: true },
    { label: "Substitute values", content: out.numeric, isMath: true },
  ];
  if (out.intermediate) {
    steps.push({ label: "Solve algebraically", content: out.intermediate, isMath: true });
  }
  steps.push({
    label: "Final answer",
    content: `${out.symbol} = ${fmt(out.value)} \\text{ ${out.unit}}`,
    isMath: true,
    highlight: true,
  });
  return { steps, answer: out.value, unit: out.unit, variable: out.symbol };
}

function req(vals: Record<string, number>, keys: string[]): string | null {
  const missing = keys.filter((k) => !isFinite(vals[k]));
  if (missing.length) {
    return `Please fill in all required values: ${missing.join(", ")}.`;
  }
  return null;
}

// ─── Equation definitions ────────────────────────────────────────────────────

const EQUATIONS: EquationDef[] = [
  // ── Kinematics ───────────────────────────────────────────────────────────
  {
    id: "kin-vf",
    units: ["kinematics"],
    title: "Velocity with time",
    shortLabel: "v = v₀ + at",
    description: "Final velocity under constant acceleration.",
    formula: "v = v_0 + a t",
    variables: [
      { key: "v",  label: "v (final velocity)", unit: "m/s" },
      { key: "v0", label: "v₀ (initial velocity)", unit: "m/s" },
      { key: "a",  label: "a (acceleration)", unit: "m/s²" },
      { key: "t",  label: "t (time)", unit: "s" },
    ],
    solvers: {
      v: (n) => {
        const e = req(n, ["v0", "a", "t"]); if (e) return err("v", "m/s", e);
        const value = n.v0 + n.a * n.t;
        return { value, symbol: "v", unit: "m/s",
          symbolic: "v = v_0 + a t",
          numeric: `v = ${n.v0} + (${n.a})(${n.t})`,
          intermediate: `v = ${n.v0} + ${fmt(n.a * n.t)}` };
      },
      v0: (n) => {
        const e = req(n, ["v", "a", "t"]); if (e) return err("v_0", "m/s", e);
        const value = n.v - n.a * n.t;
        return { value, symbol: "v_0", unit: "m/s",
          symbolic: "v_0 = v - a t",
          numeric: `v_0 = ${n.v} - (${n.a})(${n.t})`,
          intermediate: `v_0 = ${n.v} - ${fmt(n.a * n.t)}` };
      },
      a: (n) => {
        const e = req(n, ["v", "v0", "t"]); if (e) return err("a", "m/s²", e);
        if (n.t === 0) return err("a", "m/s²", "t cannot be zero.");
        const value = (n.v - n.v0) / n.t;
        return { value, symbol: "a", unit: "m/s²",
          symbolic: "a = \\frac{v - v_0}{t}",
          numeric: `a = \\frac{${n.v} - ${n.v0}}{${n.t}}`,
          intermediate: `a = \\frac{${fmt(n.v - n.v0)}}{${n.t}}` };
      },
      t: (n) => {
        const e = req(n, ["v", "v0", "a"]); if (e) return err("t", "s", e);
        if (n.a === 0) return err("t", "s", "a cannot be zero.");
        const value = (n.v - n.v0) / n.a;
        return { value, symbol: "t", unit: "s",
          symbolic: "t = \\frac{v - v_0}{a}",
          numeric: `t = \\frac{${n.v} - ${n.v0}}{${n.a}}`,
          intermediate: `t = \\frac{${fmt(n.v - n.v0)}}{${n.a}}` };
      },
    },
  },
  {
    id: "kin-disp",
    units: ["kinematics"],
    title: "Displacement with time",
    shortLabel: "Δx = v₀t + ½at²",
    description: "Displacement under constant acceleration.",
    formula: "\\Delta x = v_0 t + \\tfrac{1}{2} a t^2",
    variables: [
      { key: "dx", label: "Δx (displacement)", unit: "m" },
      { key: "v0", label: "v₀ (initial velocity)", unit: "m/s" },
      { key: "a",  label: "a (acceleration)", unit: "m/s²" },
      { key: "t",  label: "t (time)", unit: "s" },
    ],
    solvers: {
      dx: (n) => {
        const e = req(n, ["v0", "a", "t"]); if (e) return err("\\Delta x", "m", e);
        const value = n.v0 * n.t + 0.5 * n.a * n.t * n.t;
        return { value, symbol: "\\Delta x", unit: "m",
          symbolic: "\\Delta x = v_0 t + \\tfrac{1}{2} a t^2",
          numeric: `\\Delta x = (${n.v0})(${n.t}) + \\tfrac{1}{2}(${n.a})(${n.t})^2`,
          intermediate: `\\Delta x = ${fmt(n.v0 * n.t)} + ${fmt(0.5 * n.a * n.t * n.t)}` };
      },
      v0: (n) => {
        const e = req(n, ["dx", "a", "t"]); if (e) return err("v_0", "m/s", e);
        if (n.t === 0) return err("v_0", "m/s", "t cannot be zero.");
        const value = (n.dx - 0.5 * n.a * n.t * n.t) / n.t;
        return { value, symbol: "v_0", unit: "m/s",
          symbolic: "v_0 = \\frac{\\Delta x - \\tfrac{1}{2} a t^2}{t}",
          numeric: `v_0 = \\frac{${n.dx} - \\tfrac{1}{2}(${n.a})(${n.t})^2}{${n.t}}` };
      },
      a: (n) => {
        const e = req(n, ["dx", "v0", "t"]); if (e) return err("a", "m/s²", e);
        if (n.t === 0) return err("a", "m/s²", "t cannot be zero.");
        const value = (2 * (n.dx - n.v0 * n.t)) / (n.t * n.t);
        return { value, symbol: "a", unit: "m/s²",
          symbolic: "a = \\frac{2(\\Delta x - v_0 t)}{t^2}",
          numeric: `a = \\frac{2(${n.dx} - (${n.v0})(${n.t}))}{${n.t}^2}` };
      },
      t: (n) => err("t", "s", "Solving for t requires the quadratic formula — use kinematics EQ v² = v₀² + 2aΔx instead."),
    },
  },
  {
    id: "kin-vsq",
    units: ["kinematics"],
    title: "Velocity without time",
    shortLabel: "v² = v₀² + 2aΔx",
    description: "Relates velocities when time is not given.",
    formula: "v^2 = v_0^2 + 2 a \\Delta x",
    variables: [
      { key: "v",  label: "v (final velocity)", unit: "m/s" },
      { key: "v0", label: "v₀ (initial velocity)", unit: "m/s" },
      { key: "a",  label: "a (acceleration)", unit: "m/s²" },
      { key: "dx", label: "Δx (displacement)", unit: "m" },
    ],
    solvers: {
      v: (n) => {
        const e = req(n, ["v0", "a", "dx"]); if (e) return err("v", "m/s", e);
        const inner = n.v0 * n.v0 + 2 * n.a * n.dx;
        if (inner < 0) return err("v", "m/s", "No real solution (v² < 0).");
        const value = Math.sqrt(inner);
        return { value, symbol: "v", unit: "m/s",
          symbolic: "v = \\sqrt{v_0^2 + 2 a \\Delta x}",
          numeric: `v = \\sqrt{${n.v0}^2 + 2(${n.a})(${n.dx})}`,
          intermediate: `v = \\sqrt{${fmt(inner)}}` };
      },
      v0: (n) => {
        const e = req(n, ["v", "a", "dx"]); if (e) return err("v_0", "m/s", e);
        const inner = n.v * n.v - 2 * n.a * n.dx;
        if (inner < 0) return err("v_0", "m/s", "No real solution (v₀² < 0).");
        const value = Math.sqrt(inner);
        return { value, symbol: "v_0", unit: "m/s",
          symbolic: "v_0 = \\sqrt{v^2 - 2 a \\Delta x}",
          numeric: `v_0 = \\sqrt{${n.v}^2 - 2(${n.a})(${n.dx})}`,
          intermediate: `v_0 = \\sqrt{${fmt(inner)}}` };
      },
      a: (n) => {
        const e = req(n, ["v", "v0", "dx"]); if (e) return err("a", "m/s²", e);
        if (n.dx === 0) return err("a", "m/s²", "Δx cannot be zero.");
        const value = (n.v * n.v - n.v0 * n.v0) / (2 * n.dx);
        return { value, symbol: "a", unit: "m/s²",
          symbolic: "a = \\frac{v^2 - v_0^2}{2 \\Delta x}",
          numeric: `a = \\frac{${n.v}^2 - ${n.v0}^2}{2(${n.dx})}` };
      },
      dx: (n) => {
        const e = req(n, ["v", "v0", "a"]); if (e) return err("\\Delta x", "m", e);
        if (n.a === 0) return err("\\Delta x", "m", "a cannot be zero.");
        const value = (n.v * n.v - n.v0 * n.v0) / (2 * n.a);
        return { value, symbol: "\\Delta x", unit: "m",
          symbolic: "\\Delta x = \\frac{v^2 - v_0^2}{2 a}",
          numeric: `\\Delta x = \\frac{${n.v}^2 - ${n.v0}^2}{2(${n.a})}` };
      },
    },
  },
  {
    id: "kin-range",
    units: ["kinematics"],
    title: "Projectile range (level ground)",
    shortLabel: "R = v₀²sin(2θ)/g",
    description: "Horizontal range of a projectile launched and landing at the same height.",
    formula: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
    variables: [
      { key: "R",     label: "R (range)", unit: "m" },
      { key: "v0",    label: "v₀ (launch speed)", unit: "m/s" },
      { key: "theta", label: "θ (launch angle)", unit: "°" },
      { key: "g",     label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
    ],
    solvers: {
      R: (n) => {
        const e = req(n, ["v0", "theta", "g"]); if (e) return err("R", "m", e);
        if (n.g === 0) return err("R", "m", "g cannot be zero.");
        const rad = (n.theta * Math.PI) / 180;
        const value = (n.v0 * n.v0 * Math.sin(2 * rad)) / n.g;
        return { value, symbol: "R", unit: "m",
          symbolic: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
          numeric: `R = \\frac{${n.v0}^2 \\sin(2 \\times ${n.theta}°)}{${n.g}}`,
          intermediate: `R = \\frac{${fmt(n.v0 * n.v0)} \\times ${fmt(Math.sin(2 * rad))}}{${n.g}}` };
      },
      v0: (n) => {
        const e = req(n, ["R", "theta", "g"]); if (e) return err("v_0", "m/s", e);
        const rad = (n.theta * Math.PI) / 180;
        const s = Math.sin(2 * rad);
        if (s === 0) return err("v_0", "m/s", "sin(2θ) cannot be zero — choose 0 < θ < 90°.");
        const inner = (n.R * n.g) / s;
        if (inner < 0) return err("v_0", "m/s", "No real solution.");
        const value = Math.sqrt(inner);
        return { value, symbol: "v_0", unit: "m/s",
          symbolic: "v_0 = \\sqrt{\\frac{R g}{\\sin(2\\theta)}}",
          numeric: `v_0 = \\sqrt{\\frac{${n.R} \\times ${n.g}}{\\sin(2 \\times ${n.theta}°)}}` };
      },
      theta: (n) => {
        const e = req(n, ["R", "v0", "g"]); if (e) return err("\\theta", "°", e);
        if (n.v0 === 0) return err("\\theta", "°", "v₀ cannot be zero.");
        const ratio = (n.R * n.g) / (n.v0 * n.v0);
        if (ratio < -1 || ratio > 1) return err("\\theta", "°", "No real angle satisfies these values.");
        const value = (Math.asin(ratio) / 2) * (180 / Math.PI);
        return { value, symbol: "\\theta", unit: "°",
          symbolic: "\\theta = \\tfrac{1}{2}\\arcsin\\!\\left(\\tfrac{R g}{v_0^2}\\right)",
          numeric: `\\theta = \\tfrac{1}{2}\\arcsin\\!\\left(\\tfrac{${n.R} \\times ${n.g}}{${n.v0}^2}\\right)` };
      },
    },
  },

  // ── Dynamics ─────────────────────────────────────────────────────────────
  {
    id: "dyn-newton2",
    units: ["dynamics", "momentum"],
    title: "Newton's Second Law",
    shortLabel: "F = ma",
    description: "Net force, mass, and acceleration.",
    formula: "F = m a",
    variables: [
      { key: "F", label: "F (net force)", unit: "N" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "a", label: "a (acceleration)", unit: "m/s²" },
    ],
    solvers: {
      F: (n) => solveProduct(n, "F", "N", "F = m a", ["m", "a"]),
      m: (n) => solveQuotient(n, "m", "kg", "m = \\frac{F}{a}", "F", "a"),
      a: (n) => solveQuotient(n, "a", "m/s²", "a = \\frac{F}{m}", "F", "m"),
    },
  },
  {
    id: "dyn-friction",
    units: ["dynamics"],
    title: "Friction force",
    shortLabel: "f = μN",
    description: "Friction force from coefficient and normal.",
    formula: "f = \\mu N",
    variables: [
      { key: "f",  label: "f (friction)", unit: "N" },
      { key: "mu", label: "μ (coefficient)", unit: "" },
      { key: "N",  label: "N (normal force)", unit: "N" },
    ],
    solvers: {
      f: (n) => solveProduct(n, "f", "N", "f = \\mu N", ["mu", "N"]),
      mu: (n) => solveQuotient(n, "\\mu", "", "\\mu = \\frac{f}{N}", "f", "N"),
      N: (n) => solveQuotient(n, "N", "N", "N = \\frac{f}{\\mu}", "f", "mu"),
    },
  },
  {
    id: "dyn-weight",
    units: ["dynamics", "energy"],
    title: "Weight (gravitational force)",
    shortLabel: "W = mg",
    description: "Weight of an object near a planet.",
    formula: "W = m g",
    variables: [
      { key: "W", label: "W (weight)", unit: "N" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "g", label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
    ],
    solvers: {
      W: (n) => solveProduct(n, "W", "N", "W = m g", ["m", "g"]),
      m: (n) => solveQuotient(n, "m", "kg", "m = \\frac{W}{g}", "W", "g"),
      g: (n) => solveQuotient(n, "g", "m/s²", "g = \\frac{W}{m}", "W", "m"),
    },
  },
  {
    id: "dyn-centripetal",
    units: ["dynamics", "rotating-systems"],
    title: "Centripetal force",
    shortLabel: "Fc = mv²/r",
    description: "Net inward force for circular motion.",
    formula: "F_c = \\frac{m v^2}{r}",
    variables: [
      { key: "Fc", label: "F_c (centripetal)", unit: "N" },
      { key: "m",  label: "m (mass)", unit: "kg" },
      { key: "v",  label: "v (tangential speed)", unit: "m/s" },
      { key: "r",  label: "r (radius)", unit: "m" },
    ],
    solvers: {
      Fc: (n) => {
        const e = req(n, ["m", "v", "r"]); if (e) return err("F_c", "N", e);
        if (n.r === 0) return err("F_c", "N", "r cannot be zero.");
        const value = (n.m * n.v * n.v) / n.r;
        return { value, symbol: "F_c", unit: "N",
          symbolic: "F_c = \\frac{m v^2}{r}",
          numeric: `F_c = \\frac{${n.m}(${n.v})^2}{${n.r}}` };
      },
      m: (n) => {
        const e = req(n, ["Fc", "v", "r"]); if (e) return err("m", "kg", e);
        if (n.v === 0) return err("m", "kg", "v cannot be zero.");
        const value = (n.Fc * n.r) / (n.v * n.v);
        return { value, symbol: "m", unit: "kg",
          symbolic: "m = \\frac{F_c r}{v^2}",
          numeric: `m = \\frac{(${n.Fc})(${n.r})}{${n.v}^2}` };
      },
      v: (n) => {
        const e = req(n, ["Fc", "m", "r"]); if (e) return err("v", "m/s", e);
        if (n.m === 0) return err("v", "m/s", "m cannot be zero.");
        const inner = (n.Fc * n.r) / n.m;
        if (inner < 0) return err("v", "m/s", "No real solution.");
        const value = Math.sqrt(inner);
        return { value, symbol: "v", unit: "m/s",
          symbolic: "v = \\sqrt{\\frac{F_c r}{m}}",
          numeric: `v = \\sqrt{\\frac{(${n.Fc})(${n.r})}{${n.m}}}` };
      },
      r: (n) => {
        const e = req(n, ["Fc", "m", "v"]); if (e) return err("r", "m", e);
        if (n.Fc === 0) return err("r", "m", "F_c cannot be zero.");
        const value = (n.m * n.v * n.v) / n.Fc;
        return { value, symbol: "r", unit: "m",
          symbolic: "r = \\frac{m v^2}{F_c}",
          numeric: `r = \\frac{${n.m}(${n.v})^2}{${n.Fc}}` };
      },
    },
  },

  // ── Energy ───────────────────────────────────────────────────────────────
  {
    id: "en-kinetic",
    units: ["energy", "momentum"],
    title: "Kinetic Energy",
    shortLabel: "K = ½mv²",
    description: "Translational kinetic energy of a mass.",
    formula: "K = \\tfrac{1}{2} m v^2",
    variables: [
      { key: "K", label: "K (kinetic energy)", unit: "J" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "v", label: "v (speed)", unit: "m/s" },
    ],
    solvers: {
      K: (n) => {
        const e = req(n, ["m", "v"]); if (e) return err("K", "J", e);
        const value = 0.5 * n.m * n.v * n.v;
        return { value, symbol: "K", unit: "J",
          symbolic: "K = \\tfrac{1}{2} m v^2",
          numeric: `K = \\tfrac{1}{2}(${n.m})(${n.v})^2` };
      },
      m: (n) => {
        const e = req(n, ["K", "v"]); if (e) return err("m", "kg", e);
        if (n.v === 0) return err("m", "kg", "v cannot be zero.");
        const value = (2 * n.K) / (n.v * n.v);
        return { value, symbol: "m", unit: "kg",
          symbolic: "m = \\frac{2K}{v^2}",
          numeric: `m = \\frac{2(${n.K})}{${n.v}^2}` };
      },
      v: (n) => {
        const e = req(n, ["K", "m"]); if (e) return err("v", "m/s", e);
        if (n.m === 0) return err("v", "m/s", "m cannot be zero.");
        const inner = (2 * n.K) / n.m;
        if (inner < 0) return err("v", "m/s", "No real solution.");
        const value = Math.sqrt(inner);
        return { value, symbol: "v", unit: "m/s",
          symbolic: "v = \\sqrt{\\frac{2K}{m}}",
          numeric: `v = \\sqrt{\\frac{2(${n.K})}{${n.m}}}` };
      },
    },
  },
  {
    id: "en-gpe",
    units: ["energy"],
    title: "Gravitational PE",
    shortLabel: "U = mgh",
    description: "Gravitational potential energy near Earth's surface.",
    formula: "U_g = m g h",
    variables: [
      { key: "U", label: "U_g (potential energy)", unit: "J" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "g", label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
      { key: "h", label: "h (height)", unit: "m" },
    ],
    solvers: {
      U: (n) => solveProduct(n, "U_g", "J", "U_g = m g h", ["m", "g", "h"]),
      m: (n) => solveDivMultiple(n, "m", "kg", "m = \\frac{U_g}{g h}", "U", ["g", "h"]),
      g: (n) => solveDivMultiple(n, "g", "m/s²", "g = \\frac{U_g}{m h}", "U", ["m", "h"]),
      h: (n) => solveDivMultiple(n, "h", "m", "h = \\frac{U_g}{m g}", "U", ["m", "g"]),
    },
  },
  {
    id: "en-spring",
    units: ["energy", "oscillations"],
    title: "Spring Potential Energy",
    shortLabel: "U = ½kx²",
    description: "Elastic potential energy of an ideal spring.",
    formula: "U_s = \\tfrac{1}{2} k x^2",
    variables: [
      { key: "U", label: "U_s (spring PE)", unit: "J" },
      { key: "k", label: "k (spring constant)", unit: "N/m" },
      { key: "x", label: "x (displacement)", unit: "m" },
    ],
    solvers: {
      U: (n) => {
        const e = req(n, ["k", "x"]); if (e) return err("U_s", "J", e);
        const value = 0.5 * n.k * n.x * n.x;
        return { value, symbol: "U_s", unit: "J",
          symbolic: "U_s = \\tfrac{1}{2} k x^2",
          numeric: `U_s = \\tfrac{1}{2}(${n.k})(${n.x})^2` };
      },
      k: (n) => {
        const e = req(n, ["U", "x"]); if (e) return err("k", "N/m", e);
        if (n.x === 0) return err("k", "N/m", "x cannot be zero.");
        const value = (2 * n.U) / (n.x * n.x);
        return { value, symbol: "k", unit: "N/m",
          symbolic: "k = \\frac{2 U_s}{x^2}",
          numeric: `k = \\frac{2(${n.U})}{${n.x}^2}` };
      },
      x: (n) => {
        const e = req(n, ["U", "k"]); if (e) return err("x", "m", e);
        if (n.k === 0) return err("x", "m", "k cannot be zero.");
        const inner = (2 * n.U) / n.k;
        if (inner < 0) return err("x", "m", "No real solution.");
        const value = Math.sqrt(inner);
        return { value, symbol: "x", unit: "m",
          symbolic: "x = \\sqrt{\\frac{2 U_s}{k}}",
          numeric: `x = \\sqrt{\\frac{2(${n.U})}{${n.k}}}` };
      },
    },
  },
  {
    id: "en-work",
    units: ["energy"],
    title: "Work of a constant force",
    shortLabel: "W = Fd cosθ",
    description: "Work done by a constant force along a straight path.",
    formula: "W = F d \\cos\\theta",
    variables: [
      { key: "W", label: "W (work)", unit: "J" },
      { key: "F", label: "F (force)", unit: "N" },
      { key: "d", label: "d (displacement)", unit: "m" },
      { key: "theta", label: "θ (angle)", unit: "°" },
    ],
    solvers: {
      W: (n) => {
        const e = req(n, ["F", "d", "theta"]); if (e) return err("W", "J", e);
        const rad = (n.theta * Math.PI) / 180;
        const value = n.F * n.d * Math.cos(rad);
        return { value, symbol: "W", unit: "J",
          symbolic: "W = F d \\cos\\theta",
          numeric: `W = (${n.F})(${n.d})\\cos(${n.theta}°)`,
          intermediate: `W = ${fmt(n.F * n.d)} \\times ${fmt(Math.cos(rad))}` };
      },
      F: (n) => {
        const e = req(n, ["W", "d", "theta"]); if (e) return err("F", "N", e);
        const rad = (n.theta * Math.PI) / 180;
        const c = Math.cos(rad);
        if (n.d * c === 0) return err("F", "N", "d·cosθ cannot be zero.");
        const value = n.W / (n.d * c);
        return { value, symbol: "F", unit: "N",
          symbolic: "F = \\frac{W}{d \\cos\\theta}",
          numeric: `F = \\frac{${n.W}}{(${n.d})\\cos(${n.theta}°)}` };
      },
      d: (n) => {
        const e = req(n, ["W", "F", "theta"]); if (e) return err("d", "m", e);
        const rad = (n.theta * Math.PI) / 180;
        const c = Math.cos(rad);
        if (n.F * c === 0) return err("d", "m", "F·cosθ cannot be zero.");
        const value = n.W / (n.F * c);
        return { value, symbol: "d", unit: "m",
          symbolic: "d = \\frac{W}{F \\cos\\theta}",
          numeric: `d = \\frac{${n.W}}{(${n.F})\\cos(${n.theta}°)}` };
      },
    },
  },

  // ── Momentum ─────────────────────────────────────────────────────────────
  {
    id: "mom-p",
    units: ["momentum"],
    title: "Linear Momentum",
    shortLabel: "p = mv",
    description: "Momentum of a single particle.",
    formula: "p = m v",
    variables: [
      { key: "p", label: "p (momentum)", unit: "kg·m/s" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "v", label: "v (velocity)", unit: "m/s" },
    ],
    solvers: {
      p: (n) => solveProduct(n, "p", "kg·m/s", "p = m v", ["m", "v"]),
      m: (n) => solveQuotient(n, "m", "kg", "m = \\frac{p}{v}", "p", "v"),
      v: (n) => solveQuotient(n, "v", "m/s", "v = \\frac{p}{m}", "p", "m"),
    },
  },
  {
    id: "mom-impulse",
    units: ["momentum"],
    title: "Impulse",
    shortLabel: "J = FΔt",
    description: "Impulse from average force over time.",
    formula: "J = F \\Delta t = \\Delta p",
    variables: [
      { key: "J",  label: "J (impulse)", unit: "N·s" },
      { key: "F",  label: "F (average force)", unit: "N" },
      { key: "dt", label: "Δt (time interval)", unit: "s" },
    ],
    solvers: {
      J: (n) => solveProduct(n, "J", "N·s", "J = F \\Delta t", ["F", "dt"]),
      F: (n) => solveQuotient(n, "F", "N", "F = \\frac{J}{\\Delta t}", "J", "dt"),
      dt: (n) => solveQuotient(n, "\\Delta t", "s", "\\Delta t = \\frac{J}{F}", "J", "F"),
    },
  },
  {
    id: "mom-inelastic",
    units: ["momentum"],
    title: "Perfectly inelastic collision (1D)",
    shortLabel: "v_f = (m₁v₁+m₂v₂)/(m₁+m₂)",
    description: "Final velocity of two masses that stick together.",
    formula: "v_f = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
    variables: [
      { key: "vf", label: "v_f (final velocity)", unit: "m/s" },
      { key: "m1", label: "m₁ (mass 1)", unit: "kg" },
      { key: "v1", label: "v₁ (velocity 1)", unit: "m/s" },
      { key: "m2", label: "m₂ (mass 2)", unit: "kg" },
      { key: "v2", label: "v₂ (velocity 2)", unit: "m/s" },
    ],
    solvers: {
      vf: (n) => {
        const e = req(n, ["m1", "v1", "m2", "v2"]); if (e) return err("v_f", "m/s", e);
        if (n.m1 + n.m2 === 0) return err("v_f", "m/s", "m₁ + m₂ cannot be zero.");
        const value = (n.m1 * n.v1 + n.m2 * n.v2) / (n.m1 + n.m2);
        return { value, symbol: "v_f", unit: "m/s",
          symbolic: "v_f = \\frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}",
          numeric: `v_f = \\frac{(${n.m1})(${n.v1}) + (${n.m2})(${n.v2})}{${n.m1} + ${n.m2}}`,
          intermediate: `v_f = \\frac{${fmt(n.m1 * n.v1 + n.m2 * n.v2)}}{${fmt(n.m1 + n.m2)}}` };
      },
      v1: (n) => {
        const e = req(n, ["vf", "m1", "m2", "v2"]); if (e) return err("v_1", "m/s", e);
        if (n.m1 === 0) return err("v_1", "m/s", "m₁ cannot be zero.");
        const value = (n.vf * (n.m1 + n.m2) - n.m2 * n.v2) / n.m1;
        return { value, symbol: "v_1", unit: "m/s",
          symbolic: "v_1 = \\frac{v_f (m_1 + m_2) - m_2 v_2}{m_1}",
          numeric: `v_1 = \\frac{(${n.vf})(${n.m1 + n.m2}) - (${n.m2})(${n.v2})}{${n.m1}}` };
      },
      v2: (n) => {
        const e = req(n, ["vf", "m1", "m2", "v1"]); if (e) return err("v_2", "m/s", e);
        if (n.m2 === 0) return err("v_2", "m/s", "m₂ cannot be zero.");
        const value = (n.vf * (n.m1 + n.m2) - n.m1 * n.v1) / n.m2;
        return { value, symbol: "v_2", unit: "m/s",
          symbolic: "v_2 = \\frac{v_f (m_1 + m_2) - m_1 v_1}{m_2}",
          numeric: `v_2 = \\frac{(${n.vf})(${n.m1 + n.m2}) - (${n.m1})(${n.v1})}{${n.m2}}` };
      },
    },
  },

  // ── Torque & Rotating systems ────────────────────────────────────────────
  {
    id: "rot-torque",
    units: ["torque"],
    title: "Torque",
    shortLabel: "τ = rF sinθ",
    description: "Torque from force applied at a lever arm.",
    formula: "\\tau = r F \\sin\\theta",
    variables: [
      { key: "tau",   label: "τ (torque)", unit: "N·m" },
      { key: "r",     label: "r (lever arm)", unit: "m" },
      { key: "F",     label: "F (force)", unit: "N" },
      { key: "theta", label: "θ (angle)", unit: "°" },
    ],
    solvers: {
      tau: (n) => {
        const e = req(n, ["r", "F", "theta"]); if (e) return err("\\tau", "N·m", e);
        const rad = (n.theta * Math.PI) / 180;
        const value = n.r * n.F * Math.sin(rad);
        return { value, symbol: "\\tau", unit: "N·m",
          symbolic: "\\tau = r F \\sin\\theta",
          numeric: `\\tau = (${n.r})(${n.F})\\sin(${n.theta}°)`,
          intermediate: `\\tau = ${fmt(n.r * n.F)} \\times ${fmt(Math.sin(rad))}` };
      },
      r: (n) => {
        const e = req(n, ["tau", "F", "theta"]); if (e) return err("r", "m", e);
        const rad = (n.theta * Math.PI) / 180;
        const s = Math.sin(rad);
        if (n.F * s === 0) return err("r", "m", "F·sinθ cannot be zero.");
        const value = n.tau / (n.F * s);
        return { value, symbol: "r", unit: "m",
          symbolic: "r = \\frac{\\tau}{F \\sin\\theta}",
          numeric: `r = \\frac{${n.tau}}{(${n.F})\\sin(${n.theta}°)}` };
      },
      F: (n) => {
        const e = req(n, ["tau", "r", "theta"]); if (e) return err("F", "N", e);
        const rad = (n.theta * Math.PI) / 180;
        const s = Math.sin(rad);
        if (n.r * s === 0) return err("F", "N", "r·sinθ cannot be zero.");
        const value = n.tau / (n.r * s);
        return { value, symbol: "F", unit: "N",
          symbolic: "F = \\frac{\\tau}{r \\sin\\theta}",
          numeric: `F = \\frac{${n.tau}}{(${n.r})\\sin(${n.theta}°)}` };
      },
    },
  },
  {
    id: "rot-newton2",
    units: ["torque", "rotating-systems"],
    title: "Rotational Newton's 2nd",
    shortLabel: "τ = Iα",
    description: "Net torque, moment of inertia, angular acceleration.",
    formula: "\\tau = I \\alpha",
    variables: [
      { key: "tau",   label: "τ (torque)", unit: "N·m" },
      { key: "I",     label: "I (moment of inertia)", unit: "kg·m²" },
      { key: "alpha", label: "α (angular acceleration)", unit: "rad/s²" },
    ],
    solvers: {
      tau: (n) => solveProduct(n, "\\tau", "N·m", "\\tau = I \\alpha", ["I", "alpha"]),
      I: (n) => solveQuotient(n, "I", "kg·m²", "I = \\frac{\\tau}{\\alpha}", "tau", "alpha"),
      alpha: (n) => solveQuotient(n, "\\alpha", "rad/s²", "\\alpha = \\frac{\\tau}{I}", "tau", "I"),
    },
  },
  {
    id: "rot-rke",
    units: ["torque", "rotating-systems", "energy"],
    title: "Rotational Kinetic Energy",
    shortLabel: "K = ½Iω²",
    description: "Kinetic energy of a rotating rigid body.",
    formula: "K = \\tfrac{1}{2} I \\omega^2",
    variables: [
      { key: "K", label: "K (rotational KE)", unit: "J" },
      { key: "I", label: "I (moment of inertia)", unit: "kg·m²" },
      { key: "w", label: "ω (angular speed)", unit: "rad/s" },
    ],
    solvers: {
      K: (n) => {
        const e = req(n, ["I", "w"]); if (e) return err("K", "J", e);
        const value = 0.5 * n.I * n.w * n.w;
        return { value, symbol: "K", unit: "J",
          symbolic: "K = \\tfrac{1}{2} I \\omega^2",
          numeric: `K = \\tfrac{1}{2}(${n.I})(${n.w})^2` };
      },
      I: (n) => {
        const e = req(n, ["K", "w"]); if (e) return err("I", "kg·m²", e);
        if (n.w === 0) return err("I", "kg·m²", "ω cannot be zero.");
        const value = (2 * n.K) / (n.w * n.w);
        return { value, symbol: "I", unit: "kg·m²",
          symbolic: "I = \\frac{2K}{\\omega^2}",
          numeric: `I = \\frac{2(${n.K})}{${n.w}^2}` };
      },
      w: (n) => {
        const e = req(n, ["K", "I"]); if (e) return err("\\omega", "rad/s", e);
        if (n.I === 0) return err("\\omega", "rad/s", "I cannot be zero.");
        const inner = (2 * n.K) / n.I;
        if (inner < 0) return err("\\omega", "rad/s", "No real solution.");
        const value = Math.sqrt(inner);
        return { value, symbol: "\\omega", unit: "rad/s",
          symbolic: "\\omega = \\sqrt{\\frac{2K}{I}}",
          numeric: `\\omega = \\sqrt{\\frac{2(${n.K})}{${n.I}}}` };
      },
    },
  },
  {
    id: "rot-angmom",
    units: ["rotating-systems"],
    title: "Angular Momentum",
    shortLabel: "L = Iω",
    description: "Angular momentum of a rigid body.",
    formula: "L = I \\omega",
    variables: [
      { key: "L", label: "L (angular momentum)", unit: "kg·m²/s" },
      { key: "I", label: "I (moment of inertia)", unit: "kg·m²" },
      { key: "w", label: "ω (angular speed)", unit: "rad/s" },
    ],
    solvers: {
      L: (n) => solveProduct(n, "L", "kg·m²/s", "L = I \\omega", ["I", "w"]),
      I: (n) => solveQuotient(n, "I", "kg·m²", "I = \\frac{L}{\\omega}", "L", "w"),
      w: (n) => solveQuotient(n, "\\omega", "rad/s", "\\omega = \\frac{L}{I}", "L", "I"),
    },
  },
  {
    id: "rot-rolling",
    units: ["rotating-systems"],
    title: "Rolling constraint",
    shortLabel: "v = rω",
    description: "Linear speed of a rolling object's center.",
    formula: "v = r \\omega",
    variables: [
      { key: "v", label: "v (linear speed)", unit: "m/s" },
      { key: "r", label: "r (radius)", unit: "m" },
      { key: "w", label: "ω (angular speed)", unit: "rad/s" },
    ],
    solvers: {
      v: (n) => solveProduct(n, "v", "m/s", "v = r \\omega", ["r", "w"]),
      r: (n) => solveQuotient(n, "r", "m", "r = \\frac{v}{\\omega}", "v", "w"),
      w: (n) => solveQuotient(n, "\\omega", "rad/s", "\\omega = \\frac{v}{r}", "v", "r"),
    },
  },

  // ── Oscillations ─────────────────────────────────────────────────────────
  {
    id: "osc-spring-period",
    units: ["oscillations"],
    title: "Mass-Spring Period",
    shortLabel: "T = 2π√(m/k)",
    description: "Period of a horizontal mass on an ideal spring.",
    formula: "T = 2\\pi \\sqrt{\\frac{m}{k}}",
    variables: [
      { key: "T", label: "T (period)", unit: "s" },
      { key: "m", label: "m (mass)", unit: "kg" },
      { key: "k", label: "k (spring constant)", unit: "N/m" },
    ],
    solvers: {
      T: (n) => {
        const e = req(n, ["m", "k"]); if (e) return err("T", "s", e);
        if (n.k <= 0 || n.m < 0) return err("T", "s", "m ≥ 0 and k > 0 are required.");
        const value = 2 * Math.PI * Math.sqrt(n.m / n.k);
        return { value, symbol: "T", unit: "s",
          symbolic: "T = 2\\pi \\sqrt{\\frac{m}{k}}",
          numeric: `T = 2\\pi \\sqrt{\\frac{${n.m}}{${n.k}}}`,
          intermediate: `T = 2\\pi \\times ${fmt(Math.sqrt(n.m / n.k))}` };
      },
      m: (n) => {
        const e = req(n, ["T", "k"]); if (e) return err("m", "kg", e);
        const value = (n.T * n.T * n.k) / (4 * Math.PI * Math.PI);
        return { value, symbol: "m", unit: "kg",
          symbolic: "m = \\frac{T^2 k}{4\\pi^2}",
          numeric: `m = \\frac{${n.T}^2 (${n.k})}{4\\pi^2}` };
      },
      k: (n) => {
        const e = req(n, ["T", "m"]); if (e) return err("k", "N/m", e);
        if (n.T === 0) return err("k", "N/m", "T cannot be zero.");
        const value = (4 * Math.PI * Math.PI * n.m) / (n.T * n.T);
        return { value, symbol: "k", unit: "N/m",
          symbolic: "k = \\frac{4\\pi^2 m}{T^2}",
          numeric: `k = \\frac{4\\pi^2 (${n.m})}{${n.T}^2}` };
      },
    },
  },
  {
    id: "osc-pendulum-period",
    units: ["oscillations"],
    title: "Simple Pendulum Period",
    shortLabel: "T = 2π√(L/g)",
    description: "Period of a simple pendulum at small angles.",
    formula: "T = 2\\pi \\sqrt{\\frac{L}{g}}",
    variables: [
      { key: "T", label: "T (period)", unit: "s" },
      { key: "L", label: "L (length)", unit: "m" },
      { key: "g", label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
    ],
    solvers: {
      T: (n) => {
        const e = req(n, ["L", "g"]); if (e) return err("T", "s", e);
        if (n.g <= 0 || n.L < 0) return err("T", "s", "L ≥ 0 and g > 0 are required.");
        const value = 2 * Math.PI * Math.sqrt(n.L / n.g);
        return { value, symbol: "T", unit: "s",
          symbolic: "T = 2\\pi \\sqrt{\\frac{L}{g}}",
          numeric: `T = 2\\pi \\sqrt{\\frac{${n.L}}{${n.g}}}` };
      },
      L: (n) => {
        const e = req(n, ["T", "g"]); if (e) return err("L", "m", e);
        const value = (n.T * n.T * n.g) / (4 * Math.PI * Math.PI);
        return { value, symbol: "L", unit: "m",
          symbolic: "L = \\frac{T^2 g}{4\\pi^2}",
          numeric: `L = \\frac{${n.T}^2 (${n.g})}{4\\pi^2}` };
      },
      g: (n) => {
        const e = req(n, ["T", "L"]); if (e) return err("g", "m/s²", e);
        if (n.T === 0) return err("g", "m/s²", "T cannot be zero.");
        const value = (4 * Math.PI * Math.PI * n.L) / (n.T * n.T);
        return { value, symbol: "g", unit: "m/s²",
          symbolic: "g = \\frac{4\\pi^2 L}{T^2}",
          numeric: `g = \\frac{4\\pi^2 (${n.L})}{${n.T}^2}` };
      },
    },
  },
  {
    id: "osc-hookes",
    units: ["oscillations", "dynamics"],
    title: "Hooke's Law",
    shortLabel: "F = -kx",
    description: "Restoring spring force magnitude.",
    formula: "|F| = k x",
    variables: [
      { key: "F", label: "F (spring force)", unit: "N" },
      { key: "k", label: "k (spring constant)", unit: "N/m" },
      { key: "x", label: "x (displacement)", unit: "m" },
    ],
    solvers: {
      F: (n) => solveProduct(n, "F", "N", "F = k x", ["k", "x"]),
      k: (n) => solveQuotient(n, "k", "N/m", "k = \\frac{F}{x}", "F", "x"),
      x: (n) => solveQuotient(n, "x", "m", "x = \\frac{F}{k}", "F", "k"),
    },
  },

  // ── Fluids (original five) ──────────────────────────────────────────────
  {
    id: "fl-hydro",
    units: ["fluids"],
    title: "Hydrostatic Pressure",
    shortLabel: "P = P₀ + ρgh",
    description: "Pressure in a static fluid column.",
    formula: "P = P_0 + \\rho g h",
    variables: [
      { key: "P",   label: "P (pressure at depth)", unit: "Pa" },
      { key: "P0",  label: "P₀ (surface pressure)", unit: "Pa" },
      { key: "rho", label: "ρ (fluid density)", unit: "kg/m³" },
      { key: "g",   label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
      { key: "h",   label: "h (depth)", unit: "m" },
    ],
    solvers: {
      P: (n) => {
        const e = req(n, ["P0", "rho", "g", "h"]); if (e) return err("P", "Pa", e);
        const value = n.P0 + n.rho * n.g * n.h;
        return { value, symbol: "P", unit: "Pa",
          symbolic: "P = P_0 + \\rho g h",
          numeric: `P = ${n.P0} + (${n.rho})(${n.g})(${n.h})`,
          intermediate: `P = ${n.P0} + ${fmt(n.rho * n.g * n.h)}` };
      },
      P0: (n) => {
        const e = req(n, ["P", "rho", "g", "h"]); if (e) return err("P_0", "Pa", e);
        const value = n.P - n.rho * n.g * n.h;
        return { value, symbol: "P_0", unit: "Pa",
          symbolic: "P_0 = P - \\rho g h",
          numeric: `P_0 = ${n.P} - (${n.rho})(${n.g})(${n.h})` };
      },
      rho: (n) => {
        const e = req(n, ["P", "P0", "g", "h"]); if (e) return err("\\rho", "kg/m³", e);
        if (n.g * n.h === 0) return err("\\rho", "kg/m³", "g·h cannot be zero.");
        const value = (n.P - n.P0) / (n.g * n.h);
        return { value, symbol: "\\rho", unit: "kg/m³",
          symbolic: "\\rho = \\frac{P - P_0}{g h}",
          numeric: `\\rho = \\frac{${n.P} - ${n.P0}}{(${n.g})(${n.h})}` };
      },
      h: (n) => {
        const e = req(n, ["P", "P0", "rho", "g"]); if (e) return err("h", "m", e);
        if (n.rho * n.g === 0) return err("h", "m", "ρ·g cannot be zero.");
        const value = (n.P - n.P0) / (n.rho * n.g);
        return { value, symbol: "h", unit: "m",
          symbolic: "h = \\frac{P - P_0}{\\rho g}",
          numeric: `h = \\frac{${n.P} - ${n.P0}}{(${n.rho})(${n.g})}` };
      },
    },
  },
  {
    id: "fl-pascal",
    units: ["fluids"],
    title: "Pascal's Law",
    shortLabel: "F₁/A₁ = F₂/A₂",
    description: "Hydraulic force transmission.",
    formula: "\\frac{F_1}{A_1} = \\frac{F_2}{A_2}",
    variables: [
      { key: "F1", label: "F₁ (input force)", unit: "N" },
      { key: "A1", label: "A₁ (input area)", unit: "m²" },
      { key: "F2", label: "F₂ (output force)", unit: "N" },
      { key: "A2", label: "A₂ (output area)", unit: "m²" },
    ],
    solvers: {
      F1: (n) => {
        const e = req(n, ["A1", "F2", "A2"]); if (e) return err("F_1", "N", e);
        if (n.A2 === 0) return err("F_1", "N", "A₂ cannot be zero.");
        const value = (n.F2 * n.A1) / n.A2;
        return { value, symbol: "F_1", unit: "N",
          symbolic: "F_1 = F_2 \\cdot \\frac{A_1}{A_2}",
          numeric: `F_1 = ${n.F2} \\cdot \\frac{${n.A1}}{${n.A2}}` };
      },
      A1: (n) => {
        const e = req(n, ["F1", "F2", "A2"]); if (e) return err("A_1", "m²", e);
        if (n.F2 === 0) return err("A_1", "m²", "F₂ cannot be zero.");
        const value = (n.F1 * n.A2) / n.F2;
        return { value, symbol: "A_1", unit: "m²",
          symbolic: "A_1 = F_1 \\cdot \\frac{A_2}{F_2}",
          numeric: `A_1 = ${n.F1} \\cdot \\frac{${n.A2}}{${n.F2}}` };
      },
      F2: (n) => {
        const e = req(n, ["F1", "A1", "A2"]); if (e) return err("F_2", "N", e);
        if (n.A1 === 0) return err("F_2", "N", "A₁ cannot be zero.");
        const value = (n.F1 * n.A2) / n.A1;
        return { value, symbol: "F_2", unit: "N",
          symbolic: "F_2 = F_1 \\cdot \\frac{A_2}{A_1}",
          numeric: `F_2 = ${n.F1} \\cdot \\frac{${n.A2}}{${n.A1}}` };
      },
      A2: (n) => {
        const e = req(n, ["F1", "A1", "F2"]); if (e) return err("A_2", "m²", e);
        if (n.F1 === 0) return err("A_2", "m²", "F₁ cannot be zero.");
        const value = (n.F2 * n.A1) / n.F1;
        return { value, symbol: "A_2", unit: "m²",
          symbolic: "A_2 = F_2 \\cdot \\frac{A_1}{F_1}",
          numeric: `A_2 = ${n.F2} \\cdot \\frac{${n.A1}}{${n.F1}}` };
      },
    },
  },
  {
    id: "fl-buoy",
    units: ["fluids"],
    title: "Buoyancy",
    shortLabel: "Fb = ρVg",
    description: "Archimedes' principle — buoyant force.",
    formula: "F_b = \\rho V g",
    variables: [
      { key: "Fb",  label: "F_b (buoyant force)", unit: "N" },
      { key: "rho", label: "ρ (fluid density)", unit: "kg/m³" },
      { key: "V",   label: "V (displaced volume)", unit: "m³" },
      { key: "g",   label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
    ],
    solvers: {
      Fb: (n) => solveProduct(n, "F_b", "N", "F_b = \\rho V g", ["rho", "V", "g"]),
      rho: (n) => solveDivMultiple(n, "\\rho", "kg/m³", "\\rho = \\frac{F_b}{V g}", "Fb", ["V", "g"]),
      V: (n) => solveDivMultiple(n, "V", "m³", "V = \\frac{F_b}{\\rho g}", "Fb", ["rho", "g"]),
      g: (n) => solveDivMultiple(n, "g", "m/s²", "g = \\frac{F_b}{\\rho V}", "Fb", ["rho", "V"]),
    },
  },
  {
    id: "fl-continuity",
    units: ["fluids"],
    title: "Continuity",
    shortLabel: "A₁v₁ = A₂v₂",
    description: "Incompressible flow mass conservation.",
    formula: "A_1 v_1 = A_2 v_2",
    variables: [
      { key: "A1", label: "A₁ (inlet area)", unit: "m²" },
      { key: "v1", label: "v₁ (inlet speed)", unit: "m/s" },
      { key: "A2", label: "A₂ (outlet area)", unit: "m²" },
      { key: "v2", label: "v₂ (outlet speed)", unit: "m/s" },
    ],
    solvers: {
      A1: (n) => {
        const e = req(n, ["v1", "A2", "v2"]); if (e) return err("A_1", "m²", e);
        if (n.v1 === 0) return err("A_1", "m²", "v₁ cannot be zero.");
        return { value: (n.A2 * n.v2) / n.v1, symbol: "A_1", unit: "m²",
          symbolic: "A_1 = \\frac{A_2 v_2}{v_1}",
          numeric: `A_1 = \\frac{(${n.A2})(${n.v2})}{${n.v1}}` };
      },
      v1: (n) => {
        const e = req(n, ["A1", "A2", "v2"]); if (e) return err("v_1", "m/s", e);
        if (n.A1 === 0) return err("v_1", "m/s", "A₁ cannot be zero.");
        return { value: (n.A2 * n.v2) / n.A1, symbol: "v_1", unit: "m/s",
          symbolic: "v_1 = \\frac{A_2 v_2}{A_1}",
          numeric: `v_1 = \\frac{(${n.A2})(${n.v2})}{${n.A1}}` };
      },
      A2: (n) => {
        const e = req(n, ["A1", "v1", "v2"]); if (e) return err("A_2", "m²", e);
        if (n.v2 === 0) return err("A_2", "m²", "v₂ cannot be zero.");
        return { value: (n.A1 * n.v1) / n.v2, symbol: "A_2", unit: "m²",
          symbolic: "A_2 = \\frac{A_1 v_1}{v_2}",
          numeric: `A_2 = \\frac{(${n.A1})(${n.v1})}{${n.v2}}` };
      },
      v2: (n) => {
        const e = req(n, ["A1", "v1", "A2"]); if (e) return err("v_2", "m/s", e);
        if (n.A2 === 0) return err("v_2", "m/s", "A₂ cannot be zero.");
        return { value: (n.A1 * n.v1) / n.A2, symbol: "v_2", unit: "m/s",
          symbolic: "v_2 = \\frac{A_1 v_1}{A_2}",
          numeric: `v_2 = \\frac{(${n.A1})(${n.v1})}{${n.A2}}` };
      },
    },
  },
  {
    id: "fl-bern",
    units: ["fluids"],
    title: "Bernoulli's Equation",
    shortLabel: "P + ½ρv² + ρgh",
    description: "Energy conservation along a streamline.",
    formula: "P_1 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g h_2",
    variables: [
      { key: "P1",  label: "P₁ (pressure, pt 1)", unit: "Pa" },
      { key: "rho", label: "ρ (fluid density)", unit: "kg/m³" },
      { key: "v1",  label: "v₁ (velocity, pt 1)", unit: "m/s" },
      { key: "g",   label: "g (gravity)", unit: "m/s²", defaultValue: "9.8" },
      { key: "h1",  label: "h₁ (height, pt 1)", unit: "m" },
      { key: "P2",  label: "P₂ (pressure, pt 2)", unit: "Pa" },
      { key: "v2",  label: "v₂ (velocity, pt 2)", unit: "m/s" },
      { key: "h2",  label: "h₂ (height, pt 2)", unit: "m" },
    ],
    solvers: {
      P1: (n) => {
        const e = req(n, ["rho", "v1", "g", "h1", "P2", "v2", "h2"]); if (e) return err("P_1", "Pa", e);
        const value = n.P2 + 0.5 * n.rho * n.v2 * n.v2 + n.rho * n.g * n.h2
                            - 0.5 * n.rho * n.v1 * n.v1 - n.rho * n.g * n.h1;
        return { value, symbol: "P_1", unit: "Pa",
          symbolic: "P_1 = P_2 + \\tfrac{1}{2}\\rho(v_2^2 - v_1^2) + \\rho g(h_2 - h_1)",
          numeric: `P_1 = ${n.P2} + \\tfrac{1}{2}(${n.rho})(${n.v2}^2 - ${n.v1}^2) + (${n.rho})(${n.g})(${n.h2} - ${n.h1})` };
      },
      P2: (n) => {
        const e = req(n, ["P1", "rho", "v1", "g", "h1", "v2", "h2"]); if (e) return err("P_2", "Pa", e);
        const value = n.P1 + 0.5 * n.rho * n.v1 * n.v1 + n.rho * n.g * n.h1
                            - 0.5 * n.rho * n.v2 * n.v2 - n.rho * n.g * n.h2;
        return { value, symbol: "P_2", unit: "Pa",
          symbolic: "P_2 = P_1 + \\tfrac{1}{2}\\rho(v_1^2 - v_2^2) + \\rho g(h_1 - h_2)",
          numeric: `P_2 = ${n.P1} + \\tfrac{1}{2}(${n.rho})(${n.v1}^2 - ${n.v2}^2) + (${n.rho})(${n.g})(${n.h1} - ${n.h2})` };
      },
      v1: (n) => {
        const e = req(n, ["P1", "rho", "g", "h1", "P2", "v2", "h2"]); if (e) return err("v_1", "m/s", e);
        if (n.rho === 0) return err("v_1", "m/s", "ρ cannot be zero.");
        const inner = (2 / n.rho) * (n.P2 - n.P1 + 0.5 * n.rho * n.v2 * n.v2 + n.rho * n.g * (n.h2 - n.h1));
        if (inner < 0) return err("v_1", "m/s", "No real solution.");
        return { value: Math.sqrt(inner), symbol: "v_1", unit: "m/s",
          symbolic: "v_1 = \\sqrt{\\tfrac{2}{\\rho}(P_2 - P_1 + \\tfrac{1}{2}\\rho v_2^2 + \\rho g(h_2 - h_1))}",
          numeric: `v_1 = \\sqrt{${fmt(inner)}}` };
      },
      v2: (n) => {
        const e = req(n, ["P1", "rho", "v1", "g", "h1", "P2", "h2"]); if (e) return err("v_2", "m/s", e);
        if (n.rho === 0) return err("v_2", "m/s", "ρ cannot be zero.");
        const inner = (2 / n.rho) * (n.P1 - n.P2 + 0.5 * n.rho * n.v1 * n.v1 + n.rho * n.g * (n.h1 - n.h2));
        if (inner < 0) return err("v_2", "m/s", "No real solution.");
        return { value: Math.sqrt(inner), symbol: "v_2", unit: "m/s",
          symbolic: "v_2 = \\sqrt{\\tfrac{2}{\\rho}(P_1 - P_2 + \\tfrac{1}{2}\\rho v_1^2 + \\rho g(h_1 - h_2))}",
          numeric: `v_2 = \\sqrt{${fmt(inner)}}` };
      },
      h1: (n) => {
        const e = req(n, ["P1", "rho", "v1", "g", "P2", "v2", "h2"]); if (e) return err("h_1", "m", e);
        if (n.rho * n.g === 0) return err("h_1", "m", "ρ·g cannot be zero.");
        const value = (n.P2 - n.P1 + 0.5 * n.rho * (n.v2 * n.v2 - n.v1 * n.v1) + n.rho * n.g * n.h2) / (n.rho * n.g);
        return { value, symbol: "h_1", unit: "m",
          symbolic: "h_1 = \\frac{P_2 - P_1 + \\tfrac{1}{2}\\rho(v_2^2 - v_1^2) + \\rho g h_2}{\\rho g}",
          numeric: `h_1 = \\frac{${fmt(value * n.rho * n.g)}}{${fmt(n.rho * n.g)}}` };
      },
      h2: (n) => {
        const e = req(n, ["P1", "rho", "v1", "g", "h1", "P2", "v2"]); if (e) return err("h_2", "m", e);
        if (n.rho * n.g === 0) return err("h_2", "m", "ρ·g cannot be zero.");
        const value = (n.P1 - n.P2 + 0.5 * n.rho * (n.v1 * n.v1 - n.v2 * n.v2) + n.rho * n.g * n.h1) / (n.rho * n.g);
        return { value, symbol: "h_2", unit: "m",
          symbolic: "h_2 = \\frac{P_1 - P_2 + \\tfrac{1}{2}\\rho(v_1^2 - v_2^2) + \\rho g h_1}{\\rho g}",
          numeric: `h_2 = \\frac{${fmt(value * n.rho * n.g)}}{${fmt(n.rho * n.g)}}` };
      },
    },
  },
];

// ─── Shared solver helpers ───────────────────────────────────────────────────

function err(symbol: string, unit: string, message: string): SolverOutput {
  return { value: NaN, symbol, unit, symbolic: "", numeric: "", error: message };
}

function solveProduct(
  n: Record<string, number>,
  outSym: string,
  outUnit: string,
  symbolic: string,
  factors: string[],
): SolverOutput {
  const e = req(n, factors); if (e) return err(outSym, outUnit, e);
  const value = factors.reduce((acc, k) => acc * n[k], 1);
  const numeric = `${outSym} = ${factors.map((k) => `(${n[k]})`).join(" \\times ")}`;
  return { value, symbol: outSym, unit: outUnit, symbolic, numeric };
}

function solveQuotient(
  n: Record<string, number>,
  outSym: string,
  outUnit: string,
  symbolic: string,
  topKey: string,
  botKey: string,
): SolverOutput {
  const e = req(n, [topKey, botKey]); if (e) return err(outSym, outUnit, e);
  if (n[botKey] === 0) return err(outSym, outUnit, `${botKey} cannot be zero.`);
  const value = n[topKey] / n[botKey];
  return { value, symbol: outSym, unit: outUnit, symbolic,
    numeric: `${outSym} = \\frac{${n[topKey]}}{${n[botKey]}}` };
}

function solveDivMultiple(
  n: Record<string, number>,
  outSym: string,
  outUnit: string,
  symbolic: string,
  topKey: string,
  botKeys: string[],
): SolverOutput {
  const e = req(n, [topKey, ...botKeys]); if (e) return err(outSym, outUnit, e);
  const denom = botKeys.reduce((acc, k) => acc * n[k], 1);
  if (denom === 0) return err(outSym, outUnit, `${botKeys.join("·")} cannot be zero.`);
  const value = n[topKey] / denom;
  return { value, symbol: outSym, unit: outUnit, symbolic,
    numeric: `${outSym} = \\frac{${n[topKey]}}{${botKeys.map((k) => `(${n[k]})`).join(" \\times ")}}` };
}

// ─── UI sub-components ───────────────────────────────────────────────────────

function StepPanel({ result }: { result: SolveResult | null }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 mt-4">
        <p className="text-sm text-destructive font-medium">{result.error}</p>
      </div>
    );
  }

  const stepIcons = ["①", "②", "③", "④", "⑤", "⑥"];

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
            {stepIcons[i] ?? "●"}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide uppercase">
              {step.label}
            </p>
            {!step.isMath ? (
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

function Field({
  id,
  label,
  unit,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium font-mono">
        {label}
      </Label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="enter value"
          className="w-full rounded-lg border border-border px-3 py-2 pr-14 text-sm font-mono bg-background transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function EquationPanel({ eq }: { eq: EquationDef }) {
  const solvableKeys = Object.keys(eq.solvers);
  const [solveFor, setSolveFor] = useState(solvableKeys[0]);

  const [vals, setVals] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const v of eq.variables) init[v.key] = v.defaultValue ?? "";
    return init;
  });

  const [result, setResult] = useState<SolveResult | null>(null);

  // Reset state if the equation instance changes (e.g., unit navigation)
  useEffect(() => {
    setSolveFor(solvableKeys[0]);
    const init: Record<string, string> = {};
    for (const v of eq.variables) init[v.key] = v.defaultValue ?? "";
    setVals(init);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eq.id]);

  const set = (k: string) => (v: string) => setVals((p) => ({ ...p, [k]: v }));

  const handleCalc = () => {
    const numeric = parseAll(eq.variables.map((v) => v.key), vals);
    const out = eq.solvers[solveFor](numeric);
    setResult(buildResult(eq, solveFor, out, vals));
  };

  return (
    <div>
      <div className="key-concept mb-5">
        <p className="text-xs text-muted-foreground mb-1 font-semibold tracking-widest uppercase">Equation</p>
        <div className="formula-box text-primary">
          <Tex display>{eq.formula}</Tex>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{eq.description}</p>
      </div>

      <div className="mb-4">
        <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
          Solve for
        </Label>
        <select
          value={solveFor}
          onChange={(e) => {
            setSolveFor(e.target.value);
            setResult(null);
          }}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {solvableKeys.map((key) => {
            const v = eq.variables.find((x) => x.key === key)!;
            return (
              <option key={key} value={key}>
                {v.label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {eq.variables
          .filter((v) => v.key !== solveFor)
          .map((v) => (
            <Field
              key={v.key}
              id={`${eq.id}-${v.key}`}
              label={v.label}
              unit={v.unit}
              value={vals[v.key]}
              onChange={set(v.key)}
            />
          ))}
      </div>

      <Button onClick={handleCalc} className="w-full">
        Calculate
      </Button>
      <StepPanel result={result} />
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

const QUICK_REFS: Record<string, { label: string; value: string }[]> = {
  kinematics: [
    { label: "g", value: "9.8 m/s²" },
    { label: "Max range angle", value: "45°" },
    { label: "Free-fall", value: "h = ½gt²" },
  ],
  dynamics: [
    { label: "g", value: "9.8 m/s²" },
    { label: "μ_k rubber/concrete", value: "≈ 0.7" },
    { label: "Weight of 1 kg", value: "9.8 N" },
  ],
  energy: [
    { label: "g", value: "9.8 m/s²" },
    { label: "1 kWh", value: "3.6 × 10⁶ J" },
    { label: "1 hp", value: "745.7 W" },
  ],
  momentum: [
    { label: "p units", value: "kg·m/s = N·s" },
    { label: "Impulse", value: "FΔt = Δp" },
    { label: "Elastic", value: "K and p both conserved" },
  ],
  torque: [
    { label: "Solid cylinder I", value: "½ MR²" },
    { label: "Hoop I", value: "MR²" },
    { label: "Rod (end) I", value: "⅓ ML²" },
  ],
  "rotating-systems": [
    { label: "Rolling", value: "v = rω" },
    { label: "1 rev", value: "2π rad" },
    { label: "a_c", value: "v²/r = rω²" },
  ],
  oscillations: [
    { label: "Spring T", value: "2π√(m/k)" },
    { label: "Pendulum T", value: "2π√(L/g)" },
    { label: "ω", value: "2π/T = 2πf" },
  ],
  fluids: [
    { label: "ρ_water", value: "1000 kg/m³" },
    { label: "g", value: "9.8 m/s²" },
    { label: "1 atm", value: "101 325 Pa" },
    { label: "P_gauge", value: "P_abs − P_atm" },
  ],
};

function prettySlug(slug: string): string {
  if (!slug) return "Mechanics";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function EquationSolver() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1] ?? "";

  const unitEquations = useMemo(() => {
    const list = EQUATIONS.filter((eq) => eq.units.includes(slug));
    return list.length > 0 ? list : EQUATIONS;
  }, [slug]);

  const quickRef = QUICK_REFS[slug] ?? QUICK_REFS.fluids;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="font-mono text-xs tracking-wider">
            AP Physics 1
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {prettySlug(slug)}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Equation Solver</h1>
        <p className="text-sm text-muted-foreground">
          Select an equation, enter known values, and get a step-by-step solution in AP exam format.
        </p>
      </div>

      <Separator className="mb-6" />

      <Tabs defaultValue={unitEquations[0].id} key={slug}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6 p-1 bg-muted/40 rounded-xl">
          {unitEquations.map((eq) => (
            <TabsTrigger
              key={eq.id}
              value={eq.id}
              className="font-mono text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              {eq.shortLabel}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card className="border-border/60 shadow-sm">
          {unitEquations.map((eq) => (
            <TabsContent key={eq.id} value={eq.id} className="mt-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{eq.title}</CardTitle>
                <CardDescription>{eq.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <EquationPanel eq={eq} />
              </CardContent>
            </TabsContent>
          ))}
        </Card>
      </Tabs>

      <div className="mt-6 rounded-xl border border-border/40 bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Quick Reference — {prettySlug(slug)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground font-mono">
          {quickRef.map((r) => (
            <span key={r.label}>
              {r.label} = {r.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
