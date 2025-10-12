export interface Question {
  id?: string;
  category: string;
  sub_category: string;
  question_text: string;
  description?: string;
  options?: string[];
  correct_answer?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "mcq" | "coding" | "essay" | "audio";
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
  function_signature?: Record<string, string>;
  test_cases?: Array<{
    input: string;
    expected_output: string;
  }>;
  starter_code?: Record<string, string>;
  time_limit?: number;
  memory_limit?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  questions: Question[];
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
}

export interface AssessmentProgress {
  assessmentId: string;
  currentQuestion: number;
  answers: Record<number, string>;
  startTime: Date;
  timeRemaining: number;
}

export interface AssessmentResult {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: Record<number, { answer: string; correct: boolean; correctAnswer?: string }>;
  completedAt: Date;
}
