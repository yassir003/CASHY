import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  budget: number;
  // spent: number;
  color: string;
  icon: string;
  userId: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, '_id' | 'userId'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) throw new Error('User not found');

      const response = await api.get(`/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, '_id' | 'userId'>) => {
    try {
      const userId = getUserId();
      if (!userId) throw new Error('User not found');

      const response = await api.post('/categories', {
        ...category,
        userId
      });
      setCategories(prev => [...prev, response.data]);
    } catch (err) {
      setError('Failed to add category');
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const response = await api.put(`/categories/${id}`, updates);
      setCategories(prev =>
        prev.map(cat => (cat._id === id ? { ...cat, ...response.data } : cat))
      );
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => { 
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        fetchCategories
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within CategoryProvider');
  return context;
};