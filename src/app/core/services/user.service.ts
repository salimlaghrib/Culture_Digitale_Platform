// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Sequence } from '../models/sequence.model';
import { Course } from '../models/course.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  // Mock data for sequences
  private mockSequences: Sequence[] = [
    {
      id: '1',
      title: 'Introduction à TypeScript',
      subtitle: 'Les bases du langage',
      imagePath: 'https://miro.medium.com/v2/resize:fit:1400/0*cy5S4LnOIInTBXed.png',
      courseCount: 5,
      duration: 120,
      difficulty: 'beginner',
      isCompleted: false,
      tags: ['programmation', 'web'],
      createdAt: '2023-10-15',
      courses: [
        {
          id: '101',
          title: 'Introduction à TypeScript',
          videoUrl: 'https://www.youtube.com/embed/WCprnWOi8Q8',
          pdfUrl: 'assets/documents/typescript-intro.pdf',
          description: 'Découvrez les bases de TypeScript et ses avantages par rapport à JavaScript.',
          quiz: [
            {
              questionId: 'q1',
              question: 'TypeScript est un sur-ensemble de quel langage ?',
              options: [
                { answer: 'Java', isCorrect: false },
                { answer: 'C#', isCorrect: false },
                { answer: 'JavaScript', isCorrect: true },
                { answer: 'Python', isCorrect: false }
              ]
            },
            {
              questionId: 'q2',
              question: 'Quelle est l\'extension des fichiers TypeScript ?',
              options: [
                { answer: '.js', isCorrect: false },
                { answer: '.ts', isCorrect: true },
                { answer: '.tsx', isCorrect: false },
                { answer: '.typ', isCorrect: false }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Angular Avancé',
      subtitle: 'State management avec NgRx',
      imagePath: 'https://media.licdn.com/dms/image/v2/D4D12AQGbTqGbo_n5_Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1726476731558?e=2147483647&v=beta&t=CFBJUWNdFv9TetZ4L1TBOR1HnxUSu8k8I4iu9L9ix_s',
      courseCount: 8,
      duration: 180,
      difficulty: 'advanced',
      isCompleted: false,
      tags: ['frontend', 'rxjs'],
      createdAt: '2023-11-02',
      courses: [
        {
          id: '201',
          title: 'Introduction à NgRx',
          videoUrl: 'https://www.youtube.com/embed/WCprnWOi8Q8',
          pdfUrl: 'assets/documents/ngrx-intro.pdf',
          description: 'Découvrez comment gérer l\'état de votre application Angular avec NgRx.',
          quiz: [
            {
              questionId: 'q1',
              question: 'Quel est le pattern utilisé par NgRx ?',
              options: [
                { answer: 'MVC', isCorrect: false },
                { answer: 'MVVM', isCorrect: false },
                { answer: 'Redux', isCorrect: true },
                { answer: 'Observer', isCorrect: false }
              ]
            }
          ]
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  getSequences(): Observable<Sequence[]> {
    // In a real application, this would call the API
    // return this.http.get<Sequence[]>(`${this.apiUrl}/sequences`);

    // For now, return mock data
    return of(this.mockSequences);
  }

  getSequence(id: string): Observable<Sequence> {
    // In a real application, this would call the API
    // return this.http.get<Sequence>(`${this.apiUrl}/sequences/${id}`);

    // For now, return mock data
    const sequence = this.mockSequences.find(s => s.id === id);
    return of(sequence as Sequence);
  }

  getCourse(id: string): Observable<Course> {
    // In a real application, this would call the API
    // return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);

    // For now, find the course in the mock data
    let foundCourse: Course | undefined;

    this.mockSequences.forEach(sequence => {
      const course = sequence.courses.find(c => c.id === id);
      if (course) {
        foundCourse = course;
      }
    });

    return of(foundCourse as Course);
  }
}
