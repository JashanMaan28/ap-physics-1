export interface UnitMeta {
  slug: string;
  number: number;
  name: string;
  shortName: string;
  examWeight: string;
  color: string;
  description: string;
}

export const units: UnitMeta[] = [
  {
    slug: "kinematics",
    number: 1,
    name: "Kinematics",
    shortName: "Kinematics",
    examWeight: "10–15%",
    color: "#3b82f6",
    description: "Position, velocity, acceleration, kinematic equations, projectile motion, and motion graphs.",
  },
  {
    slug: "dynamics",
    number: 2,
    name: "Force and Translational Dynamics",
    shortName: "Dynamics",
    examWeight: "18–23%",
    color: "#ef4444",
    description: "Newton's three laws, friction, tension, normal force, inclined planes, and Atwood machines.",
  },
  {
    slug: "energy",
    number: 3,
    name: "Work, Energy, and Power",
    shortName: "Energy",
    examWeight: "18–23%",
    color: "#f59e0b",
    description: "Work, kinetic energy, gravitational and spring PE, conservation of energy, and power.",
  },
  {
    slug: "momentum",
    number: 4,
    name: "Linear Momentum",
    shortName: "Momentum",
    examWeight: "10–15%",
    color: "#8b5cf6",
    description: "Momentum, impulse, conservation of momentum, and elastic/inelastic collisions.",
  },
  {
    slug: "torque",
    number: 5,
    name: "Torque and Rotational Dynamics",
    shortName: "Torque",
    examWeight: "10–15%",
    color: "#ec4899",
    description: "Torque, rotational equilibrium, moment of inertia, and Newton's second law for rotation.",
  },
  {
    slug: "rotating-systems",
    number: 6,
    name: "Energy and Momentum of Rotating Systems",
    shortName: "Rotating Systems",
    examWeight: "5–8%",
    color: "#14b8a6",
    description: "Rotational KE, angular momentum, conservation of angular momentum, and rolling motion.",
  },
  {
    slug: "oscillations",
    number: 7,
    name: "Oscillations",
    shortName: "Oscillations",
    examWeight: "5–8%",
    color: "#06b6d4",
    description: "Simple harmonic motion, spring-mass systems, pendulums, and energy in SHM.",
  },
  {
    slug: "fluids",
    number: 8,
    name: "Fluids",
    shortName: "Fluids",
    examWeight: "10–15%",
    color: "#0ea5e9",
    description: "Pressure, Pascal's law, buoyancy, continuity equation, and Bernoulli's equation.",
  },
];

export function getUnitBySlug(slug: string): UnitMeta | undefined {
  return units.find((u) => u.slug === slug);
}

export const unitSlugs = units.map((u) => u.slug);
