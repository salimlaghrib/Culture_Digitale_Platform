interface Quiz {
  questionId: string;
  question: string;
  options: {
    answer: string;
    isCorrect: boolean;
  }[]; // Tableau de 4 options
}
