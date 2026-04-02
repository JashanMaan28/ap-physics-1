"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Problem {
  topic: string;
  question: string;
  answer: string;
  solution: string;
}

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateProblem(): Problem {
  const type = Math.floor(Math.random() * 5);
  switch (type) {
    case 0: {
      const F = rand(5, 80);
      const d = rand(1, 20);
      const angle = Math.floor(Math.random() * 7) * 15;
      const W = F * d * Math.cos((angle * Math.PI) / 180);
      return {
        topic: "Work",
        question: `A ${F} N force is applied to an object over ${d} m at ${angle} degrees to the displacement. Find the work done.`,
        answer: `${W.toFixed(1)} J`,
        solution: `W = Fd cos(theta) = ${F} x ${d} x cos(${angle}) = ${W.toFixed(1)} J`,
      };
    }
    case 1: {
      const m = rand(1, 50);
      const v = rand(1, 25);
      const KE = 0.5 * m * v * v;
      return {
        topic: "Kinetic Energy",
        question: `Find the kinetic energy of a ${m} kg object moving at ${v} m/s.`,
        answer: `${KE.toFixed(1)} J`,
        solution: `KE = 1/2 mv^2 = 0.5 x ${m} x ${v}^2 = ${KE.toFixed(1)} J`,
      };
    }
    case 2: {
      const m = rand(1, 30);
      const h = rand(1, 20);
      const PE = m * 9.8 * h;
      return {
        topic: "Gravitational PE",
        question: `A ${m} kg object is ${h} m above the ground. Find its gravitational potential energy. (g = 9.8 m/s^2)`,
        answer: `${PE.toFixed(1)} J`,
        solution: `PE = mgh = ${m} x 9.8 x ${h} = ${PE.toFixed(1)} J`,
      };
    }
    case 3: {
      const m = rand(0.5, 10);
      const h = rand(2, 15);
      const v = Math.sqrt(2 * 9.8 * h);
      return {
        topic: "Conservation of Energy",
        question: `A ${m} kg ball is dropped from ${h} m. What is its speed just before hitting the ground? (g = 9.8 m/s^2)`,
        answer: `${v.toFixed(2)} m/s`,
        solution: `mgh = 1/2 mv^2 => v = sqrt(2gh) = sqrt(2 x 9.8 x ${h}) = ${v.toFixed(2)} m/s`,
      };
    }
    default: {
      const W = rand(100, 5000);
      const t = rand(2, 60);
      const P = W / t;
      return {
        topic: "Power",
        question: `An engine does ${W} J of work in ${t} s. What is its power output?`,
        answer: `${P.toFixed(1)} W`,
        solution: `P = W/t = ${W} / ${t} = ${P.toFixed(1)} W`,
      };
    }
  }
}

export function ProblemGenerator() {
  const [problem, setProblem] = useState<Problem>(generateProblem);
  const [showAnswer, setShowAnswer] = useState(false);
  const [count, setCount] = useState(1);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem());
    setShowAnswer(false);
    setCount((c) => c + 1);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Problem Generator</CardTitle>
            <Badge variant="outline">Problem #{count}</Badge>
          </div>
          <CardDescription>
            Randomly generated energy problems for unlimited practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge>{problem.topic}</Badge>
          <p className="text-lg font-medium">{problem.question}</p>

          <Separator />

          <Accordion>
            <AccordionItem value="solution">
              <AccordionTrigger>Show Solution</AccordionTrigger>
              <AccordionContent>
                <p className="font-semibold text-green-700 mb-2">
                  Answer: {problem.answer}
                </p>
                <p className="text-gray-700">{problem.solution}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button onClick={nextProblem} className="w-full">
            Generate New Problem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
