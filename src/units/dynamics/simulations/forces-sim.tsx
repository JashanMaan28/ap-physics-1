"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

export function ForcesSim() {
  return (
    <PhETEmbed
      predictionManifest={getSimulationManifestBySimId("forces-and-motion-phet")}
      title="Forces and Motion: Basics"
      simUrl="https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html"
      description="Apply forces to objects and observe acceleration. Explore net force, friction, and Newton's laws in action."
      tips={[
        "Start with the 'Net Force' tab to see tug-of-war with force arrows",
        "Use the 'Motion' tab to push objects with and without friction",
        "Enable 'Values' to see numeric force and acceleration readouts",
        "Try stacking objects to see how mass affects acceleration",
      ]}
    />
  );
}
