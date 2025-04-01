interface Sequence {
  id: number;
  titre: string;
  sousTitre: string;
  imagePath: string;
  nbrLesson: number;
  duration?: number;
  difficulty?: 'beginner'|'intermediate'|'advanced';
  isCompleted: boolean;
  tags: string[];
  createdAt: string;
  courses: Course[];
  category:string;
  isFeatured?: boolean;
  rating?: number;
  listCompetence:[];
  nbrStudent:0;
}
