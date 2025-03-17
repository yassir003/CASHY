import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // For icons

// Define the props for the EditTotalBudgetDialog component
interface EditTotalBudgetDialogProps {
  visible: boolean; // Controls the visibility of the dialog
  onDismiss: () => void; // Function to close the dialog
  totalBudget: number; // Current total budget value
  onSubmit: (newBudget: number) => void; // Function to handle form submission
}

const EditTotalBudgetDialog: React.FC<EditTotalBudgetDialogProps> = ({ visible, onDismiss, totalBudget, onSubmit }) => {
  const [newBudget, setNewBudget] = useState(totalBudget.toString());

  const handleSubmit = () => {
    onSubmit(Number(newBudget));
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Total Budget</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Budget Amount ($)</Text>
            <TextInput
              value={newBudget}
              onChangeText={setNewBudget}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter total budget"
            />
          </View>

          <Text style={styles.note}>This will proportionally adjust all category budgets.</Text>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Update Budget</Text>
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
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditTotalBudgetDialog;