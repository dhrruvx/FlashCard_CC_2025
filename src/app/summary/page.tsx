'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import { BackgroundBeamsWithCollision } from '@/components/BackgroundBeamsWithCollision';
import { FlashcardProgress } from '@/types/flashcard';
import cards from '@/data/cards';

export default function Summary() {
  const router = useRouter();
  const [progress, setProgress] = useState<FlashcardProgress | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcardProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleResetProgress = () => {
    try {
      // Save login state before resetting
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      // Clear only the flashcard data, not login state
      localStorage.removeItem('flashcardProgress');
      localStorage.removeItem('shuffledCards');
      
      // Restore login state
      if (isLoggedIn) localStorage.setItem('isLoggedIn', isLoggedIn);
      if (userName) localStorage.setItem('userName', userName);
      if (userEmail) localStorage.setItem('userEmail', userEmail);
      
      // Navigate to the homepage with a reset parameter but maintain login state
      router.push('/?reset=' + Date.now());
    } catch (error) {
      console.error("Error resetting:", error);
      alert("Error resetting: " + error);
    }
  };

  if (!progress) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <BackgroundBeamsWithCollision>
      {/* Navbar */}
      <Navbar onResetProgress={handleResetProgress} />
      
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl mx-auto pt-20" // Reduced padding
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8 text-white"
          >
            Flashcard Results
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                variants={itemVariants}
                className="text-center p-5 rounded-xl bg-green-500/20 border border-green-500/30"
              >
                <h2 className="text-2xl font-semibold text-green-400 mb-1">
                  {progress.known.length}
                </h2>
                <p className="text-gray-300 text-sm">Cards Known</p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="text-center p-5 rounded-xl bg-red-500/20 border border-red-500/30"
              >
                <h2 className="text-2xl font-semibold text-red-400 mb-1">
                  {progress.unknown.length}
                </h2>
                <p className="text-gray-300 text-sm">Cards to Review</p>
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 mb-4 text-base">
                You've completed {cards.length} flashcards!
              </p>
              
              {/* Direct button with high z-index to ensure it's clickable */}
              <button
                onClick={handleResetProgress}
                className="relative z-50 px-6 py-2 text-base bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer shadow-lg"
              >
                Start Over with Shuffled Cards
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
} 