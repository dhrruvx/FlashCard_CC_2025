'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Flashcard from '@/components/Flashcard';
import ProgressBar from '@/components/ProgressBar';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import { BackgroundBeamsWithCollision } from '@/components/BackgroundBeamsWithCollision';
import { Flashcard as FlashcardType, FlashcardProgress } from '@/types/flashcard';
import { useAuth } from '@/contexts/AuthContext';
import cards, { loadCards } from '@/data/cards';

// Fisher-Yates shuffle algorithm for randomizing cards
const shuffleCards = (array: FlashcardType[]): FlashcardType[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shuffledCards, setShuffledCards] = useState<FlashcardType[]>([]);
  const [progress, setProgress] = useState<FlashcardProgress>({
    known: [],
    unknown: [],
    currentIndex: 0,
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as const });
  const { isLoggedIn } = useAuth();

  // Initialize or reset cards with shuffling
  const initializeCards = useCallback((forceReset = false) => {
    console.log("Initializing cards, force reset:", forceReset);
    
    // Always load the latest cards first to ensure we have the most recent data
    loadCards();
    
    if (forceReset) {
      // Clear progress and shuffle cards
      const newShuffledCards = shuffleCards(cards);
      setShuffledCards(newShuffledCards);
      setProgress({ known: [], unknown: [], currentIndex: 0 });
      setCurrentIndex(0);
      
      // Save shuffled order to localStorage but don't remove login state
      localStorage.setItem('shuffledCards', JSON.stringify(newShuffledCards));
      localStorage.removeItem('flashcardProgress');
      
      return;
    }
    
    // Try to load existing shuffled order first
    const savedShuffledCards = localStorage.getItem('shuffledCards');
    if (savedShuffledCards) {
      try {
        const parsedCards = JSON.parse(savedShuffledCards);
        if (Array.isArray(parsedCards) && parsedCards.length === cards.length) {
          setShuffledCards(parsedCards);
          console.log("Loaded saved card order");
          return;
        }
      } catch (error) {
        console.error("Error parsing saved card order:", error);
      }
    }
    
    // If no saved order or it's invalid, create a new shuffled order
    const newShuffledCards = shuffleCards(cards);
    setShuffledCards(newShuffledCards);
    localStorage.setItem('shuffledCards', JSON.stringify(newShuffledCards));
    console.log("Created new shuffled order");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    // Force reset if URL contains reset parameter
    const urlParams = new URLSearchParams(window.location.search);
    const resetParam = urlParams.get('reset');
    
    if (resetParam) {
      console.log("RESET PARAMETER DETECTED, RESETTING CARDS ONLY");
      // Only reset the cards, but preserve login state
      initializeCards(true);
      
      // Remove the reset parameter from URL without full page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      setIsLoading(false);
      return; // Skip the rest of this effect
    }
    
    // Normal flow without reset parameter
    console.log("Home component mounted, checking localStorage...");
    
    // Initialize cards first
    initializeCards(false);
    
    // Then try to load progress if it exists
    try {
      const savedProgress = localStorage.getItem('flashcardProgress');
      console.log("Raw saved progress:", savedProgress);
      
      if (savedProgress && savedProgress !== "null" && savedProgress !== "undefined") {
        const parsedProgress = JSON.parse(savedProgress);
        console.log("Parsed progress:", parsedProgress);
        
        if (parsedProgress && 
            Array.isArray(parsedProgress.known) && 
            Array.isArray(parsedProgress.unknown) && 
            typeof parsedProgress.currentIndex === 'number') {
          
          setProgress(parsedProgress);
          
          if (parsedProgress.currentIndex >= 0 && parsedProgress.currentIndex < cards.length) {
            setCurrentIndex(parsedProgress.currentIndex);
            console.log("Restored to index:", parsedProgress.currentIndex);
          } else {
            console.log("Index out of bounds, resetting to 0");
          }
        } else {
          console.log("Invalid progress structure, using defaults");
        }
      } else {
        console.log("No valid progress found, using defaults");
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
    
    setIsLoading(false);
  }, [initializeCards, isLoggedIn]);

  useEffect(() => {
    if (currentIndex >= cards.length && isLoggedIn) {
      router.push('/summary');
    }
  }, [currentIndex, router, isLoggedIn]);

  const handleAnswer = (known: boolean) => {
    if (!shuffledCards.length) return;
    
    const currentCardId = shuffledCards[currentIndex].id;
    const newProgress = {
      ...progress,
      known: known ? [...progress.known, currentCardId] : progress.known,
      unknown: !known ? [...progress.unknown, currentCardId] : progress.unknown,
      currentIndex: currentIndex + 1,
    };
    setProgress(newProgress);
    localStorage.setItem('flashcardProgress', JSON.stringify(newProgress));
    setCurrentIndex(currentIndex + 1);
  };

  const handleResetProgress = () => {
    // Reset progress and shuffle cards without clearing login state
    initializeCards(true);
    setCurrentIndex(0);
    
    // Show a toast confirmation
    setToast({
      show: true,
      message: 'Progress reset! Ready to start again.',
      type: 'info'
    });
  };

  const handleLoginRequest = () => {
    setToast({
      show: true,
      message: "Please login to start studying with flashcards",
      type: "info"
    });
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If already logged in, proceed to main app by just setting isLoading
      // This will trigger the main card view render instead of the welcome screen
      setIsLoading(true);
      setTimeout(() => {
        initializeCards(false);
        setIsLoading(false);
      }, 300); // Short delay for transition effect
    } else {
      // If not logged in, show login request toast
      setToast({
        show: true,
        message: "Please log in using the profile icon in the top right",
        type: "info"
      });
    }
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  // Loading state
  if (isLoading) {
  return (
      <BackgroundBeamsWithCollision>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl text-white font-medium"
          >
            Loading...
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    );
  }

  // Welcome screen for non-logged in users
  if (!isLoggedIn) {
    return (
      <BackgroundBeamsWithCollision>
        <Navbar onResetProgress={handleResetProgress} />
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                Flashcards Viewer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Studying made easy with us. A simple and effective way to memorize and learn with interactive flashcards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {isLoggedIn ? (
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl text-lg font-medium shadow-lg flex items-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Start Studying
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl text-lg font-medium shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              )}
              <motion.button
                onClick={handleLoginRequest}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-lg font-medium backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-blue-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Self-Paced Learning</h3>
                <p className="text-gray-300">Study at your own pace with our intuitive flashcard system. Track your progress as you go.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-teal-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Your Own</h3>
                <p className="text-gray-300">Create and manage your own flashcard collection. Customize them to fit your learning needs.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <div className="text-indigo-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Smart Learning</h3>
                <p className="text-gray-300">Our system tracks what you know and what you don&apos;t, helping you focus on areas that need improvement.</p>
              </div>
            </div>
          </motion.div>
        </div>
        <Toast 
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={handleToastClose}
        />
      </BackgroundBeamsWithCollision>
    );
  }

  // Error state - card not found
  if (currentIndex >= cards.length) {
    return null;
  }

  const currentCard = shuffledCards[currentIndex];
  if (!currentCard) {
    return (
      <BackgroundBeamsWithCollision>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-red-400"
          >
            Error: Card not found (Index: {currentIndex}, Total Cards: {shuffledCards.length})
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    );
  }

  // Main app for logged in users
  return (
    <BackgroundBeamsWithCollision>
      {/* Navbar */}
      <Navbar onResetProgress={handleResetProgress} />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl mx-auto pt-20" // Reduced top padding
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-white tracking-tight">
            Flashcard <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Viewer</span>
          </h1>
          <div className="mb-8">
            <ProgressBar current={currentIndex + 1} total={cards.length} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-3 text-gray-300 text-base"
            >
              Card {currentIndex + 1} of {cards.length}
            </motion.p>
          </div>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
        >
            <Flashcard card={currentCard} onAnswer={handleAnswer} />
          </motion.div>
        </motion.div>
    </div>
    </BackgroundBeamsWithCollision>
  );
}
