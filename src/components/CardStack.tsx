"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from '@/contexts/ThemeContext';

let interval: any;

type Card = {
  id: number;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);
  const { theme } = useTheme();

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          bgGradient: 'from-gray-800 to-gray-900',
          border: 'border-gray-700',
          shadow: 'shadow-gray-900/20'
        };
      case 'vibrant':
        return {
          bgGradient: 'from-purple-500 to-pink-500',
          border: 'border-purple-600',
          shadow: 'shadow-purple-600/20'
        };
      case 'default':
      default:
        return {
          bgGradient: 'from-blue-500 to-teal-400',
          border: 'border-blue-500/30',
          shadow: 'shadow-blue-500/20'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-80 mx-auto">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={`absolute backdrop-blur-sm bg-white/10 h-60 w-60 md:h-60 md:w-80 rounded-2xl p-4 shadow-xl border ${colors.border} shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-center`}
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <div className="font-normal text-neutral-100 dark:text-neutral-200 text-center">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}; 