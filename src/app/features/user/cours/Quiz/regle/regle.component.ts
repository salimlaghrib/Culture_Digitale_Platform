import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-regle',
  templateUrl: './regle.component.html',
  styleUrl: './regle.component.css'
})
export class RegleComponent {

  @Output() starQuiz = new EventEmitter()
  onStart() {
    this.starQuiz.emit()
  }
}
