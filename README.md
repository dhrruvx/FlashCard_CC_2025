# Flashcard Learning Application

## Live Demo

**[View the Live Application Here](https://flash-card-cc-2025.vercel.app/)**

## Overview

An interactive and engaging flashcard application for effective learning and memorization. The application features a modern UI with smooth animations, 3D card flipping effects, customizable settings, and progress tracking.

## Technologies & Techniques Used

### Core Stack
- **Next.js 15.3.2** - React framework with server-side rendering capabilities
- **TypeScript** - Strong typing for improved developer experience and code quality
- **React 18** - Component-based UI library with hooks for state management

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Framer Motion** - Advanced animation library for fluid transitions and micro-interactions
- **CSS3 Custom Properties** - For theming and dynamic styling
- **3D CSS Transforms** - For card flipping effect using perspective and backface-visibility
- **Gradient Backgrounds** - Custom gradients for visual appeal
- **CSS Grid & Flexbox** - For advanced responsive layouts

### State Management & Data Handling
- **React Context API** - For global theme and auth state management
- **localStorage API** - For persistent storage of user progress and settings
- **Custom Hooks** - For reusable logic like useTheme and useAuth
- **TypeScript Interfaces** - For strong typing of data structures

### Performance Optimizations
- **Dynamic Imports** - For code splitting and improved load times
- **React.memo** - For preventing unnecessary re-renders
- **useCallback & useMemo** - For memoization of functions and computed values
- **CSS Transitions** - For hardware-accelerated animations
- **useRef** - For accessing DOM elements directly without re-renders
- **Optimized Event Handlers** - With proper cleanup to prevent memory leaks

### Animations & Visual Effects
- **Framer Motion Variants** - For coordinated animation sequences
- **Staggered Animations** - For sequential element reveals
- **3D Tilt Effects** - Interactive card tilt based on mouse position
- **Dynamic Shadows** - Shadows that adjust with interaction
- **AnimatePresence** - For exit animations when components unmount
- **Intersection Observer API** - For triggering animations on scroll
- **Background Beams with Collision** - Custom visual effect with animated light beams

### UI Components
- **Custom Button Components** - With hover and tap animations
- **Progress Bar** - Visual indicator of learning progress
- **Card Stack Component** - For visual depth and context
- **Toast Notifications** - For user feedback
- **Modal System** - For settings and confirmations
- **Navbar** - With responsive design and dropdown menus

### Accessibility Features
- **Semantic HTML** - For screen reader compatibility
- **ARIA Attributes** - For enhanced accessibility
- **Focus Management** - For keyboard navigation
- **Color Contrast Compliance** - For readability
- **Responsive Typography** - For better reading experience across devices

### Developer Tools & Code Quality
- **ESLint** - For code quality and consistency
- **Custom ESLint Configuration** - Tailored rules for the project
- **React Hooks Rules** - Enforced proper hooks usage patterns
- **Import Organization** - Structured imports for better maintainability
- **Component Composition** - For reusable and maintainable UI elements

## Key Features

1. **Interactive Flashcards**
   - 3D flip animation with realistic physics
   - Interactive tilt effect following mouse movement
   - Smooth transitions between cards

2. **Multiple Learning Modes**
   - Review cards you don't know
   - Track progress of known vs. unknown cards
   - Shuffle functionality for randomized learning

3. **Customizable Experience**
   - Multiple theme options (Default, Dark, Vibrant)
   - Adjustable font sizes
   - Configurable card flip speed
   - Difficulty settings

4. **Progress Tracking**
   - Visual progress bar
   - Summary screen with performance metrics
   - Persistent progress across sessions

5. **User Authentication**
   - User profiles with localStorage persistence
   - Custom flashcards creation
   - User settings persistence

6. **Responsive Design**
   - Mobile-friendly interface
   - Adaptive layouts for all screen sizes
   - Touch-optimized interactions

7. **Visual Feedback**
   - Toast notifications for user actions
   - Animated UI responses to interactions
   - Loading states and transitions

## Architecture

The application follows a component-based architecture with separation of concerns:

- **Components/** - Reusable UI elements
- **Contexts/** - Global state management
- **Types/** - TypeScript type definitions
- **Data/** - Data management and storage logic
- **Lib/** - Utility functions

## Performance Considerations

- Optimized render cycles with proper dependency arrays in useEffect
- Memoized expensive calculations
- CSS transitions for hardware acceleration
- Local state for UI-specific logic
- Context API for global state to prevent prop drilling

## Accessibility

- Semantic HTML structure
- ARIA roles and attributes
- Keyboard navigation support
- Screen reader friendly content
- Sufficient color contrast

## Future Enhancements

- Backend integration for cloud storage
- Spaced repetition algorithm
- Social sharing features
- More advanced statistics and analytics
- Export/import functionality

## Getting Started

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT
