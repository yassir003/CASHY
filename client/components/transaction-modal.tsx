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
  amount: string;
  date: string;
  type: "credit" | "debit";
  category?: string;
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});