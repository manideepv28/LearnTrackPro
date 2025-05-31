import { useState, useEffect } from 'react';
import { User } from '@shared/schema';
import { LocalStorage, STORAGE_KEYS } from '@/lib/storage';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = LocalStorage.load<User>(STORAGE_KEYS.USER);
    if (savedUser) {
      setAuthState({
        user: savedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For demo purposes, simulate login validation
      if (email && password) {
        const user: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          password,
          joinDate: new Date().toISOString(),
          stats: {
            coursesCompleted: 0,
            totalHours: 0,
            streak: 0,
            certificates: 0,
          },
        };

        LocalStorage.save(STORAGE_KEYS.USER, user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        joinDate: new Date().toISOString(),
        stats: {
          coursesCompleted: 0,
          totalHours: 0,
          streak: 0,
          certificates: 0,
        },
      };

      LocalStorage.save(STORAGE_KEYS.USER, user);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    LocalStorage.remove(STORAGE_KEYS.USER);
    LocalStorage.remove(STORAGE_KEYS.ENROLLMENTS);
    LocalStorage.remove(STORAGE_KEYS.PROGRESS);
    LocalStorage.remove(STORAGE_KEYS.REMINDERS);
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      LocalStorage.save(STORAGE_KEYS.USER, updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };
}
