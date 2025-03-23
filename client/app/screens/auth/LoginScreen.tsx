"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native"
import { useAuth } from "@/contexts/AuthContext"

type LoginScreenProps = {
  onLoginSuccess: () => void; // Callback for successful login
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Use the auth context
  const { login, isLoading, error, clearError, user } = useAuth();
  
  // Monitor auth state changes
  useEffect(() => {
    if (user) {
      onLoginSuccess();
    }
  }, [user, onLoginSuccess]);
  
  // Display error messages
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      // The useEffect above will handle successful login
    } catch (e) {
      // Error is handled by the auth context
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <Mail size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Lock size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default LoginScreen;

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
  eyeIcon: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#1e40af", // Deep blue
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#1e40af", // Deep blue
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#93c5fd", // Lighter blue
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})