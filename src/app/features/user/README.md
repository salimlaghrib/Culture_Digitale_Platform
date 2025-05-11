# User Module

Ce module fournit les fonctionnalités pour les utilisateurs de la plateforme éducative, permettant la navigation entre séquences/cours et l'affichage interactif des contenus.

## Fonctionnalités

- Affichage de la liste des formations (séquences)
- Affichage des détails d'une séquence et de ses cours associés
- Lecteur de cours avec vidéo, PDF et quiz interactif
- Navigation fluide entre les différentes sections
- Interface responsive (mobile-first)

## Routes

- `/sequences` : Liste des formations disponibles
- `/sequences/:id` : Détails d'une séquence et ses cours associés
- `/courses/:id` : Lecteur de cours (vidéo, PDF, quiz)

## Composants

### SequenceListComponent

Affiche la liste des formations disponibles pour l'utilisateur.

### SequenceDetailComponent

Affiche les détails d'une séquence spécifique et la liste de ses cours associés.

### CoursePlayerComponent

Lecteur de cours intégrant :
- Lecteur vidéo
- Visualiseur PDF
- Quiz interactif

### SequenceCardComponent

Composant réutilisable pour afficher une carte de séquence.

## Services

### UserService

Fournit les méthodes pour récupérer les données des séquences et des cours :

```typescript
getSequences(): Observable<Sequence[]>
getSequence(id: string): Observable<Sequence>
getCourse(id: string): Observable<Course>
```

## Modèles de données

### Sequence

```typescript
interface Sequence {
  id: string;
  title: string;
  courses: Course[];
  subtitle?: string;
  imagePath?: string;
  courseCount?: number;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isCompleted?: boolean;
  tags?: string[];
  createdAt?: string;
}
```

### Course

```typescript
interface Course {
  id: string;
  title: string;
  videoUrl: string;
  pdfUrl: string;
  quiz: QuizQuestion[];
  description?: string;
  duration?: number;
  isCompleted?: boolean;
  sequenceId?: string;
}
```

## Protection des routes

Les routes du module utilisateur sont protégées par :
- `AuthGuard` : Vérifie que l'utilisateur est authentifié
- `UserGuard` : Vérifie que l'utilisateur a le rôle 'USER'

## Dépendances

- Angular 17+ (Standalone Components)
- Tailwind CSS
- ngx-extended-pdf-viewer (pour l'affichage des PDF)

## Utilisation

Pour accéder au module utilisateur, l'utilisateur doit être connecté avec un compte ayant le rôle 'USER'.
