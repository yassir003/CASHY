import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Edit {editingSection === 'profile' ? 'Profile' : 'Household'}
          </Text>

          {editingSection === 'profile' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Birthday"
                value={formData.birthday}
                onChangeText={(value) => handleInputChange('birthday', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Timezone"
                value={formData.timezone}
                onChangeText={(value) => handleInputChange('timezone', value)}
              />
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
              />
            </>
          )}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
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
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
});

export default EditModal;