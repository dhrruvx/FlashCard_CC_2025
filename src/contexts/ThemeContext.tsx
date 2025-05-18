'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeType = 'default' | 'dark' | 'vibrant';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  flipSpeed: number;
  setFlipSpeed: (speed: number) => void;
  difficulty: string;
  setDifficulty: (level: string) => void;
  autoFlip: boolean;
  setAutoFlip: (auto: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  flipSpeed: 600,
  setFlipSpeed: () => {},
  difficulty: 'medium',
  setDifficulty: () => {},
  autoFlip: true,
  setAutoFlip: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>('default');
  const [fontSize, setFontSize] = useState('medium');
  const [flipSpeed, setFlipSpeed] = useState(600);
  const [difficulty, setDifficulty] = useState('medium');
  const [autoFlip, setAutoFlip] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('flashcard-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme) setTheme(parsed.theme as ThemeType);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.flipSpeed) setFlipSpeed(parsed.flipSpeed);
        if (parsed.difficulty) setDifficulty(parsed.difficulty);
        if (parsed.autoFlip !== undefined) setAutoFlip(parsed.autoFlip);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
  }, []);

  // Apply theme classes to the body element
  useEffect(() => {
    // Always remove all theme classes first
    document.documentElement.classList.remove('theme-default', 'theme-dark', 'theme-vibrant');
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Store in localStorage alongside the other settings
    const currentSettings = {
      theme,
      fontSize,
      flipSpeed,
      difficulty,
      autoFlip,
    };
    localStorage.setItem('flashcard-settings', JSON.stringify(currentSettings));
    
    // Dispatch storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'));
  }, [theme, fontSize, flipSpeed, difficulty, autoFlip]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      fontSize, 
      setFontSize,
      flipSpeed,
      setFlipSpeed,
      difficulty,
      setDifficulty,
      autoFlip,
      setAutoFlip
    }}>
      {children}
    </ThemeContext.Provider>
  );
} 