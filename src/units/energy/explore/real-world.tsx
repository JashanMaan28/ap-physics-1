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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Application {
  id: number;
  title: string;
  category: string;
  description: string;
  physics: string;
  numbers: string;
}

const applications: Application[] = [
  {
    id: 1,
    title: "Roller Coasters",
    category: "Entertainment",
    description:
      "Roller coasters are a spectacular demonstration of energy conservation. The chain lift does work to give the car gravitational PE at the top of the first hill. As the car descends, PE converts to KE, and the car speeds up. Going over subsequent hills, KE converts back to PE.",
    physics:
      "The first hill must be the tallest (unless additional motors are used) because friction gradually removes mechanical energy as thermal energy. The speed at any point depends only on the height difference from the start (ignoring friction).",
    numbers:
      "A 500 kg car at 40 m height has PE = 196,000 J. At the bottom, v = sqrt(2 x 9.8 x 40) = 28 m/s (about 63 mph).",
  },
  {
    id: 2,
    title: "Bungee Jumping",
    category: "Sports",
    description:
      "A bungee jumper leaps from a platform and falls freely until the elastic cord pulls taut. The cord then stretches like a spring, converting the jumper's KE and remaining PE into elastic PE. At the lowest point, all energy is stored in the stretched cord.",
    physics:
      "Three energy forms interact: gravitational PE (mgh), kinetic energy (1/2 mv^2), and elastic PE (1/2 kx^2). The jumper oscillates up and down as energy converts between these forms. Air resistance and cord hysteresis gradually dissipate energy.",
    numbers:
      "A 70 kg jumper falling 50 m has PE = 34,300 J. The cord must absorb all this energy at the lowest point. With k = 50 N/m, the cord stretches about 37 m beyond its natural length.",
  },
  {
    id: 3,
    title: "Regenerative Braking in Electric Cars",
    category: "Transportation",
    description:
      "Electric and hybrid vehicles use regenerative braking to recover kinetic energy during deceleration. Instead of converting KE entirely to heat through friction brakes, the electric motor runs as a generator, converting KE back to electrical energy stored in the battery.",
    physics:
      "Traditional brakes waste KE as heat (non-conservative force). Regenerative braking captures 60-70% of the KE. This is essentially the work-energy theorem in reverse: the generator does negative work on the car, reducing KE while doing positive work on the battery.",
    numbers:
      "A 2000 kg Tesla at 30 m/s has KE = 900,000 J. Recovering 65% means 585 kJ returned to the battery, enough to drive about 1-2 km further.",
  },
  {
    id: 4,
    title: "Hydroelectric Power Plants",
    category: "Energy Production",
    description:
      "Dams convert the gravitational PE of water stored at elevation into electricity. Water falls through turbines, converting PE to KE to rotational energy to electrical energy.",
    physics:
      "The power output depends on the height of the water (head) and flow rate: P = rho x g x h x Q x efficiency, where Q is volume flow rate. This is a direct application of P = W/t = mgh/t.",
    numbers:
      "The Hoover Dam (221 m head) with 2,080 MW capacity. Each cubic meter of water falling 221 m releases about 2.17 MJ of energy.",
  },
  {
    id: 5,
    title: "Pole Vaulting",
    category: "Athletics",
    description:
      "A pole vaulter converts kinetic energy from their sprint into gravitational PE at the top of the vault. The flexible pole temporarily stores energy as elastic PE during the bend, acting as an energy transfer mechanism.",
    physics:
      "Sequence: KE (running) -> elastic PE (pole bending) -> KE (upward launch) + gravitational PE -> pure gravitational PE (at peak). The vaulter also does additional work by pushing off the pole with their arms.",
    numbers:
      "A 75 kg vaulter running at 10 m/s has KE = 3750 J. This alone could raise them to h = KE/(mg) = 5.1 m. World records exceed 6 m because athletes add energy via arm push.",
  },
  {
    id: 6,
    title: "Wind Turbines",
    category: "Energy Production",
    description:
      "Wind turbines capture the kinetic energy of moving air and convert it to rotational energy and then to electricity. The maximum theoretical efficiency (Betz limit) is 59.3%.",
    physics:
      "The KE available in wind is proportional to v^3 (since KE per unit time = 1/2 x rho x A x v^3). Doubling wind speed increases available power by 8 times. This is why turbine placement in high-wind areas is critical.",
    numbers:
      "A turbine with 50 m blades in 12 m/s wind: P = 0.5 x 1.225 x pi x 50^2 x 12^3 x 0.4 = 3.3 MW.",
  },
];

export function RealWorld() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-World Applications</CardTitle>
          <CardDescription>
            See how work, energy, and power concepts apply to {applications.length} real-world
            scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {applications.map((app, i) => (
              <Button
                key={app.id}
                variant={selected === i ? "default" : "outline"}
                size="sm"
                onClick={() => setSelected(i)}
              >
                {app.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{applications[selected].title}</CardTitle>
            <Badge>{applications[selected].category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
              Description
            </h4>
            <p>{applications[selected].description}</p>
          </div>

          <Separator />

          <Accordion>
            <AccordionItem value="physics">
              <AccordionTrigger>Physics Explanation</AccordionTrigger>
              <AccordionContent>
                <p>{applications[selected].physics}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="numbers">
              <AccordionTrigger>By the Numbers</AccordionTrigger>
              <AccordionContent>
                <p className="font-mono text-sm bg-amber-50 p-3 rounded">
                  {applications[selected].numbers}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
