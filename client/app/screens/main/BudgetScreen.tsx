import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone, Plus, Pencil, Trash2 } from 'lucide-react-native';
import AddEditCategoryDialog from '@/components/AddEditCategoryDialog';
import EditTotalBudgetDialog from '@/components/EditTotalBudgetDialog';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useBudget } from '@/contexts/BudgetContext';
import { Category, useCategories } from '@/contexts/CategoriesContext';
import { useTransactions } from '@/contexts/TransactionContext';

// Define a new interface that extends Category but makes spent optional
// This will be our internal representation with calculated spent
interface CategoryWithSpent extends Omit<Category, 'spent'> {
  spent?: number;
}

const BudgetScreen = () => {
  const { budget: contextBudget, checkBudget, setBudget } = useBudget();
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategories();
  const { transactions, fetchTransactions, deleteTransactionsByCategory } = useTransactions();
  
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isBudgetDialogVisible, setIsBudgetDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithSpent | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryWithSpent> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categoriesWithSpent, setCategoriesWithSpent] = useState<CategoryWithSpent[]>([]);

  // Calculate total budget and spent
  const totalBudget = contextBudget?.amount || categoriesWithSpent.reduce((sum, category) => sum + (category.budget || 0), 0);
  const totalSpent = categoriesWithSpent.reduce((sum, category) => sum + (category.spent || 0), 0);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await checkBudget();
        await fetchCategories();
        await fetchTransactions();
        setFetchError(null);
      } catch (error: any) {
        if (error.response?.status === 404 && error.response.data.message === "No categories found") {
          setFetchError("No categories found");
        } else {
          setFetchError("Failed to load categories. Please try again later.");
        }
      }
    };
    loadData();
  }, []);

  // Calculate spent amount for each category when transactions or categories change
  useEffect(() => {
    if (categories.length > 0) {
      // Create a map to sum up expenses by category
      const categorySpentMap: Record<string, number> = {};
      
      // Process only expense transactions
      transactions
        .filter(transaction => transaction.type === 'expense')
        .forEach(transaction => {
          const categoryId = transaction.category;
          const amount = parseFloat(transaction.amount);
          
          if (!isNaN(amount) && categoryId) {
            if (categoryId in categorySpentMap) {
              categorySpentMap[categoryId] += amount;
            } else {
              categorySpentMap[categoryId] = amount;
            }
          }
        });
      
      // Update each category with its spent amount
      const updatedCategories = categories.map(category => ({
        ...category,
        spent: categorySpentMap[category._id] || 0
      }));
      
      setCategoriesWithSpent(updatedCategories);
    } else {
      setCategoriesWithSpent([]);
    }
  }, [categories, transactions]);

  // Update total budget
  const handleUpdateTotalBudget = async (newTotal: number) => {
    try {
      await setBudget(newTotal);
      setIsBudgetDialogVisible(false);
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  // Prepare category for editing or adding
  const handleOpenDialog = (category: CategoryWithSpent | null = null) => {
    if (category) {
      // Omit the spent field as it's calculated, not editable
      const { spent, ...categoryWithoutSpent } = category;
      setEditingCategory(categoryWithoutSpent);
    } else {
      setEditingCategory(null);
    }
    setIsDialogVisible(true);
  };

  // Submit category (add or update)
  const handleCategorySubmit = async (categoryData: Omit<Category, '_id' | 'userId' | 'spent'>) => {
    try {
      if (editingCategory && editingCategory._id) {
        await updateCategory(editingCategory._id, categoryData);
      } else {
        await addCategory(categoryData);
      }
      setIsDialogVisible(false);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (category: CategoryWithSpent) => {
    setCategoryToDelete(category);
    setIsDeleteDialogVisible(true);
  };

  // Handle actual deletion
  const handleConfirmDelete = async () => {
    if (categoryToDelete && categoryToDelete._id) {
      try {
        // First delete all associated transactions
        await deleteTransactionsByCategory(categoryToDelete._id);
        // Then delete the category itself
        await deleteCategory(categoryToDelete._id);
        // Refresh both categories and transactions
        await fetchCategories();
        await fetchTransactions();
      } catch (error) {
        console.error('Error during deletion:', error);
      } finally {
        // Close dialog and clear category to delete
        setIsDeleteDialogVisible(false);
        setCategoryToDelete(null);
      }
    }
  };

  // Render category icon
  const renderCategoryIcon = (icon: string, color: string) => {
    const iconComponents = {
      Home: <Home color={color} size={20} />,
      Utensils: <Utensils color={color} size={20} />,
      Car: <Car color={color} size={20} />,
      Film: <Film color={color} size={20} />,
      Music: <Music color={color} size={20} />,
      ShoppingBag: <ShoppingBag color={color} size={20} />,
      Briefcase: <Briefcase color={color} size={20} />,
      Plane: <Plane color={color} size={20} />,
      Heart: <Heart color={color} size={20} />,
      Smartphone: <Smartphone color={color} size={20} />
    };

    return iconComponents[icon as keyof typeof iconComponents] || <Home color={color} size={20} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Total Budget Card */}
        <View style={styles.totalBudgetCard}>
          <View style={styles.totalBudgetHeader}>
            <Text style={styles.totalBudgetLabel}>Total Budget</Text>
            <View style={styles.totalBudgetActions}>
              <Pressable onPress={() => setIsBudgetDialogVisible(true)}>
                <Pencil color="#e0f2fe" size={18} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.totalBudgetAmount}>
            ${(totalBudget.toLocaleString())}
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.cardText}>Spent: ${(totalSpent || 0).toLocaleString()}</Text>
            <Text style={styles.cardText}>Remaining: ${((totalBudget - totalSpent) || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { 
              width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` 
            }]} />
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Budget Categories</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => handleOpenDialog()}
          >
            <Plus color="#fff" size={18} />
            <Text style={styles.addButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        {categoriesWithSpent.length > 0 ? (
          categoriesWithSpent.map((category) => (
            <View key={category._id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                  {renderCategoryIcon(category.icon, category.color)}
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryActions}>
                  <Pressable onPress={() => handleOpenDialog(category)}>
                    <Pencil color="#64748b" size={18} />
                  </Pressable>
                  <Pressable onPress={() => handleOpenDeleteDialog(category)}>
                    <Trash2 color="#ef4444" size={18} />
                  </Pressable>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  ${((category.spent || 0).toLocaleString())} spent
                </Text>
                <Text style={styles.progressText}>
                  ${((category.budget || 0).toLocaleString())} budget
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { 
                  width: `${category.budget > 0 ? Math.min(((category.spent || 0) / category.budget) * 100, 100) : 0}%`, 
                  backgroundColor: category.color 
                }]} />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noCategoriesText}>
            {fetchError || "No categories created yet"}
          </Text>
        )}
      </ScrollView>

      {/* Dialogs */}
      <AddEditCategoryDialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        category={editingCategory}
        onSubmit={handleCategorySubmit}
      />

      <EditTotalBudgetDialog
        visible={isBudgetDialogVisible}
        onDismiss={() => setIsBudgetDialogVisible(false)}
        totalBudget={contextBudget?.amount || totalBudget}
        onSubmit={handleUpdateTotalBudget}
      />

      {categoryToDelete && (
        <DeleteConfirmationDialog 
          visible={isDeleteDialogVisible}
          onDismiss={() => {
            setIsDeleteDialogVisible(false);
            setCategoryToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          categoryName={categoryToDelete.name}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
  },
  totalBudgetCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  totalBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalBudgetLabel: {
    fontSize: 14,
    color: '#e0f2fe',
  },
  totalBudgetAmount: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 8,
    color: '#fff',
  },
  totalBudgetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  cardText: {
    fontSize: 12,
    color: '#e0f2fe',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#bfdbfe',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryCard: {
    marginBottom: 4,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
  },
  noCategoriesText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 16,
  },
});

export default BudgetScreen;