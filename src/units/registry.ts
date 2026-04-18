import type { UnitConfig } from "@/types/unit";
import { kinematicsConfig } from "./kinematics/config";
import { dynamicsConfig } from "./dynamics/config";
import { energyConfig } from "./energy/config";
import { momentumConfig } from "./momentum/config";
import { torqueConfig } from "./torque/config";
import { rotatingSystemsConfig } from "./rotating-systems/config";
import { oscillationsConfig } from "./oscillations/config";
import { fluidsConfig } from "./fluids/config";

// All unit configs keyed by slug. Importing this module pulls in every unit's
// component map (client-only factories, topic components, simulations, etc.),
// so it is NOT safe to import from a server component. Server components that
// only need metadata should import from `@/units/meta` instead.
export const unitConfigs: Record<string, UnitConfig> = {
  kinematics: kinematicsConfig,
  dynamics: dynamicsConfig,
  energy: energyConfig,
  momentum: momentumConfig,
  torque: torqueConfig,
  "rotating-systems": rotatingSystemsConfig,
  oscillations: oscillationsConfig,
  fluids: fluidsConfig,
};

export { units, unitSlugs, getUnitBySlug } from "./meta";
