import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { X, AlertCircle, Check } from 'lucide-react-native';

interface UserProfileData {
  username: string;
  email: string;
}

interface ValidationState {
  username: boolean;
  email: boolean;
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: UserProfileData;
  handleInputChange: (field: keyof UserProfileData, value: string) => void;
  isLoading?: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  formData,
  handleInputChange,
  isLoading = false,
}) => {
  const [errors, setErrors] = useState<ValidationState>({
    username: false,
    email: false,
  });
  
  const [touched, setTouched] = useState<ValidationState>({
    username: false,
    email: false,
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  
  // Validate email format
  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Mark field as touched when user interacts with it
  const handleFieldTouched = (field: keyof UserProfileData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };
  
  // Validate the form whenever inputs change or are touched
  useEffect(() => {
    const newErrors = {
      username: !formData.username.trim(),
      email: !formData.email.trim() || !isEmailValid(formData.email),
    };
    
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
  }, [formData, touched]);
  
  // Handle the save button press with validation
  const handleSave = () => {
    // Mark all fields as touched to show all errors
    setTouched({
      username: true,
      email: true,
    });
    
    if (isFormValid) {
      onSave();
    } else {
      // Show error message
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly.",
        [{ text: "OK" }]
      );
    }
  };

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
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Username</Text>
                {touched.username && !errors.username && (
                  <Check size={16} color="#22c55e" />
                )}
              </View>
              <TextInput
                style={[
                  styles.input,
                  touched.username && errors.username && styles.inputError
                ]}
                placeholder="e.g. johndoe"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                onBlur={() => handleFieldTouched('username')}
              />
              {touched.username && errors.username && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>Username is required</Text>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Email</Text>
                {touched.email && !errors.email && (
                  <Check size={16} color="#22c55e" />
                )}
              </View>
              <TextInput
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError
                ]}
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={() => handleFieldTouched('email')}
              />
              {touched.email && errors.email && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>
                    {!formData.email.trim() 
                      ? "Email is required" 
                      : "Please enter a valid email address"}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!isFormValid || isLoading) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
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
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 6,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileModal;