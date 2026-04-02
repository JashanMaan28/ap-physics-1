"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  topic: string;
}

const questions: Question[] = [
  { id: 1, question: "In SHM, the restoring force is proportional to:", choices: ["velocity", "displacement", "acceleration", "time"], correct: 1, explanation: "Hooke's Law: F = -kx. The restoring force is directly proportional to displacement from equilibrium.", topic: "shm-basics" },
  { id: 2, question: "The period of a spring-mass system depends on:", choices: ["amplitude and mass", "mass and spring constant", "amplitude and spring constant", "amplitude only"], correct: 1, explanation: "T = 2pi*sqrt(m/k). Period depends only on mass and spring constant, not amplitude.", topic: "spring-mass" },
  { id: 3, question: "A simple pendulum's period is independent of:", choices: ["length", "gravity", "mass of the bob", "none of these"], correct: 2, explanation: "T = 2pi*sqrt(L/g). Mass cancels in the derivation because both gravitational force and inertia scale with mass.", topic: "pendulum" },
  { id: 4, question: "At the equilibrium position of SHM, which is true?", choices: ["PE is maximum", "KE is zero", "speed is maximum", "displacement is maximum"], correct: 2, explanation: "At equilibrium (x=0), PE=0 and all energy is kinetic, so speed is maximum.", topic: "energy-shm" },
  { id: 5, question: "The angular frequency omega is related to period T by:", choices: ["omega = 2pi/T", "omega = T/2pi", "omega = pi*T", "omega = T^2"], correct: 0, explanation: "omega = 2pi/T = 2pi*f. This converts between period (seconds per cycle) and angular frequency (radians per second).", topic: "shm-basics" },
  { id: 6, question: "If you quadruple the mass on a spring, the period:", choices: ["doubles", "quadruples", "halves", "stays the same"], correct: 0, explanation: "T = 2pi*sqrt(m/k). If m -> 4m, then T -> 2pi*sqrt(4m/k) = 2*T. The period doubles.", topic: "spring-mass" },
  { id: 7, question: "Which graph is 180 degrees out of phase with position x(t)?", choices: ["velocity v(t)", "acceleration a(t)", "force F(t)", "both acceleration and force"], correct: 3, explanation: "a(t) = -omega^2 * x(t), and F = ma = -m*omega^2*x. Both a(t) and F(t) are exactly opposite to x(t).", topic: "shm-graphs" },
  { id: 8, question: "The total energy of an undamped SHM system:", choices: ["increases over time", "decreases over time", "oscillates between KE and PE", "remains constant"], correct: 3, explanation: "Without friction/damping, total mechanical energy E = 1/2 kA^2 is conserved. Energy converts between KE and PE but the total stays constant.", topic: "energy-shm" },
  { id: 9, question: "A pendulum clock runs slow. To correct it, you should:", choices: ["increase the bob mass", "shorten the string", "lengthen the string", "swing it harder"], correct: 1, explanation: "T = 2pi*sqrt(L/g). Shortening L decreases the period, making the clock tick faster.", topic: "pendulum" },
  { id: 10, question: "At the turning points (x = +/- A) of SHM:", choices: ["KE is maximum", "velocity is maximum", "PE is maximum", "acceleration is zero"], correct: 2, explanation: "At the extremes, v=0 so KE=0 and all energy is potential. PE = 1/2 kA^2 is at its maximum.", topic: "energy-shm" },
  { id: 11, question: "Velocity in SHM leads position by:", choices: ["0 degrees", "90 degrees", "180 degrees", "270 degrees"], correct: 1, explanation: "v(t) = -A*omega*sin(omega*t), which is the same as A*omega*cos(omega*t + pi/2). Velocity leads position by pi/2 = 90 degrees.", topic: "shm-graphs" },
  { id: 12, question: "If you double the amplitude, the total energy:", choices: ["doubles", "quadruples", "halves", "stays the same"], correct: 1, explanation: "E = 1/2 kA^2. If A -> 2A, then E -> 1/2 k(2A)^2 = 4*(1/2 kA^2). Energy quadruples.", topic: "energy-shm" },
  { id: 13, question: "A spring constant k = 200 N/m with mass 0.5 kg gives what period?", choices: ["0.10 s", "0.31 s", "0.63 s", "1.0 s"], correct: 1, explanation: "T = 2pi*sqrt(0.5/200) = 2pi*sqrt(0.0025) = 2pi*0.05 = 0.314 s.", topic: "spring-mass" },
  { id: 14, question: "The unit of angular frequency is:", choices: ["Hz", "s", "rad/s", "m/s"], correct: 2, explanation: "Angular frequency omega = 2pi*f has units of radians per second (rad/s).", topic: "shm-basics" },
  { id: 15, question: "For a pendulum of length 1 m on Earth, T is approximately:", choices: ["1.0 s", "2.0 s", "3.1 s", "0.5 s"], correct: 1, explanation: "T = 2pi*sqrt(1/9.81) = 2pi*0.319 = 2.006 s, approximately 2.0 s.", topic: "pendulum" },
  { id: 16, question: "In SHM, when is acceleration maximum?", choices: ["at equilibrium", "at maximum displacement", "when velocity is maximum", "midway between equilibrium and max displacement"], correct: 1, explanation: "a = -omega^2 * x. Acceleration magnitude is greatest when |x| is greatest, i.e., at maximum displacement.", topic: "shm-graphs" },
  { id: 17, question: "Two springs with k1 and k2 in parallel have effective k:", choices: ["k1 + k2", "k1 * k2 / (k1 + k2)", "1/(k1 + k2)", "sqrt(k1 * k2)"], correct: 0, explanation: "Springs in parallel share the displacement, so forces add: k_eff = k1 + k2.", topic: "spring-mass" },
  { id: 18, question: "What does the phase constant phi in x = A cos(omega*t + phi) determine?", choices: ["amplitude", "frequency", "initial position at t=0", "total energy"], correct: 2, explanation: "The phase constant sets where in the cycle the oscillation begins. At t=0, x = A cos(phi).", topic: "shm-basics" },
  { id: 19, question: "A pendulum's frequency on a planet with 4x Earth's gravity:", choices: ["doubles", "halves", "quadruples", "stays the same"], correct: 0, explanation: "f = 1/(2pi) * sqrt(g/L). If g -> 4g, then f -> sqrt(4)*f = 2f. Frequency doubles.", topic: "pendulum" },
  { id: 20, question: "At what fraction of amplitude is KE = PE?", choices: ["x = A/4", "x = A/sqrt(2)", "x = A/2", "x = A/sqrt(3)"], correct: 1, explanation: "KE = PE means 1/2 kx^2 = 1/2 k(A^2 - x^2), so x^2 = A^2/2, x = A/sqrt(2).", topic: "energy-shm" },
];

