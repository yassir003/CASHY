"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native"

type LoginScreenProps = {
  onLoginSuccess: () => void; // Callback for successful login
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // Simulate a login process
    setTimeout(() => {
      setIsLoading(false);

      // Static login credentials (for testing purposes)
      const staticEmail = "user@example.com";
      const staticPassword = "password123";

      if (email === staticEmail && password === staticPassword) {
        Alert.alert("Success", "Login successful!");
        onLoginSuccess(); // Trigger navigation to Main screen
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    }, 1500);
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
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.loginButtonText}>{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      {/* <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View> */}

      {/* <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
      </View> */}
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
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#cbd5e1", // Slate 300
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#64748b", // Slate 500
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: "#cbd5e1", // Slate 300
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  socialButtonText: {
    color: "#334155", // Slate 700
    fontWeight: "500",
  },
})

