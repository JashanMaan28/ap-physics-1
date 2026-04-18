"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tex } from "@/components/ui/math";
import { PhysicsText } from "@/components/ui/physics-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TopicProps {
  onComplete: () => void;
  isComplete: boolean;
}

const FLUID_DENSITIES: Record<string, { rho: number; color: string }> = {
  Water: { rho: 1000, color: "oklch(0.7 0.12 230)" },
  "Salt Water": { rho: 1025, color: "oklch(0.65 0.1 210)" },
  Mercury: { rho: 13600, color: "oklch(0.55 0.02 250)" },
  Oil: { rho: 800, color: "oklch(0.7 0.1 80)" },
  Glycerin: { rho: 1260, color: "oklch(0.65 0.08 100)" },
};

const g = 9.81;
const P_ATM = 101325;

export function PressureDepth({ onComplete, isComplete }: TopicProps) {
  const [depth, setDepth] = useState(5);
  const [selectedFluid, setSelectedFluid] = useState("Water");

  const rho = FLUID_DENSITIES[selectedFluid].rho;
  const fluidColor = FLUID_DENSITIES[selectedFluid].color;
  const gaugePressure = rho * g * depth;
  const absolutePressure = P_ATM + gaugePressure;
  const pressureAtm = absolutePressure / P_ATM;

  const waterFillPercent = Math.min((depth / 50) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Concept Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Pressure & Depth</CardTitle>
              <CardDescription className="mt-1 text-base">
                How pressure increases with depth in a fluid
              </CardDescription>
            </div>
            <Button
              variant={isComplete ? "default" : "outline"}
              size="sm"
              onClick={onComplete}
              className="cursor-pointer"
            >
              {isComplete ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="key-concept">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Key Formula
            </h3>
            <div className="text-xl font-bold tracking-tight">
              <Tex display>{"P = P_0 + \\rho gh"}</Tex>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-4">
              <span><Tex>P</Tex> = Absolute pressure</span>
              <span><Tex>P_0</Tex> = Surface pressure</span>
              <span><Tex>{"\\rho"}</Tex> = Fluid density</span>
              <span><Tex>h</Tex> = Depth</span>
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              Pressure in a fluid increases linearly with depth. At the surface,
              the pressure equals atmospheric pressure (101,325 Pa). As you go
              deeper, the weight of the fluid above adds to this.
            </p>
            <p>
              This is why your ears hurt when you dive deep in a pool &mdash; the
              gauge pressure (&#961;gh) increases, creating a net force on your
              eardrums.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Simulation */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fluid Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fluid Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(FLUID_DENSITIES).map((fluid) => (
                  <Badge
                    key={fluid}
                    variant={selectedFluid === fluid ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                    onClick={() => setSelectedFluid(fluid)}
                  >
                    {fluid}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                &#961; = {rho} kg/m&#179;
              </p>
            </div>

            <Separator />

            {/* Depth Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Depth</label>
                <span className="font-mono text-sm font-semibold text-primary">
                  {depth.toFixed(1)} m
                </span>
              </div>
              <Slider
                value={[depth]}
                onValueChange={([v]) => setDepth(v)}
                min={0}
                max={50}
                step={0.5}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 m (surface)</span>
                <span>50 m</span>
              </div>
            </div>

            <Separator />

            {/* Results */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Calculated Values</h4>
              <div className="space-y-2">
                <ResultRow
                  label="Gauge Pressure (&#961;gh)"
                  value={`${(gaugePressure / 1000).toFixed(1)} kPa`}
                />
                <ResultRow
                  label="Atmospheric (P&#8320;)"
                  value={`${(P_ATM / 1000).toFixed(1)} kPa`}
                />
                <Separator />
                <ResultRow
                  label="Absolute Pressure"
                  value={`${(absolutePressure / 1000).toFixed(1)} kPa`}
                  highlight
                />
                <ResultRow
                  label="In atmospheres"
                  value={`${pressureAtm.toFixed(2)} atm`}
                  highlight
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-[400px] w-full max-w-md overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-950/30 dark:to-sky-900/10">
              {/* Sky / Air area */}
              <div
                className="absolute inset-x-0 top-0 flex items-center justify-center text-xs font-medium text-muted-foreground transition-all duration-500"
                style={{ height: `${100 - waterFillPercent}%` }}
              >
                {waterFillPercent < 80 && (
                  <div className="flex flex-col items-center gap-1">
                    <span>Atmosphere</span>
                    <span className="font-mono text-[10px]">
                      P&#8320; = 101.3 kPa
                    </span>
                  </div>
                )}
              </div>

              {/* Water surface line */}
              <div
                className="absolute inset-x-0 z-10 h-0.5 transition-all duration-500"
                style={{
                  top: `${100 - waterFillPercent}%`,
                  backgroundColor: fluidColor,
                  opacity: 0.8,
                }}
              />

              {/* Water fill */}
              <div
                className="absolute inset-x-0 bottom-0 transition-all duration-500"
                style={{
                  height: `${waterFillPercent}%`,
                  background: `linear-gradient(180deg, ${fluidColor}40 0%, ${fluidColor}90 100%)`,
                }}
              >
                {/* Pressure arrows at different depths */}
                {[0.2, 0.4, 0.6, 0.8].map((frac) => {
                  const arrowDepth = depth * frac;
                  const arrowPressure = P_ATM + rho * g * arrowDepth;
                  const arrowWidth = 20 + (frac * 60);
                  return (
                    <div
                      key={frac}
                      className="absolute flex items-center gap-2 transition-all duration-300"
                      style={{
                        top: `${frac * 100}%`,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Left arrow */}
                      <svg
                        width={arrowWidth}
                        height="12"
                        className="opacity-60"
                      >
                        <line
                          x1={arrowWidth}
                          y1="6"
                          x2="4"
                          y2="6"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <polygon
                          points="0,6 8,2 8,10"
                          fill="white"
                        />
                      </svg>
                      <span className="whitespace-nowrap rounded-md bg-black/40 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-sm">
                        {(arrowPressure / 1000).toFixed(0)} kPa
                      </span>
                      {/* Right arrow */}
                      <svg
                        width={arrowWidth}
                        height="12"
                        className="opacity-60"
                      >
                        <line
                          x1="0"
                          y1="6"
                          x2={arrowWidth - 4}
                          y2="6"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <polygon
                          points={`${arrowWidth},6 ${arrowWidth - 8},2 ${arrowWidth - 8},10`}
                          fill="white"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Depth indicator on the right */}
              <div
                className="absolute right-3 z-20 flex items-center gap-1 transition-all duration-500"
                style={{ top: `${100 - waterFillPercent}%` }}
              >
                <div className="flex h-6 items-center rounded-md bg-primary px-2 font-mono text-[10px] font-bold text-primary-foreground shadow-lg">
                  h = {depth.toFixed(1)}m
                </div>
              </div>
            </div>

            {/* Quick insight */}
            <div className="mt-4 rounded-xl bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              {depth === 0
                ? "At the surface, pressure equals atmospheric pressure only."
                : depth < 10
                  ? `At ${depth.toFixed(1)}m, you're experiencing ${pressureAtm.toFixed(1)}x atmospheric pressure.`
                  : depth < 30
                    ? `Recreational scuba limit is ~30m. You're at ${pressureAtm.toFixed(1)} atm.`
                    : `Deep dive territory! Pressure is ${pressureAtm.toFixed(1)}x what you feel at the surface.`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Takeaways */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion multiple className="w-full">
            <AccordionItem value="1">
              <AccordionTrigger className="cursor-pointer text-sm">
                Pressure depends only on depth, not container shape
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                This is sometimes called the <strong>hydrostatic paradox</strong>
                . A narrow tube and a wide lake at the same depth have the same
                pressure. The formula P = P&#8320; + &#961;gh doesn&apos;t include
                the width or volume of the container.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="cursor-pointer text-sm">
                Gauge vs. Absolute pressure
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <strong>Gauge pressure</strong> (&#961;gh) measures only the
                pressure from the fluid above. <strong>Absolute pressure</strong>{" "}
                includes atmospheric pressure too. A tire pressure gauge reads
                gauge pressure. Most AP Physics problems specify which one they
                want.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="cursor-pointer text-sm">
                Pressure acts in all directions equally
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                At any point in a static fluid, pressure pushes equally in every
                direction (up, down, sideways). This is why the arrows in the
                visualization point both left and right. This isotropy of
                pressure is fundamental to Pascal&apos;s Law.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="4">
              <AccordionTrigger className="cursor-pointer text-sm">
                AP Exam tip: Watch your units
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Density is in kg/m&#179;, depth in meters, g = 9.8 or 10 m/s&#178;.
                This gives pressure in <strong>Pascals</strong> (Pa = N/m&#178;).
                1 atm = 101,325 Pa &#8776; 10&#8309; Pa. The exam often uses
                approximations like g = 10 m/s&#178;.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${highlight ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"}`}
      dangerouslySetInnerHTML={{
        __html: `<span>${label}</span><span class="font-mono">${value}</span>`,
      }}
    />
  );
}
