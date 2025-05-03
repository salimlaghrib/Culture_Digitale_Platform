import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UserFormComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  // For filtering
  searchTerm: string = '';
  roleFilter: string = 'all';

  // For form handling
  showForm: boolean = false;
  currentUser: any = null;
  isEditMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Simulate loading data from an API
    setTimeout(() => {
      this.users = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'admin',
          status: 'active',
          registeredDate: '2023-01-15',
          lastLogin: '2023-05-01'
        },
        {
          id: 2,
          name: 'Marie Martin',
          email: 'marie.martin@example.com',
          role: 'instructor',
          status: 'active',
          registeredDate: '2023-02-20',
          lastLogin: '2023-04-28'
        },
        {
          id: 3,
          name: 'Pierre Bernard',
          email: 'pierre.bernard@example.com',
          role: 'student',
          status: 'inactive',
          registeredDate: '2023-03-10',
          lastLogin: '2023-03-15'
        },
        {
          id: 4,
          name: 'Sophie Petit',
          email: 'sophie.petit@example.com',
          role: 'student',
          status: 'active',
          registeredDate: '2023-04-05',
          lastLogin: '2023-04-30'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  addUser(): void {
    this.currentUser = {
      id: null,
      name: '',
      email: '',
      role: 'student',
      status: 'active',
      registeredDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0]
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  editUser(user: any): void {
    // Clone the user to avoid modifying the original directly
    this.currentUser = { ...user };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // In a real application, this would call an API
      this.users = this.users.filter(user => user.id !== id);
    }
  }

  saveUser(user: any): void {
    if (this.isEditMode) {
      // Update existing user
      // In a real app, this would call an API
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
      }
    } else {
      // Add new user
      // In a real app, this would call an API
      // Generate a simple ID for demo purposes
      user.id = Math.max(0, ...this.users.map(u => u.id)) + 1;
      this.users.push(user);
    }
    this.closeForm();
  }

  closeForm(): void {
    this.showForm = false;
    this.currentUser = null;
  }

  get filteredUsers(): any[] {
    return this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;

      return matchesSearch && matchesRole;
    });
  }
}
