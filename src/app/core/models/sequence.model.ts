// sequence.model.ts
import { Course } from './course.model';

export interface Sequence {
  id: string;
  title: string;
  courses: Course[];
  subtitle?: string;
  imagePath?: string;
  courseCount?: number;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isCompleted?: boolean;
  tags?: string[];
  createdAt?: string;
}
