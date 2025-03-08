import { useState } from "react"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import LoginScreen from "./auth/login-screen"
import RegisterScreen from "./auth/register-screen"


export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register">("login")

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>CASHY</Text>
            <Text style={styles.tagline}>Your journey begins here</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, currentScreen === "login" && styles.activeTab]}
              onPress={() => setCurrentScreen("login")}
            >
              <Text style={[styles.tabText, currentScreen === "login" && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, currentScreen === "register" && styles.activeTab]}
              onPress={() => setCurrentScreen("register")}
            >
              <Text style={[styles.tabText, currentScreen === "register" && styles.activeTabText]}>Register</Text>
            </TouchableOpacity>
          </View>

          {currentScreen === "login" ? <LoginScreen /> : <RegisterScreen />}
        </ScrollView>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af", // Deep blue
  },
  tagline: {
    fontSize: 16,
    color: "#64748b", // Slate gray
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f1f5f9", // Very light blue/gray
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabText: {
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#1e40af",
    fontWeight: "600",
  },
})

