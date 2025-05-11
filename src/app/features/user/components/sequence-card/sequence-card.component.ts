// sequence-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sequence } from '../../../../core/models/sequence.model';

@Component({
  selector: 'app-sequence-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sequence-card.component.html',
  styleUrls: ['./sequence-card.component.css']
})
export class SequenceCardComponent {
  @Input() sequence!: Sequence;
  @Output() sequenceSelected = new EventEmitter<string>();

  goToSequence(): void {
    this.sequenceSelected.emit(this.sequence.id);
  }
}
