import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { Training } from '../../models/Training'; // Assurez-vous de créer cette interface

@Injectable({
  providedIn: 'root' // Ou dans un module spécifique si nécessaire
})
export class TrainingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/admin/formations'; // Adaptez selon votre API

  /**
   * Récupère toutes les formations.
   */
  getTrainings() {
    return this.http.get<Training[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère une formation par son ID.
   */
  getTrainingById(id: number) {
    return this.http.get<Training>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée une nouvelle formation.
   */
  createTraining(training: Omit<Training, 'id'>) {
    return this.http.post<Training>(this.apiUrl, training).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour une formation existante.
   */
  updateTraining(id: number, training: Partial<Training>) {
    return this.http.patch<Training>(`${this.apiUrl}/${id}`, training).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprime une formation.
   */
  deleteTraining(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gère les erreurs HTTP.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code ${error.status} : ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
