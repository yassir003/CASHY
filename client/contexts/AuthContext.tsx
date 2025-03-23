import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('auth_token'),
          AsyncStorage.getItem('user'),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Failed to load auth data from storage', e);
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const storeAuthData = async (authToken: string, userData: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('auth_token', authToken),
        AsyncStorage.setItem('user', JSON.stringify(userData)),
      ]);
    } catch (e) {
      console.error('Failed to store auth data', e);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('auth_token'),
        AsyncStorage.removeItem('user'),
      ]);
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
      await storeAuthData(authToken, userData);
      
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
      await storeAuthData(authToken, userData);
      
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
      await clearAuthData();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleAuthError = (err: unknown, context: string) => {
    if (axios.isAxiosError(err) && err.response) {
      setError(err.response.data.message || `${context} failed`);
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

export { api };