import { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

// Auth screens
import AuthScreen from "./screens/auth/AuthScreen"

// Main app screens
import HomeScreen from "./screens/main/HomeScreen"
import ExploreScreen from "./screens/main/ExploreScreen"

// Define types for navigation
type AuthStackParamList = {
  Auth: undefined;
}

type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
}

type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
}

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>()
const MainTab = createBottomTabNavigator<MainTabParamList>()
const RootStack = createStackNavigator<RootStackParamList>()

// Auth navigator setup
const AuthNavigator = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth">
        {props => <AuthScreen {...props} onAuthSuccess={onAuthSuccess} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  )
}

// Main tab navigator setup - This is where the bottom tabs are defined
const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline"
          } else {
            iconName = "help-circle"
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#64748b",
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: "Home"
        }}
      />
      <MainTab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore"
        }}
      />
    </MainTab.Navigator>
  )
}

// Main app component
export default function App() {
  // In a real app, you would check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Function to handle successful login/registration
  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Show main tabs with bottom tab navigation when authenticated
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          // Show auth stack without bottom tabs when not authenticated
          <RootStack.Screen name="AuthStack">
            {props => <AuthNavigator {...props} onAuthSuccess={handleAuthSuccess} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}