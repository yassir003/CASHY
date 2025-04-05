import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { Header } from "@/components/Header"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { BudgetProvider } from '@/contexts/BudgetContext';
import { CategoryProvider } from '../contexts/CategoriesContext';
import { TransactionProvider } from '../contexts/TransactionContext';

// Auth screens 
import AuthScreen from "./screens/auth/AuthScreen"

// Main app screens
import HomeScreen from "./screens/main/HomeScreen"
import TransactionScreen from "./screens/main/TransactionScreen"
import ProfileScreen from "./screens/main/ProfileScreen"
import BudgetScreen from "./screens/main/BudgetScreen"
import AnalyticsDashboard from "./screens/main/Analytics"

// Define types for navigation
type AuthStackParamList = {
  Auth: undefined;
}

type MainTabParamList = {
  Home: undefined;
  Transaction: undefined;
  Budget: undefined;
  Profile: undefined;
  Analytics: undefined;
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
const AuthNavigator = () => {
  const { login } = useAuth();
  
  const handleAuthSuccess = () => {
    // Auth success is now handled by the AuthContext
  };

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth">
        {props => <AuthScreen {...props} onAuthSuccess={handleAuthSuccess} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  )
}

// Main tab navigator setup - This is where the bottom tabs are defined
const MainTabNavigator = () => {
  const { user } = useAuth();
  const username = user?.username || "User";

  return (
    <MainTab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Transaction") {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          } else if (route.name === "Budget") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-circle";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#64748b",
        headerShown: true, // Enable the header
        header: () => (
          <Header
            title={route.name}
            navigation={navigation}
            username={route.name === "Home" ? username : undefined} // Pass username only for Home
            showWelcomeMessage={route.name === "Home"} // Show welcome message only for Home
            isHomePage={route.name === "Home"}
          />
        ),
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
          tabBarLabel: "Home",
        }}
      />
      <MainTab.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{
          tabBarLabel: "Transaction",
        }}
      />
      <MainTab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarLabel: "Budget",
        }}
      />
      <MainTab.Screen
        name="Analytics"
        component={AnalyticsDashboard}
        options={{
          tabBarLabel: "Analytics",
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </MainTab.Navigator>
  );
};

// AppNavigator component to handle the navigation state
const AppNavigator = () => {
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Show main tabs with bottom tab navigation when authenticated
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          // Show auth stack without bottom tabs when not authenticated
          <RootStack.Screen name="AuthStack" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// Main app component
export default function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <CategoryProvider>
          <TransactionProvider>
            <AppNavigator />
          </TransactionProvider>
        </CategoryProvider>
      </BudgetProvider>
    </AuthProvider>
  );
}