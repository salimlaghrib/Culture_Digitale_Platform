import { Quiz } from './quiz.model';

export interface Course {
  id?: number;
  title: string;
  description: string;
  content: string;
  duration: number;
  level: string;
  quiz?: Quiz;
  createdAt?: Date;
  updatedAt?: Date;
} 