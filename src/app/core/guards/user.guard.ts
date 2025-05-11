// user.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated() && this.authService.isUser()) {
      return true;
    }

    // If not authenticated, the AuthGuard will handle the redirect to login
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    // If authenticated but not a user, redirect to home
    this.router.navigate(['/home']);
    return false;
  }
}
