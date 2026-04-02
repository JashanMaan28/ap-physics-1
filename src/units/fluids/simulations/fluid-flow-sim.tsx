"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";

export function FluidFlowSim() {
  return (
    <PhETEmbed
      title="Fluid Pressure and Flow"
      simUrl="https://phet.colorado.edu/sims/html/fluid-pressure-and-flow/latest/fluid-pressure-and-flow_en.html"
      description="Visualize fluid flow through pipes of varying width. See continuity (A₁v₁ = A₂v₂) and Bernoulli's principle in action."
      tips={[
        "Narrow the pipe and watch the flow speed increase (continuity equation)",
        "Enable pressure dots to see pressure drop where velocity increases (Bernoulli)",
        "Use the 'Water Tower' tab to see Torricelli's theorem",
        "The flux (flow rate) stays constant — same volume per second everywhere in the pipe",
      ]}
    />
  );
}
