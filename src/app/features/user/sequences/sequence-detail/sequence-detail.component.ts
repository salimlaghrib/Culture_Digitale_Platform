// sequence-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { Sequence } from '../../../../core/models/sequence.model';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-sequence-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sequence-detail.component.html',
  styleUrls: ['./sequence-detail.component.css']
})
export class SequenceDetailComponent implements OnInit {
  sequence: Sequence | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadSequence(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadSequence(id: string): void {
    this.loading = true;
    this.error = false;

    this.userService.getSequence(id).subscribe({
      next: (sequence) => {
        this.sequence = sequence;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sequence', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  goToCourse(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  goBack(): void {
    this.router.navigate(['/sequences']);
  }
}
