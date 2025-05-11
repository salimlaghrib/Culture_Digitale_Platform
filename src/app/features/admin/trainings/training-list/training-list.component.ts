import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
// import { UniquePipe } from '../../../../Shared/pipes';
import { AdminService } from '../../services/admin.service';
import { Training } from '../models/training.model';
import { TrainingFormComponent } from '../training-form/training-form.component';

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TrainingFormComponent],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css']
})
export class TrainingListComponent implements OnInit {
  trainings: Training[] = [];
  filteredTrainings: Training[] = [];
  loading: boolean = true;
  error: string | null = null;
  showForm: boolean = false;
  currentTraining: Training | null = null;
  isEditMode: boolean = false;

  // Pour l'utilisation dans le template
  protected readonly Array = Array;

  // Méthode pour obtenir les tags sous forme de tableau
  getTags(tags: string[] | string): string[] {
    if (Array.isArray(tags)) {
      return tags;
    }
    return tags ? tags.split(',').map(tag => tag.trim()) : [];
  }

  // For filtering
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';

  // Available categories
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

  constructor(private adminService: AdminService) {
    console.log('TrainingListComponent constructor');
  }

  ngOnInit(): void {
    console.log('TrainingListComponent ngOnInit');
    this.loadTrainings();
  }

  loadTrainings(): void {
    console.log('Loading trainings...');
    this.loading = true;
    this.error = null;
    this.trainings = [];
    this.filteredTrainings = [];

    this.adminService.getTrainings().pipe(
      finalize(() => {
        console.log('Loading completed');
        this.loading = false;
      })
    ).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        // Vérifier si la réponse est un tableau
        if (!Array.isArray(response)) {
          console.error('Invalid response format:', response);
          this.error = 'Format de données invalide reçu du serveur';
          return;
        }

        // Transformer les données
        this.trainings = response.map(training => ({
          id: training.id,
          title: training.title,
          subtitle: training.subtitle,
          description: training.description,
          imageUrl: training.imageUrl,
          difficulty: training.difficulty,
          category: training.category,
          durationHours: training.durationHours,
          published: training.published,
          createdAt: new Date(training.createdAt),
          courses: training.courses || [],
          tags: training.tags || []
        }));

        console.log('Processed trainings:', this.trainings);
        this.updateFilteredTrainings();
      },
      error: (err: any) => {
        console.error('Error loading trainings:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          error: err.error
        });

        if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.';
        } else if (err.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
        } else if (err.status === 403) {
          this.error = 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.';
        } else {
          this.error = err.error?.message || 'Une erreur est survenue lors du chargement des formations';
        }

        this.trainings = [];
        this.filteredTrainings = [];
      }
    });
  }

  addTraining(): void {
    this.currentTraining = {
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
    this.isEditMode = false;
    this.showForm = true;
  }

  editTraining(training: Training): void {
    this.currentTraining = { ...training };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteTraining(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.adminService.deleteTraining(id).subscribe({
        next: () => {
          this.trainings = this.trainings.filter(t => t.id !== id);
          this.updateFilteredTrainings();
        },
        error: (err: any) => {
          console.error('Error deleting training:', err);
          this.error = err.message || 'Une erreur est survenue lors de la suppression';
        }
      });
    }
  }

  saveTraining(training: Training): void {
    console.log('Saving training:', training);
    const operation$ = this.isEditMode
      ? this.adminService.updateTraining(training.id!, training)
      : this.adminService.createTraining(training);

    operation$.subscribe({
      next: (savedTraining: Training) => {
        console.log('Training saved successfully:', savedTraining);
        if (this.isEditMode) {
          const index = this.trainings.findIndex(t => t.id === savedTraining.id);
          if (index !== -1) this.trainings[index] = savedTraining;
        } else {
          this.trainings.push(savedTraining);
        }
        this.closeForm();
        this.updateFilteredTrainings();
      },
      error: (err: Error) => {
        console.error('Error saving training:', err);
        this.error = err.message;
        // Keep the form open if there's an error
        this.showForm = true;
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.currentTraining = null;
  }

  updateFilteredTrainings(): void {
    console.log('Updating filtered trainings...');
    console.log('Current trainings:', this.trainings);
    console.log('Search term:', this.searchTerm);
    console.log('Selected category:', this.selectedCategory);
    console.log('Selected status:', this.selectedStatus);

    this.filteredTrainings = this.trainings.filter(training => {
      const matchesSearch = !this.searchTerm || 
        training.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        training.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        training.category.toLowerCase() === this.selectedCategory.toLowerCase();
      
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && training.published) ||
        (this.selectedStatus === 'inactive' && !training.published);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    console.log('Filtered trainings:', this.filteredTrainings);
  }

  filterFormations(): void {
    this.updateFilteredTrainings();
  }
}
