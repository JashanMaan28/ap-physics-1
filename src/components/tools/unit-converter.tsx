"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ---------------------------------------------------------------------------
// Types & conversion data
// ---------------------------------------------------------------------------

interface UnitDef {
  label: string;
  toBase: number; // multiply by this to get base unit
}

interface Category {
  name: string;
  base: string;
  units: Record<string, UnitDef>;
}

const CATEGORIES: Record<string, Category> = {
  length: {
    name: "Length",
    base: "m",
    units: {
      m:  { label: "Meters (m)",      toBase: 1 },
      cm: { label: "Centimeters (cm)", toBase: 0.01 },
      mm: { label: "Millimeters (mm)", toBase: 0.001 },
      km: { label: "Kilometers (km)",  toBase: 1_000 },
      ft: { label: "Feet (ft)",        toBase: 0.3048 },
      in: { label: "Inches (in)",      toBase: 0.0254 },
    },
  },
  time: {
    name: "Time",
    base: "s",
    units: {
      s:   { label: "Seconds (s)",     toBase: 1 },
      ms:  { label: "Milliseconds (ms)", toBase: 0.001 },
      min: { label: "Minutes (min)",   toBase: 60 },
      h:   { label: "Hours (h)",       toBase: 3600 },
    },
  },
  velocity: {
    name: "Velocity",
    base: "m/s",
    units: {
      "m/s":   { label: "Meters/second (m/s)",   toBase: 1 },
      "km/h":  { label: "Kilometers/hour (km/h)", toBase: 1 / 3.6 },
      "ft/s":  { label: "Feet/second (ft/s)",     toBase: 0.3048 },
      mph:     { label: "Miles/hour (mph)",        toBase: 0.44704 },
    },
  },
  acceleration: {
    name: "Acceleration",
    base: "m/s²",
    units: {
      "m/s²":  { label: "Meters/second² (m/s²)",  toBase: 1 },
      g:       { label: "g (Earth gravities)",     toBase: 9.8 },
      "ft/s²": { label: "Feet/second² (ft/s²)",    toBase: 0.3048 },
    },
  },
  force: {
    name: "Force",
    base: "N",
    units: {
      N:    { label: "Newtons (N)",       toBase: 1 },
      kN:   { label: "Kilonewtons (kN)",  toBase: 1_000 },
      lbf:  { label: "Pound-force (lbf)", toBase: 4.44822 },
      dyne: { label: "Dyne (dyne)",       toBase: 1e-5 },
    },
  },
  mass: {
    name: "Mass",
    base: "kg",
    units: {
      kg:  { label: "Kilograms (kg)",   toBase: 1 },
      g:   { label: "Grams (g)",        toBase: 0.001 },
      lb:  { label: "Pounds-mass (lb)", toBase: 0.453592 },
      oz:  { label: "Ounces (oz)",      toBase: 0.0283495 },
      t:   { label: "Metric tons (t)",  toBase: 1000 },
    },
  },
  energy: {
    name: "Energy",
    base: "J",
    units: {
      J:     { label: "Joules (J)",         toBase: 1 },
      kJ:    { label: "Kilojoules (kJ)",    toBase: 1000 },
      cal:   { label: "Calories (cal)",      toBase: 4.184 },
      kcal:  { label: "Kilocalories (kcal)", toBase: 4184 },
      "ft·lb": { label: "Foot-pounds (ft·lb)", toBase: 1.35582 },
      eV:    { label: "Electronvolts (eV)",  toBase: 1.602176634e-19 },
    },
  },
  power: {
    name: "Power",
    base: "W",
    units: {
      W:   { label: "Watts (W)",      toBase: 1 },
      kW:  { label: "Kilowatts (kW)",  toBase: 1000 },
      hp:  { label: "Horsepower (hp)", toBase: 745.7 },
      "ft·lb/s": { label: "ft·lb/s",   toBase: 1.35582 },
    },
  },
  angle: {
    name: "Angle",
    base: "rad",
    units: {
      rad: { label: "Radians (rad)",    toBase: 1 },
      deg: { label: "Degrees (°)",      toBase: Math.PI / 180 },
      rev: { label: "Revolutions (rev)", toBase: 2 * Math.PI },
    },
  },
  "angular-velocity": {
    name: "Angular velocity",
    base: "rad/s",
    units: {
      "rad/s": { label: "rad/s",           toBase: 1 },
      "rev/s": { label: "rev/s (Hz)",      toBase: 2 * Math.PI },
      rpm:     { label: "rev/min (rpm)",   toBase: 2 * Math.PI / 60 },
      "deg/s": { label: "deg/s",           toBase: Math.PI / 180 },
    },
  },
  pressure: {
    name: "Pressure",
    base: "Pa",
    units: {
      Pa:    { label: "Pascals (Pa)",              toBase: 1 },
      kPa:   { label: "Kilopascals (kPa)",         toBase: 1_000 },
      atm:   { label: "Atmospheres (atm)",          toBase: 101_325 },
      mmHg:  { label: "Millimeters of Hg (mmHg)",  toBase: 133.322 },
      psi:   { label: "Pounds/in² (psi)",           toBase: 6_894.76 },
      bar:   { label: "Bar (bar)",                  toBase: 100_000 },
    },
  },
  area: {
    name: "Area",
    base: "m²",
    units: {
      "m²":   { label: "Square meters (m²)",     toBase: 1 },
      "cm²":  { label: "Square centimeters (cm²)", toBase: 1e-4 },
      "mm²":  { label: "Square millimeters (mm²)", toBase: 1e-6 },
      "ft²":  { label: "Square feet (ft²)",        toBase: 0.092903 },
      "in²":  { label: "Square inches (in²)",      toBase: 6.4516e-4 },
    },
  },
  volume: {
    name: "Volume",
    base: "m³",
    units: {
      "m³":  { label: "Cubic meters (m³)",   toBase: 1 },
      L:     { label: "Liters (L)",           toBase: 0.001 },
      mL:    { label: "Milliliters (mL)",     toBase: 1e-6 },
      "cm³": { label: "Cubic centimeters (cm³)", toBase: 1e-6 },
      gal:   { label: "Gallons (gal)",        toBase: 0.00378541 },
      "ft³": { label: "Cubic feet (ft³)",     toBase: 0.0283168 },
    },
  },
  density: {
    name: "Density",
    base: "kg/m³",
    units: {
      "kg/m³":  { label: "kg per m³ (kg/m³)",    toBase: 1 },
      "g/cm³":  { label: "g per cm³ (g/cm³)",    toBase: 1_000 },
      "g/mL":   { label: "g per mL (g/mL)",      toBase: 1_000 },
      "lb/ft³": { label: "lb per ft³ (lb/ft³)",  toBase: 16.0185 },
    },
  },
  momentum: {
    name: "Momentum",
    base: "kg·m/s",
    units: {
      "kg·m/s": { label: "kg·m/s",      toBase: 1 },
      "g·cm/s": { label: "g·cm/s",      toBase: 1e-5 },
      "N·s":    { label: "N·s",         toBase: 1 },
    },
  },
};

