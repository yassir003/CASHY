import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react-native"
import { useAuth } from "@/contexts/AuthContext"

type RegisterScreenProps = {
  onRegistrationSuccess: () => void; // Callback for successful registration
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegistrationSuccess }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Validation states
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  
  // Use the auth context
  const { register, isLoading, error, clearError, user } = useAuth();
  
  // Monitor auth state changes
  useEffect(() => {
    if (user) {
      onRegistrationSuccess();
    }
  }, [user, onRegistrationSuccess]);
  
  // Display error messages
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  // Check if passwords match whenever either password field changes
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // Reset match state if either field is empty
    }
  }, [password, confirmPassword]);

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handleRegister = async () => {
    setAttemptedSubmit(true);
    
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await register(name, email, password);
      // The useEffect above will handle successful registration
    } catch (e) {
      // Error is handled by the auth context
    }
  };

  // Function to determine if a field is invalid
  const isFieldInvalid = (value: string) => {
    return attemptedSubmit && !value;
  };

  // Function to render error message for empty fields
  const renderErrorMessage = (fieldName: string) => {
    return (
      <Text style={styles.errorText}>
        <AlertCircle size={14} color="#ef4444" /> {fieldName} is required
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <View style={[
          styles.inputContainer,
          isFieldInvalid(name) && styles.inputContainerError
        ]}>
          <User 
            size={20} 
            color={isFieldInvalid(name) ? "#ef4444" : "#64748b"} 
            style={styles.inputIcon} 
          />
          <TextInput 
            style={[
              styles.input,
              isFieldInvalid(name) && styles.inputError
            ]} 
            placeholder="Enter your full name" 
            placeholderTextColor={isFieldInvalid(name) ? "#fca5a5" : "#94a3b8"}
            value={name} 
            onChangeText={handleNameChange}
            editable={!isLoading}
          />
        </View>
        {isFieldInvalid(name) && renderErrorMessage("Full name")}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={[
          styles.inputContainer,
          isFieldInvalid(email) && styles.inputContainerError
        ]}>
          <Mail 
            size={20} 
            color={isFieldInvalid(email) ? "#ef4444" : "#64748b"} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.input,
              isFieldInvalid(email) && styles.inputError
            ]}
            placeholder="Enter your email"
            placeholderTextColor={isFieldInvalid(email) ? "#fca5a5" : "#94a3b8"}
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
        {isFieldInvalid(email) && renderErrorMessage("Email")}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={[
          styles.inputContainer,
          (isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) && styles.inputContainerError
        ]}>
          <Lock 
            size={20} 
            color={(isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.input,
              (isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) && styles.inputError
            ]}
            placeholder="Create a password"
            placeholderTextColor={(isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) ? "#fca5a5" : "#94a3b8"}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? 
              <EyeOff size={20} color={(isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} /> : 
              <Eye size={20} color={(isFieldInvalid(password) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} />
            }
          </TouchableOpacity>
        </View>
        {isFieldInvalid(password) && renderErrorMessage("Password")}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[
          styles.inputContainer,
          (isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) && styles.inputContainerError
        ]}>
          <Lock 
            size={20} 
            color={(isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[
              styles.input,
              (isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) && styles.inputError
            ]}
            placeholder="Confirm your password"
            placeholderTextColor={(isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) ? "#fca5a5" : "#94a3b8"}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? 
              <EyeOff size={20} color={(isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} /> : 
              <Eye size={20} color={(isFieldInvalid(confirmPassword) || (!passwordsMatch && attemptedSubmit)) ? "#ef4444" : "#64748b"} />
            }
          </TouchableOpacity>
        </View>
        {isFieldInvalid(confirmPassword) && renderErrorMessage("Confirm password")}
        {!isFieldInvalid(confirmPassword) && !passwordsMatch && attemptedSubmit && (
          <Text style={styles.errorText}>
            <AlertCircle size={14} color="#ef4444" /> Passwords do not match
          </Text>
        )}
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By registering, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
        onPress={handleRegister} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#334155", // Slate 700
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1", // Slate 300
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputContainerError: {
    borderColor: "#ef4444", // Red 500
    backgroundColor: "#fef2f2", // Red 50
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#334155", // Slate 700
  },
  inputError: {
    color: "#b91c1c", // Red 700
  },
  errorText: {
    color: "#ef4444", // Red 500
    fontSize: 14,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    padding: 12,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    color: "#64748b", // Slate 500
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: "#1e40af", // Deep blue
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#1e40af", // Deep blue
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: "#93c5fd", // Lighter blue
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})