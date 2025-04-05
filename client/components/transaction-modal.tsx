import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useCategories } from "@/contexts/CategoriesContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {
  Home,
  Utensils,
  Car,
  Film,
  Music,
  ShoppingBag,
  Briefcase,
  Plane,
  Heart,
  Smartphone,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react-native";

// Define an IconType to match the icons object
type IconType = keyof typeof icons;

export type Transaction = {
  id: string;
  name: string;
  date: string;
  amount: string;
  type: "income" | "expense";
  category: string;
};

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction?: Transaction;
  isEditing?: boolean;
};

type IconProps = {
  size: number;
  color: string;
};

const icons = {
  Home,
  Utensils,
  Car,
  Film,
  Music,
  ShoppingBag,
  Briefcase,
  Plane,
  Heart,
  Smartphone,
  Plus,
  Pencil,
  Trash2,
};

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction,
  isEditing = false,
}: TransactionModalProps) {
  const { categories, fetchCategories } = useCategories();
  const [formData, setFormData] = useState<Transaction>({
    id: "",
    name: "",
    amount: "",
    date: "",
    type: "expense",
    category: "",
  });
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedCategory = categories.find((c) => c._id === formData.category);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transaction && isEditing) {
      setFormData(transaction);
    } else {
      const today = new Date();
      const formattedDate = format(today, 'yyyy-MM-dd');
      const defaultCategory = categories[0]?._id || "";

      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        name: "",
        amount: "",
        date: formattedDate,
        type: "expense",
        category: defaultCategory,
      });
    }
  }, [transaction, isEditing, isOpen, categories]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      handleChange('date', formattedDate);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const iconProps = { size: 20, color: "#fff" };
    const IconComponent = (icons[iconName as IconType] || icons.Home);
    return <IconComponent {...iconProps} />;
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
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInput}
              >
                <TextInput
                  style={styles.input}
                  value={formData.date ? format(new Date(formData.date), 'MMM dd, yyyy') : ''}
                  placeholder="Select date"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.date)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleTypeChange("expense")}
                >
                  <Feather
                    name={formData.type === "expense" ? "check-circle" : "circle"}
                    size={20}
                    color={formData.type === "expense" ? "#3b82f6" : "#ccc"}
                  />
                  <Text style={styles.radioLabel}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleTypeChange("income")}
                >
                  <Feather
                    name={formData.type === "income" ? "check-circle" : "circle"}
                    size={20}
                    color={formData.type === "income" ? "#3b82f6" : "#ccc"}
                  />
                  <Text style={styles.radioLabel}>Income</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categoryPickerTrigger}
                onPress={() => setShowCategoryPicker(true)}
              >
                <View
                  style={[
                    styles.categoryColor,
                    { backgroundColor: selectedCategory?.color || "#ccc" },
                  ]}
                >
                  {selectedCategory
                    ? getCategoryIcon(selectedCategory.icon)
                    : getCategoryIcon("")}
                </View>
                <Text style={styles.categoryPickerText}>
                  {selectedCategory?.name || "Select Category"}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showCategoryPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryPicker(false)}
              >
                <View style={styles.categoryModalOverlay}>
                  <View style={styles.categoryModalContent}>
                    <ScrollView>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category._id}
                          style={styles.categoryItem}
                          onPress={() => {
                            handleCategoryChange(category._id);
                            setShowCategoryPicker(false);
                          }}
                        >
                          <View
                            style={[
                              styles.categoryColor,
                              { backgroundColor: category.color },
                            ]}
                          >
                            {getCategoryIcon(category.icon)}
                          </View>
                          <Text style={styles.categoryText}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
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
  formContainer: {
    maxHeight: "80%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: "row",
    gap: 24,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryPickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  categoryColor: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryPickerText: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  categoryModalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  categoryModalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: "60%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
});