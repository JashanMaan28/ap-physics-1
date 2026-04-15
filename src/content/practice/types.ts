export interface PracticeChoiceQuestion {
  id: string;
  unitSlug: string;
  topicKey: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface PracticeFrqPart {
  label: string;
  question: string;
  points: number;
  rubric: string[];
  sampleResponse: string;
}

export interface PracticeFrqProblem {
  id: string;
  unitSlug: string;
  topicKey: string;
  title: string;
  scenario: string;
  given: string[];
  parts: PracticeFrqPart[];
}

export interface UnitPracticeBank {
  unitSlug: string;
  quizQuestions: PracticeChoiceQuestion[];
  frqProblems: PracticeFrqProblem[];
}
