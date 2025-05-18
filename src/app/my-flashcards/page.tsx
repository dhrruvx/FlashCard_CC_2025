'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/types/flashcard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast, { ToastType } from '@/components/Toast';
import { BackgroundBeamsWithCollision } from '@/components/BackgroundBeamsWithCollision';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { addCard, deleteCard, getAllCards, loadCards } from '@/data/cards';

export default function MyFlashcardsPage() {
  const [userFlashcards, setUserFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardAnswer, setNewCardAnswer] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as ToastType });
  const { theme, fontSize } = useTheme();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      showToast('Please login to access My Flashcards', 'info');
    }
  }, [isLoggedIn, router]);

  // Fetch flashcards from cards.ts
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    
    const fetchCards = () => {
      try {
        // Explicitly load cards first to ensure we have the latest data
        loadCards();
        const allCards = getAllCards();
        setUserFlashcards(allCards);
      } catch (error) {
        showToast('Error loading flashcards', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
    
    // Set up an event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flashcards') {
        fetchCards();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCardQuestion.trim() || !newCardAnswer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }
    
    try {
      // Add card using the function from cards.ts
      const newCard = addCard(newCardQuestion.trim(), newCardAnswer.trim());
      
      // Update the UI state
      setUserFlashcards(prevCards => [...prevCards, newCard]);
      setNewCardQuestion('');
      setNewCardAnswer('');
      setShowAddForm(false);
      showToast('Flashcard added successfully!', 'success');
    } catch (error) {
      showToast('Error adding flashcard', 'error');
    }
  };

  const handleDeleteCard = (id: number) => {
    try {
      // Delete card using the function from cards.ts
      deleteCard(id);
      
      // Update the UI state
      setUserFlashcards(prevCards => prevCards.filter(card => card.id !== id));
      showToast('Flashcard deleted', 'info');
    } catch (error) {
      showToast('Error deleting flashcard', 'error');
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  const handleResetProgress = () => {
    // This is just a placeholder - the actual implementation is in the Home component
  };

  // If not logged in, show only loading state until redirection happens
  if (!isLoggedIn) {
    return (
      <BackgroundBeamsWithCollision>
        <Navbar onResetProgress={handleResetProgress} />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl text-white font-medium"
          >
            Redirecting...
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

  // Get theme-specific styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          cardBg: 'bg-gray-800',
          cardBorder: 'border-gray-700',
          text: 'text-white',
          formBg: 'bg-gray-800',
        };
      case 'vibrant':
        return {
          cardBg: 'bg-purple-600',
          cardBorder: 'border-purple-500',
          text: 'text-white',
          formBg: 'bg-indigo-600',
        };
      case 'default':
      default:
        return {
          cardBg: 'bg-white',
          cardBorder: 'border-gray-200',
          text: 'text-gray-800',
          formBg: 'bg-blue-50',
        };
    }
  };

  // Get font size class based on setting
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return { heading: 'text-2xl', text: 'text-sm' };
      case 'large':
        return { heading: 'text-4xl', text: 'text-lg' };
      case 'medium':
      default:
        return { heading: 'text-3xl', text: 'text-base' };
    }
  };

  const themeStyles = getThemeStyles();
  const fontSizes = getFontSizeClass();

  // Loading state
  if (isLoading) {
    return (
      <BackgroundBeamsWithCollision>
        <Navbar onResetProgress={handleResetProgress} />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl text-white font-medium"
          >
            Loading flashcards...
          </motion.div>
        </div>
      </BackgroundBeamsWithCollision>
    );
  }

  return (
    <BackgroundBeamsWithCollision>
      <Navbar onResetProgress={handleResetProgress} />
      <div className="min-h-screen w-full pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className={cn("font-bold mb-3 text-white", fontSizes.heading)}>
              My Flashcards
            </h1>
            <p className={cn("text-gray-300 max-w-lg", fontSizes.text)}>
              Manage your flashcards collection. Add new ones or remove cards you no longer need.
            </p>
            <Link href="/" className="mt-4 text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Study
            </Link>
          </div>

          {/* Add Card Button */}
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg flex items-center justify-center mx-auto ${fontSizes.text}`}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            {showAddForm ? 'Cancel' : 'Add New Flashcard'}
          </motion.button>

          {/* Add Card Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-10"
              >
                <form 
                  onSubmit={handleAddCard}
                  className={cn("p-6 rounded-lg shadow-lg border border-opacity-20 mx-auto max-w-2xl", 
                    themeStyles.formBg, themeStyles.cardBorder)}
                >
                  <h2 className={cn("font-semibold mb-4", themeStyles.text, fontSizes.text)}>Create New Flashcard</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="question" className={cn("block mb-2", themeStyles.text, fontSizes.text)}>Question</label>
                    <textarea
                      id="question"
                      value={newCardQuestion}
                      onChange={(e) => setNewCardQuestion(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                      rows={3}
                      placeholder="Enter your question here"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="answer" className={cn("block mb-2", themeStyles.text, fontSizes.text)}>Answer</label>
                    <textarea
                      id="answer"
                      value={newCardAnswer}
                      onChange={(e) => setNewCardAnswer(e.target.value)}
                      className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                      rows={3}
                      placeholder="Enter the answer here"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Card
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flashcards List */}
          {userFlashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userFlashcards.map((card) => (
                <motion.div
                  key={card.id}
                  className={cn("p-5 rounded-lg shadow-md border relative", 
                    themeStyles.cardBg, themeStyles.cardBorder)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  layout
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={cn("font-semibold pr-8", themeStyles.text, fontSizes.text)}>
                      Question:
                    </h3>
                    <motion.button 
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-red-500 hover:text-red-700"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                  <p className={cn("mb-4", themeStyles.text, fontSizes.text)}>
                    {card.question}
                  </p>
                  <div>
                    <h3 className={cn("font-semibold mb-1", themeStyles.text, fontSizes.text)}>
                      Answer:
                    </h3>
                    <p className={cn(themeStyles.text, fontSizes.text)}>
                      {card.answer}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={cn("text-center py-10", themeStyles.text, fontSizes.text)}>
              <p>You don't have any flashcards yet. Start by adding your first card!</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={handleToastClose}
      />
    </BackgroundBeamsWithCollision>
  );
} 