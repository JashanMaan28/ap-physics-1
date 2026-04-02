import type { UnitConfig } from "@/types/unit";

import { TorqueBasics } from "./topics/torque-basics";
import { RotationalEquilibrium } from "./topics/rotational-equilibrium";
import { MomentOfInertia } from "./topics/moment-of-inertia";
import { NewtonsSecondRotation } from "./topics/newtons-second-rotation";
import { AngularKinematics } from "./topics/angular-kinematics";
import { PracticeQuiz } from "./practice/practice-quiz";
import { ProblemGenerator } from "./practice/problem-generator";
import { FRQPractice } from "./practice/frq-practice";
import { TimedTest } from "./practice/timed-test";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { Flashcards } from "./review/flashcards";
import { WorkedExamples } from "./review/worked-examples";
import { FormulaSheet } from "./review/formula-sheet";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { BalancingActSim } from "./simulations/balancing-act-sim";
import { ConceptMap } from "./explore/concept-map";
import { RealWorld } from "./explore/real-world";
import { WhatIf } from "./explore/what-if";

export const torqueConfig: UnitConfig = {
  slug: "torque",
  number: 5,
  name: "Torque and Rotational Dynamics",
  shortName: "Torque",
  examWeight: "10–15%",
  color: "#ec4899",
  description: "Torque, rotational equilibrium, moment of inertia, and Newton's second law for rotation.",
  learnTopicIds: [
    "torque-basics",
    "rotational-equilibrium",
    "moment-of-inertia",
    "newtons-second-rotation",
    "angular-kinematics",
  ],
  sections: [
    {
      label: "Learn",
      icon: "learn",
      items: [
        { id: "torque-basics", name: "Torque Basics", short: "Torque" },
        { id: "rotational-equilibrium", name: "Rotational Equilibrium", short: "Equilibrium" },
        { id: "moment-of-inertia", name: "Moment of Inertia", short: "Inertia" },
        { id: "newtons-second-rotation", name: "Newton's 2nd (Rotation)", short: "τ=Iα" },
        { id: "angular-kinematics", name: "Angular Kinematics", short: "Kinematics" },
        { id: "concept-map", name: "Concept Map", short: "Map" },
        { id: "real-world", name: "Real-World Examples", short: "Examples" },
        { id: "what-if", name: "What If?", short: "What If" },
      ],
    },
    {
      label: "Practice",
      icon: "practice",
      items: [
        { id: "quiz", name: "Topic Quiz", short: "Quiz" },
        { id: "problem-gen", name: "Problem Generator", short: "Problems" },
        { id: "frq", name: "FRQ Practice", short: "FRQ" },
        { id: "timed-test", name: "Timed Mini-Test", short: "Timed" },
      ],
    },
    {
      label: "Tools",
      icon: "tools",
      items: [
        { id: "equation-solver", name: "Equation Solver", short: "Solver" },
        { id: "unit-converter", name: "Unit Converter", short: "Units" },
        { id: "fbd-builder", name: "FBD Builder", short: "FBD" },
      ],
    },
    {
      label: "Simulations",
      icon: "simulations",
      items: [
        { id: "sim-balancing", name: "Balancing Act (PhET)", short: "Balance" },
      ],
    },
    {
      label: "Review",
      icon: "review",
      items: [
        { id: "flashcards", name: "Flashcards", short: "Flash" },
        { id: "worked-examples", name: "Worked Examples", short: "Worked" },
        { id: "formula-sheet", name: "Formula Sheet", short: "Formulas" },
        { id: "mistakes", name: "Mistake Tracker", short: "Mistakes" },
      ],
    },
  ],
  componentMap: {
    "torque-basics": TorqueBasics,
    "rotational-equilibrium": RotationalEquilibrium,
    "moment-of-inertia": MomentOfInertia,
    "newtons-second-rotation": NewtonsSecondRotation,
    "angular-kinematics": AngularKinematics,
    "concept-map": ConceptMap,
    "real-world": RealWorld,
    "what-if": WhatIf,
    "quiz": PracticeQuiz,
    "problem-gen": ProblemGenerator,
    "frq": FRQPractice,
    "timed-test": TimedTest,
    "equation-solver": EquationSolver,
    "unit-converter": UnitConverter,
    "fbd-builder": FBDBuilder,
    "flashcards": Flashcards,
    "worked-examples": WorkedExamples,
    "formula-sheet": FormulaSheet,
    "mistakes": MistakeTracker,
    "sim-balancing": BalancingActSim,
  },
};
