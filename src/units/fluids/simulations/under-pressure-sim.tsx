"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function UnderPressureSim() {
  return (
    <PhETEmbed
      title="Under Pressure"
      simUrl="https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_en.html"
      description="Explore how pressure varies with depth, fluid density, and gravity. Verify P = P₀ + ρgh with virtual pressure sensors."
      tips={[
        "Place sensors at different depths to see pressure increase linearly",
        "Change the fluid to see how density affects pressure at the same depth",
        "Try the 'Mystery' tab to identify fluids by their density",
        "Notice: pressure at the same depth is the same regardless of container shape",
      ]}
    />
  );
}
