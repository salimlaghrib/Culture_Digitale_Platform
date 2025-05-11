import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    trainingId: '',
    duration: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    pdfFile: null,
    youtubeLink: '',
    quizzes: []
  };

  @Input() trainings: any[] = [];
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() quizzes = new EventEmitter<any[]>();

  isFormVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (!this.course.quizzes) {
      this.course.quizzes = [];
    }
    if (this.course.quizzes.length === 0) {
      this.addQuiz();
    }
  }

  onSubmit(): void {
    const courseToSave = { ...this.course };
    console.log('Course data being submitted:', courseToSave);
    this.save.emit(courseToSave);
    // Emit quizzes separately for backend sync
    if (Array.isArray(this.course.quizzes)) {
      this.quizzes.emit(this.course.quizzes);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.course.pdfFile = file;
    }
  }

  addCourse(): void {
    this.isFormVisible = true;
  }

  addQuiz(): void {
    this.course.quizzes.push({
      question: '',
      answers: ['', ''],
      correctAnswerIndex: 0
    });
  }

  removeQuiz(index: number): void {
    if (this.course.quizzes.length > 1) {
      this.course.quizzes.splice(index, 1);
    }
  }

  addAnswer(quizIndex: number): void {
    if (this.course.quizzes[quizIndex].answers.length < 4) {
      this.course.quizzes[quizIndex].answers.push('');
    }
  }

  removeAnswer(quizIndex: number, answerIndex: number): void {
    if (this.course.quizzes[quizIndex].answers.length > 2) {
      this.course.quizzes[quizIndex].answers.splice(answerIndex, 1);
      if (this.course.quizzes[quizIndex].correctAnswerIndex >= answerIndex) {
        this.course.quizzes[quizIndex].correctAnswerIndex = Math.max(0, this.course.quizzes[quizIndex].correctAnswerIndex - 1);
      }
    }
  }
}