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

const OBJECTS = [
  { name: "Wood (Pine)", density: 500, color: "#c4956a", emoji: "block" },
  { name: "Ice", density: 917, color: "#cce5ff", emoji: "cube" },
  { name: "Human Body", density: 985, color: "#ffcba4", emoji: "person" },
  { name: "Rubber Duck", density: 250, color: "#ffe066", emoji: "duck" },
  { name: "Aluminum", density: 2700, color: "#b0b0b0", emoji: "metal" },
  { name: "Steel", density: 7800, color: "#606060", emoji: "metal" },
  { name: "Gold", density: 19300, color: "#ffd700", emoji: "metal" },
  { name: "Cork", density: 120, color: "#d4a76a", emoji: "block" },
];

const g = 9.81;

export function Buoyancy({ onComplete, isComplete }: TopicProps) {
  const [fluidDensity, setFluidDensity] = useState(1000);
  const [selectedObject, setSelectedObject] = useState(0);
  const [objectVolume, setObjectVolume] = useState(0.01); // m³

  const obj = OBJECTS[selectedObject];
  const objectMass = obj.density * objectVolume;
  const weight = objectMass * g;

  const floats = obj.density < fluidDensity;
  const fractionSubmerged = floats
    ? obj.density / fluidDensity
    : 1;
  const displacedVolume = floats ? objectVolume * fractionSubmerged : objectVolume;
  const buoyantForce = fluidDensity * g * displacedVolume;
  const netForce = weight - buoyantForce;
  const apparentWeight = floats ? 0 : netForce;

  // Visualization position: floating objects sit at surface, sinking objects at bottom
  const objectYPercent = floats
    ? 40 - (1 - fractionSubmerged) * 30
    : 70;

  return (
    <div className="space-y-6">
      {/* Concept Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Buoyancy &amp; Archimedes&apos; Principle
              </CardTitle>
              <CardDescription className="mt-1 text-base">
                The upward force on an object equals the weight of displaced
                fluid
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
              Archimedes&apos; Principle
            </h3>
            <p className="font-mono text-xl font-bold tracking-tight">
              F<sub>b</sub> = &#961;<sub>fluid</sub> &middot; V
              <sub>displaced</sub> &middot; g
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              <span>
                <strong>F&#7522;</strong> = Buoyant force
              </span>
              <span>
                <strong>&#961;</strong> = Fluid density
              </span>
              <span>
                <strong>V</strong> = Volume displaced
              </span>
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
            <p>
              Any object submerged in a fluid experiences an upward
              &ldquo;buoyant force&rdquo; equal to the weight of the fluid it
              pushes out of the way. This is why heavy steel ships float &mdash;
              they displace a large volume of water.
            </p>
            <p>
              An object <strong>floats</strong> when its average density is less
              than the fluid&apos;s. When floating, the buoyant force exactly
              equals the object&apos;s weight, and the fraction submerged equals
              &#961;<sub>object</sub>/&#961;<sub>fluid</sub>.
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
          <CardContent className="space-y-5">
            {/* Object Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Object</label>
              <div className="grid grid-cols-2 gap-1.5">
                {OBJECTS.map((o, i) => (
                  <button
                    key={o.name}
                    onClick={() => setSelectedObject(i)}
                    className={`cursor-pointer rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                      selectedObject === i
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-sm"
                        style={{ backgroundColor: o.color }}
                      />
                      {o.name}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      &#961; = {o.density} kg/m&#179;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Fluid Density */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Fluid Density</label>
                <span className="formula-box">
                  {fluidDensity} kg/m&#179;
                </span>
              </div>
              <Slider
                value={[fluidDensity]}
                onValueChange={([v]) => setFluidDensity(v)}
                min={500}
                max={13600}
                step={50}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Oil (500)</span>
                <span>Water (1000)</span>
                <span>Mercury</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Object Volume</label>
                <span className="formula-box">
                  {(objectVolume * 1000).toFixed(1)} L
                </span>
              </div>
              <Slider
                value={[objectVolume]}
                onValueChange={([v]) => setObjectVolume(v)}
                min={0.001}
                max={0.1}
                step={0.001}
                className="cursor-pointer"
              />
            </div>

            <Separator />

            {/* Force Diagram */}
            <div className="space-y-2 rounded-xl bg-muted/50 p-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Forces
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    Weight (down)
                  </span>
                  <span className="font-mono font-semibold">
                    {weight.toFixed(1)} N
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    Buoyant force (up)
                  </span>
                  <span className="font-mono font-semibold text-primary">
                    {buoyantForce.toFixed(1)} N
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>
                    {floats ? "Status" : "Apparent Weight"}
                  </span>
                  <Badge variant={floats ? "default" : "secondary"}>
                    {floats
                      ? `Floats (${(fractionSubmerged * 100).toFixed(0)}% submerged)`
                      : `Sinks (${apparentWeight.toFixed(1)} N)`}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto h-[400px] w-full max-w-md overflow-hidden rounded-2xl border-2 border-border">
              {/* Air region */}
              <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-sky-50 to-sky-100 dark:from-sky-950/20 dark:to-sky-900/20" />

              {/* Water surface */}
              <div className="absolute inset-x-0 top-[35%] h-px bg-blue-400/60" />

              {/* Water region */}
              <div className="absolute inset-x-0 top-[35%] bottom-0 bg-gradient-to-b from-blue-200/40 to-blue-400/50 dark:from-blue-800/30 dark:to-blue-900/40" />

              {/* Object */}
              <div
                className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-xl border-2 shadow-lg transition-all duration-700 ease-out"
                style={{
                  top: `${objectYPercent}%`,
                  width: `${40 + objectVolume * 400}px`,
                  height: `${40 + objectVolume * 400}px`,
                  backgroundColor: obj.color,
                  borderColor: `${obj.color}cc`,
                }}
              >
                <span className="text-[10px] font-bold text-white mix-blend-difference">
                  {obj.name.split(" ")[0]}
                </span>
              </div>

              {/* Force arrows on object */}
              {(() => {
                const objSize = 40 + objectVolume * 400;
                const gap = 8;
                const weightArrowH = Math.min(80, weight / 5 + 20);
                const buoyantArrowH = Math.min(80, buoyantForce / 5 + 20);
                return (
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 transition-all duration-700"
                    style={{ top: `${objectYPercent}%` }}
                  >
                    {/* Weight arrow (down) — starts below the object */}
                    <svg
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: `${objSize + gap}px` }}
                      width="20"
                      height={weightArrowH}
                      viewBox={`0 0 20 ${weightArrowH}`}
                    >
                      <line
                        x1="10"
                        y1="0"
                        x2="10"
                        y2={Math.min(70, weight / 5 + 10)}
                        stroke="#ef4444"
                        strokeWidth="3"
                      />
                      <polygon
                        points={`5,${Math.min(65, weight / 5 + 5)} 15,${Math.min(65, weight / 5 + 5)} 10,${weightArrowH}`}
                        fill="#ef4444"
                      />
                    </svg>

                    {/* Buoyant force arrow (up) — starts above the object */}
                    <svg
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: `-${buoyantArrowH + gap}px` }}
                      width="20"
                      height={buoyantArrowH}
                      viewBox={`0 0 20 ${buoyantArrowH}`}
                    >
                      <line
                        x1="10"
                        y1={buoyantArrowH}
                        x2="10"
                        y2="15"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />
                      <polygon points="5,15 15,15 10,0" fill="#3b82f6" />
                    </svg>
                  </div>
                );
              })()}

              {/* Labels */}
              <div className="absolute left-3 top-3 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium backdrop-blur-sm dark:bg-black/50">
                &#961;<sub>fluid</sub> = {fluidDensity} kg/m&#179;
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium backdrop-blur-sm dark:bg-black/50">
                &#961;<sub>obj</sub> = {obj.density} kg/m&#179;
              </div>
            </div>

            {/* Insight */}
            <div className="mt-4 rounded-xl bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              {floats
                ? `${obj.name} floats because its density (${obj.density}) < fluid density (${fluidDensity}). It's ${(fractionSubmerged * 100).toFixed(0)}% submerged.`
                : `${obj.name} sinks because its density (${obj.density}) > fluid density (${fluidDensity}). It has an apparent weight of ${apparentWeight.toFixed(1)}N in this fluid.`}
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
                Float condition: &#961;_object &lt; &#961;_fluid
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                An object floats when its average density is less than the
                fluid&apos;s. The fraction submerged = &#961;<sub>obj</sub>
                /&#961;<sub>fluid</sub>. Ice floats in water with about 92%
                submerged because &#961;<sub>ice</sub>/&#961;<sub>water</sub> =
                917/1000 = 0.917.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger className="cursor-pointer text-sm">
                Buoyant force depends on displaced volume, not object mass
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                F&#7522; = &#961;<sub>fluid</sub> &middot; V<sub>disp</sub>{" "}
                &middot; g. The buoyant force only cares about how much fluid
                the object pushes aside. A hollow steel ship displaces enough
                water (large V) that the buoyant force equals its weight.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="3">
              <AccordionTrigger className="cursor-pointer text-sm">
                Apparent weight = Actual weight - Buoyant force
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                When you weigh an object submerged in fluid, it seems lighter.
                The &ldquo;apparent weight&rdquo; is W - F&#7522;. This is a
                common AP problem: measure an object in air and in water to find
                its density.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="4">
              <AccordionTrigger className="cursor-pointer text-sm">
                AP Exam trick: Neutral buoyancy
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                When &#961;<sub>object</sub> = &#961;<sub>fluid</sub> exactly,
                the object is neutrally buoyant &mdash; it neither floats nor
                sinks. Submarines achieve this by adjusting their ballast tanks
                to change their average density.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
