import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // For icons
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  checkIcon: {
    color: '#fff',
    fontSize: 16,
  },
  iconOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconButton: {
    margin: 8,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEditCategoryDialog;