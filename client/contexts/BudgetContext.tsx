import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface Budget {
  _id: string;
  amount: number;
  userId: string;
}

interface BudgetContextType {
  budget: Budget | null;
  shouldOpenBudgetModal: boolean;
  setBudget: (amount: number) => Promise<void>;
  checkBudget: () => Promise<void>;
  closeBudgetModal: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budget, setBudgetState] = useState<Budget | null>(null);
  const [shouldOpenBudgetModal, setShouldOpenBudgetModal] = useState(false);

  const getUserId = () => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    try {
      return JSON.parse(userString)?.id;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  };

  const checkBudget = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        setShouldOpenBudgetModal(true);
        return;
      }

      const response = await api.get(`/budgets/${userId}`);
      if (response.data?._id) {
        setBudgetState(response.data);
        setShouldOpenBudgetModal(false);
      } else {
        setShouldOpenBudgetModal(true);
        setBudgetState(null);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      setShouldOpenBudgetModal(true);
      setBudgetState(null);
    }
  };

  const setBudget = async (amount: number) => {
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User not found');
  
      if (budget?._id) {
        // Update existing budget
        await api.put(`/budgets/${budget._id}`, { amount });
        // Create updated budget object locally
        const updatedBudget = { ...budget, amount };
        setBudgetState(updatedBudget);
      } else {
        // Create new budget
        const response = await api.post('/budgets', { userId, amount });
        // Create new budget object from response and provided amount
        const newBudget = { 
          _id: response.data._id, 
          userId,
          amount 
        };
        setBudgetState(newBudget);
      }
  
      setShouldOpenBudgetModal(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error;
    }
  };

  const closeBudgetModal = () => {
    setShouldOpenBudgetModal(false);
  };

  return (
    <BudgetContext.Provider value={{ 
      budget,
      shouldOpenBudgetModal,
      setBudget,
      checkBudget,
      closeBudgetModal
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
};