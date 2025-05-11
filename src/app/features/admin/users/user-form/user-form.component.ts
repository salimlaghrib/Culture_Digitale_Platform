import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() user: any = {
    id: null,
    name: '',
    email: '',
    role: 'Apprenant',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().split('T')[0]
  };

  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    const userToSave = { ...this.user };
    this.save.emit(userToSave);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
