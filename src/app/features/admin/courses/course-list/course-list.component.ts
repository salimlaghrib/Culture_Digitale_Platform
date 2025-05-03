import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CourseFormComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  // For filtering
  searchTerm: string = '';
  categoryFilter: string = 'all';

  // For form handling
  showForm: boolean = false;
  currentCourse: any = null;
  isEditMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Simulate loading data from an API
    setTimeout(() => {
      this.courses = [
        {
          id: 1,
          title: 'Introduction à JavaScript',
          description: 'Apprenez les bases de JavaScript, le langage de programmation du web',
          category: 'development',
          instructor: 'Jean Dupont',
          duration: '3h 45min',
          level: 'débutant',
          rating: 4.7,
          enrolledStudents: 128,
          pdfFile: null,
          pdfFileName: 'javascript_introduction.pdf'
        },
        {
          id: 2,
          title: 'Conception UX avancée',
          description: 'Techniques avancées pour créer des expériences utilisateur exceptionnelles',
          category: 'design',
          instructor: 'Marie Martin',
          duration: '5h 20min',
          level: 'avancé',
          rating: 4.9,
          enrolledStudents: 85,
          pdfFile: null,
          pdfFileName: ''
        },
        {
          id: 3,
          title: 'Marketing Digital',
          description: 'Stratégies efficaces pour promouvoir votre entreprise en ligne',
          category: 'marketing',
          instructor: 'Sophie Petit',
          duration: '4h 10min',
          level: 'intermédiaire',
          rating: 4.5,
          enrolledStudents: 112,
          pdfFile: null,
          pdfFileName: 'marketing_digital_guide.pdf'
        },
        {
          id: 4,
          title: 'Bases de données SQL',
          description: 'Maîtrisez les requêtes SQL et la conception de bases de données',
          category: 'development',
          instructor: 'Pierre Bernard',
          duration: '6h 30min',
          level: 'intermédiaire',
          rating: 4.6,
          enrolledStudents: 94,
          pdfFile: null,
          pdfFileName: ''
        }
      ];
      this.loading = false;
    }, 1000);
  }

  addCourse(): void {
    this.currentCourse = {
      id: null,
      title: '',
      description: '',
      category: 'development',
      instructor: '',
      duration: '',
      level: 'débutant',
      rating: 0,
      enrolledStudents: 0,
      pdfFile: null,
      pdfFileName: ''
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  editCourse(course: any): void {
    // Clone the course to avoid modifying the original directly
    this.currentCourse = { ...course };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteCourse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      // In a real application, this would call an API
      this.courses = this.courses.filter(course => course.id !== id);
    }
  }

  saveCourse(course: any): void {
    if (this.isEditMode) {
      // Update existing course
      // In a real app, this would call an API
      const index = this.courses.findIndex(c => c.id === course.id);
      if (index !== -1) {
        this.courses[index] = course;
      }
    } else {
      // Add new course
      // In a real app, this would call an API
      // Generate a simple ID for demo purposes
      course.id = Math.max(0, ...this.courses.map(c => c.id)) + 1;
      this.courses.push(course);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.currentCourse = null;
  }

  downloadPdf(course: any): void {
    // In a real application, this would download the actual file from a server
    // For this demo, we'll just show an alert
    if (course.pdfFile) {
      // If we have the actual file object (from a recent upload)
      const url = URL.createObjectURL(course.pdfFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = course.pdfFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (course.pdfFileName) {
      // In a real app, this would fetch the file from a server
      alert(`Téléchargement du fichier: ${course.pdfFileName}`);
      // The actual implementation would be something like:
      // window.location.href = `/api/courses/${course.id}/download-pdf`;
    }
  }

  get filteredCourses(): any[] {
    return this.courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || course.category === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }
}