export function PracticeQuiz({
  onComplete,
  isComplete,
}: {
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (idx === q.correct) {
      setScore((s) => s + 1);
    } else {
      setMistakes((m) => [...m, q.id]);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
    setMistakes([]);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold text-center">
              {score} / {questions.length} ({pct}%)
            </p>
            <Progress value={pct} className="h-3" />
            {mistakes.length > 0 && (
              <div>
                <p className="font-semibold mt-4">Review these topics:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {[...new Set(mistakes.map((id) => questions.find((qq) => qq.id === id)?.topic))].map(
                    (topic) => (
                      <li key={topic}>{topic}</li>
                    )
                  )}
                </ul>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="flex-1">
                Retry Quiz
              </Button>
              <Button onClick={onComplete} disabled={isComplete} className="flex-1">
                {isComplete ? "Completed" : "Mark Complete"}
              </Button>
            </div>
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
            <CardTitle>Practice Quiz: Oscillations</CardTitle>
            <Badge variant="secondary">
              {current + 1} / {questions.length}
            </Badge>
          </div>
          <Progress value={((current + 1) / questions.length) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{q.question}</p>
          <div className="space-y-2">
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
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => handleAnswer(idx)}
                  disabled={showExplanation}
                >
                  {String.fromCharCode(65 + idx)}. {choice}
                </Button>
              );
            })}
          </div>
          {showExplanation && (
            <>
              <Separator />
              <div className={`p-3 rounded text-sm ${selected === q.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                <p className="font-semibold">{selected === q.correct ? "Correct!" : "Incorrect"}</p>
                <p className="mt-1">{q.explanation}</p>
              </div>
              <Button onClick={handleNext} className="w-full">
                {current < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
