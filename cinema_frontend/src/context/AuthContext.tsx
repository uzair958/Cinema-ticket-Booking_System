import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterRequest } from '../types';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decode JWT token to extract user information
 * JWT format: header.payload.signature
 * Payload is base64 encoded JSON
 */
const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format');
      return null;
    }

    const payload = parts[1];
    // Add padding if needed
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const token = await authService.login(email, password);
      localStorage.setItem('authToken', token);
      setToken(token);
      setIsAuthenticated(true);

      // Decode JWT to get user info
      const decodedToken = decodeJWT(token);

      if (!decodedToken) {
        throw new Error('Failed to decode authentication token');
      }

      // Create user object with decoded info from JWT
      const userInfo: User = {
        id: decodedToken.userId, // Extract userId from JWT
        email: decodedToken.sub || email, // Subject is the email
        password: '',
        name: email.split('@')[0],
        role: decodedToken.role === 'ADMIN' ? 'ADMIN' : 'USER',
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);

      console.log('✅ Login successful. User ID:', userInfo.id, 'Email:', userInfo.email, 'Role:', userInfo.role);
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Clear any partial auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const registeredUser = await authService.register(userData);

      // Store user info (without token, user needs to login)
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);

      console.log('✅ Registration successful. User:', registeredUser);
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

