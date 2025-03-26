import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone } from 'lucide-react-native';

// Define the type for the category object
interface Category {
  _id?: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
  icon: string;
  userId?: string;
}

// Updated props interface
interface AddEditCategoryDialogProps {
  visible: boolean;
  onDismiss: () => void;
  category?: Partial<Category> | null;
  onSubmit: (categoryData: Omit<Category, '_id' | 'userId'>) => void;
}

const AddEditCategoryDialog: React.FC<AddEditCategoryDialogProps> = ({ 
  visible, 
  onDismiss, 
  category, 
  onSubmit 
}) => {
  // Initialize state with default or provided values
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [spent, setSpent] = useState('0');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('Home');

  // Update state when category prop changes
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setBudget(category.budget ? category.budget.toString() : '');
      setSpent(category.spent ? category.spent.toString() : '0');
      setColor(category.color || '#3b82f6');
      setIcon(category.icon || 'Home');
    } else {
      // Reset to default values when no category is provided
      setName('');
      setBudget('');
      setSpent('0');
      setColor('#3b82f6');
      setIcon('Home');
    }
  }, [category, visible]);

  const colorOptions = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#14b8a6'];

  const handleSubmit = () => {
    // Validate inputs
    if (!name.trim()) {
      // Optional: Add error handling or show an alert
      return;
    }

    onSubmit({
      name: name.trim(),
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
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
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget Amount ($)</Text>
              <TextInput
                placeholder="0.00"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Spent Amount ($)</Text>
              <TextInput
                placeholder="0.00"
                value={spent}
                onChangeText={setSpent}
                keyboardType="numeric"
                style={styles.input}
              />
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
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddEditCategoryDialog;