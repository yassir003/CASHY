import { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { Header } from "@/components/Header"

// Auth screens 
import AuthScreen from "./screens/auth/AuthScreen"

// Main app screens
import HomeScreen from "./screens/main/HomeScreen"
import TransactionScreen from "./screens/main/TransactionScreen"
import ProfileScreen from "./screens/main/ProfileScreen";
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
const MainTabNavigator = ({ username }: { username: string }) => {
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

// Main app component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("John Doe");// Add username state

  // Function to handle successful login/registration
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Show main tabs with bottom tab navigation when authenticated
          <RootStack.Screen name="MainTabs">
            {props => <MainTabNavigator {...props} username={username} />}
          </RootStack.Screen>
        ) : (
          // Show auth stack without bottom tabs when not authenticated
          <RootStack.Screen name="AuthStack">
            {props => <AuthNavigator {...props} onAuthSuccess={handleAuthSuccess} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}