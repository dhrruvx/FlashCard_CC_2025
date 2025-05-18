'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  autoClose = true,
  duration = 3000,
}: ToastProps) {
  const { theme } = useTheme();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isVisible && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoClose, duration, onClose]);

  // Get type-specific styling
  const getTypeStyles = () => {
    const baseStyle = "rounded-lg shadow-lg px-4 py-3 flex items-center";
    
    switch (type) {
      case 'success':
        return theme === 'dark' 
          ? `${baseStyle} bg-green-700 text-white border-l-4 border-green-400`
          : `${baseStyle} bg-green-100 text-green-800 border-l-4 border-green-500`;
      case 'error':
        return theme === 'dark'
          ? `${baseStyle} bg-red-700 text-white border-l-4 border-red-400`
          : `${baseStyle} bg-red-100 text-red-800 border-l-4 border-red-500`;
      case 'info':
      default:
        return theme === 'dark'
          ? `${baseStyle} bg-blue-700 text-white border-l-4 border-blue-400`
          : `${baseStyle} bg-blue-100 text-blue-800 border-l-4 border-blue-500`;
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div className={getTypeStyles()}>
            {getIcon()}
            <p className="text-sm font-medium">{message}</p>
            <button 
              onClick={onClose}
              className="ml-auto pl-3"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 