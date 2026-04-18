import type { UnitConfig } from "@/types/unit";
import { rotatingSystemsMeta } from "@/units/meta";
import { RotationalKE } from "./topics/rotational-ke";
import { AngularMomentum } from "./topics/angular-momentum";
import { ConservationAngular } from "./topics/conservation-angular";
import { RollingMotion } from "./topics/rolling-motion";
import { CombinedRotation } from "./topics/combined-rotation";
import { ProblemGenerator } from "./practice/problem-generator";
import { FormulaSpeedRound } from "@/components/practice/formula-speed-round";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";
import { Flashcards } from "./review/flashcards";
import { WorkedExamples } from "./review/worked-examples";
import { FormulaSheet } from "./review/formula-sheet";
import { ConceptMap } from "./explore/concept-map";
import { RealWorld } from "./explore/real-world";
import { WhatIf } from "./explore/what-if";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { TorquePhETSim } from "./simulations/torque-sim";

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