// ---------------------------------------------------------------------------
// Unit-specific defaults and quick references
// ---------------------------------------------------------------------------

interface QuickRefItem {
  label: string;
  value: string;
  note?: string;
}

interface UnitPreset {
  label: string;
  categories: string[];
  defaultCategory: string;
  quickRef: QuickRefItem[];
}

const G_CONST = { label: "Gravity (g)", value: "9.8 m/s²", note: "AP Physics 1 standard" };

const UNIT_PRESETS: Record<string, UnitPreset> = {
  kinematics: {
    label: "Kinematics",
    categories: ["length", "time", "velocity", "acceleration", "angle"],
    defaultCategory: "velocity",
    quickRef: [
      G_CONST,
      { label: "Speed of sound (air)", value: "343 m/s", note: "at 20 °C" },
      { label: "60 mph", value: "26.82 m/s", note: "typical highway speed" },
      { label: "1 km/h", value: "0.2778 m/s" },
      { label: "1 ft", value: "0.3048 m" },
    ],
  },
  dynamics: {
    label: "Dynamics",
    categories: ["force", "mass", "acceleration", "length", "angle"],
    defaultCategory: "force",
    quickRef: [
      G_CONST,
      { label: "Weight of 1 kg", value: "9.8 N" },
      { label: "1 lbf", value: "4.448 N" },
      { label: "μ_k rubber on dry concrete", value: "≈ 0.6–0.85" },
      { label: "μ_k steel on ice", value: "≈ 0.03" },
    ],
  },
  energy: {
    label: "Energy & Work",
    categories: ["energy", "power", "force", "length", "mass", "velocity"],
    defaultCategory: "energy",
    quickRef: [
      G_CONST,
      { label: "1 kWh", value: "3.6 × 10⁶ J" },
      { label: "1 cal", value: "4.184 J" },
      { label: "1 hp", value: "745.7 W" },
      { label: "KE of 1 kg at 10 m/s", value: "50 J" },
    ],
  },
  momentum: {
    label: "Momentum",
    categories: ["momentum", "force", "mass", "velocity", "time"],
    defaultCategory: "momentum",
    quickRef: [
      G_CONST,
      { label: "p of 1 kg at 10 m/s", value: "10 kg·m/s" },
      { label: "1 N·s", value: "1 kg·m/s" },
      { label: "Impulse rule", value: "FΔt = Δp" },
    ],
  },
  torque: {
    label: "Torque & Rotation",
    categories: ["force", "length", "angle", "angular-velocity", "energy"],
    defaultCategory: "angle",
    quickRef: [
      G_CONST,
      { label: "1 rev", value: "2π rad ≈ 6.283 rad" },
      { label: "1 rpm", value: "0.1047 rad/s" },
      { label: "Solid cylinder I", value: "½ MR²" },
      { label: "Thin hoop I", value: "MR²" },
    ],
  },
  "rotating-systems": {
    label: "Rotating systems",
    categories: ["angle", "angular-velocity", "length", "velocity", "energy"],
    defaultCategory: "angular-velocity",
    quickRef: [
      G_CONST,
      { label: "1 rev/s", value: "2π rad/s ≈ 6.283 rad/s" },
      { label: "Rolling constraint", value: "v = rω" },
      { label: "Earth rotation ω", value: "7.27 × 10⁻⁵ rad/s" },
    ],
  },
  oscillations: {
    label: "Oscillations",
    categories: ["time", "length", "mass", "angular-velocity", "energy", "force"],
    defaultCategory: "time",
    quickRef: [
      G_CONST,
      { label: "Pendulum period", value: "T = 2π√(L/g)" },
      { label: "Spring-mass period", value: "T = 2π√(m/k)" },
      { label: "1 Hz", value: "2π rad/s" },
    ],
  },
  fluids: {
    label: "Fluids",
    categories: ["pressure", "density", "volume", "area", "length", "force", "velocity"],
    defaultCategory: "pressure",
    quickRef: [
      G_CONST,
      { label: "Water density (ρ_w)", value: "1000 kg/m³", note: "at 4 °C" },
      { label: "Air density (ρ_air)", value: "1.225 kg/m³", note: "at sea level, 15 °C" },
      { label: "Atm. pressure (P_atm)", value: "101 325 Pa", note: "= 1 atm = 760 mmHg" },
      { label: "Mercury density (ρ_Hg)", value: "13 600 kg/m³" },
      { label: "Sea-water density", value: "1025 kg/m³" },
      { label: "1 atm in psi", value: "14.696 psi" },
    ],
  },
};

