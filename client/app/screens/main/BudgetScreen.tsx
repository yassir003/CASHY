import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone, Plus, Pencil, Trash2, Wallet } from 'lucide-react-native';
import AddEditCategoryDialog from '@/components/AddEditCategoryDialog';
import EditTotalBudgetDialog from '@/components/EditTotalBudgetDialog';

// Define the Category type (ensure `id` is required)
interface Category {
  id: number; // `id` is required
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
    <ScrollView style={styles.container}>
      <View style={styles.totalBudgetCard}>
        <View style={styles.totalBudgetHeader}>
          <Text style={styles.totalBudgetLabel}>Total Budget</Text>
          <View style={styles.totalBudgetActions}>
            <Pressable onPress={() => setIsBudgetDialogVisible(true)}>
              <Pencil color="#000" />
            </Pressable>
            <Wallet color="#000" />
          </View>
        </View>
        <Text style={styles.totalBudgetAmount}>${totalBudget.toLocaleString()}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Spent: ${totalSpent.toLocaleString()}</Text>
          <Text style={styles.progressText}>Remaining: ${(totalBudget - totalSpent).toLocaleString()}</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${(totalSpent / totalBudget) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesTitle}>Budget Categories</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenDialog()}>
          <Plus color="#fff" />
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      {categories.map((category) => (
        <View key={category.id} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryIcon}>
              {category.icon === "Home" && <Home color={category.color} />}
              {category.icon === "Utensils" && <Utensils color={category.color} />}
              {category.icon === "Car" && <Car color={category.color} />}
              {category.icon === "Film" && <Film color={category.color} />}
              {category.icon === "Music" && <Music color={category.color} />}
              {category.icon === "ShoppingBag" && <ShoppingBag color={category.color} />}
              {category.icon === "Briefcase" && <Briefcase color={category.color} />}
              {category.icon === "Plane" && <Plane color={category.color} />}
              {category.icon === "Heart" && <Heart color={category.color} />}
              {category.icon === "Smartphone" && <Smartphone color={category.color} />}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <View style={styles.categoryActions}>
              <Pressable onPress={() => handleOpenDialog(category)}>
                <Pencil color="#000" />
              </Pressable>
              <Pressable onPress={() => handleDelete(category.id)}>
                <Trash2 color="#000" />
              </Pressable>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>${category.spent.toLocaleString()} spent</Text>
            <Text style={styles.progressText}>${category.budget.toLocaleString()} budget</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(category.spent / category.budget) * 100}%`, backgroundColor: category.color }]} />
          </View>
        </View>
      ))}

      <AddEditCategoryDialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        category={editingCategory || undefined} // Pass `undefined` if `editingCategory` is `null`
        onSubmit={(category) => {
          if (editingCategory) {
            // Update existing category
            setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...category, id: editingCategory.id } : cat)));
          } else {
            // Add new category
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'#f5f6fa'
  },
  totalBudgetCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalBudgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalBudgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  totalBudgetActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
  categoryCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryActions: {
    flexDirection: 'row',
  },
});

export default BudgetScreen;