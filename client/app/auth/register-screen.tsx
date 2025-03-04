"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react-native"

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Success", "Registration successful!")
    }, 1500)
  }

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <User size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Enter your full name" value={name} onChangeText={setName} />
        </View>
      </View>

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
            placeholder="Create a password"
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

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Lock size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By registering, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
        <Text style={styles.registerButtonText}>{isLoading ? "Creating Account..." : "Create Account"}</Text>
      </TouchableOpacity>
    </View>
  )
}

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
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

