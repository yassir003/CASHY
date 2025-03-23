import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // For icons

interface UserProfileData {
  fullName: string;
  birthday: string;
  timezone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: UserProfileData;
  handleInputChange: (field: keyof UserProfileData, value: string) => void;
  editingSection: 'profile' | 'household';
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  formData,
  handleInputChange,
  editingSection,
}) => {
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
            <Text style={styles.modalTitle}>
              Edit {editingSection === 'profile' ? 'Profile' : 'Household'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {editingSection === 'profile' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Birthday</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1990-01-01"
                    value={formData.birthday}
                    onChangeText={(value) => handleInputChange('birthday', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Timezone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. UTC-5"
                    value={formData.timezone}
                    onChangeText={(value) => handleInputChange('timezone', value)}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 123 Main St"
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. New York"
                    value={formData.city}
                    onChangeText={(value) => handleInputChange('city', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. NY"
                    value={formData.state}
                    onChangeText={(value) => handleInputChange('state', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Zip Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10001"
                    value={formData.zipCode}
                    onChangeText={(value) => handleInputChange('zipCode', value)}
                  />
                </View>
              </>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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

export default EditModal;