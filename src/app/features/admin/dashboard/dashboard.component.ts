import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalTrainings: 0,
    totalCourses: 0
  };

  recentTrainings: any[] = [];
  recentUsers: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // In a real app, these would be fetched from a service
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    // Simulate API calls with mock data
    this.stats = {
      totalUsers: 4,
      activeUsers: 3,
      totalTrainings: 3,
      totalCourses: 4
    };

    this.recentTrainings = [
      {
        id: 1,
        title: 'Introduction à Angular',
        category: 'Développement Web',
        createdAt: new Date('2023-01-15T10:30:00Z')
      },
      {
        id: 2,
        title: 'Tailwind CSS Avancé',
        category: 'Design Web',
        createdAt: new Date('2023-03-10T09:15:00Z')
      }
    ];

    this.recentUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin'
      },
      {
        id: 2,
        name: 'Trainer User',
        email: 'trainer@example.com',
        role: 'Formateur'
      }
    ];
  }
}
