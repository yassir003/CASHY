import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import icons

const BottomNavbar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Home Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
        <FontAwesome name="home" size={24} color="#1e40af" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Explore Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/explore')}>
        <MaterialIcons name="explore" size={24} color="#1e40af" />
        <Text style={styles.navText}>Explore</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
        <FontAwesome name="user" size={24} color="#1e40af" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 16,
    position: 'absolute', // Stick to the bottom
    bottom: 0, // Stick to the bottom
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    color: '#1e40af',
    marginTop:4, // Add some spacing between icon and text
  },
});

export default BottomNavbar;