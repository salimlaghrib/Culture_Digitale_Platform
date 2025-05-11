// course-player.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course } from '../../../../core/models/course.model';
import { UserService } from '../../../../core/services/user.service';
import { SafeResourceUrlPipe } from '../../../../Shared/pipes/safe-resource-url.pipe';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SafeResourceUrlPipe],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  error = false;

  // Quiz state
  currentScreen: 'video' | 'pdf' | 'quiz-intro' | 'quiz-questions' | 'quiz-results' = 'video';
  currentQuestionIndex = 0;
  selectedAnswers: { [questionId: string]: number } = {};
  quizScore = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCourse(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadCourse(id: string): void {
    this.loading = true;
    this.error = false;

    this.userService.getCourse(id).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading course', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Navigation methods
  goBack(): void {
    window.history.back();
  }

  // Screen navigation
  showVideo(): void {
    this.currentScreen = 'video';
  }

  showPdf(): void {
    this.currentScreen = 'pdf';
  }

  startQuiz(): void {
    this.currentScreen = 'quiz-intro';
  }

  beginQuiz(): void {
    this.currentScreen = 'quiz-questions';
    this.currentQuestionIndex = 0;
    this.selectedAnswers = {};
    this.quizScore = 0;
  }

  // Quiz navigation
  nextQuestion(): void {
    if (this.course && this.currentQuestionIndex < this.course.quiz.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateScore();
      this.currentScreen = 'quiz-results';
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Quiz logic
  selectAnswer(questionId: string, optionIndex: number): void {
    this.selectedAnswers[questionId] = optionIndex;
  }

  isAnswerSelected(questionId: string, optionIndex: number): boolean {
    return this.selectedAnswers[questionId] === optionIndex;
  }

  calculateScore(): void {
    if (!this.course) return;

    let correctAnswers = 0;

    this.course.quiz.forEach((question, index) => {
      const selectedOptionIndex = this.selectedAnswers[question.questionId];
      if (selectedOptionIndex !== undefined && question.options[selectedOptionIndex].isCorrect) {
        correctAnswers++;
      }
    });

    this.quizScore = Math.round((correctAnswers / this.course.quiz.length) * 100);
  }

  restartQuiz(): void {
    this.beginQuiz();
  }

  // PDF handling
  downloadPdf(): void {
    if (this.course && this.course.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.course.pdfUrl;
      link.download = `${this.course.title}.pdf`;
      link.click();
    }
  }
}
