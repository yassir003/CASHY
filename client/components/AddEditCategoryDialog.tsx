import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone } from 'lucide-react-native';

// Define the type for the category object
interface Category {
  _id?: string;
  name: string;
  budget: number;
  // spent: number;
  color: string;
  icon: string;
  userId?: string;
}

// Updated props interface with available budget and total budget
interface AddEditCategoryDialogProps {
  visible: boolean;
  onDismiss: () => void;
  category?: Partial<Category> | null;
  onSubmit: (categoryData: Omit<Category, '_id' | 'userId'>) => void;
  availableBudget: number;
  totalBudget: number;
}

const AddEditCategoryDialog: React.FC<AddEditCategoryDialogProps> = ({ 
  visible, 
  onDismiss, 
  category, 
  onSubmit,
  availableBudget,
  totalBudget
}) => {
  // Initialize state with default or provided values
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  // const [spent, setSpent] = useState('0');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('Home');
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<boolean>(false);
  const [zeroBudgetError, setZeroBudgetError] = useState<boolean>(false);

  // Calculate max budget allowed for this category
  const maxAllowedBudget = category?._id 
    ? (category.budget || 0) + availableBudget 
    : availableBudget;

  // Update state when category prop changes
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setBudget(category.budget ? category.budget.toString() : '');
      // setSpent(category.spent ? category.spent.toString() : '0');
      setColor(category.color || '#3b82f6');
      setIcon(category.icon || 'Home');
    } else {
      // Reset to default values when no category is provided
      setName('');
      setBudget('');
      // setSpent('0');
      setColor('#3b82f6');
      setIcon('Home');
    }
    setBudgetError(null);
    setNameError(false);
    setZeroBudgetError(false);
  }, [category, visible]);

  // Validate budget whenever it changes
  useEffect(() => {
    validateBudget(Number(budget));
    // Reset zero budget error when budget changes
    if (Number(budget) !== 0) {
      setZeroBudgetError(false);
    }
  }, [budget, availableBudget]);

  // Reset name error when name changes
  useEffect(() => {
    if (name.trim()) {
      setNameError(false);
    }
  }, [name]);

  const colorOptions = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#14b8a6'];

  // Budget validation function
  const validateBudget = (value: number) => {
    if (isNaN(value) || value < 0) {
      setBudgetError("Budget must be a positive number");
      return false;
    }
    
    if (value > maxAllowedBudget) {
      setBudgetError(`Budget exceeds available amount of $${maxAllowedBudget.toLocaleString()}`);
      return false;
    }
    
    setBudgetError(null);
    return true;
  };

  const handleSubmit = () => {
    // Reset errors
    let hasErrors = false;
    setNameError(false);
    setZeroBudgetError(false);
    
    // Validate inputs
    if (!name.trim()) {
      setNameError(true);
      hasErrors = true;
    }

    const budgetValue = Number(budget) || 0;
    
    // Check budget is valid
    if (!validateBudget(budgetValue)) {
      hasErrors = true;
    }
    
    // Check if budget is zero
    if (budgetValue === 0) {
      setZeroBudgetError(true);
      hasErrors = true;
    }

    if (hasErrors) {
      // Show error alert with appropriate message
      let errorMessage = "Please correct the following:";
      if (!name.trim()) errorMessage += "\n- Category name is required";
      if (budgetError) errorMessage += `\n- ${budgetError}`;
      if (budgetValue === 0) errorMessage += "\n- Budget amount cannot be zero";
      
      Alert.alert("Error", errorMessage);
      return;
    }

    onSubmit({
      name: name.trim(),
      budget: budgetValue,
      color,
      icon,
    });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{category ? 'Edit Category' : 'Add Category'}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                placeholder="e.g. Groceries"
                value={name}
                onChangeText={setName}
                style={[styles.input, nameError ? styles.inputError : null]}
              />
              {nameError && (
                <Text style={styles.errorText}>Category name is required</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget Amount ($)</Text>
              <TextInput
                placeholder="0.00"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={[
                  styles.input, 
                  (budgetError || zeroBudgetError) ? styles.inputError : null
                ]}
              />
              {budgetError && (
                <Text style={styles.errorText}>{budgetError}</Text>
              )}
              {zeroBudgetError && !budgetError && (
                <Text style={styles.errorText}>Budget amount cannot be zero</Text>
              )}
              <Text style={styles.helperText}>
                Available budget: ${availableBudget.toLocaleString()} / Total: ${totalBudget.toLocaleString()}
              </Text>
              {category?._id && (
                <Text style={styles.helperText}>
                  Current category budget: ${(category.budget || 0).toLocaleString()}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption}
                    onPress={() => setColor(colorOption)}
                    style={[styles.colorButton, { backgroundColor: colorOption }]}
                  >
                    {color === colorOption && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Icon</Text>
              <View style={styles.iconOptions}>
                {[
                  { name: 'Home', icon: <Home color={icon === 'Home' ? color : '#666'} size={24} /> },
                  { name: 'Utensils', icon: <Utensils color={icon === 'Utensils' ? color : '#666'} size={24} /> },
                  { name: 'Car', icon: <Car color={icon === 'Car' ? color : '#666'} size={24} /> },
                  { name: 'Film', icon: <Film color={icon === 'Film' ? color : '#666'} size={24} /> },
                  { name: 'Music', icon: <Music color={icon === 'Music' ? color : '#666'} size={24} /> },
                  { name: 'ShoppingBag', icon: <ShoppingBag color={icon === 'ShoppingBag' ? color : '#666'} size={24} /> },
                  { name: 'Briefcase', icon: <Briefcase color={icon === 'Briefcase' ? color : '#666'} size={24} /> },
                  { name: 'Plane', icon: <Plane color={icon === 'Plane' ? color : '#666'} size={24} /> },
                  { name: 'Heart', icon: <Heart color={icon === 'Heart' ? color : '#666'} size={24} /> },
                  { name: 'Smartphone', icon: <Smartphone color={icon === 'Smartphone' ? color : '#666'} size={24} /> },
                ].map((iconOption) => (
                  <TouchableOpacity
                    key={iconOption.name}
                    onPress={() => setIcon(iconOption.name)}
                    style={styles.iconButton}
                  >
                    {iconOption.icon}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>{category ? 'Save Changes' : 'Add Category'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    maxHeight: '80%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddEditCategoryDialog;