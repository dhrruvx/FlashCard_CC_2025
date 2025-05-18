'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  userName: string;
  userEmail: string;
}

const defaultContext: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userName: '',
  userEmail: '',
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

  // Check localStorage for login state on initial load
  useEffect(() => {
    const storedLoginState = localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    
    if (storedLoginState === 'true') {
      setIsLoggedIn(true);
    }
    
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
    
    setAuthInitialized(true);
  }, []);

  // Prevent auth flickering by not rendering children until auth is initialized
  if (!authInitialized) {
    return null;
  }

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    // Don't remove user info on logout, just the login state
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        login, 
        logout, 
        userName, 
        userEmail 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 