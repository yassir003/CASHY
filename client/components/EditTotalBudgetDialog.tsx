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
  note: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
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

export default EditTotalBudgetDialog;