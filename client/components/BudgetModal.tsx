import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState(false);

  // Reset state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setAmount('');
      setError('');
      setInputError(false);
    }
  }, [visible]);

  // Clear input error when amount changes
  useEffect(() => {
    if (amount) {
      setInputError(false);
    }
  }, [amount]);

  const handleSubmit = async () => {
    try {
      // Check if amount is empty
      if (!amount.trim()) {
        setInputError(true);
        throw new Error('Please enter an amount');
      }

      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount)) {
        setInputError(true);
        throw new Error('Please enter a valid number');
      }
      
      if (numericAmount <= 0) {
        setInputError(true);
        throw new Error('Budget must be greater than zero');
      }
      
      await onSubmit(numericAmount);
      
      // Reset input and close modal on successful submission
      setAmount('');
      setError('');
      setInputError(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Budget</Text>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TextInput 
            style={[
              styles.input, 
              inputError ? styles.inputError : null
            ]} 
            placeholder="Enter amount" 
            keyboardType="numeric" 
            value={amount} 
            onChangeText={setAmount} 
          />
          
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.submitButton,
                (!amount.trim() || parseFloat(amount) <= 0) ? styles.disabledButton : null
              ]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: 'rgba(254, 226, 226, 0.2)',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
});