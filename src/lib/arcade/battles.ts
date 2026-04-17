import type { BossBattle } from "./types";

export const bossBattles: BossBattle[] = [
  {
    unitSlug: "kinematics",
    title: "Meteor Alley",
    flavor: "Your drone camera has one launch chance. Predict the path cleanly or lose the shot.",
    reward: "Unlock precision XP and a share-card brag line.",
    questions: [
      {
        id: "bb-kin-1",
        unitSlug: "kinematics",
        prompt: "A projectile is launched horizontally from a cliff. Which statement is true just after launch?",
        choices: [
          "Horizontal acceleration is nonzero and vertical acceleration is zero",
          "Horizontal velocity is constant while vertical velocity begins increasing downward",
          "Both velocity components stay constant",
          "Vertical velocity remains zero for the full flight",
        ],
        answer: 1,
        explanation: "Gravity changes only the vertical velocity; the horizontal velocity stays constant if air resistance is ignored.",
        tag: "projectile battle",
      },
      {
        id: "bb-kin-2",
        unitSlug: "kinematics",
        prompt: "A curved position-time graph that gets steeper every second indicates:",
        choices: ["constant negative acceleration", "increasing speed", "zero velocity", "constant displacement"],
        answer: 1,
        explanation: "A steeper x-t slope means the velocity magnitude is increasing.",
        tag: "graphs battle",
      },
      {
        id: "bb-kin-3",
        unitSlug: "kinematics",
        prompt: "If acceleration is constant and positive while velocity is negative, the object is:",
        choices: ["speeding up in the negative direction", "slowing down before possibly reversing", "at rest", "moving with constant speed"],
        answer: 1,
        explanation: "Acceleration opposite the velocity reduces the speed until the object stops and may reverse.",
        tag: "signs battle",
      },
    ],
  },
  {
    unitSlug: "dynamics",
    title: "Force Forge",
    flavor: "A test rig is about to snap. Balance the forces before the whole contraption skids away.",
    reward: "Unlock a dynamics battle clear and momentum toward higher ranks.",
    questions: [
      {
        id: "bb-dyn-1",
        unitSlug: "dynamics",
        prompt: "A box moves right at constant speed on rough ground. The horizontal forces must be:",
        choices: ["friction right, push left", "balanced", "unbalanced to the right", "zero because the box is moving"],
        answer: 1,
        explanation: "Constant speed means zero acceleration, so the net horizontal force is zero.",
        tag: "net force",
      },
      {
        id: "bb-dyn-2",
        unitSlug: "dynamics",
        prompt: "If the applied force doubles while mass stays fixed, acceleration:",
        choices: ["halves", "doubles", "stays unchanged", "depends only on velocity"],
        answer: 1,
        explanation: "Newton's second law gives a = F/m.",
        tag: "second law",
      },
      {
        id: "bb-dyn-3",
        unitSlug: "dynamics",
        prompt: "The normal force on an object resting on a table usually acts:",
        choices: ["downward", "parallel to motion", "perpendicular to the surface", "toward the center of Earth"],
        answer: 2,
        explanation: "The normal force is the support force perpendicular to the contact surface.",
        tag: "normal force",
      },
    ],
  },
  {
    unitSlug: "energy",
    title: "Power Plant Panic",
    flavor: "You have one minute to stabilize the runaway demo coaster using energy logic.",
    reward: "Unlock energy master text for result cards.",
    questions: [
      {
        id: "bb-energy-1",
        unitSlug: "energy",
        prompt: "At the lowest point of a frictionless track, gravitational potential energy is lower and kinetic energy is usually:",
        choices: ["also lower", "maximum", "zero", "undefined"],
        answer: 1,
        explanation: "Mechanical energy shifts into kinetic energy at lower height.",
        tag: "track energy",
      },
      {
        id: "bb-energy-2",
        unitSlug: "energy",
        prompt: "A spring compressed twice as far stores how much elastic potential energy?",
        choices: ["twice as much", "four times as much", "half as much", "the same"],
        answer: 1,
        explanation: "Spring energy is U = 1/2 kx², so doubling x quadruples U.",
        tag: "spring energy",
      },
      {
        id: "bb-energy-3",
        unitSlug: "energy",
        prompt: "A machine that does the same work in less time has:",
        choices: ["less power", "more power", "less energy", "more mass"],
        answer: 1,
        explanation: "Power is work divided by time.",
        tag: "power battle",
      },
    ],
  },
  {
    unitSlug: "momentum",
    title: "Collision Core",
    flavor: "The arena doors close in thirty seconds. Read the collision correctly and clear the chamber.",
    reward: "Unlock a collision clear and extra streak XP.",
    questions: [
      {
        id: "bb-mom-1",
        unitSlug: "momentum",
        prompt: "Two carts stick together after collision. The collision is:",
        choices: ["elastic", "perfectly inelastic", "impossible", "uniform circular motion"],
        answer: 1,
        explanation: "Sticking together defines a perfectly inelastic collision.",
        tag: "inelastic",
      },
      {
        id: "bb-mom-2",
        unitSlug: "momentum",
        prompt: "A lighter object can still have the same momentum as a heavier one if it has:",
        choices: ["lower speed", "the same speed", "greater speed", "zero mass"],
        answer: 2,
        explanation: "Momentum is p = mv, so a smaller mass can match momentum with a larger velocity.",
        tag: "momentum magnitude",
      },
      {
        id: "bb-mom-3",
        unitSlug: "momentum",
        prompt: "During a collision between two objects in an isolated system, internal forces are:",
        choices: ["unrelated", "equal and opposite", "always zero", "only vertical"],
        answer: 1,
        explanation: "Newton's third law pairs are equal in magnitude and opposite in direction.",
        tag: "third law",
      },
    ],
  },
  {
    unitSlug: "torque",
    title: "Bridge of Balance",
    flavor: "A rotating bridge is about to fail inspection. Fix the moments and hold the line.",
    reward: "Unlock a balance badge and boss battle XP.",
    questions: [
      {
        id: "bb-torque-1",
        unitSlug: "torque",
        prompt: "A force applied at the pivot produces:",
        choices: ["maximum torque", "zero torque", "negative inertia", "only angular momentum"],
        answer: 1,
        explanation: "With zero lever arm, τ = rF sinθ is zero.",
        tag: "pivot",
      },
      {
        id: "bb-torque-2",
        unitSlug: "torque",
        prompt: "If equal forces act at equal distances in opposite rotational directions, the net torque is:",
        choices: ["positive", "negative", "zero", "equal to the force"],
        answer: 2,
        explanation: "The torques cancel when magnitudes match and directions oppose.",
        tag: "net torque",
      },
      {
        id: "bb-torque-3",
        unitSlug: "torque",
        prompt: "A larger moment of inertia means an object is generally:",
        choices: ["harder to angularly accelerate", "easier to stop linearly", "lighter", "faster automatically"],
        answer: 0,
        explanation: "Moment of inertia is rotational inertia: more of it resists angular acceleration.",
        tag: "inertia battle",
      },
    ],
  },
  {
    unitSlug: "rotating-systems",
    title: "Spin Vault",
    flavor: "A demo skater is pulling inward. Call the spin changes before the vault judges do.",
    reward: "Unlock angular momentum bragging rights.",
    questions: [
      {
        id: "bb-rot-1",
        unitSlug: "rotating-systems",
        prompt: "A skater pulls arms inward while angular momentum is conserved. Angular speed:",
        choices: ["decreases", "increases", "stays zero", "must reverse"],
        answer: 1,
        explanation: "Pulling inward decreases I, so ω rises to keep L constant.",
        tag: "skater",
      },
      {
        id: "bb-rot-2",
        unitSlug: "rotating-systems",
        prompt: "Rolling without slipping means the contact point with the ground is instantaneously:",
        choices: ["moving fastest", "at rest relative to the ground", "moving backward", "lifting off"],
        answer: 1,
        explanation: "For pure rolling, the contact point has zero instantaneous velocity relative to the surface.",
        tag: "rolling battle",
      },
      {
        id: "bb-rot-3",
        unitSlug: "rotating-systems",
        prompt: "Rotational kinetic energy depends on:",
        choices: ["I and ω", "mass only", "radius only", "force and time"],
        answer: 0,
        explanation: "K_rot = 1/2 Iω².",
        tag: "rotational KE",
      },
    ],
  },
  {
    unitSlug: "oscillations",
    title: "SHM Chamber",
    flavor: "The oscillator room is drifting out of tune. Reset the rhythm before the timer hits zero.",
    reward: "Unlock oscillator rank progress and notebook flair.",
    questions: [
      {
        id: "bb-osc-1",
        unitSlug: "oscillations",
        prompt: "For a simple pendulum, increasing the string length makes the period:",
        choices: ["smaller", "larger", "negative", "unchanged"],
        answer: 1,
        explanation: "T = 2π√(L/g), so a larger L gives a larger period.",
        tag: "pendulum",
      },
      {
        id: "bb-osc-2",
        unitSlug: "oscillations",
        prompt: "In ideal SHM, acceleration is always directed:",
        choices: ["away from equilibrium", "toward equilibrium", "with velocity", "opposite momentum only"],
        answer: 1,
        explanation: "The restoring acceleration points back toward equilibrium.",
        tag: "restoring force",
      },
      {
        id: "bb-osc-3",
        unitSlug: "oscillations",
        prompt: "At equilibrium in SHM, potential energy is minimum and speed is usually:",
        choices: ["minimum", "maximum", "zero", "imaginary"],
        answer: 1,
        explanation: "Energy is mostly kinetic at equilibrium, so speed is greatest there.",
        tag: "equilibrium energy",
      },
    ],
  },
  {
    unitSlug: "fluids",
    title: "Pressure Room",
    flavor: "The pipe network is unstable. Read the pressure and flow changes before it bursts.",
    reward: "Unlock fluid analyst status.",
    questions: [
      {
        id: "bb-fluid-1",
        unitSlug: "fluids",
        prompt: "Bernoulli's principle links higher fluid speed with generally:",
        choices: ["higher pressure", "lower pressure", "zero density", "larger area only"],
        answer: 1,
        explanation: "For ideal flow, faster moving fluid corresponds to lower pressure.",
        tag: "Bernoulli",
      },
      {
        id: "bb-fluid-2",
        unitSlug: "fluids",
        prompt: "Buoyant force equals the weight of:",
        choices: ["the object", "the displaced fluid", "the air above", "the container"],
        answer: 1,
        explanation: "That is Archimedes' principle.",
        tag: "buoyancy",
      },
      {
        id: "bb-fluid-3",
        unitSlug: "fluids",
        prompt: "Pascal's principle explains why hydraulic systems can:",
        choices: ["destroy energy", "transmit pressure through enclosed fluid", "eliminate mass", "remove gravity"],
        answer: 1,
        explanation: "Pressure applied to a confined fluid is transmitted throughout the fluid.",
        tag: "Pascal",
      },
    ],
  },
];

export function getBossBattle(unitSlug: string): BossBattle {
  return (
    bossBattles.find((battle) => battle.unitSlug === unitSlug) ??
    bossBattles[0]
  );
}

export function gradeBossBattle(score: number, total: number): "S" | "A" | "B" | "C" {
  if (score === total) {
    return "S";
  }
  if (score >= total - 1) {
    return "A";
  }
  if (score >= 1) {
    return "B";
  }
  return "C";
}
