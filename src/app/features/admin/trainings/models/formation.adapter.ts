import { Training } from './training.model';

export class FormationAdapter {
  static toTraining(formation: any): Training {
    return {
      id: formation.id,
      title: formation.title,
      subtitle: formation.subtitle,
      description: formation.description,
      imageUrl: formation.imageUrl,
      difficulty: formation.difficulty,
      category: formation.category,
      durationHours: formation.durationHours,
      createdAt: formation.createdAt,
      published: formation.published,
      courses: formation.courses || [],
      tags: formation.tags || []
    };
  }

  static toFormation(training: Training): any {
    return {
      id: training.id,
      title: training.title,
      subtitle: training.subtitle,
      description: training.description,
      imageUrl: training.imageUrl,
      difficulty: training.difficulty,
      category: training.category,
      durationHours: training.durationHours,
      createdAt: training.createdAt,
      published: training.published,
      courses: training.courses || [],
      tags: training.tags || []
    };
  }
} 