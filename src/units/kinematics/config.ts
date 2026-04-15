import type { UnitConfig } from "@/types/unit";
import { PositionVelocity } from "./topics/position-velocity";
import { Acceleration } from "./topics/acceleration";
import { KinematicEquations } from "./topics/kinematic-equations";
import { ProjectileMotion } from "./topics/projectile-motion";
import { MotionGraphs } from "./topics/motion-graphs";
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
import { RealWorldExamples } from "./explore/real-world";
import { WhatIfScenarios } from "./explore/what-if";
import { EquationSolver } from "@/components/tools/equation-solver";
import { UnitConverter } from "@/components/tools/unit-converter";
import { FBDBuilder } from "@/components/tools/fbd-builder";
import { MistakeTracker } from "@/components/review/mistake-tracker";
import { ProjectileSim } from "./simulations/projectile-sim";
import { MovingManSim } from "./simulations/moving-man-sim";
import { ProjectileLauncher } from "./simulations/projectile-launcher";

const PracticeQuiz = createUnitPracticeQuiz("kinematics");
const FRQPractice = createUnitFrqPractice("kinematics");
const TimedTest = createUnitTimedTest("kinematics");

export const kinematicsConfig: UnitConfig = {
  slug: "kinematics",
  number: 1,
  name: "Kinematics",
  shortName: "Kinematics",
  examWeight: "10–15%",
  color: "#3b82f6",
  description: "Position, velocity, acceleration, kinematic equations, projectile motion, and motion graphs.",
  learnTopicIds: ["position-velocity", "acceleration", "kinematic-equations", "projectile-motion", "motion-graphs"],
  sections: [
    {
      label: "Learn", icon: "learn",
      items: [
        { id: "position-velocity", name: "Position & Velocity", short: "Pos/Vel" },
        { id: "acceleration", name: "Acceleration", short: "Accel" },
        { id: "kinematic-equations", name: "Kinematic Equations", short: "Equations" },
        { id: "projectile-motion", name: "Projectile Motion", short: "Projectile" },
        { id: "motion-graphs", name: "Motion Graphs", short: "Graphs" },
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
        { id: "sim-projectile", name: "Projectile Motion (PhET)", short: "Projectile" },
        { id: "sim-moving-man", name: "The Moving Man (PhET)", short: "Moving Man" },
        { id: "sim-launcher", name: "Projectile Launcher", short: "Launcher" },
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
    "position-velocity": PositionVelocity,
    "acceleration": Acceleration,
    "kinematic-equations": KinematicEquations,
    "projectile-motion": ProjectileMotion,
    "motion-graphs": MotionGraphs,
    "concept-map": ConceptMap,
    "real-world": RealWorldExamples,
    "what-if": WhatIfScenarios,
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
    "sim-projectile": ProjectileSim,
    "sim-moving-man": MovingManSim,
    "sim-launcher": ProjectileLauncher,
  },
};
