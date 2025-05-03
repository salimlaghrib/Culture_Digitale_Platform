// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
  private apiUrl = `http://localhost:8080/api/auth`;
  private readonly USER_KEY = 'currentUser';

  constructor(private http: HttpClient) { }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          this.saveUserData(response);
        }
      })
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.saveUserData(response);
        }
      })
    );
  }

  getUserData(): AuthResponse | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUserData();
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  private saveUserData(userData: AuthResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }
}
