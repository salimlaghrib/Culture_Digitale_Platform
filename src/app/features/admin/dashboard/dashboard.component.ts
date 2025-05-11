import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalTrainings: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    userGrowth: 0,
    completionRate: 0
  };

  recentActivity: any[] = [];
  isLoading = true;
  lastUpdated: Date | null = null;
  error: string | null = null;

  constructor(
    private adminService: AdminService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getDashboardStats()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.stats = {
            ...this.stats,
            ...data.stats,
            completionRate: this.calculateCompletionRate(data.stats)
          };
          this.recentActivity = this.processActivityData(data.recentActivity);
          this.lastUpdated = new Date();
        },
        error: (err) => {
          console.error('Error loading dashboard data:', err);
          this.error = 'Failed to load dashboard data. Please try again later.';
        }
      });
  }

  private calculateCompletionRate(stats: any): number {
    if (stats.totalEnrollments && stats.completedEnrollments) {
      return Math.round((stats.completedEnrollments / stats.totalEnrollments) * 100);
    }
    return 0;
  }

  private processActivityData(activities: any[]): any[] {
    return activities.map(activity => ({
      ...activity,
      date: new Date(activity.date),
      status: activity.status || 'completed'
    })).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'medium') || '';
  }
}