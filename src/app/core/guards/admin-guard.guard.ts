import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    try {
      const user = this.authService.getUserData();
      if (user && user.role === 'ADMIN') {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Error in AdminGuard:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
