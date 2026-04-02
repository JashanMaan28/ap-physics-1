"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useMistakes } from "@/contexts/mistake-context";

interface QuizQuestion {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the SI unit of momentum?",
    choices: ["N", "kg·m/s", "J", "kg·m/s²"],
    correct: 1,
    explanation: "Momentum p = mv has units of kg·m/s. Note that N·s is equivalent.",
  },
  {
    id: 2,
    question: "A 2 kg object moves at 5 m/s. What is its momentum?",
    choices: ["2.5 kg·m/s", "7 kg·m/s", "10 kg·m/s", "25 kg·m/s"],
    correct: 2,
    explanation: "p = mv = (2 kg)(5 m/s) = 10 kg·m/s.",
  },
  {
    id: 3,
    question: "What quantity is represented by the area under a Force vs. Time graph?",
    choices: ["Work", "Power", "Impulse", "Momentum"],
    correct: 2,
    explanation: "The area under an F-t graph equals impulse J = F·Δt.",
  },
  {
    id: 4,
    question: "Impulse equals the change in which quantity?",
    choices: ["Kinetic energy", "Momentum", "Velocity", "Force"],
    correct: 1,
    explanation: "The impulse-momentum theorem: J = Δp.",
  },
  {
    id: 5,
    question: "A 0.5 kg ball changes velocity from +4 m/s to −6 m/s. What is the impulse?",
    choices: ["−1 N·s", "−5 N·s", "5 N·s", "1 N·s"],
    correct: 1,
    explanation: "J = Δp = m(vf − vi) = 0.5(−6 − 4) = 0.5(−10) = −5 N·s.",
  },
  {
    id: 6,
    question: "In a perfectly inelastic collision, which is conserved?",
    choices: ["Only KE", "Only momentum", "Both KE and momentum", "Neither"],
    correct: 1,
    explanation: "In a perfectly inelastic collision, momentum is conserved but KE is not.",
  },
  {
    id: 7,
    question: "Two objects collide and stick together. This is called a(n):",
    choices: ["Elastic collision", "Perfectly inelastic collision", "Explosion", "Superelastic collision"],
    correct: 1,
    explanation: "When objects stick together, it is a perfectly inelastic collision.",
  },
  {
    id: 8,
    question: "In an elastic collision between equal masses where one is at rest, what happens?",
    choices: ["Both stop", "They exchange velocities", "Both move at half speed", "They stick together"],
    correct: 1,
    explanation: "Equal-mass elastic collision with one at rest: they exchange velocities (Newton's cradle).",
  },
  {
    id: 9,
    question: "A system has zero net external force. What is conserved?",
    choices: ["Kinetic energy", "Potential energy", "Momentum", "Speed"],
    correct: 2,
    explanation: "Zero net external force means the system is isolated and momentum is conserved.",
  },
  {
    id: 10,
    question: "Why do airbags reduce injury in a crash?",
    choices: [
      "They reduce the impulse",
      "They increase the stopping time, reducing the force",
      "They increase momentum",
      "They make the collision elastic",
    ],
    correct: 1,
    explanation: "Since J = FΔt is fixed, increasing Δt decreases F. Airbags extend the stopping time.",
  },
  {
    id: 11,
    question: "A 3 kg cart at 4 m/s collides with a 1 kg cart at rest. They stick together. What is vf?",
    choices: ["1 m/s", "2 m/s", "3 m/s", "4 m/s"],
    correct: 2,
    explanation: "vf = m₁v₁/(m₁+m₂) = (3)(4)/(3+1) = 12/4 = 3 m/s.",
  },
  {
    id: 12,
    question: "Momentum is a:",
    choices: ["Scalar quantity", "Vector quantity", "Dimensionless number", "Unit of force"],
    correct: 1,
    explanation: "Momentum p = mv is a vector with the same direction as velocity.",
  },
  {
    id: 13,
    question: "Which collision type conserves BOTH momentum and kinetic energy?",
    choices: ["Inelastic", "Perfectly inelastic", "Elastic", "All collisions"],
    correct: 2,
    explanation: "Only elastic collisions conserve both momentum and kinetic energy.",
  },
  {
    id: 14,
    question: "A 50 N force acts on an object for 0.2 s. What is the impulse?",
    choices: ["250 N·s", "10 N·s", "100 N·s", "0.004 N·s"],
    correct: 1,
    explanation: "J = FΔt = (50)(0.2) = 10 N·s.",
  },
  {
    id: 15,
    question: "Two objects undergo a head-on perfectly inelastic collision with equal and opposite momenta. After the collision they:",
    choices: ["Move right", "Move left", "Are at rest", "Explode"],
    correct: 2,
    explanation: "Equal and opposite momenta sum to zero. After sticking, vf = 0.",
  },
  {
    id: 16,
    question: "In which scenario is momentum NOT conserved?",
    choices: [
      "A ball bounces off a wall (ball only as system)",
      "Two ice skaters push apart on frictionless ice",
      "A bullet embeds in a block on a frictionless surface",
      "Two bumper cars collide",
    ],
    correct: 0,
    explanation: "The wall exerts an external force on the ball (if ball alone is the system), so momentum of the ball is not conserved.",
  },
  {
    id: 17,
    question: "A rocket propels itself by expelling gas. This is an example of conservation of:",
    choices: ["Energy only", "Momentum", "Mass", "Angular momentum"],
    correct: 1,
    explanation: "The rocket + exhaust system conserves momentum. Exhaust goes backward, rocket goes forward.",
  },
  {
    id: 18,
    question: "If you double the velocity of an object, its momentum:",
    choices: ["Doubles", "Quadruples", "Halves", "Stays the same"],
    correct: 0,
    explanation: "p = mv. If v doubles, p doubles (linear relationship).",
  },
  {
    id: 19,
    question: "In a perfectly inelastic collision, the fraction of KE lost is greatest when:",
    choices: [
      "The masses are equal",
      "One mass is much larger than the other",
      "Both objects are moving fast",
      "The collision is head-on",
    ],
    correct: 0,
    explanation: "For a perfectly inelastic collision with one at rest, the max KE fraction lost is when m₁ = m₂ (50% lost). For head-on equal masses with equal speeds, 100% is lost.",
  },
  {
    id: 20,
    question: "Newton's second law can be written as F = dp/dt. This is related to:",
    choices: ["Conservation of energy", "Impulse-momentum theorem", "Work-energy theorem", "Hooke's law"],
    correct: 1,
    explanation: "F = dp/dt leads directly to FΔt = Δp, the impulse-momentum theorem.",
  },
];

