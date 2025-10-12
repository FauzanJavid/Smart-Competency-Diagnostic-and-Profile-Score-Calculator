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
    id: "technical-mcq",
    title: "Technical Assessment",
    description: "Comprehensive technical knowledge test covering OS, CN, DBMS",
    category: "Technical",
    duration: 45,
    questions: [],
    totalQuestions: 30,
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
    description: "Solve real-world programming problems",
    category: "Coding",
    duration: 60,
    questions: [],
    totalQuestions: 3,
    difficulty: "Mixed",
  },
  {
    id: "full-stack-assessment",
    title: "Full Stack Developer Assessment",
    description: "Complete assessment with MCQs and coding challenges",
    category: "Full Stack",
    duration: 90,
    questions: [],
    totalQuestions: 25,
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
    case "technical-mcq":
      questions.push(
        ...getRandomQuestions(osQuestions as Question[], 10),
        ...getRandomQuestions(cnQuestions as Question[], 10),
        ...getRandomQuestions(dbmsQuestions as Question[], 10)
      );
      break;
    case "aptitude-test":
      questions.push(...getRandomQuestions(aptitudeQuestions as Question[], 25));
      break;
    case "coding-challenge":
      questions.push(...getRandomQuestions(codingQuestions as Question[], 3));
      break;
    case "full-stack-assessment":
      questions.push(
        ...getRandomQuestions(
          [...osQuestions, ...cnQuestions, ...dbmsQuestions] as Question[],
          20
        ),
        ...getRandomQuestions(codingQuestions as Question[], 5)
      );
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
