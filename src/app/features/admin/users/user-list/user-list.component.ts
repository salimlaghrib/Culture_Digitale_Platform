import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
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
  selectedRole: string = '';
  selectedStatus: string = '';

  // For form handling
  showForm: boolean = false;
  currentUser: any = null;
  isEditMode: boolean = false;

  filteredUsers: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.filterUsers();
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      }
    });
  }

  addUser(): void {
    this.currentUser = {
      id: null,
      name: '',
      email: '',
      role: 'Apprenant',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0]
    };
    this.isEditMode = false;
    this.showForm = true;
  }

  editUser(user: any): void {
    this.currentUser = { ...user };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
        }
      });
    }
  }

  saveUser(user: any): void {
    if (this.isEditMode) {
      this.adminService.updateUser(user.id, user).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.closeForm();
        },
        error: (error) => {
          this.error = 'Erreur lors de la mise à jour de l\'utilisateur';
        }
      });
    } else {
      this.adminService.createUser(user).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.closeForm();
        },
        error: (error) => {
          this.error = 'Erreur lors de la création de l\'utilisateur';
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.currentUser = null;
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }
}
