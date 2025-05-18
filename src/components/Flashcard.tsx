'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/types/flashcard';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { CardStack } from './CardStack';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (known: boolean) => void;
}

export default function Flashcard({ card, onAnswer }: FlashcardProps) {
  const { 
    theme, 
    fontSize, 
    flipSpeed, 
    difficulty,
    autoFlip 
  } = useTheme();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInteractionDisabled, setIsInteractionDisabled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frontCardControls = useAnimationControls();
  const backCardControls = useAnimationControls();

  // Create stack cards for visual effect
  const stackCards = [
    { id: 1, content: <div className="opacity-30 text-sm">Study Cards</div> },
    { id: 2, content: <div className="opacity-40 text-sm">More Questions</div> },
    { id: 3, content: <div className="opacity-50 text-sm">Keep Learning</div> },
  ];

  if (!card || !card.question || !card.answer) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-red-50 rounded-xl">
        <p className="text-red-600 text-center">Invalid flashcard data</p>
      </div>
    );
  }

  // Get theme-specific styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          frontBg: 'bg-gray-800',
          frontShadow: 'shadow-[0_0_25px_rgba(55,65,81,0.5)]',
          backBg: 'bg-gradient-to-br from-gray-700 to-gray-900',
          backShadow: 'shadow-[0_0_25px_rgba(31,41,55,0.5)]',
        };
      case 'vibrant':
        return {
          frontBg: 'bg-purple-500',
          frontShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
          backBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
          backShadow: 'shadow-[0_0_25px_rgba(219,39,119,0.5)]',
        };
      case 'default':
      default:
        return {
          frontBg: 'bg-[#00ccb1]',
          frontShadow: 'shadow-[0_0_25px_rgba(0,204,177,0.5)]',
          backBg: 'bg-gradient-to-br from-blue-500 to-violet-500',
          backShadow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
        };
    }
  };

  // Get font size class based on setting
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-xl';
      case 'large':
        return 'text-3xl';
      case 'medium':
      default:
        return 'text-2xl';
    }
  };

  // Apply difficulty level
  const getDifficultyClass = () => {
    // Adjust transition speed based on difficulty
    let transitionSpeed = flipSpeed;
    if (difficulty === 'easy') {
      transitionSpeed = Math.max(flipSpeed, 800); // Slower transitions for easier difficulty
    } else if (difficulty === 'hard') {
      transitionSpeed = Math.min(flipSpeed, 400); // Faster transitions for harder difficulty
    }
    return transitionSpeed;
  };

  // Function to safely handle animations and state updates
  const safelySetAnimating = (animating: boolean) => {
    setIsAnimating(animating);
    setIsInteractionDisabled(animating);
    
    // Clean up any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    if (animating) {
      // Set a timeout to force the animation state to complete if something goes wrong
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setIsInteractionDisabled(false);
      }, transitionSpeed + 100); // Add extra buffer
    }
  };

  // Mouse move handler for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-1 to 1 range)
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    
    setMousePosition({ x, y });
  };
  
  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Function for "Know" button - go directly to next card
  const handleKnow = () => {
    if (isAutoFlipping) return;
    onAnswer(true);
    setIsFlipped(false);
  };

  // Function for "Don't Know" button - flip the card to show answer
  const handleDontKnow = () => {
    if (isAutoFlipping) return;
    
    if (!isFlipped) {
      // If card isn't flipped yet, flip it to show answer
      setIsFlipped(true);
      
      if (autoFlip) {
        // If auto-flip is enabled, automatically move to next card after 2 seconds
        setIsAutoFlipping(true);
        timerRef.current = setTimeout(() => {
          onAnswer(false);
          setIsFlipped(false);
          setIsAutoFlipping(false);
        }, 2000);
      }
    } else {
      // If the card is already flipped, proceed to the next card
      onAnswer(false);
      setIsFlipped(false);
    }
  };

  // Function to trigger wobble animation - only when card is stable
  const triggerWobble = () => {
    if (isInteractionDisabled || isAutoFlipping) return;
    
    const controls = isFlipped ? backCardControls : frontCardControls;
    controls.start({
      rotateZ: [0, -2, 3, -3, 2, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  };

  // Clean up all timers if component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const themeStyles = getThemeStyles();
  const transitionSpeed = getDifficultyClass();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="w-full h-[350px] flex items-center justify-center relative">
        {/* Card Stack in background */}
        <div className="absolute -bottom-8 -right-12 scale-75 opacity-80 transform rotate-6">
          <CardStack items={stackCards} offset={5} scaleFactor={0.04} />
        </div>
        
        {/* Card Stack in background - left side */}
        <div className="absolute -bottom-4 -left-12 scale-75 opacity-80 transform -rotate-6">
          <CardStack 
            items={[
              { id: 4, content: <div className="opacity-40 text-sm">Flashcards</div> },
              { id: 5, content: <div className="opacity-50 text-sm">Learning</div> },
            ]} 
            offset={5} 
            scaleFactor={0.04} 
          />
        </div>
        
        {/* Glow effect */}
        <div className={cn("absolute inset-0 -top-4 rounded-3xl opacity-20 blur-xl", 
          theme === 'dark' ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
          theme === 'vibrant' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
          'bg-gradient-to-r from-teal-500 to-emerald-400')} />
        
        <div 
          ref={cardRef}
          className="relative w-full h-full perspective-1000 z-10"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Card container with 3D flip */}
          <div 
            className="relative w-full h-full preserve-3d cursor-default"
            style={{
              transform: isFlipped 
                ? 'rotateY(180deg)' 
                : `rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg)`,
              transition: isFlipped 
                ? `transform ${transitionSpeed}ms ease-in-out` 
                : isHovered 
                  ? 'transform 0.1s ease-out' 
                  : 'transform 0.5s ease-out',
            }}
          >
            {/* FRONT CARD (Question) */}
            <motion.div 
              animate={frontCardControls}
              className={cn("absolute inset-0 w-full h-full rounded-2xl backface-hidden", themeStyles.frontShadow)}
              style={{
                transform: isHovered && !isInteractionDisabled ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Solid background */}
              <div className={cn("absolute inset-0 rounded-2xl", themeStyles.frontBg)}></div>
              
              {/* Question text */}
              <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                <span className={`${getFontSizeClass()} font-medium text-center text-white w-full px-8 drop-shadow-md`}>
                  {card.question}
                </span>
              </div>
            </motion.div>

            {/* BACK CARD (Answer) */}
            <motion.div 
              animate={backCardControls}
              className={cn("absolute inset-0 w-full h-full rounded-2xl backface-hidden", themeStyles.backShadow)}
              style={{
                transform: 'rotateY(180deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              {/* Solid background */}
              <div className={cn(
                "absolute inset-0 rounded-2xl", 
                themeStyles.backBg,
                isHovered && !isInteractionDisabled ? "scale-105" : "scale-100"
              )} 
              style={{ transition: 'transform 0.3s ease' }}></div>
              
              {/* Answer text */}
              <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white mb-2 opacity-80">Answer:</h3>
                  <p className={`${getFontSizeClass()} font-bold text-white drop-shadow-lg`}>
                    {card.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <motion.button
          onClick={handleDontKnow}
          disabled={isAutoFlipping}
          className={cn(
            "px-8 py-3 text-white rounded-xl transition-colors shadow-lg",
            isFlipped ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600",
            isAutoFlipping ? "opacity-70 cursor-not-allowed" : ""
          )}
          whileHover={{ scale: isAutoFlipping ? 1 : 1.05, boxShadow: isAutoFlipping ? "none" : "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
          whileTap={{ scale: isAutoFlipping ? 1 : 0.95 }}
        >
          {isFlipped ? "Next Card" : "Don't Know"}
        </motion.button>
        <motion.button
          onClick={handleKnow}
          disabled={isAutoFlipping}
          className={cn(
            "px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg",
            isAutoFlipping ? "opacity-70 cursor-not-allowed" : ""
          )}
          whileHover={{ scale: isAutoFlipping ? 1 : 1.05, boxShadow: isAutoFlipping ? "none" : "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: isAutoFlipping ? 1 : 0.95 }}
        >
          Know
        </motion.button>
      </div>
    </div>
  );
}

// Add this to ensure consistent backface visibility handling across browsers
const cssStyles = `
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = cssStyles;
  document.head.appendChild(style);
} 