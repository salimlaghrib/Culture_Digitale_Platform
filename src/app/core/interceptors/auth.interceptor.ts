import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('AuthInterceptor: Intercepting request to', request.url);
    
    const token = this.authService.getToken();
    console.log('AuthInterceptor: Token exists:', !!token);

    // Clone the request and add headers
    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    console.log('AuthInterceptor: Modified request headers:', modifiedRequest.headers.keys());

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('AuthInterceptor: Error occurred:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
          url: request.url
        });

        if (error.status === 401) {
          console.log('AuthInterceptor: Unauthorized access, redirecting to login');
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
        }

        if (error.status === 403) {
          console.log('AuthInterceptor: Forbidden access');
          return throwError(() => new Error('Accès non autorisé.'));
        }

        if (error.status === 404) {
          console.log('AuthInterceptor: Resource not found');
          return throwError(() => new Error('Ressource non trouvée.'));
        }

        return throwError(() => error);
      })
    );
  }
}
