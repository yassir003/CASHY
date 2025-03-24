import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface BudgetContextType {
  budget: number | null;
  setBudget: (budget: number) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budget, setBudgetState] = useState<number | null>(null);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = await getAuthToken();
        const { data } = await axios.get('http://localhost:3000/api/budgets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBudgetState(data.budget);
      } catch (error) {
        console.error('Error fetching budget:', error);
        setBudgetState(null);
      }
    };
    fetchBudget();
  }, []);

  const setBudget = async (newBudget: number) => {
    try {
      const token = await getAuthToken();
      await axios.post(
        'http://localhost:3000/api/budgets',
        { amount: newBudget },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setBudgetState(newBudget);
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error;
    }
  };

  return (
    <BudgetContext.Provider value={{ budget, setBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

// Add this export at the bottom
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
};