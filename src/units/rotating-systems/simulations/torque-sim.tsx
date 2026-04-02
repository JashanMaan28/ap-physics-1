"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function TorquePhETSim() {
  return (
    <PhETEmbed
      title="Torque"
      simUrl="https://phet.colorado.edu/sims/html/torque/latest/torque_en.html"
      description="Apply forces to a rotating platform and observe angular acceleration. Explore the relationship between torque, moment of inertia, and angular motion."
      tips={[
        "Change the moment arm to see how distance from the axis affects torque",
        "Add masses at different radii to change the moment of inertia",
        "Observe how τ = Iα plays out — more inertia means less angular acceleration for the same torque",
        "Compare a solid disk to a ring with the same mass",
      ]}
    />
  );
}
