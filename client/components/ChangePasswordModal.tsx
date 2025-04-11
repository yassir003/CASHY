import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  label: string;
  isMet: boolean;
}

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  passwordData: PasswordData;
  handleInputChange: (field: keyof PasswordData, value: string) => void;
  isLoading?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSave,
  passwordData,
  handleInputChange,
}) => {
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: 'Minimum 8 characters', isMet: false },
    { label: 'At least one uppercase letter', isMet: false },
    { label: 'At least one number', isMet: false },
    { label: 'At least one special character', isMet: false },
  ]);

  // Check password requirements whenever newPassword changes
  useEffect(() => {
    const { newPassword } = passwordData;
    const updatedRequirements = [
      { 
        label: 'Minimum 8 characters', 
        isMet: newPassword.length >= 8 
      },
      { 
        label: 'At least one uppercase letter', 
        isMet: /[A-Z]/.test(newPassword) 
      },
      { 
        label: 'At least one number', 
        isMet: /\d/.test(newPassword) 
      },
      { 
        label: 'At least one special character', 
        isMet: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) 
      },
    ];
    
    setRequirements(updatedRequirements);
  }, [passwordData.newPassword]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your current password"
                value={passwordData.currentPassword}
                onChangeText={(value) => handleInputChange('currentPassword', value)}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              {requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementRow}>
                  {requirement.isMet ? (
                    <Check size={16} color="#22c55e" />
                  ) : (
                    <View style={styles.bulletPoint} />
                  )}
                  <Text 
                    style={[
                      styles.requirementItem, 
                      requirement.isMet && styles.requirementMet
                    ]}
                  >
                    {requirement.label}
                  </Text>
                </View>
              ))}
            </View>
            
            {passwordData.newPassword && passwordData.confirmPassword && (
              <View style={styles.confirmationCheck}>
                <View style={styles.requirementRow}>
                  {passwordData.newPassword === passwordData.confirmPassword ? (
                    <Check size={16} color="#22c55e" />
                  ) : (
                    <View style={styles.bulletPoint} />
                  )}
                  <Text 
                    style={[
                      styles.requirementItem, 
                      passwordData.newPassword === passwordData.confirmPassword && styles.requirementMet
                    ]}
                  >
                    Passwords match
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Update Password</Text>
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
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  passwordRequirements: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748b',
    marginRight: 10,
  },
  requirementItem: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 10,
  },
  requirementMet: {
    color: '#22c55e',
    fontWeight: '500',
  },
  confirmationCheck: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordModal;