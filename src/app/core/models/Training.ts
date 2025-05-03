export enum DifficultyLevel {
  BEGINNER = 'Débutant',
  INTERMEDIATE = 'Intermédiaire',
  ADVANCED = 'Avancé'
}

export interface Training {
  id: number; // Pas "Long" comme en Java
  title: string;
  subtitle?: string; // Optionnel
  description: string;
  imageUrl?: string; // Chemin ou URL de l'image
  difficulty: DifficultyLevel; // Enum recommandé
  category: string;
  durationHours: number; // "Integer" devient "number" en TS
  courseCount?: number; // Optionnel, calculé côté serveur
  published: boolean;
  price?: number; // Optionnel (ajout depuis la première version)
  enrolledStudents?: number; // Optionnel
  rating?: number; // Optionnel
}
