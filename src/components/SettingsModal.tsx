'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeType = 'default' | 'dark' | 'vibrant';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
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
  } = useTheme();

  // Define local state to avoid direct context updates until save
  const [localTheme, setLocalTheme] = useState<ThemeType>(theme as ThemeType);
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localFlipSpeed, setLocalFlipSpeed] = useState(flipSpeed);
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);
  const [localAutoFlip, setLocalAutoFlip] = useState(autoFlip);

  // Update local state when context changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(theme as ThemeType);
      setLocalFontSize(fontSize);
      setLocalFlipSpeed(flipSpeed);
      setLocalDifficulty(difficulty);
      setLocalAutoFlip(autoFlip);
    }
  }, [isOpen, theme, fontSize, flipSpeed, difficulty, autoFlip]);

  const handleSave = () => {
    // Save all settings to context
    setTheme(localTheme);
    setFontSize(localFontSize);
    setFlipSpeed(localFlipSpeed);
    setDifficulty(localDifficulty);
    setAutoFlip(localAutoFlip);
    
    // Close the modal
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.25 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Theme Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'default', name: 'Default', color: 'from-teal-500 to-blue-500' },
                      { id: 'dark', name: 'Dark', color: 'from-gray-700 to-gray-900' },
                      { id: 'vibrant', name: 'Vibrant', color: 'from-purple-500 to-pink-500' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => setLocalTheme(themeOption.id as ThemeType)}
                        className={`py-2 px-3 rounded-lg capitalize transition-colors ${
                          localTheme === themeOption.id 
                            ? `bg-gradient-to-r ${themeOption.color} text-white` 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {themeOption.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Flip Speed Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Flip Speed (ms)
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="100"
                    value={localFlipSpeed}
                    onChange={(e) => setLocalFlipSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Fast</span>
                    <span className="text-sm font-medium text-gray-700">{localFlipSpeed}ms</span>
                    <span className="text-xs text-gray-500">Slow</span>
                  </div>
                </div>
                
                {/* Font Size Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setLocalFontSize(size)}
                        className={`py-2 px-4 rounded-lg capitalize transition-colors ${
                          localFontSize === size 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setLocalDifficulty(level)}
                        className={`py-2 px-4 rounded-lg capitalize transition-colors ${
                          localDifficulty === level 
                            ? level === 'easy' 
                              ? 'bg-green-500 text-white' 
                              : level === 'medium' 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Flip Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-flip for &quot;Don&apos;t Know&quot;
                  </label>
                  <div 
                    onClick={() => setLocalAutoFlip(!localAutoFlip)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localAutoFlip ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localAutoFlip ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <motion.button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Settings
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 