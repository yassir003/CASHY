import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone, Plus, Pencil, Trash2, Wallet } from 'lucide-react-native';
import AddEditCategoryDialog from '@/components/AddEditCategoryDialog';
import EditTotalBudgetDialog from '@/components/EditTotalBudgetDialog';

interface Category {
  id: number;
  name: string;
  budget: number;
  spent: number;
  color: string;
  icon: string;
}

const BudgetScreen = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Housing", budget: 1500, spent: 1200, color: "#3b82f6", icon: "Home" },
    { id: 2, name: "Food & Dining", budget: 600, spent: 450, color: "#10b981", icon: "Utensils" },
    { id: 3, name: "Transportation", budget: 400, spent: 380, color: "#8b5cf6", icon: "Car" },
    { id: 4, name: "Entertainment", budget: 300, spent: 150, color: "#f97316", icon: "Film" },
  ]);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isBudgetDialogVisible, setIsBudgetDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [totalBudgetValue, setTotalBudgetValue] = useState(2800);

  const totalBudget = totalBudgetValue || categories.reduce((sum, category) => sum + category.budget, 0);
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);

  const handleUpdateTotalBudget = (newTotal: number) => {
    const ratio = newTotal / totalBudget;
    const updatedCategories = categories.map((category) => ({
      ...category,
      budget: Math.round(category.budget * ratio),
    }));
    setCategories(updatedCategories);
    setTotalBudgetValue(newTotal);
    setIsBudgetDialogVisible(false);
  };

  const handleOpenDialog = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsDialogVisible(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
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
          <Text style={styles.totalBudgetAmount}>${totalBudget.toLocaleString()}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.cardText}>Spent: ${totalSpent.toLocaleString()}</Text>
            <Text style={styles.cardText}>Remaining: ${(totalBudget - totalSpent).toLocaleString()}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(totalSpent / totalBudget) * 100}%` }]} />
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
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                {category.icon === "Home" && <Home color={category.color} size={20} />}
                {category.icon === "Utensils" && <Utensils color={category.color} size={20} />}
                {category.icon === "Car" && <Car color={category.color} size={20} />}
                {category.icon === "Film" && <Film color={category.color} size={20} />}
                {category.icon === "Music" && <Music color={category.color} size={20} />}
                {category.icon === "ShoppingBag" && <ShoppingBag color={category.color} size={20} />}
                {category.icon === "Briefcase" && <Briefcase color={category.color} size={20} />}
                {category.icon === "Plane" && <Plane color={category.color} size={20} />}
                {category.icon === "Heart" && <Heart color={category.color} size={20} />}
                {category.icon === "Smartphone" && <Smartphone color={category.color} size={20} />}
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.categoryActions}>
                <Pressable onPress={() => handleOpenDialog(category)}>
                  <Pencil color="#64748b" size={18} />
                </Pressable>
                <Pressable onPress={() => handleDelete(category.id)}>
                  <Trash2 color="#ef4444" size={18} />
                </Pressable>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>${category.spent.toLocaleString()} spent</Text>
              <Text style={styles.progressText}>${category.budget.toLocaleString()} budget</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { 
                width: `${(category.spent / category.budget) * 100}%`, 
                backgroundColor: category.color 
              }]} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dialogs */}
      <AddEditCategoryDialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        category={editingCategory || undefined}
        onSubmit={(category) => {
          if (editingCategory) {
            setCategories(categories.map((cat) => 
              cat.id === editingCategory.id ? { ...category, id: editingCategory.id } : cat
            ));
          } else {
            setCategories([...categories, { ...category, id: Date.now() }]);
          }
          setIsDialogVisible(false);
        }}
      />

      <EditTotalBudgetDialog
        visible={isBudgetDialogVisible}
        onDismiss={() => setIsBudgetDialogVisible(false)}
        totalBudget={totalBudgetValue}
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
});

export default BudgetScreen;