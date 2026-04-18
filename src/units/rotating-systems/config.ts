import type { UnitConfig } from "@/types/unit";
import { rotatingSystemsMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const RotationalKE = lazyNamed(() => import("./topics/rotational-ke"), "RotationalKE");
const AngularMomentum = lazyNamed(() => import("./topics/angular-momentum"), "AngularMomentum");
const ConservationAngular = lazyNamed(() => import("./topics/conservation-angular"), "ConservationAngular");
const RollingMotion = lazyNamed(() => import("./topics/rolling-motion"), "RollingMotion");
const CombinedRotation = lazyNamed(() => import("./topics/combined-rotation"), "CombinedRotation");
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
const TorquePhETSim = lazyNamed(() => import("./simulations/torque-sim"), "TorquePhETSim");

const PracticeQuiz = createUnitPracticeQuiz("rotating-systems");
const FRQPractice = createUnitFrqPractice("rotating-systems");
const TimedTest = createUnitTimedTest("rotating-systems");

export const rotatingSystemsConfig: UnitConfig = {
  ...rotatingSystemsMeta,
  learnTopicIds: ["rotational-ke", "angular-momentum", "conservation-angular", "rolling-motion", "combined-rotation"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "rotational-ke", name: "Rotational KE", short: "KE_rot" },
        { id: "angular-momentum", name: "Angular Momentum", short: "L" },
        { id: "conservation-angular", name: "Conservation of L", short: "Conserv." },
        { id: "rolling-motion", name: "Rolling Motion", short: "Rolling" },
        { id: "combined-rotation", name: "Combined Rotation", short: "Combined" },
        { id: "concept-map", name: "Concept Map", short: "Map" },
        { id: "real-world", name: "Real-World Examples", short: "Examples" },
        { id: "what-if", name: "What If?", short: "What If" },
      ],
    },
    {
      label: "Practice", icon: "practice",
      items: [
        { id: "quiz", name: "Topic Quiz", short: "Quiz" },
        { id: "problem-gen", name: "Problem Generator", short: "Problems" },
        { id: "frq", name: "FRQ Practice", short: "FRQ" },
        { id: "timed-test", name: "Timed Mini-Test", short: "Timed" },
        { id: "formula-speed", name: "Formula Speed Round", short: "Speed" },
      ],
    },
    {
      label: "Tools", icon: "tools",
      items: [
        { id: "equation-solver", name: "Equation Solver", short: "Solver" },
        { id: "unit-converter", name: "Unit Converter", short: "Units" },
        { id: "fbd-builder", name: "FBD Builder", short: "FBD" },
      ],
    },
    {
      label: "Simulations", icon: "simulations",
      items: [
        { id: "sim-torque", name: "Torque (PhET)", short: "Torque" },
      ],
    },
    {
      label: "Review", icon: "review",
      items: [
        { id: "flashcards", name: "Flashcards", short: "Flash" },
        { id: "worked-examples", name: "Worked Examples", short: "Worked" },
        { id: "formula-sheet", name: "Formula Sheet", short: "Formulas" },
        { id: "mistakes", name: "Mistake Tracker", short: "Mistakes" },
      ],
    },
  ],
  componentMap: {
    "rotational-ke": RotationalKE,
    "angular-momentum": AngularMomentum,
    "conservation-angular": ConservationAngular,
    "rolling-motion": RollingMotion,
    "combined-rotation": CombinedRotation,
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
    "sim-torque": TorquePhETSim,
  },
};
