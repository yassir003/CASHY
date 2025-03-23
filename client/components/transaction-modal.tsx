import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For dropdown
import { AntDesign, Feather } from "@expo/vector-icons"; // For icons

export type Transaction = {
  id: string;
  name: string;
  date: string; // Remove any '?' that might make this optional
  amount: string;
  type: "credit" | "debit";
  category: string;
};

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction?: Transaction;
  isEditing?: boolean;
};

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction,
  isEditing = false,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<Transaction>({
    id: "",
    name: "",
    amount: "",
    date: "",
    type: "debit",
    category: "general",
  });

  useEffect(() => {
    if (transaction && isEditing) {
      setFormData(transaction);
    } else {
      // Generate current date in format "YYYY-MM-DD"
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        name: "",
        amount: "",
        date: formattedDate,
        type: "debit",
        category: "general",
      });
    }
  }, [transaction, isEditing, isOpen]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: "credit" | "debit") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Transaction" : "Add Transaction"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholder="e.g. Grocery Shopping"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={(value) => handleChange("amount", value)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(value) => handleChange("date", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleTypeChange("debit")}
                >
                  <Feather
                    name={formData.type === "debit" ? "check-circle" : "circle"}
                    size={20}
                    color={formData.type === "debit" ? "#3b82f6" : "#ccc"}
                  />
                  <Text style={styles.radioLabel}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleTypeChange("credit")}
                >
                  <Feather
                    name={formData.type === "credit" ? "check-circle" : "circle"}
                    size={20}
                    color={formData.type === "credit" ? "#3b82f6" : "#ccc"}
                  />
                  <Text style={styles.radioLabel}>Income</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <Picker
                selectedValue={formData.category}
                onValueChange={handleCategoryChange}
                style={styles.picker}
              >
                <Picker.Item label="General" value="general" />
                <Picker.Item label="Food & Dining" value="food" />
                <Picker.Item label="Shopping" value="shopping" />
                <Picker.Item label="Housing" value="housing" />
                <Picker.Item label="Transportation" value="transportation" />
                <Picker.Item label="Entertainment" value="entertainment" />
                <Picker.Item label="Utilities" value="utilities" />
                <Picker.Item label="Income" value="income" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>
              {isEditing ? "Save Changes" : "Add Transaction"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
  formContainer: {
    maxHeight: '80%',
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
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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