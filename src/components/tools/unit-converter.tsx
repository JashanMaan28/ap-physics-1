"use client";

import { useState, useMemo } from "react";
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
};

// ---------------------------------------------------------------------------
// Quick-reference constants relevant to AP Physics Fluids
// ---------------------------------------------------------------------------

const QUICK_REF = [
  { label: "Water density (ρ_w)",        value: "1000 kg/m³",   note: "at 4 °C" },
  { label: "Air density (ρ_air)",         value: "1.225 kg/m³",  note: "at sea level, 15 °C" },
  { label: "Atm. pressure (P_atm)",       value: "101 325 Pa",   note: "= 1 atm = 760 mmHg" },
  { label: "Gravity (g)",                 value: "9.8 m/s²",     note: "standard AP value" },
  { label: "Mercury density (ρ_Hg)",      value: "13 600 kg/m³", note: "at 20 °C" },
  { label: "Sea-water density",           value: "1025 kg/m³",   note: "approximate" },
  { label: "1 atm in psi",               value: "14.696 psi",    note: "" },
  { label: "1 atm in bar",               value: "1.01325 bar",   note: "" },
];

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
    // Use up to 6 significant figures, trimming trailing zeros
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
      {/* Input row */}
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

      {/* Swap + To-unit row */}
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

      {/* Result */}
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

      {/* Conversion factor */}
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

function QuickReference() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Commonly used constants and values in AP Physics 1 Fluids problems.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {QUICK_REF.map((item) => (
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
  const categoryKeys = Object.keys(CATEGORIES);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Unit Converter</CardTitle>
        <CardDescription>
          AP Physics 1 Fluids — instant conversions across pressure, length, area, volume, density,
          force, and velocity.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={categoryKeys[0]}>
          {/* Category tabs */}
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

          {/* Converter panels */}
          {categoryKeys.map((key) => (
            <TabsContent key={key} value={key}>
              <ConverterPanel category={CATEGORIES[key]} />
            </TabsContent>
          ))}

          {/* Quick-reference tab */}
          <TabsContent value="quickref">
            <QuickReference />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
