"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FormulaRowProps {
  equation: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  whenToUse: string;
}

function FormulaRow({ equation, variables, whenToUse }: FormulaRowProps) {
  return (
    <div className="border border-border rounded-md p-3 bg-background">
      <div className="font-mono text-base font-semibold text-foreground mb-2 tracking-wide overflow-x-auto break-words" style={{overflowWrap: "anywhere"}}>
        {equation}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 mb-2">
        {variables.map((v) => (
          <div key={v.symbol} className="flex items-baseline gap-1.5 text-[11px] min-w-0">
            <span className="font-mono font-semibold text-primary min-w-[2.5rem] shrink-0">{v.symbol}</span>
            <span className="text-muted-foreground break-words min-w-0" style={{overflowWrap: "anywhere"}}>{v.meaning}</span>
            <span className="font-mono text-[11px] text-muted-foreground ml-auto shrink-0">[{v.unit}]</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground italic border-t border-border/50 pt-1.5">
        <span className="not-italic font-medium text-foreground">Use when: </span>
        {whenToUse}
      </div>
    </div>
  );
}

interface TopicCardProps {
  title: string;
  badge?: string;
  formulas: FormulaRowProps[];
}

function TopicCard({ title, badge, formulas }: TopicCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground">
            {title}
          </CardTitle>
          {badge && (
            <Badge variant="secondary" className="text-xs font-mono">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col gap-2">
        {formulas.map((f, i) => (
          <FormulaRow key={i} {...f} />
        ))}
      </CardContent>
    </Card>
  );
}

export function FormulaSheet() {
  return (
    <div className="min-h-screen bg-background p-6 print:p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AP Physics 1 — Fluids Formula Sheet
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete reference for pressure, buoyancy, and fluid dynamics
        </p>
      </div>

      {/* Constants Bar */}
      <div className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Important Constants
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "g", value: "9.8 m/s²", note: "gravitational acceleration" },
            { label: "ρ_water", value: "1000 kg/m³", note: "density of water" },
            { label: "ρ_air", value: "1.225 kg/m³", note: "density of air (sea level)" },
            { label: "1 atm", value: "101,325 Pa ≈ 101.3 kPa", note: "also 760 mmHg" },
          ].map((c) => (
            <div key={c.label} className="flex items-baseline gap-1.5 text-sm">
              <span className="font-mono font-bold text-primary">{c.label}</span>
              <span className="font-mono text-foreground">= {c.value}</span>
              <span className="text-xs text-muted-foreground">({c.note})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Pressure */}
        <TopicCard
          title="Pressure"
          badge="P"
          formulas={[
            {
              equation: "P = F / A",
              variables: [
                { symbol: "P", meaning: "pressure", unit: "Pa = N/m²" },
                { symbol: "F", meaning: "force (perpendicular)", unit: "N" },
                { symbol: "A", meaning: "area", unit: "m²" },
              ],
              whenToUse: "Finding pressure from a force applied over an area (piston, weight on surface).",
            },
            {
              equation: "P = P₀ + ρgh",
              variables: [
                { symbol: "P", meaning: "pressure at depth", unit: "Pa" },
                { symbol: "P₀", meaning: "surface pressure", unit: "Pa" },
                { symbol: "ρ", meaning: "fluid density", unit: "kg/m³" },
                { symbol: "g", meaning: "gravitational acceleration", unit: "m/s²" },
                { symbol: "h", meaning: "depth below surface", unit: "m" },
              ],
              whenToUse: "Finding pressure at a depth h in a static fluid. h is measured downward from the free surface.",
            },
            {
              equation: "ΔP = ρgΔh",
              variables: [
                { symbol: "ΔP", meaning: "pressure difference", unit: "Pa" },
                { symbol: "Δh", meaning: "height difference", unit: "m" },
              ],
              whenToUse: "Comparing pressures at two different heights in the same connected fluid.",
            },
          ]}
        />

        {/* Pascal's Law */}
        <TopicCard
          title="Pascal's Law"
          badge="Hydraulics"
          formulas={[
            {
              equation: "P₁ = P₂  →  F₁/A₁ = F₂/A₂",
              variables: [
                { symbol: "F₁", meaning: "force on piston 1", unit: "N" },
                { symbol: "A₁", meaning: "area of piston 1", unit: "m²" },
                { symbol: "F₂", meaning: "force on piston 2", unit: "N" },
                { symbol: "A₂", meaning: "area of piston 2", unit: "m²" },
              ],
              whenToUse: "Hydraulic systems (car lifts, syringes). Pressure transmits equally through enclosed fluid.",
            },
            {
              equation: "F₂ = F₁ · (A₂ / A₁)",
              variables: [
                { symbol: "F₂", meaning: "output force (large piston)", unit: "N" },
                { symbol: "F₁", meaning: "input force (small piston)", unit: "N" },
                { symbol: "A₂/A₁", meaning: "area ratio (mechanical advantage)", unit: "dimensionless" },
              ],
              whenToUse: "Calculating force multiplication in a hydraulic press. Large area = large output force.",
            },
            {
              equation: "d₁A₁ = d₂A₂  (volume conservation)",
              variables: [
                { symbol: "d₁", meaning: "displacement of input piston", unit: "m" },
                { symbol: "d₂", meaning: "displacement of output piston", unit: "m" },
              ],
              whenToUse: "Finding how far each piston moves. Bigger piston moves less (energy is conserved).",
            },
          ]}
        />

        {/* Buoyancy */}
        <TopicCard
          title="Buoyancy (Archimedes)"
          badge="F_b"
          formulas={[
            {
              equation: "F_b = ρ_fluid · g · V_submerged",
              variables: [
                { symbol: "F_b", meaning: "buoyant force (upward)", unit: "N" },
                { symbol: "ρ_fluid", meaning: "density of the fluid", unit: "kg/m³" },
                { symbol: "g", meaning: "gravitational acceleration", unit: "m/s²" },
                { symbol: "V_sub", meaning: "volume of fluid displaced", unit: "m³" },
              ],
              whenToUse: "Any object submerged or floating in a fluid. F_b equals weight of displaced fluid.",
            },
            {
              equation: "F_b = ρ_fluid · g · V_obj  (fully submerged)",
              variables: [
                { symbol: "V_obj", meaning: "total volume of object", unit: "m³" },
              ],
              whenToUse: "Object fully submerged (sinking or neutrally buoyant). V_sub = V_obj.",
            },
            {
              equation: "W_apparent = W - F_b",
              variables: [
                { symbol: "W_apparent", meaning: "scale reading underwater", unit: "N" },
                { symbol: "W", meaning: "true weight (= mg)", unit: "N" },
                { symbol: "F_b", meaning: "buoyant force", unit: "N" },
              ],
              whenToUse: "Finding what a submerged object reads on a scale. Always less than true weight.",
            },
            {
              equation: "fraction submerged = ρ_obj / ρ_fluid",
              variables: [
                { symbol: "ρ_obj", meaning: "density of the floating object", unit: "kg/m³" },
                { symbol: "ρ_fluid", meaning: "density of the fluid", unit: "kg/m³" },
              ],
              whenToUse: "Floating equilibrium. Derived from F_b = W. If ρ_obj < ρ_fluid → floats; if > → sinks.",
            },
          ]}
        />

        {/* Continuity */}
        <TopicCard
          title="Continuity Equation"
          badge="Flow"
          formulas={[
            {
              equation: "A₁v₁ = A₂v₂",
              variables: [
                { symbol: "A₁", meaning: "cross-sectional area at point 1", unit: "m²" },
                { symbol: "v₁", meaning: "fluid speed at point 1", unit: "m/s" },
                { symbol: "A₂", meaning: "cross-sectional area at point 2", unit: "m²" },
                { symbol: "v₂", meaning: "fluid speed at point 2", unit: "m/s" },
              ],
              whenToUse: "Incompressible, steady flow in a pipe. Narrower pipe → faster flow. Wider pipe → slower flow.",
            },
            {
              equation: "Q = Av",
              variables: [
                { symbol: "Q", meaning: "volume flow rate", unit: "m³/s" },
                { symbol: "A", meaning: "cross-sectional area", unit: "m²" },
                { symbol: "v", meaning: "fluid speed", unit: "m/s" },
              ],
              whenToUse: "Calculating how much fluid passes a point per second. Q is constant in steady flow.",
            },
          ]}
        />

        {/* Bernoulli's */}
        <TopicCard
          title="Bernoulli's Equation"
          badge="Energy"
          formulas={[
            {
              equation: "P + ½ρv² + ρgh = constant",
              variables: [
                { symbol: "P", meaning: "static pressure", unit: "Pa" },
                { symbol: "½ρv²", meaning: "dynamic pressure (kinetic)", unit: "Pa" },
                { symbol: "ρgh", meaning: "hydrostatic pressure (potential)", unit: "Pa" },
                { symbol: "ρ", meaning: "fluid density", unit: "kg/m³" },
                { symbol: "v", meaning: "fluid speed", unit: "m/s" },
                { symbol: "h", meaning: "height above reference", unit: "m" },
              ],
              whenToUse: "Ideal (inviscid, incompressible, steady) fluid along a streamline. Relates P, speed, and height.",
            },
            {
              equation: "P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂",
              variables: [
                { symbol: "1, 2", meaning: "two points along the same streamline", unit: "—" },
              ],
              whenToUse: "Comparing two specific points. If h₁=h₂ (horizontal pipe): higher speed → lower pressure.",
            },
            {
              equation: "v = √(2gh)  [Torricelli's theorem]",
              variables: [
                { symbol: "v", meaning: "efflux speed from a hole", unit: "m/s" },
                { symbol: "h", meaning: "depth of hole below free surface", unit: "m" },
              ],
              whenToUse: "Speed of fluid exiting a hole in a large tank. Derived from Bernoulli with v_top ≈ 0.",
            },
          ]}
        />

        {/* Derived Relationships */}
        <TopicCard
          title="Key Derived Relationships"
          badge="Quick Ref"
          formulas={[
            {
              equation: "ρ = m / V",
              variables: [
                { symbol: "ρ", meaning: "density", unit: "kg/m³" },
                { symbol: "m", meaning: "mass", unit: "kg" },
                { symbol: "V", meaning: "volume", unit: "m³" },
              ],
              whenToUse: "Fundamental definition. Use to connect mass, volume, and density in any fluids problem.",
            },
            {
              equation: "P_gauge = P_abs − P_atm",
              variables: [
                { symbol: "P_gauge", meaning: "gauge pressure (above atm)", unit: "Pa" },
                { symbol: "P_abs", meaning: "absolute pressure", unit: "Pa" },
                { symbol: "P_atm", meaning: "atmospheric pressure", unit: "Pa" },
              ],
              whenToUse: "Converting between gauge (tire pressure) and absolute pressure. AP problems usually want absolute.",
            },
            {
              equation: "Lift ∝ ½ρ(v_top² − v_bot²) · A",
              variables: [
                { symbol: "v_top", meaning: "air speed over top of wing", unit: "m/s" },
                { symbol: "v_bot", meaning: "air speed under wing", unit: "m/s" },
                { symbol: "A", meaning: "wing area", unit: "m²" },
              ],
              whenToUse: "Qualitative Bernoulli application (airfoil). Faster flow on top → lower pressure → lift upward.",
            },
          ]}
        />
      </div>

      {/* Common Mistakes */}
      <Separator className="my-6" />
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-destructive">
            Common Mistakes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              {
                title: "h is depth, not height above",
                body: "In P = P₀ + ρgh, h is measured downward from the free surface. Deeper → higher pressure.",
              },
              {
                title: "Buoyancy uses fluid density, not object density",
                body: "F_b = ρ_fluid · g · V_sub. A steel ball submerged in mercury has huge F_b because mercury is dense.",
              },
              {
                title: "Continuity: area is cross-sectional, not surface area",
                body: "A₁v₁ = A₂v₂ uses the pipe's cross-section. Doubling diameter quadruples area (A = πr²), quartering speed.",
              },
              {
                title: "Bernoulli requires the same streamline",
                body: "You cannot apply Bernoulli across unconnected streamlines or in turbulent/viscous flow.",
              },
              {
                title: "Floating ≠ zero buoyant force",
                body: "A floating object has F_b = W (net force = 0), not F_b = 0. The buoyant force is very real.",
              },
              {
                title: "Pascal's Law: neglect height differences",
                body: "F₁/A₁ = F₂/A₂ only holds when both pistons are at the same height. Add ρgh correction if heights differ.",
              },
            ].map((m) => (
              <div
                key={m.title}
                className="rounded-md border border-destructive/30 bg-destructive/5 p-3"
              >
                <p className="text-xs font-semibold text-destructive mb-1">{m.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6 print:mt-4">
        AP Physics 1 · Fluids Unit · All formulas assume ideal, incompressible, steady flow unless stated otherwise
      </p>
    </div>
  );
}
