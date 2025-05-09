import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../utils/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, rollNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }
      
      try {
        // Fetch current user data from API
        const userData = await authAPI.getCurrentUser();
        
        setState({
          user: userData.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Real API call to backend
      const response = await authAPI.login(email, password);
      const { user, token } = response;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, rollNumber: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Validate email domain
      if (!email.endsWith('@iitp.ac.in')) {
        throw new Error('Only IIT Patna email addresses are allowed');
      }
      
      // Real API call to backend
      const response = await authAPI.signup(name, email, rollNumber, password);
      const { user, token } = response;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Call logout API
      await authAPI.logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Even if the API call fails, we should still log out locally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};