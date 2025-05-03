import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-training-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-form.component.html'
})
export class TrainingFormComponent implements OnInit {
  @Input() training: any = {
    id: null,
    title: '',
    description: '',
    duration: '',
    price: 0,
    enrolledStudents: 0,
    rating: 0
  };

  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Clone the training object to avoid reference issues
    const trainingToSave = { ...this.training };

    // In a real app, validation would happen here

    this.save.emit(trainingToSave);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
