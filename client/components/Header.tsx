import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  navigation?: any;
  username?: string;
  showWelcomeMessage?: boolean;
  isHomePage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, navigation, username, showWelcomeMessage, isHomePage = false }) => {
  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      {navigation && !isHomePage && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
      )}

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
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
});

export default Header;