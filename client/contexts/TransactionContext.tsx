import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '@/lib/api';

// Define the Transaction type with category details
export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  // Add these new fields to hold populated category data
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
}

// Define the context type
interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchfiveTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactionsByCategory: (categoryId: string) => Promise<void>;
}

// Create the context
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

// 1. Update fetchTransactions to properly map _id to id
const fetchTransactions = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.get('/expenses/this-month');
    
    // Transform the data to include category details
    const transactions = response.data.map(({ _id, categoryId, ...rest }: any) => ({
      id: _id,
      category: categoryId?._id || categoryId, // Use categoryId._id if populated, or categoryId if not
      categoryName: categoryId?.name || undefined,
      categoryColor: categoryId?.color || undefined,
      categoryIcon: categoryId?.icon || undefined,
      ...rest
    }));
    
    setTransactions(transactions);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Fetch failed');
  } finally {
    setLoading(false);
  }
};

const fetchfiveTransactions = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.get('/expenses/last-five-this-month');
    
    // Transform the data to include category details
    const transactions = response.data.map(({ _id, categoryId, ...rest }: any) => ({
      id: _id,
      category: categoryId?._id || categoryId, // Use categoryId._id if populated, or categoryId if not
      categoryName: categoryId?.name || undefined,
      categoryColor: categoryId?.color || undefined,
      categoryIcon: categoryId?.icon || undefined,
      ...rest
    }));
    
    setTransactions(transactions);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Fetch failed');
  } finally {
    setLoading(false);
  }
};

// Update the addTransaction function
const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  setLoading(true);
  setError(null);
  try {
    // Extract and send categoryId instead of category
    const { category, categoryName, categoryColor, categoryIcon, ...rest } = transaction;
    const payload = { ...rest, categoryId: category };
    
    await api.post('/expenses', payload);
    await fetchTransactions(); // Refresh the list
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to add transaction');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // 2. Update updateTransaction to handle categoryId and ensure valid ID
const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      // Validate ID exists
      if (!id) throw new Error('Invalid transaction ID');
      
      // Convert category to categoryId in payload
      const { category, ...rest } = transaction;
      const payload = { ...rest, categoryId: category };
  
      await api.put(`/expenses/${id}`, payload);
      await fetchTransactions(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/expenses/${id}`);
      await fetchTransactions(); // Refetch to ensure we have the latest data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransactionsByCategory = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/expenses/category/${categoryId}`);
      // Filter out deleted transactions from local state
      setTransactions(prev => prev.filter(t => t.category !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue: TransactionContextType = {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchfiveTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactionsByCategory
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};