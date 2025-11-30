export enum AppMode {
  HOME = 'HOME',
  FLASHCARD = 'FLASHCARD',
  QUIZ = 'QUIZ',
  STUDY_SHEET = 'STUDY_SHEET'
}

export interface FlashcardData {
  term: string;
  type: 'Brand' | 'Generic';
  answer: string;
  drugClass: string;
  indication: string;
  genericName: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subjectDrug: string;
}

export interface DrugDetails {
  brandName: string;
  genericName: string;
  drugClass: string;
  indication: string;
  sideEffects: string[];
  schedule: string;
}

export interface ApiError {
  message: string;
}