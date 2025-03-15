import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Home, Utensils, Car, Film, Music, ShoppingBag, Briefcase, Plane, Heart, Smartphone } from 'lucide-react-native';

// Define the type for the category object
interface Category {
  id?: number;
  name: string;
  budget: number;
  spent: number;
  color: string;
  icon: string;
}

// Define the props for the AddEditCategoryDialog component
interface AddEditCategoryDialogProps {
  visible: boolean;
  onDismiss: () => void;
  category?: Category;
  onSubmit: (category: Category) => void;
}

const AddEditCategoryDialog: React.FC<AddEditCategoryDialogProps> = ({ visible, onDismiss, category, onSubmit }) => {
  const [name, setName] = useState(category?.name || '');
  const [budget, setBudget] = useState(category?.budget?.toString() || '');
  const [spent, setSpent] = useState(category?.spent?.toString() || '0');
  const [color, setColor] = useState(category?.color || '#3b82f6');
  const [icon, setIcon] = useState(category?.icon || 'Home');

  const colorOptions = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#ef4444', '#14b8a6'];

  const handleSubmit = () => {
    onSubmit({
      name,
      budget: Number(budget),
      spent: Number(spent),
      color,
      icon,
    });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{category ? 'Edit Category' : 'Add Category'}</Text>
          <TextInput
            placeholder="Category Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Budget Amount ($)"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Spent Amount ($)"
            value={spent}
            onChangeText={setSpent}
            keyboardType="numeric"
            style={styles.input}
          />
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
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconOptions}>
            {[
              { name: 'Home', icon: <Home color={icon === 'Home' ? color : '#666'} /> },
              { name: 'Utensils', icon: <Utensils color={icon === 'Utensils' ? color : '#666'} /> },
              { name: 'Car', icon: <Car color={icon === 'Car' ? color : '#666'} /> },
              { name: 'Film', icon: <Film color={icon === 'Film' ? color : '#666'} /> },
              { name: 'Music', icon: <Music color={icon === 'Music' ? color : '#666'} /> },
              { name: 'ShoppingBag', icon: <ShoppingBag color={icon === 'ShoppingBag' ? color : '#666'} /> },
              { name: 'Briefcase', icon: <Briefcase color={icon === 'Briefcase' ? color : '#666'} /> },
              { name: 'Plane', icon: <Plane color={icon === 'Plane' ? color : '#666'} /> },
              { name: 'Heart', icon: <Heart color={icon === 'Heart' ? color : '#666'} /> },
              { name: 'Smartphone', icon: <Smartphone color={icon === 'Smartphone' ? color : '#666'} /> },
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
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onDismiss} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.buttonText}>{category ? 'Update' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  checkIcon: {
    color: '#fff',
    fontSize: 16,
  },
  iconOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  iconButton: {
    margin: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
  },
  submitButton: {
    padding: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddEditCategoryDialog;