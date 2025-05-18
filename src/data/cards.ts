import { Flashcard } from "@/types/flashcard";

// Initial default cards that should always be available
const defaultCards: Flashcard[] = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "What is 2 + 2?", answer: "4" },
  { id: 3, question: "Who wrote Hamlet?", answer: "William Shakespeare" },
  { id: 4, question: "What is the boiling point of water in Celsius?", answer: "100°C" },
  { id: 5, question: "What planet is known as the Red Planet?", answer: "Mars" },
  { id: 6, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
  { id: 7, question: "What is the largest mammal?", answer: "Blue Whale" },
  { id: 8, question: "What is the chemical symbol for gold?", answer: "Au" },
  { id: 9, question: "Who discovered penicillin?", answer: "Alexander Fleming" },
  { id: 10, question: "What is the square root of 64?", answer: "8" },
  { id: 11, question: "What is the fastest land animal?", answer: "Cheetah" },
  { id: 12, question: "What is the main language spoken in Brazil?", answer: "Portuguese" }
];

// Initialize cards from localStorage or use default cards
const initializeCards = (): Flashcard[] => {
  if (typeof window === 'undefined') {
    return [...defaultCards];
  }
  
  try {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      if (Array.isArray(parsedCards) && parsedCards.length > 0) {
        return parsedCards;
      }
    }
  } catch (error) {
    console.error('Error loading stored cards:', error);
  }
  
  // If no valid saved cards, use defaults and save them
  localStorage.setItem('flashcards', JSON.stringify(defaultCards));
  return [...defaultCards];
};

// Dynamic cards variable that gets initialized properly
let cards: Flashcard[] = defaultCards;

// Function to load cards (called when needed)
export function loadCards(): Flashcard[] {
  cards = initializeCards();
  return [...cards];
}

// Function to add a new card
export function addCard(question: string, answer: string): Flashcard {
  // Make sure cards are loaded first
  if (cards.length === 0) {
    loadCards();
  }
  
  const maxId = cards.reduce((max, card) => Math.max(max, card.id), 0);
  const newCard: Flashcard = {
    id: maxId + 1,
    question,
    answer
  };
  
  cards = [...cards, newCard];
  
  // Update localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }
  
  return newCard;
}

// Function to delete a card
export function deleteCard(id: number): void {
  cards = cards.filter(card => card.id !== id);
  
  // Update localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }
}

// Function to get all cards
export function getAllCards(): Flashcard[] {
  // Always load the latest cards
  return loadCards();
}

// Load cards immediately if in browser environment
if (typeof window !== 'undefined') {
  loadCards();
}

export default cards; 