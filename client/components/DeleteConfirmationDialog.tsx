import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { AntDesign } from "@expo/vector-icons";

interface DeleteConfirmationDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  categoryName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  onDismiss,
  onConfirm,
  categoryName
}) => {
  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Category</Text>
            {/* <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity> */}
          </View>
          
          <View style={styles.warningContainer}>
            <AlertTriangle color="#ef4444" size={24} />
            <Text style={styles.message}>
              Are you sure you want to delete "{categoryName}"?
            </Text>
          </View>
          
          <Text style={styles.warningText}>
            All transactions related to this category will also be deleted.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onDismiss}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onConfirm}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
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
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  closeButton: {
    padding: 4,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
  },
  warningText: {
    fontSize: 14,
    color: "#ef4444",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default DeleteConfirmationDialog;