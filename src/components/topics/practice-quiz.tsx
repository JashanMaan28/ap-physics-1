"use client";

import { useState } from "react";
import { useMistakes } from "@/app/fluids-study";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    topic: "Pressure",
    question:
      "A swimmer is 10 m below the surface of a lake. The density of water is 1000 kg/m\u00b3 and g = 10 m/s\u00b2. What is the gauge pressure at this depth?",
    options: [
      "10,000 Pa",
      "100,000 Pa",
      "101,325 Pa",
      "201,325 Pa",
    ],
    correct: 1,
    explanation:
      "Gauge pressure = \u03c1gh = 1000 \u00d7 10 \u00d7 10 = 100,000 Pa = 100 kPa. Gauge pressure doesn't include atmospheric pressure \u2014 that would be absolute pressure (201,325 Pa).",
  },
  {
    id: 2,
    topic: "Pressure",
    question:
      "Two containers of different shapes are filled with water to the same height. How does the pressure at the bottom compare?",
    options: [
      "The wider container has more pressure",
      "The narrower container has more pressure",
      "The pressures are equal",
      "It depends on the total volume of water",
    ],
    correct: 2,
    explanation:
      "Pressure depends only on depth (P = P\u2080 + \u03c1gh), not on the shape or volume of the container. This is the hydrostatic paradox.",
  },
  {
    id: 3,
    topic: "Pascal's Law",
    question:
      "In a hydraulic system, the input piston has an area of 5 cm\u00b2 and the output piston has an area of 50 cm\u00b2. If a 200 N force is applied to the input, what force is exerted by the output?",
    options: ["20 N", "200 N", "2,000 N", "20,000 N"],
    correct: 2,
    explanation:
      "F\u2081/A\u2081 = F\u2082/A\u2082 \u2192 F\u2082 = F\u2081 \u00d7 (A\u2082/A\u2081) = 200 \u00d7 (50/5) = 200 \u00d7 10 = 2,000 N. The area ratio of 10:1 gives a 10x force multiplication.",
  },
  {
    id: 4,
    topic: "Pascal's Law",
    question:
      "In the same hydraulic system (input 5 cm\u00b2, output 50 cm\u00b2), if the input piston moves down 20 cm, how far does the output piston move up?",
    options: ["2 cm", "20 cm", "200 cm", "0.2 cm"],
    correct: 0,
    explanation:
      "Volume is conserved: A\u2081d\u2081 = A\u2082d\u2082 \u2192 d\u2082 = d\u2081 \u00d7 (A\u2081/A\u2082) = 20 \u00d7 (5/50) = 2 cm. What you gain in force, you lose in distance.",
  },
  {
    id: 5,
    topic: "Buoyancy",
    question:
      "A block of wood (density 600 kg/m\u00b3) floats in water (density 1000 kg/m\u00b3). What fraction of the block is submerged?",
    options: ["40%", "60%", "100%", "30%"],
    correct: 1,
    explanation:
      "Fraction submerged = \u03c1_object/\u03c1_fluid = 600/1000 = 0.6 = 60%. When floating, the buoyant force equals the weight, so the object sinks until it displaces its own weight in fluid.",
  },
  {
    id: 6,
    topic: "Buoyancy",
    question:
      "A 2 kg object has a volume of 0.001 m\u00b3 and is fully submerged in water (\u03c1 = 1000 kg/m\u00b3). What is its apparent weight? (g = 10 m/s\u00b2)",
    options: ["10 N", "20 N", "30 N", "0 N"],
    correct: 0,
    explanation:
      "Weight = mg = 2 \u00d7 10 = 20 N. Buoyant force = \u03c1_fluid \u00d7 V \u00d7 g = 1000 \u00d7 0.001 \u00d7 10 = 10 N. Apparent weight = 20 - 10 = 10 N.",
  },
  {
    id: 7,
    topic: "Continuity",
    question:
      "Water flows through a pipe that narrows from 10 cm\u00b2 to 5 cm\u00b2. If the velocity in the wide section is 3 m/s, what is the velocity in the narrow section?",
    options: ["1.5 m/s", "3 m/s", "6 m/s", "9 m/s"],
    correct: 2,
    explanation:
      "A\u2081v\u2081 = A\u2082v\u2082 \u2192 v\u2082 = v\u2081 \u00d7 (A\u2081/A\u2082) = 3 \u00d7 (10/5) = 6 m/s. When the area halves, the velocity doubles.",
  },
  {
    id: 8,
    topic: "Continuity",
    question:
      "Blood flows through the aorta (radius 1 cm) at 30 cm/s. It then splits into many capillaries with a combined cross-sectional area 600 times larger. What is the speed in the capillaries?",
    options: ["0.05 cm/s", "0.5 cm/s", "5 cm/s", "18,000 cm/s"],
    correct: 0,
    explanation:
      "v\u2082 = v\u2081 \u00d7 (A\u2081/A\u2082) = 30 \u00d7 (1/600) = 0.05 cm/s. Blood moves very slowly through capillaries \u2014 this gives time for oxygen/nutrient exchange.",
  },
  {
    id: 9,
    topic: "Bernoulli's",
    question:
      "A horizontal pipe narrows, causing the fluid speed to increase from 2 m/s to 6 m/s. What happens to the pressure?",
    options: [
      "Pressure increases",
      "Pressure decreases",
      "Pressure stays the same",
      "Not enough information",
    ],
    correct: 1,
    explanation:
      "By Bernoulli's equation (horizontal pipe, so \u03c1gh cancels): P\u2081 + \u00bd\u03c1v\u2081\u00b2 = P\u2082 + \u00bd\u03c1v\u2082\u00b2. Since v\u2082 > v\u2081, the kinetic term increases, so P\u2082 must decrease. Faster flow = lower pressure.",
  },
  {
    id: 10,
    topic: "Bernoulli's",
    question:
      "Water exits a hole 3 m below the surface of a large open tank. Using Torricelli's theorem, what is the exit speed? (g = 10 m/s\u00b2)",
    options: [
      "\u221a30 \u2248 5.5 m/s",
      "\u221a60 \u2248 7.7 m/s",
      "\u221a6 \u2248 2.4 m/s",
      "30 m/s",
    ],
    correct: 1,
    explanation:
      "Torricelli's theorem: v = \u221a(2gh) = \u221a(2 \u00d7 10 \u00d7 3) = \u221a60 \u2248 7.7 m/s. This is the same speed an object would have if dropped from height h in free fall.",
  },
];

