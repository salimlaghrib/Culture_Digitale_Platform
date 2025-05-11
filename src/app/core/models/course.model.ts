// course.model.ts
export interface Course {
  id: string;
  title: string;
  videoUrl: string;
  pdfUrl: string;
  quiz: QuizQuestion[];
  description?: string;
  duration?: number;
  isCompleted?: boolean;
  sequenceId?: string;
}

export interface QuizQuestion {
  questionId: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  answer: string;
  isCorrect: boolean;
}
