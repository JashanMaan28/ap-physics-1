import { units } from "@/data/units";

export interface ArcadeQuestion {
  id: string;
  unitSlug: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  tag: string;
}

export interface BossBattle {
  unitSlug: string;
  title: string;
  flavor: string;
  reward: string;
  questions: ArcadeQuestion[];
}

export interface FormulaSprintQuestion {
  id: string;
  unitSlug: string;
  prompt: string;
  choices: string[];
  answer: number;
  formula: string;
  hint: string;
}

export interface ExamDraftStep {
  unitSlug: string;
  unitName: string;
  minutes: number;
  focus: string;
  reason: string;
}

export const dailyChallengeBank: ArcadeQuestion[] = [
  {
    id: "dc-kin-1",
    unitSlug: "kinematics",
    prompt: "On a velocity-time graph, the slope represents:",
    choices: ["position", "acceleration", "force", "jerk"],
    answer: 1,
    explanation: "The slope of v-t is Δv/Δt, which is acceleration.",
    tag: "graph reading",
  },
  {
    id: "dc-kin-2",
    unitSlug: "kinematics",
    prompt: "At the top of a projectile's path, the vertical velocity is zero but the acceleration is:",
    choices: ["zero", "upward", "still downward", "undefined"],
    answer: 2,
    explanation: "Gravity keeps acting throughout the motion, so acceleration remains downward.",
    tag: "projectile motion",
  },
  {
    id: "dc-dyn-1",
    unitSlug: "dynamics",
    prompt: "If the net force on an object is zero, the object must be:",
    choices: ["at rest", "moving with constant velocity", "speeding up", "slowing down"],
    answer: 1,
    explanation: "Zero net force means zero acceleration, so velocity stays constant.",
    tag: "Newton's laws",
  },
  {
    id: "dc-dyn-2",
    unitSlug: "dynamics",
    prompt: "On an incline with no friction, the force causing acceleration down the ramp is the component of:",
    choices: ["normal force", "mass", "weight", "tension"],
    answer: 2,
    explanation: "The weight component parallel to the incline drives the motion.",
    tag: "inclines",
  },
  {
    id: "dc-energy-1",
    unitSlug: "energy",
    prompt: "If no non-conservative forces act, total mechanical energy is:",
    choices: ["zero", "conserved", "always increasing", "equal to momentum"],
    answer: 1,
    explanation: "Without losses like friction, kinetic and potential energy trade off but total stays constant.",
    tag: "energy conservation",
  },
  {
    id: "dc-energy-2",
    unitSlug: "energy",
    prompt: "Power measures how quickly you transfer:",
    choices: ["velocity", "mass", "energy", "momentum"],
    answer: 2,
    explanation: "Power is the rate of energy transfer: P = ΔE/Δt.",
    tag: "power",
  },
  {
    id: "dc-mom-1",
    unitSlug: "momentum",
    prompt: "Impulse equals the change in:",
    choices: ["velocity", "force", "momentum", "acceleration"],
    answer: 2,
    explanation: "Impulse J = FΔt = Δp.",
    tag: "impulse",
  },
  {
    id: "dc-mom-2",
    unitSlug: "momentum",
    prompt: "In a perfectly inelastic collision, which quantity is guaranteed conserved for the system?",
    choices: ["kinetic energy", "momentum", "speed", "force"],
    answer: 1,
    explanation: "Momentum is conserved in isolated collisions even when kinetic energy is not.",
    tag: "collisions",
  },
  {
    id: "dc-torque-1",
    unitSlug: "torque",
    prompt: "Torque increases when the lever arm is:",
    choices: ["shorter", "perpendicular and longer", "parallel", "zero"],
    answer: 1,
    explanation: "Torque magnitude is τ = rF sinθ, so a longer perpendicular distance gives more torque.",
    tag: "torque",
  },
  {
    id: "dc-torque-2",
    unitSlug: "torque",
    prompt: "Rotational equilibrium requires:",
    choices: ["Στ = 0 only", "ΣF = 0 only", "ΣF = 0 and Στ = 0", "constant angular speed only"],
    answer: 2,
    explanation: "Balanced translation and balanced rotation are both required.",
    tag: "equilibrium",
  },
  {
    id: "dc-rot-1",
    unitSlug: "rotating-systems",
    prompt: "If angular momentum is conserved and moment of inertia increases, angular speed must:",
    choices: ["increase", "decrease", "stay the same", "become zero immediately"],
    answer: 1,
    explanation: "Since L = Iω stays constant, ω decreases when I increases.",
    tag: "angular momentum",
  },
  {
    id: "dc-rot-2",
    unitSlug: "rotating-systems",
    prompt: "Rolling without slipping means:",
    choices: ["v = ω/r", "v = rω", "a = r/ω", "τ = I/r"],
    answer: 1,
    explanation: "The linear speed of the center is v = rω.",
    tag: "rolling motion",
  },
  {
    id: "dc-osc-1",
    unitSlug: "oscillations",
    prompt: "For a spring-mass system, increasing the mass makes the period:",
    choices: ["smaller", "larger", "zero", "unchanged"],
    answer: 1,
    explanation: "T = 2π√(m/k), so a larger mass gives a longer period.",
    tag: "springs",
  },
  {
    id: "dc-osc-2",
    unitSlug: "oscillations",
    prompt: "At maximum displacement in SHM, the speed is:",
    choices: ["maximum", "minimum", "zero", "negative only"],
    answer: 2,
    explanation: "The object stops and reverses at the endpoints, so the speed is zero there.",
    tag: "SHM energy",
  },
  {
    id: "dc-fluid-1",
    unitSlug: "fluids",
    prompt: "Fluid pressure due to depth increases with:",
    choices: ["temperature only", "depth", "surface area", "volume only"],
    answer: 1,
    explanation: "Hydrostatic pressure follows P = ρgh, so it grows with depth.",
    tag: "pressure",
  },
  {
    id: "dc-fluid-2",
    unitSlug: "fluids",
    prompt: "In an ideal fluid moving through a narrower pipe section, the speed generally:",
    choices: ["decreases", "stays the same", "increases", "becomes zero"],
    answer: 2,
    explanation: "Continuity says Av stays constant, so smaller area means larger speed.",
    tag: "continuity",
  },
];

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

