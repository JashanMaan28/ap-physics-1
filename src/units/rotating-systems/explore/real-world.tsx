"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RealWorldExample {
  id: number;
  title: string;
  image: string;
  description: string;
  physics: string;
  funFact: string;
  topic: string;
}

const examples: RealWorldExample[] = [
  {
    id: 1,
    title: "Figure Skating Spins",
    image: "skating",
    description:
      "When figure skaters pull their arms in during a spin, they dramatically increase their rotation speed. Tessa Virtue and Scott Moir's spins can exceed 6 revolutions per second.",
    physics:
      "Conservation of angular momentum: L = Iw is constant. Arms out: large I, small w. Arms in: small I, large w. The skater does work against centripetal effects to increase KE.",
    funFact:
      "A skater's moment of inertia can change by a factor of 3-4x between arms extended and tucked, meaning their spin rate increases by the same factor.",
    topic: "conservation-angular",
  },
  {
    id: 2,
    title: "Planetary Orbits (Kepler's 2nd Law)",
    image: "planets",
    description:
      "Planets move faster when closer to the Sun (perihelion) and slower when farther away (aphelion). Earth's orbital speed varies from 30.3 km/s to 29.3 km/s.",
    physics:
      "The gravitational force produces zero torque about the Sun (force is radial). So L = mvr is conserved. When r decreases, v must increase. This is Kepler's second law (equal areas in equal times).",
    funFact:
      "Mercury's orbit is so elliptical that its speed at perihelion (59 km/s) is 50% faster than at aphelion (39 km/s).",
    topic: "angular-momentum",
  },
  {
    id: 3,
    title: "Gyroscopes and Stability",
    image: "gyroscope",
    description:
      "Gyroscopes resist changes to their orientation. They are used in navigation systems, spacecraft attitude control, and bicycle stability.",
    physics:
      "A spinning gyroscope has large angular momentum L along its spin axis. Changing L requires a torque (t = dL/dt). The large L means significant torque is needed to reorient it, providing stability.",
    funFact:
      "The Hubble Space Telescope uses reaction wheels (gyroscopes) to point with accuracy of 0.007 arcseconds — like holding a laser dot on a dime 200 miles away.",
    topic: "angular-momentum",
  },
  {
    id: 4,
    title: "Flywheel Energy Storage",
    image: "flywheel",
    description:
      "Flywheels store energy as rotational kinetic energy. Modern carbon-fiber flywheels spin at 60,000+ RPM and can store energy comparable to lithium batteries.",
    physics:
      "Energy stored = (1/2)Iw². High-performance flywheels maximize w (using strong materials to resist centrifugal forces) and use vacuum chambers to eliminate air resistance.",
    funFact:
      "Formula 1 cars use KERS (Kinetic Energy Recovery System) flywheels that store braking energy and release it for acceleration, providing an extra 80 horsepower boost.",
    topic: "rotational-ke",
  },
  {
    id: 5,
    title: "Neutron Stars (Pulsars)",
    image: "pulsar",
    description:
      "When a massive star collapses, its core shrinks from ~1 million km to ~10 km. The resulting neutron star can spin hundreds of times per second.",
    physics:
      "Conservation of angular momentum during collapse: I_star × w_star = I_neutron × w_neutron. Since R shrinks by ~10^5, I shrinks by ~10^10, so w increases by ~10^10.",
    funFact:
      "The fastest known pulsar (PSR J1748-2446ad) spins at 716 Hz — its surface moves at 24% the speed of light!",
    topic: "conservation-angular",
  },
  {
    id: 6,
    title: "Bowling: Spin vs Speed",
    image: "bowling",
    description:
      "Professional bowlers throw the ball with both translational and rotational motion. The spin creates a curved path as the ball transitions from sliding to rolling.",
    physics:
      "Initially, the ball slides with v > Rw. Friction decelerates translation and accelerates rotation until v = Rw (pure rolling). The spin also creates asymmetric friction that curves the ball's path.",
    funFact:
      "Professional bowlers achieve spin rates of 300-500 RPM. The transition from sliding to rolling typically happens about 2/3 of the way down the lane.",
    topic: "rolling-motion",
  },
  {
    id: 7,
    title: "Helicopter Tail Rotors",
    image: "helicopter",
    description:
      "A helicopter's tail rotor counteracts the torque from the main rotor. Without it, the body would spin in the opposite direction.",
    physics:
      "Newton's 3rd law in rotation: the engine applies torque to spin the main rotor, so the rotor applies equal and opposite torque on the body. The tail rotor provides external torque to keep the body stationary (conservation of angular momentum of the system).",
    funFact:
      "NOTAR (No Tail Rotor) helicopters use a jet of air from the tail boom instead, exploiting the Coanda effect to generate sideways thrust.",
    topic: "conservation-angular",
  },
];

export function RealWorld() {
  const [selectedId, setSelectedId] = useState(1);
  const selected = examples.find((e) => e.id === selectedId)!;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-teal-400">Real-World Applications</h2>
      <p className="text-gray-400 text-sm">
        See how rotating system physics appears in everyday life and cutting-edge
        technology.
      </p>

      {/* Selector */}
      <div className="flex gap-2 flex-wrap">
        {examples.map((ex) => (
          <Button
            key={ex.id}
            onClick={() => setSelectedId(ex.id)}
            variant={ex.id === selectedId ? "default" : "outline"}
            className={
              ex.id === selectedId
                ? "bg-teal-600"
                : "border-gray-700 text-gray-300"
            }
            size="sm"
          >
            {ex.title}
          </Button>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl">{selected.title}</CardTitle>
            <Badge className="bg-teal-900 text-teal-300">{selected.topic}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Placeholder icon */}
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
              <circle cx="40" cy="40" r="35" fill="none" stroke="#14b8a6" strokeWidth="2" />
              <circle cx="40" cy="40" r="5" fill="#5eead4" />
              <line x1="40" y1="40" x2="70" y2="40" stroke="#5eead4" strokeWidth="2">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 40 40"
                  to="360 40 40"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          </div>

          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
              What Happens
            </h3>
            <p className="text-gray-300">{selected.description}</p>
          </div>

          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
              The Physics
            </h3>
            <p className="text-teal-200">{selected.physics}</p>
          </div>

          <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-3">
            <h3 className="text-teal-300 text-xs uppercase tracking-wider mb-1">
              Fun Fact
            </h3>
            <p className="text-gray-300 text-sm">{selected.funFact}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
