import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseFormComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  /**
   * Retourne le titre de la formation à partir de son id (pour affichage dans la liste des cours)
   */
  getTrainingName(trainingId: any): string {
    if (!trainingId) return '';
    const found = this.trainings.find(t => t.id == trainingId || t.id === trainingId?.toString());
    return found ? found.title : '';
  }

  courses: any[] = [];
  trainings: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
  selectedTraining: string = '';
  selectedStatus: string = '';
  showForm = false;
  currentCourse: any = null;
  isEditMode = false;
  categoryFilter: string = 'all';
  loading = false;
  error: string | null = null;
  isFormVisible = false;
  private pendingQuizzes: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadTrainings();
  }

  loadCourses(): void {
    this.adminService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.updateFilteredCourses();
    });
  }

  loadTrainings(): void {
    this.adminService.getFormations().subscribe((formations: any[]) => {
      this.trainings = formations;
    });
  }

  updateFilteredCourses(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchTerm || 
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesTraining = !this.selectedTraining || course.trainingId === this.selectedTraining;
      const matchesStatus = !this.selectedStatus || course.status === this.selectedStatus;

      return matchesSearch && matchesTraining && matchesStatus;
    });
  }

  filterCourses(): void {
    this.updateFilteredCourses();
  }

  getTrainingTitle(trainingId: string): string {
    const training = this.trainings.find(t => t.id === trainingId);
    return training ? training.title : '';
  }

  downloadPdf(course: any): void {
    if (course.pdfFileName) {
      this.adminService.downloadCoursePdf(course.id).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = course.pdfFileName;
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  editCourse(course: any): void {
    this.currentCourse = { ...course };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteCourse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.adminService.deleteCourse(id).subscribe(() => {
        this.loadCourses();
      });
    }
  }

  addCourse(): void {
    if (this.trainings.length === 0) {
      this.adminService.getFormations().subscribe((formations: any[]) => {
        this.trainings = formations;
        this.initializeNewCourse();
      });
    } else {
      this.initializeNewCourse();
    }
  }

  private initializeNewCourse(): void {
    this.currentCourse = {
      id: null,
      title: '',
      description: '',
      trainingId: '',
      duration: 0,
      status: 'active'
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  handleQuizzes(quizzes: any[]): void {
    // Ensure correctAnswerIndex is a valid number and within answers array
    this.pendingQuizzes = (quizzes || []).map(quiz => {
      let correctAnswerIndex = Number(quiz.correctAnswerIndex);
      if (
        isNaN(correctAnswerIndex) ||
        correctAnswerIndex < 0 ||
        correctAnswerIndex >= (quiz.answers?.length || 0)
      ) {
        correctAnswerIndex = 0;
      }
      return {
        ...quiz,
        correctAnswerIndex,
        answers: Array.isArray(quiz.answers) ? quiz.answers : []
      };
    });
  }

  saveCourse(course: any): void {
    if (this.isEditMode) {
      this.adminService.updateCourse(course.id, course).subscribe((updatedCourse) => {
        // Send quizzes if present
        if (this.pendingQuizzes && Array.isArray(this.pendingQuizzes)) {
          this.pendingQuizzes.forEach((quiz: any) => {
            if (quiz.id) {
              this.adminService.updateQuiz(quiz.id, quiz).subscribe();
            } else {
              this.adminService.createQuiz(course.id, quiz).subscribe();
            }
          });
        }
        this.loadCourses();
        this.closeForm();
        this.pendingQuizzes = [];
      });
    } else {
      this.adminService.createCourse(course).subscribe((createdCourse) => {
        // Send quizzes if present
        if (this.pendingQuizzes && Array.isArray(this.pendingQuizzes)) {
          this.pendingQuizzes.forEach((quiz: any) => {
            this.adminService.createQuiz(createdCourse.id, quiz).subscribe();
          });
        }
        this.loadCourses();
        this.closeForm();
        this.pendingQuizzes = [];
      });
    }
  }

  onSearchChange(): void {
    // Call backend advanced search when searchTerm changes
    this.adminService.advancedSearchCourses({
      keyword: this.searchTerm,
      formationId: this.selectedTraining ? Number(this.selectedTraining) : undefined,
      status: this.selectedStatus || undefined,
      page: 0,
      size: 20
    }).subscribe(result => {
      this.filteredCourses = result.content || [];
    }, err => {
      this.filteredCourses = [];
      this.error = err.message || 'Erreur lors de la recherche avancée';
    });
  }
}
