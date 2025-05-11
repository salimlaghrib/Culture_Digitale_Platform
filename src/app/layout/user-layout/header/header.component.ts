import { NgIf } from "@angular/common";
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterModule
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userProfileImage: string = 'favicon.ico';
  showDropdown: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  get userName(): string {
    const user = this.authService.getUserData();
    return user ? user.username : '';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goTosignin(): void {
    this.router.navigate(['/register']);
  }
}