export function PracticeQuiz() {
  const { addMistake } = useMistakes();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const q = questions[currentQ];

  const handleSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelected(optionIndex);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (optionIndex === q.correct) {
      setScore((s) => s + 1);
    } else {
      addMistake({
        topic: q.topic,
        question: q.question,
        yourAnswer: q.options[optionIndex],
        correctAnswer: q.options[q.correct],
        timestamp: Date.now(),
      });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg">
            Here&apos;s how you did
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
            <span className="text-4xl font-bold text-primary">
              {score}/{questions.length}
            </span>
          </div>
          <Progress value={pct} className="mx-auto h-3 max-w-xs" />
          <p className="text-lg text-muted-foreground">
            {pct >= 90
              ? "Excellent! You've mastered AP Fluids."
              : pct >= 70
                ? "Great job! Review the topics you missed and you'll be ready."
                : pct >= 50
                  ? "Good start. Focus on the explanations for the ones you missed."
                  : "Keep studying! Go through each topic tab and try again."}
          </p>

          {/* Topic breakdown */}
          <div className="mx-auto max-w-sm space-y-2">
            {["Pressure", "Pascal's Law", "Buoyancy", "Continuity", "Bernoulli's"].map(
              (topic) => {
                const topicQs = questions.filter((qu) => qu.topic === topic);
                const topicCorrect = topicQs.filter(
                  (qu, i) => {
                    const idx = questions.indexOf(qu);
                    return idx < answered && selected !== null; // simplified
                  }
                ).length;
                return (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span>{topic}</span>
                    <Badge variant="outline">
                      {topicQs.length} questions
                    </Badge>
                  </div>
                );
              }
            )}
          </div>

          <Button onClick={handleRestart} size="lg" className="cursor-pointer">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQ + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                Score: {score}/{answered}
              </span>
              <Progress
                value={((currentQ + 1) / questions.length) * 100}
                className="h-2 w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{q.topic}</Badge>
            <Badge variant="outline" className="font-mono text-xs">
              #{q.id}
            </Badge>
          </div>
          <CardTitle className="mt-3 text-lg leading-relaxed">
            {q.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map((option, i) => {
            let variant = "outline";
            let extraClass = "hover:border-primary/50 hover:bg-muted/50";

            if (showExplanation) {
              if (i === q.correct) {
                variant = "default";
                extraClass = "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300";
              } else if (i === selected && i !== q.correct) {
                extraClass = "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300";
              } else {
                extraClass = "opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showExplanation}
                className={`w-full cursor-pointer rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${extraClass} ${
                  selected === i && !showExplanation
                    ? "border-primary bg-primary/5"
                    : ""
                } disabled:cursor-default`}
              >
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            );
          })}

          {/* Explanation */}
          {showExplanation && (
            <>
              <Separator className="my-4" />
              <div
                className={`rounded-xl p-4 text-sm ${
                  selected === q.correct
                    ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                }`}
              >
                <p className="mb-1 font-semibold">
                  {selected === q.correct ? "Correct!" : "Not quite."}
                </p>
                <p className="text-muted-foreground">{q.explanation}</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleNext} className="cursor-pointer">
                  {currentQ < questions.length - 1
                    ? "Next Question"
                    : "See Results"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
