import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Training } from '../models/training.model';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-form.component.html'
})
export class TrainingFormComponent implements OnInit {
  @Input() training: Training | null = {
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    difficulty: '',
    category: '',
    durationHours: 0,
    published: false,
    courses: [],
    tags: [],
    createdAt: new Date()
  };

  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Training>();
  @Output() cancel = new EventEmitter<void>();

  categories: string[] = [
    'Développement Web',
    'Sécurité',
    'Intelligence Artificielle',
    'Data Science',
    'DevOps',
    'Mobile',
    'Cloud Computing',
    'Blockchain',
    'UX/UI Design',
    'Gestion de Projet'
  ];

  difficultyLevels: string[] = [
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
  ];

  constructor() {}

  ngOnInit(): void {
    if (!this.isEditMode && this.training) {
      this.training = {
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        difficulty: '',
        category: '',
        durationHours: 0,
        published: false,
        courses: [],
        tags: [],
        createdAt: new Date()
      };
    }
  }

  onSubmit(): void {
    if (this.validateForm() && this.training) {
      console.log('Form data before submission:', this.training);
      
      // Convertir les tags en tableau si c'est une chaîne
      if (typeof this.training.tags === 'string') {
        this.training.tags = (this.training.tags as string)
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
      }
      
      // S'assurer que la date est valide
      if (this.training.createdAt) {
        try {
          const date = new Date(this.training.createdAt);
          if (!isNaN(date.getTime())) {
            this.training.createdAt = date.toISOString();
          } else {
            this.training.createdAt = new Date().toISOString();
          }
        } catch (e) {
          console.warn('Invalid date, using current date instead');
          this.training.createdAt = new Date().toISOString();
        }
      } else {
        this.training.createdAt = new Date().toISOString();
      }
      
      console.log('Form data after processing:', this.training);
      this.save.emit(this.training);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private validateForm(): boolean {
    if (!this.training?.title || !this.training.subtitle || !this.training.description || 
        !this.training.category || !this.training.difficulty || !this.training.imageUrl) {
      alert('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (this.training.durationHours <= 0) {
      alert('La durée doit être supérieure à 0');
      return false;
    }
    return true;
  }

  // Pour l'affichage dans le template
  getDifficultyLabel(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      'BEGINNER': 'Débutant',
      'INTERMEDIATE': 'Intermédiaire',
      'ADVANCED': 'Avancé'
    };
    return difficultyMap[difficulty] || difficulty;
  }
}
