import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

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
          <Text style={styles.modalTitle}>Edit Total Budget</Text>
          <TextInput
            placeholder="Total Budget Amount ($)"
            value={newBudget}
            onChangeText={setNewBudget}
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.note}>This will proportionally adjust all category budgets.</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onDismiss} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.buttonText}>Update Budget</Text>
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
  note: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
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

export default EditTotalBudgetDialog;