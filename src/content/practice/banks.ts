import type {
  PracticeChoiceQuestion,
  PracticeFrqProblem,
  UnitPracticeBank,
} from "./types";

function q(question: PracticeChoiceQuestion) {
  return question;
}

function frq(problem: PracticeFrqProblem) {
  return problem;
}

export const unitPracticeBanks: Record<string, UnitPracticeBank> = {};

unitPracticeBanks.kinematics = {
  unitSlug: "kinematics",
  quizQuestions: [
    q({
      id: "kin-q1",
      unitSlug: "kinematics",
      topicKey: "position-velocity",
      prompt: "A runner covers 120 m in 8 s. What is the average velocity?",
      choices: ["12 m/s", "15 m/s", "18 m/s", "960 m/s"],
      answer: 1,
      explanation: "Average velocity is displacement divided by time: 120/8 = 15 m/s.",
    }),
    q({
      id: "kin-q2",
      unitSlug: "kinematics",
      topicKey: "acceleration",
      prompt: "A car speeds up from 10 m/s to 22 m/s in 4 s. What is the acceleration?",
      choices: ["2 m/s^2", "3 m/s^2", "4 m/s^2", "8 m/s^2"],
      answer: 1,
      explanation: "Acceleration is change in velocity over time: (22 - 10)/4 = 3 m/s^2.",
    }),
    q({
      id: "kin-q3",
      unitSlug: "kinematics",
      topicKey: "kinematic-equations",
      prompt: "An object starts from rest and accelerates at 4 m/s^2 for 3 s. How far does it travel?",
      choices: ["9 m", "12 m", "18 m", "36 m"],
      answer: 2,
      explanation: "Use x = 1/2 a t^2 = 0.5 * 4 * 9 = 18 m.",
    }),
    q({
      id: "kin-q4",
      unitSlug: "kinematics",
      topicKey: "projectile-motion",
      prompt: "Ignoring air resistance, which launch angle gives maximum range on level ground?",
      choices: ["30 deg", "45 deg", "60 deg", "75 deg"],
      answer: 1,
      explanation: "Range is maximized when sin(2 theta) is 1, which happens at 45 degrees.",
    }),
    q({
      id: "kin-q5",
      unitSlug: "kinematics",
      topicKey: "motion-graphs",
      prompt: "What does the slope of a velocity-time graph represent?",
      choices: ["Displacement", "Acceleration", "Momentum", "Jerk"],
      answer: 1,
      explanation: "The slope of v versus t is acceleration.",
    }),
    q({
      id: "kin-q6",
      unitSlug: "kinematics",
      topicKey: "projectile-motion",
      prompt: "Two projectiles are launched at the same speed, one at 30 deg and one at 60 deg. How do their ranges compare?",
      choices: ["30 deg goes farther", "60 deg goes farther", "They have the same range", "Not enough information"],
      answer: 2,
      explanation: "Complementary launch angles have the same range on level ground.",
    }),
  ],
  frqProblems: [
    frq({
      id: "kin-frq-1",
      unitSlug: "kinematics",
      topicKey: "projectile-motion",
      title: "Cart and Cliff Launch",
      scenario:
        "A cart leaves the edge of a table moving horizontally at 6.0 m/s from a height of 1.8 m.",
      given: ["v_x = 6.0 m/s", "v_y0 = 0", "h = 1.8 m", "g = 9.8 m/s^2"],
      parts: [
        {
          label: "a",
          question: "Calculate the time the cart is in the air.",
          points: 2,
          rubric: [
            "Uses vertical motion with h = 1/2 g t^2.",
            "Finds t = sqrt(2h/g) ≈ 0.61 s.",
          ],
          sampleResponse:
            "The horizontal launch does not change the vertical fall time. Using 1.8 = 0.5(9.8)t^2 gives t ≈ 0.61 s.",
        },
        {
          label: "b",
          question: "Determine the horizontal distance from the table edge to the landing point.",
          points: 2,
          rubric: ["Uses x = v_x t.", "Finds x ≈ 3.7 m."],
          sampleResponse:
            "Horizontal velocity stays constant, so x = 6.0(0.61) ≈ 3.7 m.",
        },
        {
          label: "c",
          question: "Explain why the cart's horizontal and vertical motions can be treated separately.",
          points: 2,
          rubric: [
            "States that horizontal acceleration is zero when air resistance is ignored.",
            "States that gravity acts only vertically, so the components evolve independently.",
          ],
          sampleResponse:
            "With no air resistance there is no horizontal force, so horizontal acceleration is zero. Gravity acts only downward, so the vertical motion changes independently from the horizontal motion.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.dynamics = {
  unitSlug: "dynamics",
  quizQuestions: [
    q({
      id: "dyn-q1",
      unitSlug: "dynamics",
      topicKey: "newtons-laws",
      prompt: "A 4 kg box has a net force of 12 N to the right. What is its acceleration?",
      choices: ["2 m/s^2", "3 m/s^2", "4 m/s^2", "48 m/s^2"],
      answer: 1,
      explanation: "Newton's second law gives a = F/m = 12/4 = 3 m/s^2.",
    }),
    q({
      id: "dyn-q2",
      unitSlug: "dynamics",
      topicKey: "friction",
      prompt: "What determines the maximum static friction force before slipping begins?",
      choices: ["mu_s N", "mu_k N", "mg", "ma"],
      answer: 0,
      explanation: "Static friction can adjust up to a maximum value of mu_s times the normal force.",
    }),
    q({
      id: "dyn-q3",
      unitSlug: "dynamics",
      topicKey: "inclined-planes",
      prompt: "A block rests on a 30 deg incline. Which component of weight acts parallel to the plane?",
      choices: ["mg cos 30", "mg tan 30", "mg sin 30", "mg"],
      answer: 2,
      explanation: "The parallel component of weight down the incline is mg sin theta.",
    }),
    q({
      id: "dyn-q4",
      unitSlug: "dynamics",
      topicKey: "tension-normal",
      prompt: "For a mass hanging motionless from a rope, how does tension compare to the weight?",
      choices: ["Greater than weight", "Less than weight", "Equal to weight", "Zero"],
      answer: 2,
      explanation: "Zero acceleration means the upward tension balances the downward weight.",
    }),
    q({
      id: "dyn-q5",
      unitSlug: "dynamics",
      topicKey: "atwood-machines",
      prompt: "In an ideal Atwood machine with unequal masses, what can be said about the rope tension?",
      choices: ["It equals the heavier weight", "It equals the lighter weight", "It is the same throughout the rope", "It varies by position"],
      answer: 2,
      explanation: "For an ideal massless rope and pulley, the tension is uniform throughout the rope.",
    }),
    q({
      id: "dyn-q6",
      unitSlug: "dynamics",
      topicKey: "newtons-laws",
      prompt: "A puck moves across frictionless ice at constant velocity. What is the net force?",
      choices: ["Zero", "Forward", "Backward", "Equal to its weight"],
      answer: 0,
      explanation: "Constant velocity means zero acceleration, so the net force is zero.",
    }),
  ],
  frqProblems: [
    frq({
      id: "dyn-frq-1",
      unitSlug: "dynamics",
      topicKey: "friction",
      title: "Block on a Rough Incline",
      scenario:
        "A 6.0 kg crate is pulled up a 25 deg incline by a rope parallel to the surface. The coefficient of kinetic friction is 0.20 and the crate accelerates at 0.80 m/s^2.",
      given: ["m = 6.0 kg", "theta = 25 deg", "mu_k = 0.20", "a = 0.80 m/s^2", "g = 9.8 m/s^2"],
      parts: [
        {
          label: "a",
          question: "Draw and label the free-body diagram.",
          points: 2,
          rubric: [
            "Includes weight, normal force, rope tension, and kinetic friction.",
            "Shows friction opposing motion along the incline.",
          ],
          sampleResponse:
            "The diagram includes mg downward, a normal force perpendicular to the plane, rope tension up the plane, and kinetic friction down the plane.",
        },
        {
          label: "b",
          question: "Calculate the tension in the rope.",
          points: 3,
          rubric: [
            "Resolves weight into components parallel and perpendicular to the incline.",
            "Uses f_k = mu_k N.",
            "Applies ΣF_parallel = ma to solve for T.",
          ],
          sampleResponse:
            "Along the incline, T - mg sin25 - mu_k mg cos25 = ma. Solving gives T ≈ 40 N.",
        },
        {
          label: "c",
          question: "Explain how the acceleration would change if the rope force stayed the same but friction were removed.",
          points: 2,
          rubric: [
            "States acceleration would increase.",
            "Connects the change to the removal of a force opposing the motion.",
          ],
          sampleResponse:
            "Without friction there is less opposing force down the plane, so the same rope tension produces a larger net force and therefore a larger acceleration.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.energy = {
  unitSlug: "energy",
  quizQuestions: [
    q({
      id: "ene-q1",
      unitSlug: "energy",
      topicKey: "work",
      prompt: "A 10 N force moves an object 5 m in the same direction. How much work is done?",
      choices: ["2 J", "25 J", "50 J", "100 J"],
      answer: 2,
      explanation: "Work is Fd cos theta. With theta = 0, W = 10 * 5 = 50 J.",
    }),
    q({
      id: "ene-q2",
      unitSlug: "energy",
      topicKey: "kinetic-energy",
      prompt: "What happens to kinetic energy if speed doubles while mass stays constant?",
      choices: ["It doubles", "It triples", "It quadruples", "It stays the same"],
      answer: 2,
      explanation: "Kinetic energy depends on v^2, so doubling speed multiplies KE by 4.",
    }),
    q({
      id: "ene-q3",
      unitSlug: "energy",
      topicKey: "potential-energy",
      prompt: "What is the gravitational potential energy of a 2 kg object 5 m above the ground? Use g = 10 m/s^2.",
      choices: ["10 J", "25 J", "50 J", "100 J"],
      answer: 3,
      explanation: "PE = mgh = 2 * 10 * 5 = 100 J.",
    }),
    q({
      id: "ene-q4",
      unitSlug: "energy",
      topicKey: "conservation-energy",
      prompt: "In the absence of non-conservative work, total mechanical energy is:",
      choices: ["Always increasing", "Always decreasing", "Conserved", "Zero"],
      answer: 2,
      explanation: "When only conservative forces do work, mechanical energy is conserved.",
    }),
    q({
      id: "ene-q5",
      unitSlug: "energy",
      topicKey: "power",
      prompt: "A machine does 600 J of work in 3 s. What is its power?",
      choices: ["1800 W", "600 W", "300 W", "200 W"],
      answer: 3,
      explanation: "Power is work divided by time: 600/3 = 200 W.",
    }),
    q({
      id: "ene-q6",
      unitSlug: "energy",
      topicKey: "conservation-energy",
      prompt: "At the bottom of a frictionless track, a skater has mostly:",
      choices: ["Kinetic energy", "Gravitational potential energy", "Thermal energy", "No energy"],
      answer: 0,
      explanation: "At the lowest point, gravitational potential energy is smallest and kinetic energy is largest.",
    }),
  ],
  frqProblems: [
    frq({
      id: "ene-frq-1",
      unitSlug: "energy",
      topicKey: "conservation-energy",
      title: "Ramp and Spring",
      scenario:
        "A 0.80 kg block slides from rest down a frictionless ramp from a height of 1.5 m and compresses a spring at the bottom.",
      given: ["m = 0.80 kg", "h = 1.5 m", "k = 160 N/m", "g = 9.8 m/s^2"],
      parts: [
        {
          label: "a",
          question: "Find the block's speed just before it reaches the spring.",
          points: 2,
          rubric: ["Uses mgh = 1/2 mv^2.", "Finds v ≈ 5.4 m/s."],
          sampleResponse:
            "Because the ramp is frictionless, mgh = 1/2 mv^2. Solving gives v = sqrt(2gh) ≈ 5.4 m/s.",
        },
        {
          label: "b",
          question: "Determine the maximum compression of the spring.",
          points: 3,
          rubric: [
            "Uses mgh = 1/2 kx^2.",
            "Solves for x.",
            "Finds x ≈ 0.38 m.",
          ],
          sampleResponse:
            "At maximum compression, all the initial gravitational potential energy is stored in the spring. So 0.80(9.8)(1.5) = 0.5(160)x^2, giving x ≈ 0.38 m.",
        },
        {
          label: "c",
          question: "Describe how the answer would change if friction acted along the ramp.",
          points: 2,
          rubric: [
            "States that the final speed and compression would both be smaller.",
            "Explains that friction converts part of the mechanical energy into thermal energy.",
          ],
          sampleResponse:
            "Friction would remove some mechanical energy as thermal energy, so the block would reach the spring with less speed and the spring would compress by a smaller distance.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.momentum = {
  unitSlug: "momentum",
  quizQuestions: [
    q({
      id: "mom-q1",
      unitSlug: "momentum",
      topicKey: "momentum-impulse",
      prompt: "What is the momentum of a 2 kg cart moving at 5 m/s?",
      choices: ["2.5 kg m/s", "7 kg m/s", "10 kg m/s", "25 kg m/s"],
      answer: 2,
      explanation: "Momentum is p = mv = 2 * 5 = 10 kg m/s.",
    }),
    q({
      id: "mom-q2",
      unitSlug: "momentum",
      topicKey: "impulse-force",
      prompt: "Impulse is equal to:",
      choices: ["Force divided by time", "Change in momentum", "Mass times acceleration", "Kinetic energy"],
      answer: 1,
      explanation: "Impulse equals the change in momentum of the object.",
    }),
    q({
      id: "mom-q3",
      unitSlug: "momentum",
      topicKey: "conservation-momentum",
      prompt: "In an isolated system, the total momentum before a collision compared with after a collision is:",
      choices: ["Greater before", "Greater after", "The same", "Zero"],
      answer: 2,
      explanation: "Momentum is conserved in an isolated system.",
    }),
    q({
      id: "mom-q4",
      unitSlug: "momentum",
      topicKey: "elastic-collisions",
      prompt: "What quantity is conserved in every elastic collision in addition to momentum?",
      choices: ["Potential energy", "Kinetic energy", "Force", "Acceleration"],
      answer: 1,
      explanation: "Elastic collisions conserve both momentum and kinetic energy.",
    }),
    q({
      id: "mom-q5",
      unitSlug: "momentum",
      topicKey: "inelastic-collisions",
      prompt: "Two carts stick together after collision. The collision is:",
      choices: ["Elastic", "Perfectly inelastic", "Impossible", "Explosive"],
      answer: 1,
      explanation: "Objects sticking together identifies a perfectly inelastic collision.",
    }),
    q({
      id: "mom-q6",
      unitSlug: "momentum",
      topicKey: "impulse-force",
      prompt: "For the same change in momentum, increasing the interaction time will:",
      choices: ["Increase average force", "Decrease average force", "Keep average force the same", "Reverse the force"],
      answer: 1,
      explanation: "Impulse equals force times time, so a longer time means a smaller average force for the same impulse.",
    }),
  ],
  frqProblems: [
    frq({
      id: "mom-frq-1",
      unitSlug: "momentum",
      topicKey: "conservation-momentum",
      title: "Two-Cart Collision",
      scenario:
        "Cart A of mass 0.50 kg moves right at 3.0 m/s and collides with cart B of mass 0.75 kg initially at rest on a nearly frictionless track. The carts stick together.",
      given: ["m_A = 0.50 kg", "v_Ai = 3.0 m/s", "m_B = 0.75 kg", "v_Bi = 0"],
      parts: [
        {
          label: "a",
          question: "Find the velocity of the combined carts after the collision.",
          points: 2,
          rubric: [
            "Uses conservation of momentum.",
            "Finds v_f = (m_A v_Ai)/(m_A + m_B) = 1.2 m/s.",
          ],
          sampleResponse:
            "Because momentum is conserved, (0.50)(3.0) = (0.50 + 0.75)v_f, so v_f = 1.2 m/s to the right.",
        },
        {
          label: "b",
          question: "Determine whether kinetic energy is conserved.",
          points: 3,
          rubric: [
            "Computes initial kinetic energy.",
            "Computes final kinetic energy.",
            "Concludes that kinetic energy decreases, so it is not conserved.",
          ],
          sampleResponse:
            "Initial KE is 0.5(0.50)(3.0^2) = 2.25 J. Final KE is 0.5(1.25)(1.2^2) = 0.90 J. Since the final value is smaller, kinetic energy is not conserved.",
        },
        {
          label: "c",
          question: "Explain where the missing kinetic energy goes.",
          points: 2,
          rubric: [
            "States that it is transformed into internal energy, sound, or deformation.",
            "Connects that conversion to the carts sticking together.",
          ],
          sampleResponse:
            "The missing kinetic energy is converted into internal energy such as sound, heat, and deformation during the sticking collision.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.torque = {
  unitSlug: "torque",
  quizQuestions: [
    q({
      id: "tor-q1",
      unitSlug: "torque",
      topicKey: "torque-basics",
      prompt: "Torque magnitude is given by:",
      choices: ["rF cos theta", "rF sin theta", "Fr^2", "I alpha"],
      answer: 1,
      explanation: "The magnitude of torque is rF sin theta.",
    }),
    q({
      id: "tor-q2",
      unitSlug: "torque",
      topicKey: "rotational-equilibrium",
      prompt: "For rotational equilibrium, the net torque must be:",
      choices: ["Maximum", "Equal to weight", "Zero", "Equal to angular momentum"],
      answer: 2,
      explanation: "Rotational equilibrium requires zero net torque.",
    }),
    q({
      id: "tor-q3",
      unitSlug: "torque",
      topicKey: "moment-of-inertia",
      prompt: "Moment of inertia depends on:",
      choices: ["Only mass", "Only radius", "Mass distribution relative to the axis", "Only angular acceleration"],
      answer: 2,
      explanation: "It depends on how the mass is distributed about the axis of rotation.",
    }),
    q({
      id: "tor-q4",
      unitSlug: "torque",
      topicKey: "newtons-second-rotation",
      prompt: "The rotational analog of F = ma is:",
      choices: ["tau = I alpha", "L = I omega", "p = mv", "W = tau theta"],
      answer: 0,
      explanation: "Net torque equals moment of inertia times angular acceleration.",
    }),
    q({
      id: "tor-q5",
      unitSlug: "torque",
      topicKey: "angular-kinematics",
      prompt: "Angular velocity is measured in:",
      choices: ["m/s", "rad/s", "N m", "kg m^2"],
      answer: 1,
      explanation: "Angular velocity uses radians per second.",
    }),
    q({
      id: "tor-q6",
      unitSlug: "torque",
      topicKey: "rotational-equilibrium",
      prompt: "If a force acts directly through the pivot point, the torque is:",
      choices: ["Maximum", "Positive", "Negative", "Zero"],
      answer: 3,
      explanation: "The lever arm is zero, so the torque is zero.",
    }),
  ],
  frqProblems: [
    frq({
      id: "tor-frq-1",
      unitSlug: "torque",
      topicKey: "rotational-equilibrium",
      title: "Meter Stick Balance",
      scenario:
        "A uniform meter stick of weight 2.0 N is supported at its center. A 1.5 N weight hangs 0.20 m to the left of center.",
      given: ["Stick weight = 2.0 N at center", "Pivot at center", "Left weight = 1.5 N at 0.20 m"],
      parts: [
        {
          label: "a",
          question: "Determine the torque due to the left hanging weight about the pivot.",
          points: 2,
          rubric: ["Uses tau = rF.", "Finds magnitude 0.30 N m."],
          sampleResponse:
            "The torque magnitude is (0.20 m)(1.5 N) = 0.30 N m about the pivot.",
        },
        {
          label: "b",
          question: "Where should a 0.75 N weight be placed on the right side to balance the stick?",
          points: 2,
          rubric: [
            "Sets clockwise and counterclockwise torques equal.",
            "Finds r = 0.40 m on the right.",
          ],
          sampleResponse:
            "Balance requires (0.75 N)r = 0.30 N m, so r = 0.40 m to the right of the pivot.",
        },
        {
          label: "c",
          question: "Explain why the weight of the stick itself does not affect the torque balance here.",
          points: 2,
          rubric: [
            "States that the stick's weight acts through the pivot.",
            "Recognizes zero lever arm means zero torque.",
          ],
          sampleResponse:
            "Because the stick is supported at its center and is uniform, its weight acts through the pivot. That gives it zero lever arm, so it contributes no torque about the pivot.",
        },
      ],
    }),
  ],
};

unitPracticeBanks["rotating-systems"] = {
  unitSlug: "rotating-systems",
  quizQuestions: [
    q({
      id: "rot-q1",
      unitSlug: "rotating-systems",
      topicKey: "rotational-ke",
      prompt: "Rotational kinetic energy is:",
      choices: ["1/2 I omega^2", "I alpha", "tau theta", "mgh"],
      answer: 0,
      explanation: "Rotational kinetic energy is one-half I omega squared.",
    }),
    q({
      id: "rot-q2",
      unitSlug: "rotating-systems",
      topicKey: "angular-momentum",
      prompt: "Angular momentum for a rigid body about a fixed axis is:",
      choices: ["I alpha", "I omega", "mr^2", "tau t"],
      answer: 1,
      explanation: "For rigid-body rotation, angular momentum is I omega.",
    }),
    q({
      id: "rot-q3",
      unitSlug: "rotating-systems",
      topicKey: "conservation-angular",
      prompt: "A skater pulls in their arms while spinning. What happens if external torque is negligible?",
      choices: ["Angular speed decreases", "Angular speed increases", "Angular momentum becomes zero", "Moment of inertia increases"],
      answer: 1,
      explanation: "Reducing moment of inertia increases angular speed so angular momentum stays constant.",
    }),
    q({
      id: "rot-q4",
      unitSlug: "rotating-systems",
      topicKey: "rolling-motion",
      prompt: "For rolling without slipping, the speed of the center of mass is:",
      choices: ["v = r alpha", "v = r omega", "v = omega / r", "v = tau / I"],
      answer: 1,
      explanation: "Rolling without slipping requires v = r omega.",
    }),
    q({
      id: "rot-q5",
      unitSlug: "rotating-systems",
      topicKey: "combined-rotation",
      prompt: "A larger moment of inertia means, for the same torque:",
      choices: ["Larger angular acceleration", "Smaller angular acceleration", "Same angular acceleration", "Zero angular momentum"],
      answer: 1,
      explanation: "Because alpha = tau / I, larger I means smaller angular acceleration.",
    }),
    q({
      id: "rot-q6",
      unitSlug: "rotating-systems",
      topicKey: "angular-momentum",
      prompt: "What can change angular momentum?",
      choices: ["Any force", "Only net external torque", "Only mass", "Only angular speed"],
      answer: 1,
      explanation: "Net external torque changes angular momentum.",
    }),
  ],
  frqProblems: [
    frq({
      id: "rot-frq-1",
      unitSlug: "rotating-systems",
      topicKey: "conservation-angular",
      title: "Spinning Platform",
      scenario:
        "A student stands on a frictionless rotating platform holding two masses. Initially the platform and student rotate at 1.5 rad/s with a total moment of inertia of 4.0 kg m^2. The student then pulls the masses inward so the total moment of inertia becomes 2.5 kg m^2.",
      given: ["omega_i = 1.5 rad/s", "I_i = 4.0 kg m^2", "I_f = 2.5 kg m^2"],
      parts: [
        {
          label: "a",
          question: "Calculate the final angular speed.",
          points: 2,
          rubric: [
            "Uses conservation of angular momentum I_i omega_i = I_f omega_f.",
            "Finds omega_f = 2.4 rad/s.",
          ],
          sampleResponse:
            "With negligible external torque, angular momentum stays constant: (4.0)(1.5) = (2.5)omega_f, so omega_f = 2.4 rad/s.",
        },
        {
          label: "b",
          question: "Determine whether rotational kinetic energy is conserved.",
          points: 2,
          rubric: [
            "Computes initial and final rotational kinetic energies.",
            "Concludes the final kinetic energy is larger, so it is not conserved.",
          ],
          sampleResponse:
            "KE_i = 0.5(4.0)(1.5^2) = 4.5 J. KE_f = 0.5(2.5)(2.4^2) = 7.2 J. Rotational kinetic energy increases, so it is not conserved.",
        },
        {
          label: "c",
          question: "Explain where the extra rotational kinetic energy comes from.",
          points: 2,
          rubric: [
            "States that the student does work while pulling the masses inward.",
            "Connects that work to the increase in rotational kinetic energy.",
          ],
          sampleResponse:
            "The student does work to pull the masses inward against their rotational motion. That work becomes additional rotational kinetic energy.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.oscillations = {
  unitSlug: "oscillations",
  quizQuestions: [
    q({
      id: "osc-q1",
      unitSlug: "oscillations",
      topicKey: "shm-basics",
      prompt: "In ideal simple harmonic motion, acceleration is always directed:",
      choices: ["Away from equilibrium", "Toward equilibrium", "Along the velocity", "Perpendicular to the motion"],
      answer: 1,
      explanation: "The restoring acceleration always points back toward equilibrium.",
    }),
    q({
      id: "osc-q2",
      unitSlug: "oscillations",
      topicKey: "spring-mass",
      prompt: "The period of a spring-mass oscillator is:",
      choices: ["2 pi sqrt(m/k)", "2 pi sqrt(k/m)", "sqrt(km)", "k/m"],
      answer: 0,
      explanation: "For a spring-mass system, T = 2 pi sqrt(m/k).",
    }),
    q({
      id: "osc-q3",
      unitSlug: "oscillations",
      topicKey: "pendulum",
      prompt: "For small angles, the period of a pendulum increases when:",
      choices: ["Length decreases", "Gravity increases", "Length increases", "Mass decreases"],
      answer: 2,
      explanation: "T = 2 pi sqrt(L/g), so increasing length increases the period.",
    }),
    q({
      id: "osc-q4",
      unitSlug: "oscillations",
      topicKey: "energy-shm",
      prompt: "At equilibrium in an ideal spring oscillator, the speed is:",
      choices: ["Maximum", "Minimum", "Zero", "Undefined"],
      answer: 0,
      explanation: "At equilibrium the spring potential energy is lowest and the speed is highest.",
    }),
    q({
      id: "osc-q5",
      unitSlug: "oscillations",
      topicKey: "shm-graphs",
      prompt: "A displacement-time graph for SHM is:",
      choices: ["Linear", "Parabolic", "Sinusoidal", "Exponential"],
      answer: 2,
      explanation: "Ideal SHM produces sinusoidal position-time graphs.",
    }),
    q({
      id: "osc-q6",
      unitSlug: "oscillations",
      topicKey: "pendulum",
      prompt: "For a simple pendulum at small amplitude, changing the bob mass will:",
      choices: ["Increase period", "Decrease period", "Not change the period", "Reverse the motion"],
      answer: 2,
      explanation: "The period depends on length and gravity, not bob mass.",
    }),
  ],
  frqProblems: [
    frq({
      id: "osc-frq-1",
      unitSlug: "oscillations",
      topicKey: "pendulum",
      title: "Pendulum Timing",
      scenario:
        "A simple pendulum of length 1.2 m oscillates with a small amplitude on Earth.",
      given: ["L = 1.2 m", "g = 9.8 m/s^2"],
      parts: [
        {
          label: "a",
          question: "Calculate the pendulum period.",
          points: 2,
          rubric: ["Uses T = 2 pi sqrt(L/g).", "Finds T ≈ 2.2 s."],
          sampleResponse:
            "For a small-angle pendulum, T = 2 pi sqrt(1.2/9.8) ≈ 2.2 s.",
        },
        {
          label: "b",
          question: "Explain what would happen to the period on the Moon where gravity is smaller.",
          points: 2,
          rubric: [
            "States the period would increase.",
            "Connects the increase to the smaller value of g in the denominator.",
          ],
          sampleResponse:
            "Because gravity is smaller on the Moon, the value of sqrt(L/g) is larger, so the pendulum takes longer to complete each oscillation.",
        },
        {
          label: "c",
          question: "State one reason real pendulum data may differ slightly from the ideal formula.",
          points: 2,
          rubric: [
            "Mentions damping, large angles, pivot friction, or air resistance.",
            "Explains that the ideal formula assumes small amplitude and negligible losses.",
          ],
          sampleResponse:
            "Real pendulums lose energy to air resistance and pivot friction, and large amplitudes break the small-angle approximation, so measured periods can differ slightly from the ideal prediction.",
        },
      ],
    }),
  ],
};

unitPracticeBanks.fluids = {
  unitSlug: "fluids",
  quizQuestions: [
    q({
      id: "flu-q1",
      unitSlug: "fluids",
      topicKey: "pressure",
      prompt: "What is the gauge pressure 10 m below the surface of water? Use rho = 1000 kg/m^3 and g = 10 m/s^2.",
      choices: ["10,000 Pa", "100,000 Pa", "101,000 Pa", "1,000,000 Pa"],
      answer: 1,
      explanation: "Gauge pressure is rho g h = 1000 * 10 * 10 = 100,000 Pa.",
    }),
    q({
      id: "flu-q2",
      unitSlug: "fluids",
      topicKey: "pascal",
      prompt: "In a hydraulic lift, pressure applied to an enclosed fluid is transmitted:",
      choices: ["Only downward", "Only upward", "Equally throughout the fluid", "Only to larger pistons"],
      answer: 2,
      explanation: "Pascal's principle says pressure changes are transmitted equally in all directions.",
    }),
    q({
      id: "flu-q3",
      unitSlug: "fluids",
      topicKey: "buoyancy",
      prompt: "A wood block with density 600 kg/m^3 floats in water. What fraction of its volume is submerged?",
      choices: ["0.40", "0.60", "0.80", "1.00"],
      answer: 1,
      explanation: "For a floating object, the submerged fraction equals rho_object / rho_fluid = 0.60.",
    }),
    q({
      id: "flu-q4",
      unitSlug: "fluids",
      topicKey: "continuity",
      prompt: "A pipe narrows from area 0.04 m^2 to 0.01 m^2. If the speed in the wide section is 2 m/s, the speed in the narrow section is:",
      choices: ["0.5 m/s", "4 m/s", "8 m/s", "16 m/s"],
      answer: 2,
      explanation: "Continuity gives A1 v1 = A2 v2, so v2 = (0.04 * 2)/0.01 = 8 m/s.",
    }),
    q({
      id: "flu-q5",
      unitSlug: "fluids",
      topicKey: "bernoulli",
      prompt: "In a horizontal pipe, fluid speed increases. What happens to pressure?",
      choices: ["It increases", "It decreases", "It stays the same", "It becomes zero"],
      answer: 1,
      explanation: "Bernoulli's principle says higher speed corresponds to lower pressure in a horizontal flow.",
    }),
    q({
      id: "flu-q6",
      unitSlug: "fluids",
      topicKey: "bernoulli",
      prompt: "Torricelli's theorem predicts the exit speed from a hole a depth h below a fluid surface as:",
      choices: ["sqrt(gh)", "sqrt(2gh)", "gh", "2gh"],
      answer: 1,
      explanation: "The ideal efflux speed is v = sqrt(2gh).",
    }),
  ],
  frqProblems: [
    frq({
      id: "flu-frq-1",
      unitSlug: "fluids",
      topicKey: "bernoulli",
      title: "Draining Tank",
      scenario:
        "A large open tank contains water to a depth of 2.0 m above a small hole near its base.",
      given: ["h = 2.0 m", "g = 9.8 m/s^2", "rho_water = 1000 kg/m^3"],
      parts: [
        {
          label: "a",
          question: "Calculate the water speed as it exits the hole.",
          points: 2,
          rubric: ["Uses Torricelli's theorem v = sqrt(2gh).", "Finds v ≈ 6.3 m/s."],
          sampleResponse:
            "Using v = sqrt(2gh) gives v = sqrt(2 * 9.8 * 2.0) ≈ 6.3 m/s.",
        },
        {
          label: "b",
          question: "Explain qualitatively what happens to the exit speed as the tank drains.",
          points: 2,
          rubric: [
            "States that exit speed decreases as the height decreases.",
            "Links the change to the reduced pressure head above the hole.",
          ],
          sampleResponse:
            "As the tank drains, the fluid height above the hole gets smaller. That means the pressure head is smaller, so the exit speed decreases.",
        },
        {
          label: "c",
          question: "Describe one assumption built into Torricelli's theorem.",
          points: 2,
          rubric: [
            "Mentions ideal flow, negligible viscosity, or a large tank with tiny surface speed.",
            "Explains why that assumption simplifies the energy analysis.",
          ],
          sampleResponse:
            "One assumption is that the fluid behaves ideally with negligible viscosity. Another is that the tank is large enough that the speed of the top surface is effectively zero.",
        },
      ],
    }),
  ],
};

export function getUnitPracticeBank(unitSlug: string) {
  return unitPracticeBanks[unitSlug];
}

export function getAllPracticeQuestions() {
  return Object.values(unitPracticeBanks).flatMap((bank) => bank.quizQuestions);
}

export function getAllPracticeFrqs() {
  return Object.values(unitPracticeBanks).flatMap((bank) => bank.frqProblems);
}
