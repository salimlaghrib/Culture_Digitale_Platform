import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

  currentScreen: 'rules' | 'questions' | 'results' = 'rules';
  questions: any   = [
    {
      questionId: "q1",
      question: "Quelle est la capitale de la France ?",
      options: [
        { answer: "Lyon", isCorrect: false },
        { answer: "Marseille", isCorrect: false },
        { answer: "Paris", isCorrect: true },
        { answer: "Toulouse", isCorrect: false }
      ]
    },
    {
      questionId: "q2",
      question: "Quel est le plus grand océan du monde ?",
      options: [
        { answer: "Océan Atlantique", isCorrect: false },
        { answer: "Océan Indien", isCorrect: false },
        { answer: "Océan Pacifique", isCorrect: true },
        { answer: "Océan Arctique", isCorrect: false }
      ]
    },
    {
      questionId: "q3",
      question: "Qui a peint la Joconde ?",
      options: [
        { answer: "Pablo Picasso", isCorrect: false },
        { answer: "Vincent van Gogh", isCorrect: false },
        { answer: "Léonard de Vinci", isCorrect: true },
        { answer: "Michel-Ange", isCorrect: false }
      ]
    },
    {
      questionId: "q4",
      question: "Combien de continents y a-t-il sur Terre ?",
      options: [
        { answer: "5", isCorrect: false },
        { answer: "6", isCorrect: false },
        { answer: "7", isCorrect: true },
        { answer: "8", isCorrect: false }
      ]
    }
  ];


  constructor(
    private router: Router,
    private modalService: NgbModal
  ) {}


  pdfSrc  =  "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf" ;


  gotoreadPdf() {
    this.router.navigateByUrl('pdf');
  }

  score = 0
  startQuiz(){
    this.currentScreen = 'questions'
    console.log(this.currentScreen)
  }
  finishQuiz(score: number) {
    this.score = score;
    this.currentScreen = 'results';
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = 'assets/documents/support.pdf';
    link.download = this.pdfSrc;
    link.click();
  }

  startRules() {
    this.currentScreen = "rules"
  }
}
