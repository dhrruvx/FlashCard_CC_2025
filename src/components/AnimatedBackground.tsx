'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const { theme } = useTheme();
  const [bubbles, setBubbles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Create random bubbles
    const newBubbles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100, // random position from 0-100%
      y: Math.random() * 100,
      size: Math.random() * 150 + 50, // random size between 50-200px
      delay: Math.random() * 5, // random delay up to 5s
      duration: Math.random() * 15 + 15, // random duration between 15-30s
    }));
    setBubbles(newBubbles);
  }, []);

  // Get theme-specific colors
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          primary: 'rgba(75, 85, 99, 0.15)',
          secondary: 'rgba(55, 65, 81, 0.1)',
          accent: 'rgba(31, 41, 55, 0.08)'
        };
      case 'vibrant':
        return {
          primary: 'rgba(168, 85, 247, 0.1)',
          secondary: 'rgba(236, 72, 153, 0.08)',
          accent: 'rgba(139, 92, 246, 0.12)'
        };
      case 'default':
      default:
        return {
          primary: 'rgba(59, 130, 246, 0.1)',
          secondary: 'rgba(0, 204, 177, 0.08)',
          accent: 'rgba(125, 211, 252, 0.12)'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a23]">
      {/* Static gradient overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${colors.primary} 0%, transparent 70%), 
                      radial-gradient(circle at 80% 60%, ${colors.secondary} 0%, transparent 70%)`
        }}
      />
      
      {/* Animated floating bubbles */}
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl z-0 opacity-20"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
            background: index % 3 === 0 ? colors.primary : index % 3 === 1 ? colors.secondary : colors.accent,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, -Math.random() * 100 + 50, 0],
            y: [0, Math.random() * 100 - 50, -Math.random() * 100 + 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Core radial gradient that follows mouse */}
      <MouseFollowGradient colors={colors} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Component for mouse-following gradient
function MouseFollowGradient({ colors }: { colors: { primary: string; secondary: string; accent: string } }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-0 opacity-50"
      animate={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                    ${colors.accent} 0%, transparent 35%)`
      }}
      transition={{ duration: 0.5 }}
    />
  );
} 