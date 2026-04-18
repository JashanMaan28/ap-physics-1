import type { UnitConfig } from "@/types/unit";
import { kinematicsMeta } from "@/units/meta";
import { lazyNamed } from "@/units/_lazy";
import {
  createUnitFrqPractice,
  createUnitPracticeQuiz,
  createUnitTimedTest,
} from "@/components/practice/unit-practice";

const PositionVelocity = lazyNamed(() => import("./topics/position-velocity"), "PositionVelocity");
const Acceleration = lazyNamed(() => import("./topics/acceleration"), "Acceleration");
const KinematicEquations = lazyNamed(() => import("./topics/kinematic-equations"), "KinematicEquations");
const ProjectileMotion = lazyNamed(() => import("./topics/projectile-motion"), "ProjectileMotion");
const MotionGraphs = lazyNamed(() => import("./topics/motion-graphs"), "MotionGraphs");
const ConceptMap = lazyNamed(() => import("./explore/concept-map"), "ConceptMap");
const RealWorldExamples = lazyNamed(() => import("./explore/real-world"), "RealWorldExamples");
const WhatIfScenarios = lazyNamed(() => import("./explore/what-if"), "WhatIfScenarios");
const ProblemGenerator = lazyNamed(() => import("./practice/problem-generator"), "ProblemGenerator");
const FormulaSpeedRound = lazyNamed(() => import("@/components/practice/formula-speed-round"), "FormulaSpeedRound");
const Flashcards = lazyNamed(() => import("./review/flashcards"), "Flashcards");
const WorkedExamples = lazyNamed(() => import("./review/worked-examples"), "WorkedExamples");
const FormulaSheet = lazyNamed(() => import("./review/formula-sheet"), "FormulaSheet");
const EquationSolver = lazyNamed(() => import("@/components/tools/equation-solver"), "EquationSolver");
const UnitConverter = lazyNamed(() => import("@/components/tools/unit-converter"), "UnitConverter");
const FBDBuilder = lazyNamed(() => import("@/components/tools/fbd-builder"), "FBDBuilder");
const MistakeTracker = lazyNamed(() => import("@/components/review/mistake-tracker"), "MistakeTracker");
const ProjectileSim = lazyNamed(() => import("./simulations/projectile-sim"), "ProjectileSim");
const MovingManSim = lazyNamed(() => import("./simulations/moving-man-sim"), "MovingManSim");
const ProjectileLauncher = lazyNamed(() => import("./simulations/projectile-launcher"), "ProjectileLauncher");

const PracticeQuiz = createUnitPracticeQuiz("kinematics");
const FRQPractice = createUnitFrqPractice("kinematics");
const TimedTest = createUnitTimedTest("kinematics");

export const kinematicsConfig: UnitConfig = {
  ...kinematicsMeta,
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
