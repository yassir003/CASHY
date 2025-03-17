import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  navigation?: any; // Make navigation optional
  username?: string; // Add username prop
  showWelcomeMessage?: boolean; // Add showWelcomeMessage prop
  isHomePage?: boolean; // Add isHomePage prop to identify the home page

  
}

export const Header: React.FC<HeaderProps> = ({ title, navigation, username, showWelcomeMessage, isHomePage = false }) => {
  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  return (
    <View style={styles.header}>
      {/* Back Button - Only show if navigation prop is provided */}
      {navigation && !isHomePage && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}

      {/* Title or Welcome Message */}
      {showWelcomeMessage && username ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.usernameText}>{username}</Text>
        </View>
      ) : (
        <Text style={styles.headerTitle}>{title}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Header;