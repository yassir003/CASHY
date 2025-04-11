import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api'; // Import the separate API instance

// Updated User type to match API response
type User = {
  _id: string;
  username: string;
  email: string;
  __v?: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load auth data from storage', e);
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredData();
  }, []);

  const storeAuthData = (authToken: string, userData: User) => {
    try {
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to store auth data', e);
    }
  };

  const clearAuthData = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error('Failed to clear auth data', e);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/users/register', {
        username,
        email,
        password,
      });
      
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      storeAuthData(authToken, userData);
      
    } catch (err) {
      handleAuthError(err, 'Registration');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });
      
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      storeAuthData(authToken, userData);
      
    } catch (err) {
      handleAuthError(err, 'Login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      setToken(null);
      setUser(null);
      clearAuthData();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //update user profile
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put('/users/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the user state with the returned updated user data
      const updatedUser = response.data;
      setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : updatedUser);
      
      // Update stored user data
      if (user) {
        storeAuthData(token, { ...user, ...updatedUser });
      }
      
    } catch (err) {
      handleAuthError(err, 'Profile update');
    } finally {
      setIsLoading(false);
    }
  };

  //change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      await api.put('/users/change-password', 
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      
    } catch (err) {
      handleAuthError(err, 'Password change');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleAuthError = (err: unknown, context: string) => {
    if (axios.isAxiosError(err) && err.response) {
      setError(err.response.data.message || err.response.data.error || `${context} failed`);
    } else {
      setError(`An unexpected error occurred during ${context.toLowerCase()}`);
    }
    console.error(`${context} error:`, err);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        clearError,
      }}
    >
      {isInitialized ? children : null}
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