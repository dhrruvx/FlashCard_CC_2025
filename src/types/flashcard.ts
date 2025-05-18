export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface FlashcardProgress {
  known: number[];
  unknown: number[];
  currentIndex: number;
} 