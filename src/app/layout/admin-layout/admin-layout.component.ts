import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  userData = this.authService.getUserData();
  isDarkMode = false;
  isSidenavCollapsed = false;
  showUserDropdown = false;

  @ViewChild('userDropdown') userDropdown!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.showUserDropdown && this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserDropdown = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  toggleSidenav(): void {
    this.isSidenavCollapsed = !this.isSidenavCollapsed;
    localStorage.setItem('sidenavCollapsed', this.isSidenavCollapsed.toString());
  }

  ngOnInit(): void {
    // Check for saved preferences
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      this.isDarkMode = darkMode === 'true';
      document.documentElement.classList.toggle('dark', this.isDarkMode);
    }

    const sidenavCollapsed = localStorage.getItem('sidenavCollapsed');
    if (sidenavCollapsed) {
      this.isSidenavCollapsed = sidenavCollapsed === 'true';
    }

    // Refresh user data
    this.userData = this.authService.getUserData();

    // Redirect to login if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
