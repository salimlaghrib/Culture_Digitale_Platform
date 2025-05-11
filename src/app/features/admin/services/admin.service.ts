import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl ="http://localhost:8080/api/admin";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AdminService initialized with API URL:', this.apiUrl);
  }

  private getHeaders(): HttpHeaders {
    const userData = this.authService.getUserData();
    console.log('User data available:', !!userData);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (userData) {
      console.log('User role:', userData.role);
      // Ajouter l'ID de l'utilisateur dans les headers
      headers = headers.set('X-User-Id', userData.id.toString());
      headers = headers.set('X-User-Role', userData.role);
      console.log('User headers added');
    } else {
      console.warn('No user data available');
    }

    return headers;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: error.message,
        url: error.url,
        headers: error.headers?.keys()
      });

      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          errorMessage = 'Accès non autorisé';
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution sur le port 8080.';
        }
      }

      return throwError(() => new Error(errorMessage));
    };
  }

  // Dashboard methods
  getStats(): Observable<any> {
    // Mock data for now
    return of({
      totalUsers: 150,
      totalFormations: 25,
      totalCourses: 45,
      activeEnrollments: 89,
      userGrowth: 12.5,
      completedEnrollments: 65,
      totalEnrollments: 120
    }).pipe(
      delay(500), // Simulate network delay
      catchError(this.handleError('getStats', {}))
    );
  }

  getDashboardStats(): Observable<any> {
    return forkJoin({
      stats: this.getStats(),
      recentActivity: this.getRecentActivity()
    }).pipe(
      catchError(this.handleError('getDashboardStats', { stats: {}, recentActivity: [] }))
    );
  }

  getRecentActivity(): Observable<any[]> {
    // Mock data for now
    return of([
      {
        id: 1,
        user: 'John Doe',
        action: 'enrolled',
        item: 'Web Development Course',
        date: new Date(),
        type: 'course',
        status: 'new',
        description: 'John Doe s\'est inscrit au cours Web Development'
      },
      {
        id: 2,
        user: 'Jane Smith',
        action: 'completed',
        item: 'Digital Marketing Training',
        date: new Date(Date.now() - 86400000),
        type: 'training',
        status: 'completed',
        description: 'Jane Smith a terminé la formation Digital Marketing'
      },
      {
        id: 3,
        user: 'Mike Johnson',
        action: 'started',
        item: 'Data Science Course',
        date: new Date(Date.now() - 172800000),
        type: 'course',
        status: 'pending',
        description: 'Mike Johnson a commencé le cours Data Science'
      },
      {
        id: 4,
        user: 'Sarah Williams',
        action: 'registered',
        item: 'Platform',
        date: new Date(Date.now() - 259200000),
        type: 'user',
        status: 'new',
        description: 'Sarah Williams s\'est inscrite sur la plateforme'
      }
    ]).pipe(
      delay(700), // Simulate network delay
      catchError(this.handleError('getRecentActivity', []))
    );
  }

  // Formation methods
  getFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formations`).pipe(
      tap(formations => console.log(`Fetched ${formations.length} formations`)),
      catchError(this.handleError<any[]>('getFormations', []))
    );
  }

  createFormation(formation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formations`, formation).pipe(
      tap(newFormation => console.log(`Created formation with id ${newFormation.id}`)),
      catchError(this.handleError<any>('createFormation'))
    );
  }

  updateFormation(id: number, formation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/formations/${id}`, formation).pipe(
      tap(_ => console.log(`Updated formation with id ${id}`)),
      catchError(this.handleError<any>('updateFormation'))
    );
  }

  deleteFormation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/formations/${id}`).pipe(
      tap(_ => console.log(`Deleted formation with id ${id}`)),
      catchError(this.handleError<any>('deleteFormation'))
    );
  }

  // User methods
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      tap(users => console.log(`Fetched ${users.length} users`)),
      catchError(this.handleError<any[]>('getUsers', []))
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user).pipe(
      tap(newUser => console.log(`Created user with id ${newUser.id}`)),
      catchError(this.handleError<any>('createUser'))
    );
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap(_ => console.log(`Updated user with id ${id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`).pipe(
      tap(_ => console.log(`Deleted user with id ${id}`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  // Course methods
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/courses`).pipe(
      tap(courses => console.log(`Fetched ${courses.length} courses`)),
      catchError(this.handleError<any[]>('getCourses', []))
    );
  }

  createCourse(course: any): Observable<any> {
    // Validation
    if (!course?.title?.trim()) throw new Error('Title is required');
    if (!course?.description?.trim()) throw new Error('Description is required');

    const formData = new FormData();

    // Champs de base
    formData.append('title', course.title);
    formData.append('description', course.description);

    // PDF
    if (course.pdfFile instanceof File) {
      formData.append('pdfFile', course.pdfFile, course.pdfFile.name);
    }

    // Date
    const createdAt = course.createdAt 
      ? new Date(course.createdAt).toISOString() 
      : new Date().toISOString();
    formData.append('createdAt', createdAt);

    // Durée et statut
    formData.append('duration', (course.duration || 60).toString());
    formData.append('status', course.status || 'active');

    // Correction : envoyer le bon champ formationId (et non trainingId)
    if (course.trainingId) {
      formData.append('formationId', course.trainingId.toString());
    } else if (course.formationId) {
      formData.append('formationId', course.formationId.toString());
    } else {
      formData.append('formationId', '');
    }

    if (course.youtubeLink) formData.append('youtubeLink', course.youtubeLink);

    return this.http.post(`${this.apiUrl}/courses`, formData).pipe(
      tap((newCourse: any) => console.log('Course created:', newCourse.id)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(() => error.error?.message || 'Creation failed');
      })
    );
  }

  updateCourse(id: number, course: any): Observable<any> {
    // Validation
    if (!course?.title?.trim()) throw new Error('Title is required');
    if (!course?.description?.trim()) throw new Error('Description is required');

    const formData = new FormData();

    // Champs de base
    formData.append('title', course.title);
    formData.append('description', course.description);

    // PDF
    if (course.pdfFile instanceof File) {
      formData.append('pdfFile', course.pdfFile, course.pdfFile.name);
    }

    // Date
    const createdAt = course.createdAt 
      ? new Date(course.createdAt).toISOString() 
      : new Date().toISOString();
    formData.append('createdAt', createdAt);

    // Durée et statut
    formData.append('duration', (course.duration || 60).toString());
    formData.append('status', course.status || 'active');

    // Correction : envoyer le bon champ formationId (et non trainingId)
    if (course.trainingId) {
      formData.append('formationId', course.trainingId.toString());
    } else if (course.formationId) {
      formData.append('formationId', course.formationId.toString());
    } else {
      formData.append('formationId', '');
    }

    if (course.youtubeLink) formData.append('youtubeLink', course.youtubeLink);

    return this.http.put(`http://localhost:8080/api/admin/courses/${id}`, formData).pipe(
      tap((updatedCourse: any) => console.log('Course updated:', updatedCourse.id)),
      catchError(error => {
        console.error('Error:', error);
        return throwError(() => error.error?.message || 'Update failed');
      })
    );
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/admin/courses/${id}`).pipe(
      tap(_ => console.log(`Deleted course with id ${id}`)),
      catchError(this.handleError<any>('deleteCourse'))
    );
  }

  advancedSearchCourses(params: { formationId?: number, status?: string, keyword?: string, page?: number, size?: number }): Observable<any> {
    const queryParams: any = {};
    if (params.formationId) queryParams.formationId = params.formationId;
    if (params.status) queryParams.status = params.status;
    if (params.keyword) queryParams.keyword = params.keyword;
    queryParams.page = params.page ?? 0;
    queryParams.size = params.size ?? 10;
    return this.http.get<any>(`http://localhost:8080/api/admin/courses/advanced-search`, { params: queryParams }).pipe(
      catchError(this.handleError<any>('advancedSearchCourses', { content: [], totalElements: 0 }))
    );
  }

  // Course content methods
  getCourseContent(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/content`).pipe(
      tap(_ => console.log(`Fetched content for course id ${courseId}`)),
      catchError(this.handleError<any>('getCourseContent'))
    );
  }

  downloadCoursePdf(courseId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/courses/${courseId}/pdf`, { responseType: 'blob' }).pipe(
      tap(_ => console.log(`Downloaded PDF for course id ${courseId}`)),
      catchError(this.handleError<Blob>('downloadCoursePdf'))
    );
  }

  updateCourseContent(courseId: number, content: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${courseId}/content`, content).pipe(
      tap(_ => console.log(`Updated content for course id ${courseId}`)),
      catchError(this.handleError<any>('updateCourseContent'))
    );
  }

  // Course enrollment methods
  getCourseEnrollments(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses/${courseId}/enrollments`).pipe(
      tap(enrollments => console.log(`Fetched ${enrollments.length} enrollments for course id ${courseId}`)),
      catchError(this.handleError<any[]>('getCourseEnrollments', []))
    );
  }

  updateEnrollmentStatus(courseId: number, userId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${courseId}/enrollments/${userId}`, { status }).pipe(
      tap(_ => console.log(`Updated enrollment status to ${status} for user ${userId} in course ${courseId}`)),
      catchError(this.handleError<any>('updateEnrollmentStatus'))
    );
  }

  // Training methods
  getTrainings(): Observable<any> {
    console.log('AdminService: Calling getTrainings');
    console.log('API URL:', `${this.apiUrl}/formations`);
    
    return this.http.get<any>(`${this.apiUrl}/formations`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('Error in getTrainings:', error);
        if (error.status === 0) {
          throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution sur le port 8080.');
        }
        throw error;
      })
    );
  }

  getTraining(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formations/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(_ => console.log(`Fetched formation with id ${id}`)),
      catchError(this.handleError<any>('getTraining'))
    );
  }

  createTraining(training: any): Observable<any> {
    // Formater les données avant l'envoi
    const formattedTraining = {
      ...training,
      // Convertir les champs en format attendu par le serveur
      difficulty: training.difficulty?.toUpperCase() || 'INTERMEDIATE',
      category: training.category?.toUpperCase() || 'WEB_DEVELOPMENT',
      tags: Array.isArray(training.tags) ? training.tags : training.tags?.split(',').map((tag: string) => tag.trim()),
      published: training.published || false,
      courses: training.courses || [],
      createdAt: new Date().toISOString()
    };

    console.log('Creating training with formatted data:', JSON.stringify(formattedTraining, null, 2));
    
    const headers = this.getHeaders();
    console.log('Request headers:', headers.keys());
    
    return this.http.post<any>(`${this.apiUrl}/admin/formations`, formattedTraining, {
      headers: headers,
      withCredentials: true
    }).pipe(
      tap(newFormation => console.log(`Created formation with id ${newFormation.id}`)),
      catchError(error => {
        console.error('Error creating training:', error);
        console.error('Request details:', {
          url: `${this.apiUrl}/admin/formations`,
          method: 'POST',
          headers: headers.keys(),
          body: JSON.stringify(formattedTraining, null, 2)
        });
        
        if (error.status === 0) {
          throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else if (error.status === 400) {
          // Log the full error response for debugging
          console.error('Validation error details:', error.error);
          const errorMessage = error.error?.detail || 
                             error.error?.message || 
                             'Les données de la formation sont invalides. Veuillez vérifier tous les champs requis.';
          throw new Error(errorMessage);
        } else if (error.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour créer une formation.');
        } else {
          const errorMessage = error.error?.message || 'Une erreur est survenue lors de la création de la formation';
          throw new Error(errorMessage);
        }
      })
    );
  }

  private convertDifficultyToEnum(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      'DÉBUTANT': 'BEGINNER',
      'DÉBUTANTE': 'BEGINNER',
      'INTERMÉDIAIRE': 'INTERMEDIATE',
      'AVANCÉ': 'ADVANCED',
      'AVANCÉE': 'ADVANCED',
      'EXPERT': 'ADVANCED'
    };

    const normalizedDifficulty = difficulty.toUpperCase().trim();
    return difficultyMap[normalizedDifficulty] || 'INTERMEDIATE';
  }

  updateTraining(id: number, training: any): Observable<any> {
    // Formater les données avant l'envoi
    const formattedTraining = {
      id: training.id,
      title: training.title?.trim(),
      subtitle: training.subtitle?.trim(),
      description: training.description?.trim(),
      imageUrl: training.imageUrl?.trim(),
      difficulty: this.convertDifficultyToEnum(training.difficulty || 'INTERMEDIATE'),
      category: (training.category || 'WEB_DEVELOPMENT').toUpperCase(),
      durationHours: Number(training.durationHours) || 0,
      published: Boolean(training.published),
      courses: Array.isArray(training.courses) ? training.courses : [],
      tags: Array.isArray(training.tags) 
        ? training.tags.map((tag: string) => tag.trim())
        : typeof training.tags === 'string'
          ? training.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : [],
      createdAt: (() => {
        try {
          if (training.createdAt) {
            const date = new Date(training.createdAt);
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
          }
          return new Date().toISOString();
        } catch (e) {
          console.warn('Invalid date, using current date instead');
          return new Date().toISOString();
        }
      })()
    };

    // Vérifier que tous les champs requis sont présents
    if (!formattedTraining.title || !formattedTraining.subtitle || !formattedTraining.description || 
        !formattedTraining.imageUrl || !formattedTraining.category || !formattedTraining.difficulty) {
      throw new Error('Tous les champs obligatoires doivent être remplis');
    }

    console.log('Updating training with formatted data:', JSON.stringify(formattedTraining, null, 2));
    
    const headers = this.getHeaders();
    console.log('Request headers:', headers.keys());
    
    return this.http.put<any>(`${this.apiUrl}/admin/formations/${id}`, formattedTraining, {
      headers: headers,
      withCredentials: true
    }).pipe(
      tap(_ => console.log(`Updated formation with id ${id}`)),
      catchError(error => {
        console.error('Error updating training:', error);
        console.error('Request details:', {
          url: `${this.apiUrl}/admin/formations/${id}`,
          method: 'PUT',
          headers: headers.keys(),
          body: JSON.stringify(formattedTraining, null, 2)
        });
        
        if (error.status === 0) {
          throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else if (error.status === 400) {
          // Log the full error response for debugging
          console.error('Validation error details:', error.error);
          const errorMessage = error.error?.detail || 
                             error.error?.message || 
                             'Les données de la formation sont invalides. Veuillez vérifier tous les champs requis.';
          throw new Error(errorMessage);
        } else if (error.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour modifier cette formation.');
        } else if (error.status === 404) {
          throw new Error('Formation non trouvée.');
        } else {
          const errorMessage = error.error?.message || 'Une erreur est survenue lors de la mise à jour de la formation';
          throw new Error(errorMessage);
        }
      })
    );
  }

  deleteTraining(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/formations/${id}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(_ => console.log(`Deleted formation with id ${id}`)),
      catchError(error => {
        console.error('Error deleting training:', error);
        console.error('Request details:', {
          url: `${this.apiUrl}/admin/formations/${id}`,
          method: 'DELETE',
          headers: this.getHeaders().keys()
        });
        
        if (error.status === 0) {
          throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else if (error.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour supprimer cette formation.');
        } else if (error.status === 404) {
          throw new Error('Formation non trouvée.');
        } else if (error.status === 405) {
          throw new Error('Méthode non autorisée. Veuillez vérifier la configuration du serveur.');
        } else {
          const errorMessage = error.error?.message || 'Une erreur est survenue lors de la suppression de la formation';
          throw new Error(errorMessage);
        }
      })
    );
  }

  // Quiz methods
  createQuiz(courseId: number, quiz: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/admin/quizzes/courses/${courseId}`, quiz).pipe(
      catchError(this.handleError<any>('createQuiz'))
    );
  }

  getQuizByCourseId(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/quizzes/courses/${courseId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(quiz => console.log(`Fetched quiz for course ${courseId}`)),
      catchError(error => {
        console.error('Error fetching quiz:', error);
        if (error.status === 404) {
          throw new Error('Quiz non trouvé pour ce cours');
        } else if (error.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour accéder à ce quiz.');
        }
        throw error;
      })
    );
  }

  updateQuiz(quizId: number, quiz: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/admin/quizzes/${quizId}`, quiz).pipe(
      catchError(this.handleError<any>('updateQuiz'))
    );
  }

  deleteQuiz(quizId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/quizzes/${quizId}`, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap(_ => console.log(`Deleted quiz with id ${quizId}`)),
      catchError(error => {
        console.error('Error deleting quiz:', error);
        if (error.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          throw new Error('Vous n\'avez pas les droits nécessaires pour supprimer ce quiz.');
        } else if (error.status === 404) {
          throw new Error('Quiz non trouvé');
        }
        throw error;
      })
    );
  }
}
