import type { UnitConfig } from "@/types/unit";
import { torqueMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const TorqueBasics = lazyNamed(() => import("./topics/torque-basics"), "TorqueBasics");
const RotationalEquilibrium = lazyNamed(() => import("./topics/rotational-equilibrium"), "RotationalEquilibrium");
const MomentOfInertia = lazyNamed(() => import("./topics/moment-of-inertia"), "MomentOfInertia");
const NewtonsSecondRotation = lazyNamed(() => import("./topics/newtons-second-rotation"), "NewtonsSecondRotation");
const AngularKinematics = lazyNamed(() => import("./topics/angular-kinematics"), "AngularKinematics");
const ConceptMap = lazyNamed(() => import("./explore/concept-map"), "ConceptMap");
const RealWorld = lazyNamed(() => import("./explore/real-world"), "RealWorld");
const WhatIf = lazyNamed(() => import("./explore/what-if"), "WhatIf");
const ProblemGenerator = lazyNamed(() => import("./practice/problem-generator"), "ProblemGenerator");
const FormulaSpeedRound = lazyNamed(() => import("@/components/practice/formula-speed-round"), "FormulaSpeedRound");
const Flashcards = lazyNamed(() => import("./review/flashcards"), "Flashcards");
const WorkedExamples = lazyNamed(() => import("./review/worked-examples"), "WorkedExamples");
const FormulaSheet = lazyNamed(() => import("./review/formula-sheet"), "FormulaSheet");
const EquationSolver = lazyNamed(() => import("@/components/tools/equation-solver"), "EquationSolver");
const UnitConverter = lazyNamed(() => import("@/components/tools/unit-converter"), "UnitConverter");
const FBDBuilder = lazyNamed(() => import("@/components/tools/fbd-builder"), "FBDBuilder");
const MistakeTracker = lazyNamed(() => import("@/components/review/mistake-tracker"), "MistakeTracker");
const BalancingActSim = lazyNamed(() => import("./simulations/balancing-act-sim"), "BalancingActSim");

const PracticeQuiz = createUnitPracticeQuiz("torque");
const FRQPractice = createUnitFrqPractice("torque");
const TimedTest = createUnitTimedTest("torque");

export const torqueConfig: UnitConfig = {
  ...torqueMeta,
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
        { id: "formula-speed", name: "Formula Speed Round", short: "Speed" },
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
    "formula-speed": FormulaSpeedRound,
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