export function PracticeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const { addMistake } = useMistakes();

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (idx === q.correct) {
      setScore((s) => s + 1);
    } else {
      addMistake({
        unit: "momentum",
        topic: "momentum",
        question: q.question,
        yourAnswer: q.choices[idx],
        correctAnswer: q.choices[q.correct],
        timestamp: Date.now(),
      });
    }
  };

  const next = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (finished) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-5xl font-bold text-purple-500">{score}/{questions.length}</div>
            <Progress value={(score / questions.length) * 100} className="h-3" />
            <p className="text-muted-foreground">
              {score >= 18 ? "Excellent! You've mastered momentum." :
               score >= 14 ? "Good job! Review the topics you missed." :
               "Keep studying — review the topics and try again."}
            </p>
            <Button onClick={() => { setCurrentQ(0); setSelected(null); setShowExplanation(false); setScore(0); setAnswered(0); setFinished(false); }}>
              Retake Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Quiz: Linear Momentum</CardTitle>
            <Badge variant="outline">{currentQ + 1} / {questions.length}</Badge>
          </div>
          <Progress value={(answered / questions.length) * 100} className="h-2" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.choices.map((choice, idx) => {
            let variant: "outline" | "default" | "destructive" = "outline";
            if (showExplanation) {
              if (idx === q.correct) variant = "default";
              else if (idx === selected) variant = "destructive";
            }
            return (
              <Button
                key={idx}
                variant={variant}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
              >
                <span className="font-mono mr-3">{String.fromCharCode(65 + idx)}.</span>
                {choice}
              </Button>
            );
          })}

          {showExplanation && (
            <>
              <Separator />
              <div className="p-4 rounded bg-muted text-sm">
                <p className="font-semibold mb-1">
                  {selected === q.correct ? "Correct!" : "Incorrect."}
                </p>
                <p>{q.explanation}</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={next}>
                  {currentQ + 1 >= questions.length ? "Finish" : "Next Question"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        Score: {score}/{answered} answered
      </div>
    </div>
  );
}

export default PracticeQuiz;