export const formulaSprintBank: Record<string, FormulaSprintQuestion[]> = {
  kinematics: [
    {
      id: "fs-kin-1",
      unitSlug: "kinematics",
      prompt: "Which equation relates final velocity, initial velocity, acceleration, and time?",
      choices: ["v = v0 + at", "x = vt", "F = ma", "p = mv"],
      answer: 0,
      formula: "v = v0 + at",
      hint: "One-dimensional constant acceleration.",
    },
    {
      id: "fs-kin-2",
      unitSlug: "kinematics",
      prompt: "Which equation gives displacement under constant acceleration using time?",
      choices: ["Δx = v0t + 1/2 at²", "Δx = at", "v² = v0² + 2aΔx", "P = ΔE/Δt"],
      answer: 0,
      formula: "Δx = v0t + 1/2 at²",
      hint: "Starts with initial-velocity times time.",
    },
    {
      id: "fs-kin-3",
      unitSlug: "kinematics",
      prompt: "Which kinematic equation avoids time?",
      choices: ["v² = v0² + 2aΔx", "v = Δx/t", "a = F/m", "T = 2π√(L/g)"],
      answer: 0,
      formula: "v² = v0² + 2aΔx",
      hint: "Useful when time is missing.",
    },
    {
      id: "fs-kin-4",
      unitSlug: "kinematics",
      prompt: "Which expression gives average velocity for constant acceleration?",
      choices: ["(v + v0)/2", "at²", "FΔt", "mgh"],
      answer: 0,
      formula: "v_avg = (v + v0)/2",
      hint: "Mean of the initial and final velocities.",
    },
    {
      id: "fs-kin-5",
      unitSlug: "kinematics",
      prompt: "Which expression defines average acceleration?",
      choices: ["a_avg = Δv/Δt", "a = F·Δt", "a = v²/r", "a = Δx/Δt"],
      answer: 0,
      formula: "a_avg = Δv/Δt",
      hint: "Change in velocity over change in time.",
    },
    {
      id: "fs-kin-6",
      unitSlug: "kinematics",
      prompt: "How long does an object dropped from rest take to fall a height h (ignoring air)?",
      choices: ["t = √(2h/g)", "t = 2h/g", "t = h/g", "t = √(h/2g)"],
      answer: 0,
      formula: "t = √(2h/g)",
      hint: "Solve h = 1/2 g t² for t.",
    },
    {
      id: "fs-kin-7",
      unitSlug: "kinematics",
      prompt: "Which expression gives projectile range on level ground?",
      choices: ["R = v0² sin(2θ)/g", "R = v0 t", "R = v0² /g", "R = v0 sinθ /g"],
      answer: 0,
      formula: "R = v0² sin(2θ)/g",
      hint: "Maximum when θ = 45°.",
    },
    {
      id: "fs-kin-8",
      unitSlug: "kinematics",
      prompt: "For uniform circular motion, the magnitude of centripetal acceleration is:",
      choices: ["a_c = v²/r", "a_c = v/r", "a_c = r/v²", "a_c = rω"],
      answer: 0,
      formula: "a_c = v²/r",
      hint: "Points toward center; equals v²/r.",
    },
    {
      id: "fs-kin-9",
      unitSlug: "kinematics",
      prompt: "Time of flight for a projectile launched and landing at the same height:",
      choices: ["t = 2 v0 sinθ / g", "t = v0 sinθ / g", "t = v0 / g", "t = 2g/v0"],
      answer: 0,
      formula: "t = 2 v0 sinθ / g",
      hint: "Twice the time to reach peak.",
    },
  ],
  dynamics: [
    {
      id: "fs-dyn-1",
      unitSlug: "dynamics",
      prompt: "Which relation is Newton's second law?",
      choices: ["F = ma", "p = mv", "W = Fd cosθ", "τ = rF"],
      answer: 0,
      formula: "F = ma",
      hint: "Net force and acceleration.",
    },
    {
      id: "fs-dyn-2",
      unitSlug: "dynamics",
      prompt: "Which equation gives weight near Earth's surface?",
      choices: ["Fg = mg", "F = qE", "p = mv", "P = F/A"],
      answer: 0,
      formula: "Fg = mg",
      hint: "Mass times gravitational field strength.",
    },
    {
      id: "fs-dyn-3",
      unitSlug: "dynamics",
      prompt: "Which formula gives frictional force in the simple model?",
      choices: ["Ff = μFn", "F = ma", "W = ΔK", "ρgh"],
      answer: 0,
      formula: "Ff = μFn",
      hint: "Coefficient times normal force.",
    },
    {
      id: "fs-dyn-4",
      unitSlug: "dynamics",
      prompt: "Which expression gives the force component parallel to an incline?",
      choices: ["mg sinθ", "mg cosθ", "μmg", "mgh"],
      answer: 0,
      formula: "F_parallel = mg sinθ",
      hint: "Down-the-ramp component of weight.",
    },
    {
      id: "fs-dyn-5",
      unitSlug: "dynamics",
      prompt: "Which expression gives the weight component perpendicular to an incline?",
      choices: ["mg cosθ", "mg sinθ", "mg tanθ", "mg/cosθ"],
      answer: 0,
      formula: "F_perp = mg cosθ",
      hint: "Matches the normal force on a frictionless ramp.",
    },
    {
      id: "fs-dyn-6",
      unitSlug: "dynamics",
      prompt: "Which relation states Newton's third law?",
      choices: ["F_AB = -F_BA", "F = ma", "F = μN", "F = Δp/Δt"],
      answer: 0,
      formula: "F_AB = -F_BA",
      hint: "Equal magnitude, opposite direction action–reaction pairs.",
    },
    {
      id: "fs-dyn-7",
      unitSlug: "dynamics",
      prompt: "Net force in terms of the sum of forces is:",
      choices: ["ΣF = ma", "ΣF = mv", "ΣF = Iα", "ΣF = μmg"],
      answer: 0,
      formula: "ΣF = ma",
      hint: "Vector sum equals mass times acceleration.",
    },
    {
      id: "fs-dyn-8",
      unitSlug: "dynamics",
      prompt: "Magnitude of the centripetal force for uniform circular motion:",
      choices: ["F_c = mv²/r", "F_c = mg sinθ", "F_c = μmg", "F_c = mω/r"],
      answer: 0,
      formula: "F_c = mv²/r",
      hint: "Points toward the center of the circle.",
    },
    {
      id: "fs-dyn-9",
      unitSlug: "dynamics",
      prompt: "Apparent weight inside an elevator accelerating upward at a is:",
      choices: ["W_app = m(g + a)", "W_app = m(g − a)", "W_app = mg", "W_app = ma"],
      answer: 0,
      formula: "W_app = m(g + a)",
      hint: "Normal force feels larger when the floor pushes up harder.",
    },
  ],
  energy: [
    {
      id: "fs-energy-1",
      unitSlug: "energy",
      prompt: "Which formula gives translational kinetic energy?",
      choices: ["1/2 mv²", "mgh", "1/2 kx²", "P = F/A"],
      answer: 0,
      formula: "K = 1/2 mv²",
      hint: "Half mass times speed squared.",
    },
    {
      id: "fs-energy-2",
      unitSlug: "energy",
      prompt: "Which formula gives gravitational potential energy near Earth's surface?",
      choices: ["mgh", "1/2 mv²", "Fd", "p = mv"],
      answer: 0,
      formula: "Ug = mgh",
      hint: "Mass, gravity, height.",
    },
    {
      id: "fs-energy-3",
      unitSlug: "energy",
      prompt: "Which expression gives spring potential energy?",
      choices: ["1/2 kx²", "kx", "mgh", "1/2 Iω²"],
      answer: 0,
      formula: "Us = 1/2 kx²",
      hint: "Depends on displacement squared.",
    },
    {
      id: "fs-energy-4",
      unitSlug: "energy",
      prompt: "Which formula defines power?",
      choices: ["P = ΔE/Δt", "P = F/A", "P = mv", "P = ρgh"],
      answer: 0,
      formula: "P = ΔE/Δt",
      hint: "Energy transferred per unit time.",
    },
    {
      id: "fs-energy-5",
      unitSlug: "energy",
      prompt: "Work done by a constant force along a straight path:",
      choices: ["W = Fd cosθ", "W = F/d", "W = mgh only", "W = Fd²"],
      answer: 0,
      formula: "W = Fd cosθ",
      hint: "Only the force component along displacement does work.",
    },
    {
      id: "fs-energy-6",
      unitSlug: "energy",
      prompt: "The work-energy theorem states:",
      choices: ["W_net = ΔK", "W_net = ΔU", "W_net = 0 always", "W_net = P·Δt"],
      answer: 0,
      formula: "W_net = ΔK",
      hint: "Net work equals change in kinetic energy.",
    },
    {
      id: "fs-energy-7",
      unitSlug: "energy",
      prompt: "Mechanical energy conservation (no non-conservative forces):",
      choices: ["K_i + U_i = K_f + U_f", "K_i = U_f", "K_i + U_f = 0", "ΔK = ΔU"],
      answer: 0,
      formula: "K_i + U_i = K_f + U_f",
      hint: "Total mechanical energy stays constant.",
    },
    {
      id: "fs-energy-8",
      unitSlug: "energy",
      prompt: "Instantaneous mechanical power from a constant force:",
      choices: ["P = F v cosθ", "P = Fd", "P = F/v", "P = m v²"],
      answer: 0,
      formula: "P = F v cosθ",
      hint: "Force dotted with velocity.",
    },
    {
      id: "fs-energy-9",
      unitSlug: "energy",
      prompt: "Kinetic energy written in terms of momentum:",
      choices: ["K = p²/(2m)", "K = p·m", "K = 2mp", "K = p/m"],
      answer: 0,
      formula: "K = p²/(2m)",
      hint: "Substitute p = mv into K = ½mv².",
    },
  ],
  momentum: [
    {
      id: "fs-mom-1",
      unitSlug: "momentum",
      prompt: "Which formula gives linear momentum?",
      choices: ["p = mv", "F = ma", "J = Fd", "K = 1/2 mv²"],
      answer: 0,
      formula: "p = mv",
      hint: "Mass times velocity.",
    },
    {
      id: "fs-mom-2",
      unitSlug: "momentum",
      prompt: "Which relation defines impulse?",
      choices: ["J = FΔt", "J = mv²", "J = ρgh", "J = kx"],
      answer: 0,
      formula: "J = FΔt = Δp",
      hint: "Force applied over a time interval.",
    },
    {
      id: "fs-mom-3",
      unitSlug: "momentum",
      prompt: "Which statement expresses momentum conservation in a closed system?",
      choices: ["Σp_initial = Σp_final", "ΣF = 0 always", "K_initial = K_final", "W = ΔK"],
      answer: 0,
      formula: "Σp_i = Σp_f",
      hint: "Before equals after.",
    },
    {
      id: "fs-mom-4",
      unitSlug: "momentum",
      prompt: "Which expression is useful for average force from impulse?",
      choices: ["F_avg = Δp/Δt", "F = mgh", "F = p/t²", "F = 1/2 mv²"],
      answer: 0,
      formula: "F_avg = Δp/Δt",
      hint: "Rearrange the impulse relation.",
    },
    {
      id: "fs-mom-5",
      unitSlug: "momentum",
      prompt: "Change in momentum for constant mass:",
      choices: ["Δp = m Δv", "Δp = Δm v", "Δp = 1/2 mv²", "Δp = F/Δt"],
      answer: 0,
      formula: "Δp = m Δv",
      hint: "Mass times change in velocity.",
    },
    {
      id: "fs-mom-6",
      unitSlug: "momentum",
      prompt: "Conservation of momentum component form (x direction):",
      choices: ["Σp_ix = Σp_fx", "Σp_ix = 0 always", "p_ix = K_fx", "Σp_ix = FΔt"],
      answer: 0,
      formula: "Σp_ix = Σp_fx",
      hint: "Each component is conserved separately.",
    },
    {
      id: "fs-mom-7",
      unitSlug: "momentum",
      prompt: "Final speed after a perfectly inelastic 1D collision (m1·v1 + m2·v2 → (m1+m2)·v_f):",
      choices: [
        "v_f = (m1 v1 + m2 v2)/(m1 + m2)",
        "v_f = v1 + v2",
        "v_f = (v1 − v2)/2",
        "v_f = m1 v1 / m2",
      ],
      answer: 0,
      formula: "v_f = (m1 v1 + m2 v2)/(m1 + m2)",
      hint: "Total momentum divided by total mass.",
    },
    {
      id: "fs-mom-8",
      unitSlug: "momentum",
      prompt: "Velocity of the center of mass of a two-object system:",
      choices: [
        "v_cm = (m1 v1 + m2 v2)/(m1 + m2)",
        "v_cm = (v1 + v2)/2",
        "v_cm = m1 v1 − m2 v2",
        "v_cm = p_total · m_total",
      ],
      answer: 0,
      formula: "v_cm = Σ m_i v_i / Σ m_i",
      hint: "Weighted average by mass.",
    },
    {
      id: "fs-mom-9",
      unitSlug: "momentum",
      prompt: "For an elastic collision, which is conserved in addition to momentum?",
      choices: ["Kinetic energy", "Potential energy only", "Impulse", "Torque"],
      answer: 0,
      formula: "K_i = K_f (elastic)",
      hint: "Elastic collisions preserve kinetic energy.",
    },
  ],
  torque: [
    {
      id: "fs-torque-1",
      unitSlug: "torque",
      prompt: "Which expression gives torque magnitude?",
      choices: ["τ = rF sinθ", "τ = Iω", "τ = ma", "τ = kx"],
      answer: 0,
      formula: "τ = rF sinθ",
      hint: "Lever arm, force, and angle.",
    },
    {
      id: "fs-torque-2",
      unitSlug: "torque",
      prompt: "Which rotational analog of Newton's second law is correct?",
      choices: ["τ = Iα", "τ = rω", "τ = mv", "τ = F/A"],
      answer: 0,
      formula: "τ_net = Iα",
      hint: "Net torque and angular acceleration.",
    },
    {
      id: "fs-torque-3",
      unitSlug: "torque",
      prompt: "Which condition is required for rotational equilibrium?",
      choices: ["Στ = 0", "Σp = 0", "W = 0", "P = 0"],
      answer: 0,
      formula: "Στ = 0",
      hint: "No net turning effect.",
    },
    {
      id: "fs-torque-4",
      unitSlug: "torque",
      prompt: "Which formula gives angular acceleration from torque and inertia?",
      choices: ["α = τ/I", "α = I/τ", "α = ω/r", "α = rω"],
      answer: 0,
      formula: "α = τ/I",
      hint: "Rearrange the rotational second law.",
    },
    {
      id: "fs-torque-5",
      unitSlug: "torque",
      prompt: "Moment of inertia of a solid cylinder about its central axis:",
      choices: ["I = 1/2 MR²", "I = MR²", "I = 2/5 MR²", "I = 1/3 MR²"],
      answer: 0,
      formula: "I_cyl = 1/2 MR²",
      hint: "Mass, radius squared, factor of 1/2.",
    },
    {
      id: "fs-torque-6",
      unitSlug: "torque",
      prompt: "Moment of inertia of a thin hoop about its central axis:",
      choices: ["I = MR²", "I = 1/2 MR²", "I = 2/5 MR²", "I = 1/12 ML²"],
      answer: 0,
      formula: "I_hoop = MR²",
      hint: "All mass at the radius R.",
    },
    {
      id: "fs-torque-7",
      unitSlug: "torque",
      prompt: "Work done by a constant torque through angle Δθ:",
      choices: ["W = τ Δθ", "W = τ/Δθ", "W = Iα", "W = F Δθ"],
      answer: 0,
      formula: "W = τ Δθ",
      hint: "Rotational analog of W = F·d.",
    },
    {
      id: "fs-torque-8",
      unitSlug: "torque",
      prompt: "Angular impulse equals change in what?",
      choices: ["Angular momentum (τ Δt = ΔL)", "Moment of inertia", "Angular speed only", "Kinetic energy"],
      answer: 0,
      formula: "τ Δt = ΔL",
      hint: "Rotational analog of F Δt = Δp.",
    },
    {
      id: "fs-torque-9",
      unitSlug: "torque",
      prompt: "Moment of inertia of a uniform rod about one end:",
      choices: ["I = 1/3 ML²", "I = 1/12 ML²", "I = 1/2 ML²", "I = ML²"],
      answer: 0,
      formula: "I_rod_end = 1/3 ML²",
      hint: "Twelve times the rod about its center times four.",
    },
  ],
  "rotating-systems": [
    {
      id: "fs-rot-1",
      unitSlug: "rotating-systems",
      prompt: "Which formula gives rotational kinetic energy?",
      choices: ["1/2 Iω²", "1/2 mv²", "mgh", "ρgh"],
      answer: 0,
      formula: "Krot = 1/2 Iω²",
      hint: "Half inertia times angular speed squared.",
    },
    {
      id: "fs-rot-2",
      unitSlug: "rotating-systems",
      prompt: "Which expression gives angular momentum for a rigid object?",
      choices: ["L = Iω", "L = mv", "L = FΔt", "L = rF"],
      answer: 0,
      formula: "L = Iω",
      hint: "Rotational analog of p = mv.",
    },
    {
      id: "fs-rot-3",
      unitSlug: "rotating-systems",
      prompt: "Which relation describes rolling without slipping?",
      choices: ["v = rω", "v = ω/r", "a = r/ω", "τ = Iω"],
      answer: 0,
      formula: "v = rω",
      hint: "Linear speed equals radius times angular speed.",
    },
    {
      id: "fs-rot-4",
      unitSlug: "rotating-systems",
      prompt: "Which equation states angular momentum conservation?",
      choices: ["Li =Lf", "Ki = Kf always", "τ = 0 always", "W = Δp"],
      answer: 0,
      formula: "Li = Lf",
      hint: "Initial equals final if no external torque acts.",
    },
    {
      id: "fs-rot-5",
      unitSlug: "rotating-systems",
      prompt: "Angular velocity from kinematics (constant α):",
      choices: ["ω = ω0 + α t", "ω = α t²", "ω = θ/t only", "ω = Iα"],
      answer: 0,
      formula: "ω = ω0 + α t",
      hint: "Rotational analog of v = v0 + at.",
    },
    {
      id: "fs-rot-6",
      unitSlug: "rotating-systems",
      prompt: "Angular displacement under constant α:",
      choices: ["θ = ω0 t + 1/2 α t²", "θ = ω t²", "θ = α t", "θ = 2π/ω"],
      answer: 0,
      formula: "θ = ω0 t + 1/2 α t²",
      hint: "Rotational analog of x = v0 t + 1/2 a t².",
    },
    {
      id: "fs-rot-7",
      unitSlug: "rotating-systems",
      prompt: "Tangential acceleration at radius r for angular acceleration α:",
      choices: ["a_t = r α", "a_t = α/r", "a_t = rω", "a_t = v²/r"],
      answer: 0,
      formula: "a_t = r α",
      hint: "Same form as v = rω but for acceleration.",
    },
    {
      id: "fs-rot-8",
      unitSlug: "rotating-systems",
      prompt: "Total kinetic energy of a rolling object:",
      choices: [
        "K = 1/2 m v² + 1/2 I ω²",
        "K = 1/2 m v²",
        "K = 1/2 I ω² only",
        "K = mgh",
      ],
      answer: 0,
      formula: "K = 1/2 m v² + 1/2 I ω²",
      hint: "Translational plus rotational.",
    },
    {
      id: "fs-rot-9",
      unitSlug: "rotating-systems",
      prompt: "Centripetal acceleration written with ω:",
      choices: ["a_c = r ω²", "a_c = v ω", "a_c = ω/r", "a_c = r/ω²"],
      answer: 0,
      formula: "a_c = r ω²",
      hint: "Use v = rω in a_c = v²/r.",
    },
  ],
  oscillations: [
    {
      id: "fs-osc-1",
      unitSlug: "oscillations",
      prompt: "Which formula gives the period of a mass-spring system?",
      choices: ["2π√(m/k)", "2π√(L/g)", "1/f", "v = rω"],
      answer: 0,
      formula: "T = 2π√(m/k)",
      hint: "Mass and spring constant.",
    },
    {
      id: "fs-osc-2",
      unitSlug: "oscillations",
      prompt: "Which formula gives the period of a simple pendulum?",
      choices: ["2π√(L/g)", "2π√(m/k)", "2πr/v", "1/2 mv²"],
      answer: 0,
      formula: "T = 2π√(L/g)",
      hint: "Length and gravity, not mass.",
    },
    {
      id: "fs-osc-3",
      unitSlug: "oscillations",
      prompt: "Which equation is the restoring force for a spring?",
      choices: ["F = -kx", "F = ma", "F = qE", "F = μN"],
      answer: 0,
      formula: "F = -kx",
      hint: "Opposite the displacement.",
    },
    {
      id: "fs-osc-4",
      unitSlug: "oscillations",
      prompt: "Which expression gives total spring energy at amplitude A?",
      choices: ["1/2 kA²", "kA", "mgA", "1/2 mv²"],
      answer: 0,
      formula: "E = 1/2 kA²",
      hint: "All potential at the turning points.",
    },
    {
      id: "fs-osc-5",
      unitSlug: "oscillations",
      prompt: "Relation between frequency and period:",
      choices: ["f = 1/T", "f = T", "f = 2πT", "f = T²"],
      answer: 0,
      formula: "f = 1/T",
      hint: "Cycles per second is the inverse of period.",
    },
    {
      id: "fs-osc-6",
      unitSlug: "oscillations",
      prompt: "Angular frequency for a mass on a spring:",
      choices: ["ω = √(k/m)", "ω = √(m/k)", "ω = k/m", "ω = 2π m/k"],
      answer: 0,
      formula: "ω = √(k/m)",
      hint: "Square root of restoring stiffness over inertia.",
    },
    {
      id: "fs-osc-7",
      unitSlug: "oscillations",
      prompt: "Position as a function of time for SHM starting at amplitude:",
      choices: ["x(t) = A cos(ωt)", "x(t) = A t²", "x(t) = A sin(ω/t)", "x(t) = A/ω"],
      answer: 0,
      formula: "x(t) = A cos(ωt)",
      hint: "Cosine because it starts at +A.",
    },
    {
      id: "fs-osc-8",
      unitSlug: "oscillations",
      prompt: "Maximum speed in SHM of amplitude A:",
      choices: ["v_max = A ω", "v_max = A/ω", "v_max = ω²", "v_max = A"],
      answer: 0,
      formula: "v_max = A ω",
      hint: "Reached at the equilibrium point.",
    },
    {
      id: "fs-osc-9",
      unitSlug: "oscillations",
      prompt: "Angular frequency of a simple pendulum (small angles):",
      choices: ["ω = √(g/L)", "ω = √(L/g)", "ω = g/L", "ω = 2π L/g"],
      answer: 0,
      formula: "ω = √(g/L)",
      hint: "Inverse of the pendulum period formula.",
    },
  ],
  fluids: [
    {
      id: "fs-fluid-1",
      unitSlug: "fluids",
      prompt: "Which formula gives pressure due to a fluid column?",
      choices: ["ΔP = ρgh", "P = Fd", "P = mv", "P = τω"],
      answer: 0,
      formula: "ΔP = ρgh",
      hint: "Density, gravity, depth.",
    },
    {
      id: "fs-fluid-2",
      unitSlug: "fluids",
      prompt: "Which equation is the continuity relation?",
      choices: ["A1v1 = A2v2", "P + ρgh = constant", "Fb = mg", "P = F/A only"],
      answer: 0,
      formula: "A1v1 = A2v2",
      hint: "Area times speed stays constant.",
    },
    {
      id: "fs-fluid-3",
      unitSlug: "fluids",
      prompt: "Which expression gives buoyant force?",
      choices: ["Fb = ρfluid Vdisplaced g", "Fb = mv", "Fb = 1/2 mv²", "Fb = Iα"],
      answer: 0,
      formula: "Fb = ρfluid Vdisplaced g",
      hint: "Weight of displaced fluid.",
    },
    {
      id: "fs-fluid-4",
      unitSlug: "fluids",
      prompt: "Which Bernoulli form is appropriate along a streamline?",
      choices: ["P + 1/2ρv² + ρgh = constant", "P = ρgh only", "F = ma", "τ = rF"],
      answer: 0,
      formula: "P + 1/2ρv² + ρgh = constant",
      hint: "Pressure, kinetic, and gravitational terms together.",
    },
    {
      id: "fs-fluid-5",
      unitSlug: "fluids",
      prompt: "Absolute pressure at depth h below the surface:",
      choices: ["P = P0 + ρ g h", "P = ρ g h only", "P = P0 − ρ g h", "P = P0 ρ g h"],
      answer: 0,
      formula: "P = P0 + ρ g h",
      hint: "Add atmospheric pressure to the hydrostatic term.",
    },
    {
      id: "fs-fluid-6",
      unitSlug: "fluids",
      prompt: "Pascal's principle for a hydraulic lift:",
      choices: ["F1/A1 = F2/A2", "F1 A1 = F2 A2", "F1 = F2 always", "F1/V1 = F2/V2"],
      answer: 0,
      formula: "F1/A1 = F2/A2",
      hint: "Equal pressure on both pistons.",
    },
    {
      id: "fs-fluid-7",
      unitSlug: "fluids",
      prompt: "Volume flow rate in an ideal fluid pipe:",
      choices: ["Q = A v", "Q = A/v", "Q = ρ v", "Q = P/ρ"],
      answer: 0,
      formula: "Q = A v",
      hint: "Area of the pipe times speed of flow.",
    },
    {
      id: "fs-fluid-8",
      unitSlug: "fluids",
      prompt: "Definition of density:",
      choices: ["ρ = m/V", "ρ = V/m", "ρ = m V", "ρ = m g"],
      answer: 0,
      formula: "ρ = m/V",
      hint: "Mass per unit volume.",
    },
    {
      id: "fs-fluid-9",
      unitSlug: "fluids",
      prompt: "Pressure definition from force and area:",
      choices: ["P = F/A", "P = F·A", "P = A/F", "P = F²/A"],
      answer: 0,
      formula: "P = F/A",
      hint: "Force per unit area.",
    },
  ],
};

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseExamWeight(weight: string): number {
  const match = weight.match(/(\d+)[–-](\d+)/);
  if (!match) {
    return 10;
  }
  return (Number(match[1]) + Number(match[2])) / 2;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function pickDeterministic<T>(items: T[], seed: string, count: number): T[] {
  if (items.length <= count) {
    return items;
  }

  const working = [...items];
  const selected: T[] = [];
  let hash = hashSeed(seed);

  while (selected.length < count && working.length > 0) {
    const index = hash % working.length;
    selected.push(working.splice(index, 1)[0]);
    hash = (hash * 1664525 + 1013904223) >>> 0;
  }

  return selected;
}

export function getDailyChallenge(dateKey: string): ArcadeQuestion[] {
  return pickDeterministic(dailyChallengeBank, `daily:${dateKey}`, 5);
}

export function getFormulaSprint(
  unitSlug: string,
  seed: string,
  count = 6
): FormulaSprintQuestion[] {
  return pickDeterministic(formulaSprintBank[unitSlug] ?? [], `formula:${unitSlug}:${seed}`, count);
}

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

export function buildExamDraft(
  progressByUnit: Record<string, number>,
  mistakesByUnit: Record<string, number>,
  seed: number
): ExamDraftStep[] {
  const ranked = [...units]
    .map((unit) => {
      const examWeight = parseExamWeight(unit.examWeight);
      const progressPenalty = 100 - (progressByUnit[unit.slug] ?? 0);
      const mistakePressure = (mistakesByUnit[unit.slug] ?? 0) * 8;
      const swing = ((hashSeed(`${unit.slug}:${seed}`) % 11) - 5) * 0.8;
      const score = examWeight * 2 + progressPenalty + mistakePressure + swing;

      return { unit, score, examWeight };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return ranked.map(({ unit, examWeight }, index) => {
    const minutes = Math.max(10, Math.round(examWeight + 6 - index));
    const progress = progressByUnit[unit.slug] ?? 0;
    const mistakes = mistakesByUnit[unit.slug] ?? 0;

    return {
      unitSlug: unit.slug,
      unitName: unit.shortName,
      minutes,
      focus:
        index === 0
          ? "Boss battle + quiz"
          : index === 1
            ? "Mistake revenge + worked example"
            : index === 2
              ? "Formula recall + timed drill"
              : "One simulation + recap note",
      reason:
        progress < 50
          ? "Low progress and strong exam weight make this the best payoff."
          : mistakes > 0
            ? "Your mistake log says this unit still bites."
            : "This keeps the session aligned with AP exam weighting.",
    };
  });
}

export function createShareCardText(input: {
  level: number;
  xp: number;
  streak: number;
  progress: number;
  dailyBest?: string;
  bossBest?: string;
}): string {
  const lines = [
    "AP Physics 1 Study Arcade",
    `Level ${input.level} · ${input.xp} XP`,
    `Overall progress: ${Math.round(input.progress)}%`,
    `Current streak: ${input.streak} day${input.streak === 1 ? "" : "s"}`,
  ];

  if (input.dailyBest) {
    lines.push(`Daily challenge: ${input.dailyBest}`);
  }

  if (input.bossBest) {
    lines.push(`Best boss battle: ${input.bossBest}`);
  }

  lines.push("Built in the AP Physics 1 app.");
  return lines.join("\n");
}
