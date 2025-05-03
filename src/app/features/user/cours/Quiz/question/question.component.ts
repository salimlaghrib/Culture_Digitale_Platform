import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  @Input() questions: any[] = [];
  @Output() quizFinished = new EventEmitter<number>();

  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  score = 0;

  submitAnswer() {
    if (this.selectedAnswer !== null &&
      this.questions[this.currentQuestionIndex].options[this.selectedAnswer].isCorrect) {
      this.score++;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
    } else {
      this.quizFinished.emit(this.score);
    }
  }
}
