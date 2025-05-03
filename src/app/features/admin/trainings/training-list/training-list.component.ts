import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrainingFormComponent } from '../training-form/training-form.component';
import { TrainingService } from '../../../../core/services/service_admin/training.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TrainingFormComponent],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  providers: [TrainingService]
})
export class TrainingListComponent implements OnInit {
  trainings: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showForm: boolean = false;
  currentTraining: any = null;
  isEditMode: boolean = false;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getTrainings().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (trainings: any[]) => this.trainings = trainings,
      error: (err: { message: string | null }) => this.error = err.message
    });
  }

  addTraining(): void {
    this.currentTraining = {
      title: '',
      description: '',
      duration: '',
      price: 0,
      enrolledStudents: 0,
      rating: 0
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  editTraining(training: any): void {
    this.currentTraining = { ...training };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteTraining(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.trainingService.deleteTraining(id).subscribe({
        next: () => this.trainings = this.trainings.filter(t => t.id !== id),
        error: (err: { message: string | null }) => this.error = err.message
      });
    }
  }

  saveTraining(training: any): void {
    const operation$ = this.isEditMode
      ? this.trainingService.updateTraining(training.id, training)
      : this.trainingService.createTraining(training);

    operation$.subscribe({
      next: (savedTraining: any) => {
        if (this.isEditMode) {
          const index = this.trainings.findIndex(t => t.id === savedTraining.id);
          if (index !== -1) this.trainings[index] = savedTraining;
        } else {
          this.trainings.push(savedTraining);
        }
        this.closeForm();
      },
      error: (err: { message: string | null }) => this.error = err.message
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.currentTraining = null;
  }
}
