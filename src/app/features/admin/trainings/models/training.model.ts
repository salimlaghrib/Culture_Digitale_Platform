export interface Training {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  category: string;
  durationHours: number;
  createdAt: Date | string;
  published: boolean;
  courses: any[];
  tags: string[] | string;
} 