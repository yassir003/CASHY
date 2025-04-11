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
  Alert,
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
  AlertCircle,
  Check,
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

// Track validation errors for each field
interface ValidationErrors {
  name: boolean;
  amount: boolean;
  date: boolean;
  category: boolean;
}

// Track which fields have been touched/interacted with
interface TouchedFields {
  name: boolean;
  amount: boolean;
  date: boolean;
  category: boolean;
}

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
  
  // Track validation errors
  const [errors, setErrors] = useState<ValidationErrors>({
    name: false,
    amount: false,
    date: false,
    category: false,
  });
  
  // Track which fields have been touched by the user
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    amount: false,
    date: false,
    category: false,
  });
  
  // Track if form is valid overall
  const [isFormValid, setIsFormValid] = useState(false);

  const selectedCategory = categories.find((c) => c._id === formData.category);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transaction && isEditing) {
      setFormData(transaction);
      // Mark all fields as touched in edit mode
      setTouched({
        name: true,
        amount: true,
        date: true,
        category: true,
      });
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
      
      // Reset touched state for new transaction
      setTouched({
        name: false,
        amount: false,
        date: true, // Date is pre-filled, so mark as touched
        category: defaultCategory ? true : false, // Mark as touched if default category exists
      });
    }
  }, [transaction, isEditing, isOpen, categories]);

  // Validate form whenever data changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: ValidationErrors = {
      name: !formData.name.trim(),
      amount: !formData.amount.trim() || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0,
      date: !formData.date,
      category: !formData.category,
    };
    
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleTypeChange = (value: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setTouched(prev => ({
      ...prev,
      category: true
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      handleChange('date', formattedDate);
    }
    setTouched(prev => ({
      ...prev,
      date: true
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    const iconProps = { size: 20, color: "#fff" };
    const IconComponent = (icons[iconName as IconType] || icons.Home);
    return <IconComponent {...iconProps} />;
  };

  const handleSubmit = () => {
    // Mark all fields as touched to show all validation errors
    setTouched({
      name: true,
      amount: true,
      date: true,
      category: true,
    });
    
    validateForm();
    
    if (isFormValid) {
      onSave(formData);
    } else {
      // Display error message
      Alert.alert(
        "Incomplete Transaction",
        "Please fill in all required fields correctly.",
        [{ text: "OK" }]
      );
    }
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
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Description</Text>
                {touched.name && !errors.name && (
                  <Check size={16} color="#16a34a" />
                )}
              </View>
              <TextInput
                style={[
                  styles.input,
                  touched.name && errors.name && styles.inputError
                ]}
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholder="e.g. Grocery Shopping"
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              />
              {touched.name && errors.name && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>Description is required</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Amount</Text>
                {touched.amount && !errors.amount && (
                  <Check size={16} color="#16a34a" />
                )}
              </View>
              <TextInput
                style={[
                  styles.input,
                  touched.amount && errors.amount && styles.inputError
                ]}
                value={formData.amount}
                onChangeText={(value) => handleChange("amount", value)}
                placeholder="0.00"
                keyboardType="numeric"
                onBlur={() => setTouched(prev => ({ ...prev, amount: true }))}
              />
              {touched.amount && errors.amount && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>
                    {!formData.amount.trim() 
                      ? "Amount is required" 
                      : "Please enter a valid positive amount"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Date</Text>
                {touched.date && !errors.date && (
                  <Check size={16} color="#16a34a" />
                )}
              </View>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateInput,
                  touched.date && errors.date && styles.inputError
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={formData.date ? format(new Date(formData.date), 'MMM dd, yyyy') : ''}
                  placeholder="Select date"
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>
              {touched.date && errors.date && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>Date is required</Text>
                </View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(formData.date || new Date())}
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
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Category</Text>
                {touched.category && !errors.category && (
                  <Check size={16} color="#16a34a" />
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.categoryPickerTrigger,
                  touched.category && errors.category && styles.inputError
                ]}
                onPress={() => {
                  setShowCategoryPicker(true);
                  setTouched(prev => ({ ...prev, category: true }));
                }}
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
              {touched.category && errors.category && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#ef4444" />
                  <Text style={styles.errorText}>Category is required</Text>
                </View>
              )}

              <Modal
                visible={showCategoryPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryPicker(false)}
              >
                <View style={styles.categoryModalOverlay}>
                  <View style={styles.categoryModalContent}>
                    <View style={styles.categoryModalHeader}>
                      <Text style={styles.categoryModalTitle}>Select Category</Text>
                      <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                        <AntDesign name="close" size={24} color="#000" />
                      </TouchableOpacity>
                    </View>
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
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
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginLeft: 6,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
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
  saveButtonDisabled: {
    backgroundColor: "#93c5fd",
    opacity: 0.7,
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
  categoryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
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