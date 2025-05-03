interface Course {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  videoPath: string;
  duration: number; // en minutes
  pdfs: {
    name: string;
    data: Blob | Uint8Array; // Les deux types acceptés comme indiqué
    size: number; // en octets
  }[];
  quizzes?: Quiz[]; // Optionnel comme spécifié
  // objectives: string[];
  creationDate: Date;
  lastUpdated: Date;
  author: Author; // Structure de base maintenue
}
