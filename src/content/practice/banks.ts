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
      difficulty: "easy",
      estimatedMinutes: 10,
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
    frq({
      id: "kin-frq-2",
      unitSlug: "kinematics",
      topicKey: "kinematic-equations",
      title: "Braking Car on a Highway",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "A car travels at 28 m/s when the driver sees a stopped truck ahead. The driver reacts for 0.60 s before applying the brakes, which produce a constant deceleration of 6.0 m/s^2 until the car stops.",
      given: [
        "v_0 = 28 m/s",
        "t_react = 0.60 s",
        "a_brake = -6.0 m/s^2",
        "v_f = 0",
      ],
      parts: [
        {
          label: "a",
          question: "Determine the distance the car covers during the reaction time.",
          points: 2,
          rubric: [
            "Recognizes the car moves at constant speed during the reaction time.",
            "Calculates d_react = v_0 t_react = 16.8 m.",
          ],
          sampleResponse:
            "During the reaction time the speed is unchanged, so d_react = (28)(0.60) = 16.8 m.",
        },
        {
          label: "b",
          question: "Calculate the additional distance traveled while braking to rest.",
          points: 3,
          rubric: [
            "Uses v_f^2 = v_0^2 + 2 a d.",
            "Solves for d_brake = v_0^2 / (2 |a|).",
            "Finds d_brake ≈ 65 m.",
          ],
          sampleResponse:
            "Using 0 = (28)^2 + 2(-6.0) d_brake gives d_brake = 784/12 ≈ 65 m.",
        },
        {
          label: "c",
          question: "Sketch and describe the shape of the velocity-versus-time graph from the moment the driver sees the truck until the car stops.",
          points: 2,
          rubric: [
            "Describes a horizontal segment during the reaction time.",
            "Describes a straight line with negative slope during braking down to v = 0.",
          ],
          sampleResponse:
            "From t = 0 to t = 0.60 s the graph is a horizontal line at v = 28 m/s. After that, the graph is a straight line with slope -6.0 m/s^2 that reaches v = 0 at about t = 5.3 s.",
        },
        {
          label: "d",
          question: "If the highway is wet and the maximum deceleration drops to 3.0 m/s^2, explain qualitatively how the total stopping distance changes.",
          points: 2,
          rubric: [
            "States that the braking distance increases.",
            "Explains using the inverse relationship between d_brake and |a|.",
          ],
          sampleResponse:
            "The reaction distance is unchanged because the speed during the reaction time is the same. Because d_brake is inversely proportional to |a|, cutting the deceleration in half roughly doubles the braking distance, so the total stopping distance grows.",
        },
      ],
    }),
    frq({
      id: "kin-frq-3",
      unitSlug: "kinematics",
      topicKey: "motion-graphs",
      title: "Interpreting a Position-Time Graph",
      difficulty: "medium",
      estimatedMinutes: 10,
      scenario:
        "A toy robot moves along a straight track. Its position-time graph has three segments: from 0 to 2 s the position goes from 0 to 4 m linearly; from 2 to 5 s the position is constant at 4 m; from 5 to 8 s the position decreases linearly from 4 m to -2 m.",
      given: [
        "Segment 1: 0 to 2 s, x from 0 to 4 m",
        "Segment 2: 2 to 5 s, x = 4 m",
        "Segment 3: 5 to 8 s, x from 4 m to -2 m",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the average velocity during each segment.",
          points: 3,
          rubric: [
            "Segment 1: v = +2 m/s.",
            "Segment 2: v = 0.",
            "Segment 3: v = -2 m/s.",
          ],
          sampleResponse:
            "Average velocity equals change in position over change in time. Segment 1: (4-0)/2 = 2 m/s. Segment 2: 0/3 = 0. Segment 3: (-2-4)/3 = -2 m/s.",
        },
        {
          label: "b",
          question: "Describe the motion of the robot in everyday language, including direction.",
          points: 2,
          rubric: [
            "Moves forward at constant speed, then is at rest, then moves backward past the origin.",
            "Mentions that the speed has the same magnitude in segments 1 and 3 but opposite directions.",
          ],
          sampleResponse:
            "The robot first moves forward at a steady 2 m/s for two seconds, then stays still for three seconds. Finally it moves backward at 2 m/s for three seconds, passing through the origin and ending 2 m on the negative side.",
        },
        {
          label: "c",
          question: "On the interval from 0 to 8 s, compute the total distance traveled and the total displacement.",
          points: 2,
          rubric: [
            "Distance = 4 + 0 + 6 = 10 m.",
            "Displacement = -2 m.",
          ],
          sampleResponse:
            "Distance adds up the path length: 4 m forward + 0 m + 6 m backward = 10 m. Displacement is final minus initial position: -2 - 0 = -2 m.",
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
      difficulty: "medium",
      estimatedMinutes: 12,
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
    frq({
      id: "dyn-frq-2",
      unitSlug: "dynamics",
      topicKey: "atwood-machines",
      title: "Modified Atwood Machine",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "A 3.0 kg cart sits on a frictionless horizontal track and is connected over a massless, frictionless pulley to a 2.0 kg hanging mass. The system is released from rest.",
      given: [
        "m_cart = 3.0 kg",
        "m_hang = 2.0 kg",
        "g = 9.8 m/s^2",
        "Track is frictionless",
      ],
      parts: [
        {
          label: "a",
          question: "Draw separate free-body diagrams for the cart and the hanging mass.",
          points: 2,
          rubric: [
            "Cart: normal force up, weight down, tension horizontal toward pulley.",
            "Hanging mass: tension up, weight down.",
          ],
          sampleResponse:
            "For the cart the vertical forces are its weight down and the normal force up; horizontally only the rope tension acts toward the pulley. For the hanging mass only tension up and weight down act.",
        },
        {
          label: "b",
          question: "Derive an expression for the acceleration of the system and calculate its numerical value.",
          points: 3,
          rubric: [
            "Writes Newton's second law for each object with the same acceleration magnitude.",
            "Eliminates tension to get a = m_hang g / (m_cart + m_hang).",
            "Computes a = 2.0(9.8)/5.0 ≈ 3.9 m/s^2.",
          ],
          sampleResponse:
            "For the cart: T = m_cart a. For the hanging mass: m_hang g - T = m_hang a. Adding these gives a = m_hang g / (m_cart + m_hang) = (2.0)(9.8)/5.0 ≈ 3.9 m/s^2.",
        },
        {
          label: "c",
          question: "Calculate the tension in the rope.",
          points: 2,
          rubric: [
            "Uses T = m_cart a (or m_hang (g - a)).",
            "Finds T ≈ 12 N.",
          ],
          sampleResponse:
            "Using T = m_cart a = (3.0)(3.9) ≈ 12 N. This is less than the 19.6 N weight of the hanging mass, consistent with downward acceleration.",
        },
        {
          label: "d",
          question: "Explain what happens to the acceleration if the hanging mass is doubled while the cart mass is kept the same.",
          points: 2,
          rubric: [
            "States acceleration increases.",
            "Uses the formula a = m_hang g / (m_cart + m_hang) to justify the change and notes it approaches g as m_hang grows.",
          ],
          sampleResponse:
            "Doubling m_hang increases the numerator more than the denominator, so a grows. In the limit of a very large m_hang, a approaches g because the cart's inertia becomes negligible.",
        },
      ],
    }),
    frq({
      id: "dyn-frq-3",
      unitSlug: "dynamics",
      topicKey: "newtons-laws",
      title: "Elevator Scale Reading",
      difficulty: "easy",
      estimatedMinutes: 10,
      scenario:
        "A 60 kg student stands on a bathroom scale inside an elevator. The scale reads the normal force in newtons.",
      given: ["m = 60 kg", "g = 9.8 m/s^2"],
      parts: [
        {
          label: "a",
          question: "Determine the scale reading when the elevator is at rest or moving at constant velocity.",
          points: 2,
          rubric: [
            "Applies Newton's second law with a = 0.",
            "Finds N = mg ≈ 590 N.",
          ],
          sampleResponse:
            "With a = 0, the net force is zero and N = mg = (60)(9.8) ≈ 590 N.",
        },
        {
          label: "b",
          question: "The elevator accelerates upward at 2.0 m/s^2. Calculate the new scale reading and explain whether the student feels heavier or lighter.",
          points: 3,
          rubric: [
            "Writes N - mg = ma.",
            "Computes N = m(g + a) ≈ 708 N.",
            "States the student feels heavier because the scale reads above mg.",
          ],
          sampleResponse:
            "From N - mg = ma, N = m(g + a) = 60(9.8 + 2.0) ≈ 708 N. Since the scale pushes harder than normal, the student feels heavier.",
        },
        {
          label: "c",
          question: "Describe what the scale would read if the elevator cable broke and the elevator were in free fall.",
          points: 2,
          rubric: [
            "States the scale reads zero.",
            "Explains that both scale and student accelerate downward at g, so there is no contact force.",
          ],
          sampleResponse:
            "In free fall the scale and the student accelerate downward at g together, so the scale exerts no force on the student and reads 0 N. This is apparent weightlessness.",
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
      difficulty: "medium",
      estimatedMinutes: 12,
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
    frq({
      id: "ene-frq-2",
      unitSlug: "energy",
      topicKey: "work",
      title: "Pulling a Crate at an Angle",
      difficulty: "medium",
      estimatedMinutes: 11,
      scenario:
        "A student pulls a 20 kg crate 5.0 m across a horizontal floor with a constant rope force of 80 N directed 30 degrees above the horizontal. The coefficient of kinetic friction between the crate and the floor is 0.15.",
      given: [
        "m = 20 kg",
        "F = 80 N",
        "theta = 30 deg",
        "d = 5.0 m",
        "mu_k = 0.15",
        "g = 9.8 m/s^2",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the work done by the rope on the crate.",
          points: 2,
          rubric: [
            "Uses W = F d cos theta.",
            "Finds W ≈ 346 J.",
          ],
          sampleResponse:
            "W_rope = F d cos theta = 80(5.0) cos 30 ≈ 346 J.",
        },
        {
          label: "b",
          question: "Determine the work done by kinetic friction on the crate.",
          points: 3,
          rubric: [
            "Finds normal force N = mg - F sin theta.",
            "Computes friction force f_k = mu_k N.",
            "Computes W_friction = -f_k d ≈ -117 J (negative sign required).",
          ],
          sampleResponse:
            "Vertical equilibrium gives N = mg - F sin30 = 196 - 40 = 156 N. Then f_k = 0.15(156) ≈ 23 N, so W_friction = -(23)(5.0) ≈ -117 J.",
        },
        {
          label: "c",
          question: "Using the work-energy theorem, find the crate's speed after 5.0 m, assuming it started from rest.",
          points: 2,
          rubric: [
            "Uses W_net = 1/2 m v^2.",
            "Finds v ≈ 4.8 m/s.",
          ],
          sampleResponse:
            "W_net ≈ 346 - 117 = 229 J. Setting 1/2 m v^2 = 229 gives v = sqrt(2(229)/20) ≈ 4.8 m/s.",
        },
      ],
    }),
    frq({
      id: "ene-frq-3",
      unitSlug: "energy",
      topicKey: "power",
      title: "Motor Lifting a Load",
      difficulty: "easy",
      estimatedMinutes: 9,
      scenario:
        "A small electric motor lifts a 30 kg crate at a constant speed of 0.50 m/s up to a loft. The motor is 80% efficient.",
      given: [
        "m = 30 kg",
        "v = 0.50 m/s",
        "efficiency = 0.80",
        "g = 9.8 m/s^2",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the useful mechanical power delivered to the crate.",
          points: 2,
          rubric: [
            "Recognizes at constant speed lifting force equals mg.",
            "Computes P_useful = mgv = 30(9.8)(0.50) = 147 W.",
          ],
          sampleResponse:
            "At constant speed, the motor must exert an upward force equal to mg. The useful power is P = F v = mgv = 147 W.",
        },
        {
          label: "b",
          question: "Determine the electrical power the motor must draw.",
          points: 2,
          rubric: [
            "Uses P_input = P_useful / efficiency.",
            "Finds P_input ≈ 184 W.",
          ],
          sampleResponse:
            "P_input = P_useful / 0.80 = 147 / 0.80 ≈ 184 W.",
        },
        {
          label: "c",
          question: "Describe where the missing energy goes.",
          points: 2,
          rubric: [
            "Mentions heat dissipated in the motor windings, friction in the pulley, or other internal losses.",
            "Notes that these losses convert electrical energy into thermal energy.",
          ],
          sampleResponse:
            "The 20% difference becomes thermal energy in the motor windings and bearings because of electrical resistance and mechanical friction.",
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
      difficulty: "medium",
      estimatedMinutes: 12,
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
    frq({
      id: "mom-frq-2",
      unitSlug: "momentum",
      topicKey: "impulse-force",
      title: "Bouncing Ball and Impulse",
      difficulty: "medium",
      estimatedMinutes: 10,
      scenario:
        "A 0.15 kg rubber ball strikes a wall horizontally at 8.0 m/s and rebounds at 6.0 m/s in the opposite direction. The contact lasts 0.020 s.",
      given: [
        "m = 0.15 kg",
        "v_i = +8.0 m/s",
        "v_f = -6.0 m/s",
        "Delta t = 0.020 s",
      ],
      parts: [
        {
          label: "a",
          question: "Determine the impulse delivered to the ball by the wall.",
          points: 2,
          rubric: [
            "Uses J = m Delta v with consistent signs.",
            "Finds J = -2.1 kg m/s (magnitude 2.1 kg m/s, opposite to initial motion).",
          ],
          sampleResponse:
            "J = m(v_f - v_i) = 0.15(-6.0 - 8.0) = -2.1 kg m/s. The impulse points opposite the initial motion.",
        },
        {
          label: "b",
          question: "Calculate the average force the wall exerts on the ball during contact.",
          points: 2,
          rubric: [
            "Uses F_avg = J / Delta t.",
            "Finds |F_avg| ≈ 105 N directed away from the wall.",
          ],
          sampleResponse:
            "F_avg = J / Delta t = -2.1 / 0.020 ≈ -105 N. The magnitude is about 105 N directed away from the wall.",
        },
        {
          label: "c",
          question: "Explain why a ball that sticks to the wall experiences a smaller average force for the same mass and initial speed.",
          points: 2,
          rubric: [
            "Computes or compares impulses: sticking gives |Delta v| = 8.0 m/s, while bouncing gives 14 m/s.",
            "Concludes smaller impulse leads to smaller average force for the same contact time.",
          ],
          sampleResponse:
            "If the ball sticks, its final velocity is 0 and |Delta v| = 8.0 m/s, so the impulse magnitude is 1.2 kg m/s. That is less than the 2.1 kg m/s needed to reverse it, so for the same contact time the average force is smaller.",
        },
        {
          label: "d",
          question: "State what happens to the average force if the contact time is doubled while the ball still rebounds with the same speeds.",
          points: 2,
          rubric: [
            "States that average force is halved.",
            "References J = F Delta t with constant J.",
          ],
          sampleResponse:
            "The impulse is the same because the change in momentum is unchanged. Since J = F_avg Delta t, doubling Delta t cuts F_avg in half.",
        },
      ],
    }),
    frq({
      id: "mom-frq-3",
      unitSlug: "momentum",
      topicKey: "conservation-momentum",
      title: "Recoil of a Skateboarder",
      difficulty: "easy",
      estimatedMinutes: 9,
      scenario:
        "A 55 kg skateboarder stands at rest on a frictionless surface holding a 4.0 kg medicine ball. They throw the ball horizontally forward at 6.0 m/s relative to the ground.",
      given: [
        "m_person = 55 kg",
        "m_ball = 4.0 kg",
        "v_ball = +6.0 m/s",
        "System initially at rest",
      ],
      parts: [
        {
          label: "a",
          question: "Find the skateboarder's velocity after the throw.",
          points: 2,
          rubric: [
            "Uses conservation of momentum for the isolated system.",
            "Finds v_person = -m_ball v_ball / m_person ≈ -0.44 m/s.",
          ],
          sampleResponse:
            "Initial momentum is zero. After the throw, 0 = 55 v_person + 4.0(6.0), so v_person = -24/55 ≈ -0.44 m/s (backward).",
        },
        {
          label: "b",
          question: "Explain why external forces like gravity and the normal force do not change the horizontal momentum of the system.",
          points: 2,
          rubric: [
            "Identifies that those external forces act vertically.",
            "Concludes they exert no net horizontal impulse.",
          ],
          sampleResponse:
            "Gravity and the normal force are both vertical. They contribute zero horizontal component of impulse, so horizontal momentum is conserved.",
        },
        {
          label: "c",
          question: "The skateboarder now throws the ball with the same force but over a longer time by pushing gently. Describe how the final speeds compare to the original throw.",
          points: 2,
          rubric: [
            "States the final speeds are the same if the applied impulses are equal.",
            "Relates impulse to momentum change via J = Delta p.",
          ],
          sampleResponse:
            "Final speeds depend on the total impulse, not on how it is delivered. If the same total impulse is applied, the ball and skateboarder end up with the same final speeds as before.",
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
      difficulty: "easy",
      estimatedMinutes: 9,
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
    frq({
      id: "tor-frq-2",
      unitSlug: "torque",
      topicKey: "newtons-second-rotation",
      title: "Unwinding Pulley",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "A light string is wound around a solid disk pulley of mass 2.0 kg and radius 0.10 m that can rotate freely about a horizontal axis. A 0.50 kg mass is attached to the free end of the string and released from rest.",
      given: [
        "M = 2.0 kg (disk)",
        "R = 0.10 m",
        "m = 0.50 kg (hanging)",
        "I_disk = 1/2 M R^2",
        "g = 9.8 m/s^2",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the moment of inertia of the disk about its axis.",
          points: 1,
          rubric: [
            "Uses I = 1/2 M R^2.",
            "Finds I = 0.010 kg m^2.",
          ],
          sampleResponse:
            "I = (1/2)(2.0)(0.10)^2 = 0.010 kg m^2.",
        },
        {
          label: "b",
          question: "Derive an expression for the linear acceleration of the hanging mass.",
          points: 3,
          rubric: [
            "Writes m g - T = m a for the hanging mass.",
            "Writes T R = I alpha with a = alpha R.",
            "Solves to a = m g / (m + I/R^2) = m g / (m + M/2).",
          ],
          sampleResponse:
            "For the hanging mass: mg - T = ma. For the disk: TR = I alpha = (1/2 M R^2)(a/R), so T = 1/2 M a. Substituting gives a = mg/(m + M/2).",
        },
        {
          label: "c",
          question: "Calculate the numerical value of the linear acceleration.",
          points: 2,
          rubric: [
            "Substitutes numbers into a = mg/(m + M/2).",
            "Finds a ≈ 3.3 m/s^2.",
          ],
          sampleResponse:
            "a = (0.50)(9.8)/(0.50 + 1.0) = 4.9/1.5 ≈ 3.3 m/s^2.",
        },
        {
          label: "d",
          question: "Explain qualitatively how the acceleration changes if the disk is replaced with a thin hoop of the same mass and radius.",
          points: 2,
          rubric: [
            "States a hoop has a larger moment of inertia (I = MR^2).",
            "Concludes the acceleration decreases.",
          ],
          sampleResponse:
            "A hoop has I = MR^2, twice that of a solid disk of the same mass. A larger rotational inertia means more of the gravitational force goes into angular acceleration, so the linear acceleration decreases.",
        },
      ],
    }),
    frq({
      id: "tor-frq-3",
      unitSlug: "torque",
      topicKey: "rotational-equilibrium",
      title: "Beam Held by a Cable",
      difficulty: "hard",
      estimatedMinutes: 14,
      scenario:
        "A uniform 8.0 kg horizontal beam of length 2.0 m is hinged to a wall at one end. A cable attached to the other end makes a 40 degree angle above the horizontal and holds the beam in static equilibrium. A 12 kg box sits on the beam 1.5 m from the hinge.",
      given: [
        "M_beam = 8.0 kg",
        "L = 2.0 m",
        "theta = 40 deg",
        "m_box = 12 kg at 1.5 m from hinge",
        "g = 9.8 m/s^2",
      ],
      parts: [
        {
          label: "a",
          question: "Draw an extended free-body diagram of the beam showing every force and its point of application.",
          points: 2,
          rubric: [
            "Weight of beam at its center, weight of box at 1.5 m, cable tension at the far end, and hinge reaction components at the wall.",
            "Correct direction for cable tension along the cable.",
          ],
          sampleResponse:
            "At the hinge there are horizontal and vertical reaction forces. Beam weight 78.4 N acts at 1.0 m. Box weight 117.6 N acts at 1.5 m. Cable tension T acts at 2.0 m along the cable at 40 degrees above horizontal.",
        },
        {
          label: "b",
          question: "By taking torques about the hinge, determine the tension in the cable.",
          points: 3,
          rubric: [
            "Sets torques about hinge to zero.",
            "Uses lever arms M_beam g (L/2) and m_box g d_box balanced by T L sin theta.",
            "Finds T ≈ 198 N.",
          ],
          sampleResponse:
            "Torque balance: T(L sin theta) = M_beam g(L/2) + m_box g d_box. T(2.0)(sin 40) = (8.0)(9.8)(1.0) + (12)(9.8)(1.5). T(1.286) ≈ 78.4 + 176.4 = 254.8, so T ≈ 198 N.",
        },
        {
          label: "c",
          question: "Find the horizontal and vertical components of the force that the hinge exerts on the beam.",
          points: 3,
          rubric: [
            "Horizontal: H = T cos theta ≈ 152 N toward the wall.",
            "Vertical: V = (M_beam + m_box) g - T sin theta ≈ 196 - 127 ≈ 69 N upward.",
            "Uses Sigma F_x = 0 and Sigma F_y = 0.",
          ],
          sampleResponse:
            "Horizontal: H = T cos 40 ≈ 198(0.766) ≈ 152 N. Vertical: V = total weight - T sin 40 = 196 - 127 ≈ 69 N upward.",
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
      difficulty: "medium",
      estimatedMinutes: 11,
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
    frq({
      id: "rot-frq-2",
      unitSlug: "rotating-systems",
      topicKey: "rolling-motion",
      title: "Rolling Down a Ramp",
      difficulty: "hard",
      estimatedMinutes: 14,
      scenario:
        "A uniform solid sphere of mass M and radius R rolls without slipping from rest down an incline of height h. Moment of inertia about its center is I_cm = 2/5 M R^2.",
      given: [
        "I_cm = 2/5 M R^2",
        "Rolls without slipping",
        "Starts from rest at height h",
        "Ramp frictionless enough to roll but with sufficient static friction",
      ],
      parts: [
        {
          label: "a",
          question: "Use energy conservation to derive an expression for the sphere's center-of-mass speed at the bottom of the ramp.",
          points: 3,
          rubric: [
            "Writes M g h = 1/2 M v^2 + 1/2 I omega^2.",
            "Applies rolling condition v = omega R.",
            "Solves for v = sqrt(10 g h / 7).",
          ],
          sampleResponse:
            "Conservation of energy: M g h = 1/2 M v^2 + 1/2(2/5 M R^2)(v/R)^2 = 1/2 M v^2 + 1/5 M v^2 = 7/10 M v^2. Solving gives v = sqrt(10 g h / 7).",
        },
        {
          label: "b",
          question: "Compare this speed to the speed a block of the same mass would have sliding down the same frictionless ramp.",
          points: 2,
          rubric: [
            "Block speed is sqrt(2 g h).",
            "Notes the rolling sphere is slower because some energy is stored in rotation.",
          ],
          sampleResponse:
            "A sliding block reaches sqrt(2gh), which is larger than sqrt(10gh/7). The rolling sphere is slower because part of its gravitational potential energy becomes rotational kinetic energy.",
        },
        {
          label: "c",
          question: "Explain the role of static friction in making the sphere roll without slipping and whether static friction does work on the sphere.",
          points: 3,
          rubric: [
            "States static friction provides the torque needed for angular acceleration.",
            "Explains static friction acts at the instantaneously stationary contact point.",
            "Concludes that it does no work on the sphere.",
          ],
          sampleResponse:
            "Static friction at the contact point exerts a torque that spins the sphere up so the rolling condition is satisfied. Because the contact point is instantaneously at rest, that friction force moves zero distance and does no work. That is why mechanical energy is conserved.",
        },
      ],
    }),
    frq({
      id: "rot-frq-3",
      unitSlug: "rotating-systems",
      topicKey: "angular-momentum",
      title: "Clay Sticking to a Rod",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "A uniform rod of mass 1.2 kg and length 0.80 m is pivoted at its center and initially at rest. A 0.10 kg ball of clay moving at 4.0 m/s strikes the end of the rod perpendicular to its length and sticks. The rod is free to rotate about the pivot.",
      given: [
        "M_rod = 1.2 kg",
        "L = 0.80 m",
        "I_rod = (1/12) M L^2 about center",
        "m_clay = 0.10 kg",
        "v_clay = 4.0 m/s",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the moment of inertia of the rod-plus-clay system about the pivot immediately after the clay sticks.",
          points: 2,
          rubric: [
            "Rod contributes (1/12)(1.2)(0.80)^2 = 0.064 kg m^2.",
            "Clay contributes (0.10)(0.40)^2 = 0.016 kg m^2; total I ≈ 0.080 kg m^2.",
          ],
          sampleResponse:
            "I_total = (1/12)(1.2)(0.80)^2 + (0.10)(0.40)^2 = 0.064 + 0.016 = 0.080 kg m^2.",
        },
        {
          label: "b",
          question: "Using conservation of angular momentum about the pivot, determine the angular speed just after the collision.",
          points: 3,
          rubric: [
            "Angular momentum before: m v r = 0.10(4.0)(0.40) = 0.16 kg m^2/s.",
            "Sets that equal to I_total omega.",
            "Finds omega = 2.0 rad/s.",
          ],
          sampleResponse:
            "Before: L = m v r = 0.10(4.0)(0.40) = 0.16 kg m^2/s. After: L = I_total omega. So omega = 0.16/0.080 = 2.0 rad/s.",
        },
        {
          label: "c",
          question: "Determine whether kinetic energy is conserved in this collision, and justify your answer.",
          points: 2,
          rubric: [
            "Compares initial KE (0.80 J) to final KE (0.16 J).",
            "Concludes kinetic energy is not conserved because the clay sticks.",
          ],
          sampleResponse:
            "Before: KE_i = 1/2(0.10)(4.0)^2 = 0.80 J. After: KE_f = 1/2(0.080)(2.0)^2 = 0.16 J. Since KE_f < KE_i, kinetic energy is not conserved — this is a perfectly inelastic collision.",
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
      difficulty: "easy",
      estimatedMinutes: 9,
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
    frq({
      id: "osc-frq-2",
      unitSlug: "oscillations",
      topicKey: "spring-mass",
      title: "Spring-Mass Oscillator",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "A 0.50 kg block on a frictionless horizontal surface is attached to a spring with k = 200 N/m. The block is pulled 0.10 m from equilibrium and released from rest at t = 0.",
      given: [
        "m = 0.50 kg",
        "k = 200 N/m",
        "A = 0.10 m",
        "v(0) = 0",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the angular frequency and the period of the oscillation.",
          points: 2,
          rubric: [
            "Uses omega = sqrt(k/m) = 20 rad/s.",
            "Uses T = 2 pi / omega ≈ 0.31 s.",
          ],
          sampleResponse:
            "omega = sqrt(200/0.50) = sqrt(400) = 20 rad/s. T = 2 pi/20 ≈ 0.31 s.",
        },
        {
          label: "b",
          question: "Determine the maximum speed and the maximum acceleration of the block.",
          points: 3,
          rubric: [
            "v_max = A omega = 2.0 m/s.",
            "a_max = A omega^2 = 40 m/s^2.",
            "Identifies v_max occurs at equilibrium and a_max at maximum displacement.",
          ],
          sampleResponse:
            "v_max = A omega = 0.10(20) = 2.0 m/s, reached when x = 0. a_max = A omega^2 = 0.10(400) = 40 m/s^2, reached at x = ±A.",
        },
        {
          label: "c",
          question: "Write the position of the block as a function of time, and state the position, velocity, and acceleration at t = T/4.",
          points: 3,
          rubric: [
            "x(t) = A cos(omega t) = 0.10 cos(20 t).",
            "At t = T/4, x = 0.",
            "v = -v_max = -2.0 m/s and a = 0.",
          ],
          sampleResponse:
            "Since it is released from rest at the extreme, x(t) = 0.10 cos(20 t). At t = T/4 we have cos(pi/2) = 0, so x = 0, v = -0.10(20) sin(pi/2) = -2.0 m/s, and a = -0.10(400) cos(pi/2) = 0.",
        },
      ],
    }),
    frq({
      id: "osc-frq-3",
      unitSlug: "oscillations",
      topicKey: "energy-shm",
      title: "Energy in an Oscillator",
      difficulty: "medium",
      estimatedMinutes: 11,
      scenario:
        "A 0.30 kg glider oscillates on a horizontal spring with amplitude 0.20 m. The spring constant is 80 N/m. Friction is negligible.",
      given: [
        "m = 0.30 kg",
        "k = 80 N/m",
        "A = 0.20 m",
      ],
      parts: [
        {
          label: "a",
          question: "Calculate the total mechanical energy of the oscillator.",
          points: 2,
          rubric: [
            "Uses E = 1/2 k A^2.",
            "Finds E = 1.6 J.",
          ],
          sampleResponse:
            "E = 1/2 k A^2 = 0.5(80)(0.20)^2 = 1.6 J.",
        },
        {
          label: "b",
          question: "Determine the glider's speed when it is 0.10 m from equilibrium.",
          points: 3,
          rubric: [
            "Uses energy conservation: 1/2 k A^2 = 1/2 k x^2 + 1/2 m v^2.",
            "Substitutes values.",
            "Finds v ≈ 2.8 m/s.",
          ],
          sampleResponse:
            "At x = 0.10 m: 1/2 k x^2 = 0.40 J, so 1/2 m v^2 = 1.6 - 0.40 = 1.20 J. Then v = sqrt(2(1.20)/0.30) ≈ 2.8 m/s.",
        },
        {
          label: "c",
          question: "Describe how the total mechanical energy would change if the amplitude were doubled.",
          points: 2,
          rubric: [
            "States total energy increases by a factor of four.",
            "References E ∝ A^2.",
          ],
          sampleResponse:
            "Because E = 1/2 k A^2, doubling A multiplies E by 4. The new total mechanical energy would be 6.4 J.",
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
      difficulty: "medium",
      estimatedMinutes: 10,
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
    frq({
      id: "flu-frq-2",
      unitSlug: "fluids",
      topicKey: "buoyancy",
      title: "Crown in Water",
      difficulty: "easy",
      estimatedMinutes: 9,
      scenario:
        "A decorative crown weighs 4.90 N in air. When fully submerged in water it appears to weigh only 4.41 N. (rho_water = 1000 kg/m^3.)",
      given: [
        "W_air = 4.90 N",
        "W_apparent = 4.41 N",
        "rho_water = 1000 kg/m^3",
        "g = 9.8 m/s^2",
      ],
      parts: [
        {
          label: "a",
          question: "Determine the buoyant force on the crown when submerged.",
          points: 1,
          rubric: [
            "States F_b = W_air - W_apparent.",
            "Finds F_b = 0.49 N.",
          ],
          sampleResponse:
            "F_b = 4.90 - 4.41 = 0.49 N upward.",
        },
        {
          label: "b",
          question: "Calculate the volume of the crown.",
          points: 2,
          rubric: [
            "Uses F_b = rho_water V g.",
            "Finds V = 5.0e-5 m^3.",
          ],
          sampleResponse:
            "V = F_b/(rho_water g) = 0.49/(1000 * 9.8) = 5.0e-5 m^3.",
        },
        {
          label: "c",
          question: "Find the density of the crown and comment on whether it could be made of pure gold (density 19,300 kg/m^3).",
          points: 3,
          rubric: [
            "Finds mass from W_air/g = 0.50 kg.",
            "Computes density rho = m/V = 10,000 kg/m^3.",
            "Concludes the crown is not pure gold because its density is too low.",
          ],
          sampleResponse:
            "Mass is m = W_air/g = 4.90/9.8 = 0.50 kg. Density is rho = 0.50/5.0e-5 = 1.0e4 kg/m^3, well below gold's 19,300 kg/m^3, so it is not pure gold.",
        },
      ],
    }),
    frq({
      id: "flu-frq-3",
      unitSlug: "fluids",
      topicKey: "continuity",
      title: "Narrowing Pipe",
      difficulty: "medium",
      estimatedMinutes: 12,
      scenario:
        "Water flows through a horizontal pipe that narrows from a cross-section of 4.0e-3 m^2 to 1.0e-3 m^2. The speed in the wide section is 1.5 m/s and the gauge pressure there is 2.0e5 Pa.",
      given: [
        "A_1 = 4.0e-3 m^2",
        "A_2 = 1.0e-3 m^2",
        "v_1 = 1.5 m/s",
        "P_1 = 2.0e5 Pa",
        "rho = 1000 kg/m^3",
      ],
      parts: [
        {
          label: "a",
          question: "Use the continuity equation to find the speed in the narrow section.",
          points: 2,
          rubric: [
            "Uses A_1 v_1 = A_2 v_2.",
            "Finds v_2 = 6.0 m/s.",
          ],
          sampleResponse:
            "v_2 = A_1 v_1 / A_2 = (4.0e-3)(1.5)/(1.0e-3) = 6.0 m/s.",
        },
        {
          label: "b",
          question: "Apply Bernoulli's equation to determine the pressure in the narrow section.",
          points: 3,
          rubric: [
            "Uses P_1 + 1/2 rho v_1^2 = P_2 + 1/2 rho v_2^2 for horizontal flow.",
            "Solves P_2 = P_1 + 1/2 rho (v_1^2 - v_2^2).",
            "Finds P_2 ≈ 1.83e5 Pa.",
          ],
          sampleResponse:
            "P_2 = 2.0e5 + 0.5(1000)((1.5)^2 - (6.0)^2) = 2.0e5 + 500(-33.75) = 2.0e5 - 16,875 ≈ 1.83e5 Pa.",
        },
        {
          label: "c",
          question: "Explain qualitatively why the pressure decreases even though the fluid speeds up.",
          points: 2,
          rubric: [
            "Uses energy conservation in Bernoulli to note kinetic energy per volume increases.",
            "States that the pressure potential energy per volume must decrease to compensate.",
          ],
          sampleResponse:
            "Bernoulli's equation is an energy statement per unit volume. As the fluid speeds up, its kinetic energy per unit volume grows. Since the total is conserved in a horizontal pipe, the pressure term must decrease.",
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
