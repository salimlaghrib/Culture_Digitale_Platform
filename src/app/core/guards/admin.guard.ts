import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAdmin(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  private checkAdmin(url: string): boolean {
    // First check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Store the attempted URL for redirecting
      sessionStorage.setItem('redirectUrl', url);
      this.router.navigate(['/login']);
      return false;
    }

    // Then check if the user is an admin
    if (this.authService.isAdmin()) {
      return true;
    }

    // If user is authenticated but not an admin, redirect to home
    this.router.navigate(['/home']);
    return false;
  }
}
