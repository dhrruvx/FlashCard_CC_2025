'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SettingsModal from './SettingsModal';
import Toast from './Toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onResetProgress: () => void;
}

export default function Navbar({ onResetProgress }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const { theme } = useTheme();
  const { isLoggedIn, login, logout, userName, userEmail } = useAuth();

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      logout();
      setToast({
        show: true,
        message: 'Successfully logged out',
        type: 'success'
      });
    } else {
      login();
      setToast({
        show: true,
        message: 'Successfully logged in!',
        type: 'success'
      });
    }
    setIsProfileOpen(false);
  };

  const handleToastClose = () => {
    setToast({ ...toast, show: false });
  };

  // Get theme-specific gradient
  const getThemeGradient = () => {
    switch (theme) {
      case 'dark':
        return 'from-gray-800 to-gray-900';
      case 'vibrant':
        return 'from-purple-500 to-pink-500';
      case 'default':
      default:
        return 'from-teal-500 to-blue-500';
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${getThemeGradient()} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Home Link */}
            <Link href="/" className="flex items-center">
              <span className="text-white font-bold text-xl">FlashCards</span>
            </Link>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-4">
              {/* Reset Progress Button - Only show when logged in */}
              {isLoggedIn && (
                <motion.button
                  onClick={onResetProgress}
                  className="text-white bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg text-sm font-medium shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Start over with shuffled cards"
                >
                  Shuffle & Reset
                </motion.button>
              )}

              {/* Settings Icon */}
              <motion.button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>

              {/* Profile Avatar with Dropdown */}
              <div className="relative">
                <motion.div
                  className={`w-10 h-10 rounded-full ${isLoggedIn ? 'bg-green-400/20' : 'bg-white/10'} hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </motion.div>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <p className="font-medium">{isLoggedIn ? userName : 'Guest'}</p>
                          <p className="text-xs text-gray-500">{isLoggedIn ? userEmail : 'Not logged in'}</p>
                        </div>
                        
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={handleLoginToggle}
                        >
                          {isLoggedIn ? 'Logout' : 'Login'}
                        </a>
                        
                        {isLoggedIn && (
                          <Link
                            href="/my-flashcards"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            My Flashcards
                          </Link>
                        )}
                        
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => {
                            setIsSettingsOpen(true);
                            setIsProfileOpen(false);
                          }}
                        >
                          Account Settings
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </nav>

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={handleToastClose}
      />
    </>
  );
} 