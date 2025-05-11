export interface Quiz {
  id?: number;
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  courseId?: number;
}

export interface Question {
  id?: number;
  text: string;
  type: QuestionType;
  options: Option[];
  correctOptionId: number;
  points: number;
}

export interface Option {
  id?: number;
  text: string;
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE'
} 