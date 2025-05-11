// auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  message: string;
  success: boolean;
  redirectPath: string;
  token?: string;
  formations?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('Registering user with data:', userData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('Registration response:', response);
        if (response.success) {
          this.saveUserData(response);
          if (response.token) {
            this.saveToken(response.token);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Logging in with credentials:', credentials);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Login response in service:', JSON.stringify(response, null, 2));
        if (response.success) {
          console.log('Saving user data:', response);
          this.saveUserData(response);
          
          // Vérifier si le token est présent dans la réponse
          if (response.token) {
            console.log('Token found in response, saving it...');
            this.saveToken(response.token);
            // Vérifier que le token a été sauvegardé
            const savedToken = this.getToken();
            console.log('Token saved successfully:', !!savedToken);
          } else {
            console.warn('No token received in login response');
            // Si pas de token, vérifier si on peut en générer un à partir des données utilisateur
            if (response.id && response.email) {
              console.log('Attempting to generate token from user data');
              const generatedToken = btoa(`${response.id}:${response.email}`);
              this.saveToken(generatedToken);
              console.log('Generated and saved token:', !!this.getToken());
            }
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  getUserData(): AuthResponse | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Getting token from storage:', token ? 'Token exists' : 'No token');
    return token;
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.getUserData();
    console.log('[AuthService] isAuthenticated:', authenticated);
    return authenticated;
  }

  isAdmin(): boolean {
    const userData = this.getUserData();
    return userData?.role === 'ADMIN';
  }

  isUser(): boolean {
    const userData = this.getUserData();
    const isUser = userData?.role === 'USER';
    console.log('[AuthService] isUser:', isUser, '| userData:', userData);
    return isUser;
  }

  getRedirectPath(): string {
    if (this.isAdmin()) {
      return '/admin/dashboard';
    } else if (this.isUser()) {
      return '/home';
    }
    return '/login';
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  private saveUserData(userData: AuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  private saveToken(token: string): void {
    console.log('Saving token to localStorage');
    try {
    localStorage.setItem(this.TOKEN_KEY, token);
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      console.log('Token saved, verifying:', savedToken ? 'Token exists' : 'No token');
      if (!savedToken) {
        console.error('Token was not saved successfully');
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth service error:', error);
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 403) {
        errorMessage = 'Accès non autorisé';
      } else if (error.status === 409) {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
