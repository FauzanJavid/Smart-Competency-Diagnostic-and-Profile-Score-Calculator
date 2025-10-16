import { Assessment, Question } from "@/types/assessment";
import osQuestions from "@/data/os_questions.json";
import cnQuestions from "@/data/cn_questions.json";
import dbmsQuestions from "@/data/dbms_questions.json";
import aptitudeQuestions from "@/data/aptitude_questions.json";
import codingQuestions from "@/data/coding_questions.json";

const allQuestions: Question[] = [
  ...osQuestions,
  ...cnQuestions,
  ...dbmsQuestions,
  ...aptitudeQuestions,
  ...codingQuestions,
] as Question[];

export const assessmentTemplates: Assessment[] = [
  {
    id: "computer-networks",
    title: "Computer Networks",
    description: "Test your knowledge of networking concepts, protocols, and architectures",
    category: "Technical",
    duration: 30,
    questions: [],
    totalQuestions: 20,
    difficulty: "Mixed",
  },
  {
    id: "operating-systems",
    title: "Operating Systems",
    description: "Assess your understanding of OS concepts, processes, and memory management",
    category: "Technical",
    duration: 30,
    questions: [],
    totalQuestions: 20,
    difficulty: "Mixed",
  },
  {
    id: "database-management",
    title: "Database Management Systems",
    description: "Evaluate your DBMS knowledge including SQL, normalization, and transactions",
    category: "Technical",
    duration: 30,
    questions: [],
    totalQuestions: 20,
    difficulty: "Mixed",
  },
  {
    id: "aptitude-test",
    title: "Aptitude & Reasoning",
    description: "Test your quantitative, logical, and verbal reasoning skills",
    category: "Aptitude",
    duration: 30,
    questions: [],
    totalQuestions: 25,
    difficulty: "Mixed",
  },
  {
    id: "coding-challenge",
    title: "Coding Challenge",
    description: "Solve real-world programming problems and demonstrate coding skills",
    category: "Coding",
    duration: 60,
    questions: [],
    totalQuestions: 3,
    difficulty: "Mixed",
  },
];

export function getAssessmentById(id: string): Assessment | undefined {
  const template = assessmentTemplates.find((a) => a.id === id);
  if (!template) return undefined;

  // Generate questions based on template
  const questions = generateQuestionsForAssessment(template);
  return { ...template, questions };
}

function generateQuestionsForAssessment(template: Assessment): Question[] {
  const questions: Question[] = [];

  switch (template.id) {
    case "computer-networks":
      questions.push(...getRandomQuestions(cnQuestions as Question[], 20));
      break;
    case "operating-systems":
      questions.push(...getRandomQuestions(osQuestions as Question[], 20));
      break;
    case "database-management":
      questions.push(...getRandomQuestions(dbmsQuestions as Question[], 20));
      break;
    case "aptitude-test":
      questions.push(...getRandomQuestions(aptitudeQuestions as Question[], 25));
      break;
    case "coding-challenge":
      questions.push(...getRandomQuestions(codingQuestions as Question[], 3));
      break;
    default:
      questions.push(...getRandomQuestions(allQuestions, template.totalQuestions));
  }

  return questions;
}

function getRandomQuestions(pool: Question[], count: number): Question[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function calculateScore(
  questions: Question[],
  answers: Record<number, string>
): {
  score: number;
  correctAnswers: number;
  details: Record<number, { answer: string; correct: boolean; correctAnswer?: string }>;
} {
  let correctAnswers = 0;
  const details: Record<number, { answer: string; correct: boolean; correctAnswer?: string }> = {};

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correct_answer;
    if (isCorrect) correctAnswers++;

    details[index] = {
      answer: userAnswer,
      correct: isCorrect,
      correctAnswer: question.correct_answer,
    };
  });

  const score = Math.round((correctAnswers / questions.length) * 100);
  return { score, correctAnswers, details };
}
