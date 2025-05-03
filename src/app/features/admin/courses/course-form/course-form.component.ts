import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  @Input() course: any = {
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

  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  selectedFile: File | null = null;

  constructor() {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.course.pdfFileName = file.name;

      // In a real app, you would upload the file to a server here
      // and store the file reference in the course object
      // For now, we'll just store the file object directly
      this.course.pdfFile = file;
    } else {
      // Reset if not a PDF
      this.selectedFile = null;
      this.course.pdfFileName = '';
      this.course.pdfFile = null;
      alert('Veuillez sélectionner un fichier PDF valide.');
    }
  }

  onSubmit(): void {
    // Clone the course object to avoid reference issues
    const courseToSave = { ...this.course };

    // In a real app, validation would happen here

    this.save.emit(courseToSave);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