const DEFAULT_PRESET: UnitPreset = {
  label: "AP Physics 1",
  categories: Object.keys(CATEGORIES),
  defaultCategory: "length",
  quickRef: [
    G_CONST,
    { label: "Speed of light (c)", value: "3.00 × 10⁸ m/s" },
    { label: "1 atm", value: "101 325 Pa" },
    { label: "Water density", value: "1000 kg/m³" },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function convert(value: number, fromUnit: string, toUnit: string, category: Category): number {
  const base = value * category.units[fromUnit].toBase;
  return base / category.units[toUnit].toBase;
}

function conversionFactor(fromUnit: string, toUnit: string, category: Category): number {
  return category.units[fromUnit].toBase / category.units[toUnit].toBase;
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e-3 && abs < 1e7) {
    return parseFloat(n.toPrecision(6)).toString();
  }
  return n.toExponential(4);
}

// ---------------------------------------------------------------------------
// Sub-component: single converter panel
// ---------------------------------------------------------------------------

function ConverterPanel({ category }: { category: Category }) {
  const unitKeys = Object.keys(category.units);
  const [rawInput, setRawInput] = useState("1");
  const [fromUnit, setFromUnit] = useState(unitKeys[0]);
  const [toUnit, setToUnit] = useState(unitKeys[1] ?? unitKeys[0]);

  const inputValue = parseFloat(rawInput);
  const isValid = !isNaN(inputValue);

  const result = useMemo(() => {
    if (!isValid) return null;
    return convert(inputValue, fromUnit, toUnit, category);
  }, [inputValue, fromUnit, toUnit, category, isValid]);

  const factor = useMemo(
    () => conversionFactor(fromUnit, toUnit, category),
    [fromUnit, toUnit, category]
  );

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Value</Label>
          <input
            type="number"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter value…"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">From unit</Label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {category.units[k].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="flex justify-start sm:justify-center">
          <Button variant="outline" size="sm" onClick={handleSwap} className="gap-1.5">
            ⇄ Swap
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">To unit</Label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {category.units[k].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg bg-muted/50 border px-5 py-4 space-y-1">
        {isValid && result !== null ? (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Result</p>
            <p className="font-mono text-2xl font-semibold break-all">
              {formatNumber(result)}
              <span className="ml-2 text-base font-normal text-muted-foreground">{toUnit}</span>
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {formatNumber(inputValue)} {fromUnit} = {formatNumber(result)} {toUnit}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">Enter a valid number above.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Conversion factor:</span>
        <Badge variant="secondary" className="font-mono text-xs">
          1 {fromUnit} = {formatNumber(factor)} {toUnit}
        </Badge>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick-reference panel
// ---------------------------------------------------------------------------

function QuickReference({ preset }: { preset: UnitPreset }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Commonly used constants and values for {preset.label}.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {preset.quickRef.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between rounded-md border bg-background px-3 py-2.5 gap-2"
          >
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              {item.note && (
                <p className="text-xs text-muted-foreground/60 italic">{item.note}</p>
              )}
            </div>
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              {item.value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function UnitConverter() {
  const pathname = usePathname();
  const slug = pathname.split("/")[1];
  const preset = UNIT_PRESETS[slug] ?? DEFAULT_PRESET;

  const categoryKeys = preset.categories.filter((key) => CATEGORIES[key]);
  const defaultCategory = CATEGORIES[preset.defaultCategory]
    ? preset.defaultCategory
    : categoryKeys[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Unit Converter</CardTitle>
        <CardDescription>
          {preset.label} · instant conversions across {categoryKeys.map((k) => CATEGORIES[k].name.toLowerCase()).join(", ")}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={defaultCategory}>
          <TabsList className="flex flex-wrap h-auto gap-1 mb-5">
            {categoryKeys.map((key) => (
              <TabsTrigger key={key} value={key} className="text-xs px-2.5 py-1">
                {CATEGORIES[key].name}
              </TabsTrigger>
            ))}
            <TabsTrigger value="quickref" className="text-xs px-2.5 py-1">
              Quick Ref
            </TabsTrigger>
          </TabsList>

          {categoryKeys.map((key) => (
            <TabsContent key={key} value={key}>
              <ConverterPanel category={CATEGORIES[key]} />
            </TabsContent>
          ))}

          <TabsContent value="quickref">
            <QuickReference preset={preset} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
