import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const EditProfileScreen = () => {
  const [fullName, setFullName] = useState('John Doe');
  const [birthday, setBirthday] = useState('February 19, 1993');
  const [timezone, setTimezone] = useState('America/New York');

  const handleSave = () => {
    // Add logic to save the updated profile information
    console.log('Profile saved:', { fullName, birthday, timezone });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
      </View>

      {/* Birthday */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Birthday</Text>
        <TextInput
          style={styles.input}
          value={birthday}
          onChangeText={setBirthday}
          placeholder="Enter your birthday"
        />
      </View>

      {/* Timezone */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Timezone</Text>
        <TextInput
          style={styles.input}
          value={timezone}
          onChangeText={setTimezone}
          placeholder="Enter your timezone"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;