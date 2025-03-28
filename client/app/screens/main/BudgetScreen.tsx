import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone, Plus, Pencil, Trash2 } from 'lucide-react-native';
import AddEditCategoryDialog from '@/components/AddEditCategoryDialog';
import EditTotalBudgetDialog from '@/components/EditTotalBudgetDialog';
import { useBudget } from '@/contexts/BudgetContext';
import { Category, useCategories } from '@/contexts/CategoriesContext';

const BudgetScreen = () => {
  const { budget: contextBudget, checkBudget, setBudget } = useBudget();
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategories();
  
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isBudgetDialogVisible, setIsBudgetDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calculate total budget and spent
  const totalBudget = contextBudget?.amount || categories.reduce((sum, category) => sum + (category.budget || 0), 0);
  const totalSpent = categories.reduce((sum, category) => sum + (category.spent || 0), 0);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await checkBudget();
        await fetchCategories();
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
  const handleOpenDialog = (category: Category | null = null) => {
    if (category) {
      setEditingCategory({
        _id: category._id,
        name: category.name,
        budget: category.budget,
        spent: category.spent || 0,
        color: category.color,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
    }
    setIsDialogVisible(true);
  };

  // Submit category (add or update)
  const handleCategorySubmit = async (categoryData: Omit<Category, '_id' | 'userId'>) => {
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

  // Delete category
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
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
              width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` 
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
        {categories.length > 0 ? (
          categories.map((category) => (
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
                  <Pressable onPress={() => handleDelete(category._id)}>
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
                  width: `${category.budget > 0 ? ((category.spent || 0) / category.budget) * 100 : 0}%`, 
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