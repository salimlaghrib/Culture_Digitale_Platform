// sequence-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Sequence } from '../../../../core/models/sequence.model';
import { SequenceCardComponent } from '../../components/sequence-card/sequence-card.component';

@Component({
  selector: 'app-sequence-list',
  standalone: true,
  imports: [CommonModule, SequenceCardComponent],
  templateUrl: './sequence-list.component.html',
  styleUrls: ['./sequence-list.component.css']
})
export class SequenceListComponent implements OnInit {
  sequences: Sequence[] = [];
  loading = true;
  error = false;
  searchTerm = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSequences();
  }

  loadSequences(): void {
    this.loading = true;
    this.error = false;

    this.userService.getSequences().subscribe({
      next: (sequences) => {
        this.sequences = sequences;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sequences', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSequenceSelected(sequenceId: string): void {
    this.router.navigate(['/sequences', sequenceId]);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // In a real application, you might want to implement filtering logic here
    // or call an API endpoint with the search term
  }
}
