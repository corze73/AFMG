import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: { name?: string; profile_image_url?: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if API client is available
    if (!apiClient) {
      console.error('API client not initialized. Please check your environment variables.');
      setIsLoading(false);
      return;
    }

    // Check for existing session
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      if (!apiClient) return;
      
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading current user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!apiClient) {
        console.error('API client not available');
        return false;
      }

      const response = await apiClient.login(email, password);

      if (response.user) {
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const updateProfile = async (updates: { name?: string; profile_image_url?: string }): Promise<boolean> => {
    if (!apiClient || !user) return false;

    try {
      const updatedUser = await apiClient.updateProfile(updates);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const logout = async () => {
    if (!apiClient) return;
    
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};