"use client";

import { PhETEmbed } from "@/components/simulations/phet-embed";
import { getSimulationManifestBySimId } from "@/lib/simulation-manifests";

export function FrictionSim() {
  return (
    <PhETEmbed
      predictionManifest={getSimulationManifestBySimId("friction-phet")}
      title="Friction"
      simUrl="https://phet.colorado.edu/sims/html/friction/latest/friction_en.html"
      description="Explore friction at the molecular level. Rub two surfaces together and observe heat generation from kinetic friction."
      tips={[
        "Drag the top book back and forth to generate friction",
        "Zoom in to see the atomic-level interactions causing friction",
        "Notice how faster rubbing generates more heat",
        "This shows why kinetic friction converts kinetic energy to thermal energy",
      ]}
    />
  );
}
