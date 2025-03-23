import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditModal from '../../../components/EditModal'; 
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';


// Define the user profile data type
interface UserProfileData {
  fullName: string;
  birthday: string;
  timezone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileImage?: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth(); // Get logout from context
  const [userInfo, setUserInfo] = useState<UserProfileData>({
    fullName: 'Amin',
    birthday: 'February 18, 2003',
    timezone: 'Morroco/Marrakech',
    address: '40000 Douar iziki ',
    city: 'Marrakech',
    state: 'Marrakech-safi',
    zipCode: '40100',
  });

  // State for modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState<'profile' | 'household'>('profile');
  const [formData, setFormData] = useState<UserProfileData>(userInfo);



  // Add a logout handler function
const handleLogout = async () => {
  try {
    await logout();
    // Navigate to login screen after logout
  } catch (error) {
    Alert.alert('Logout Error', 'Failed to logout. Please try again.');
  }
};
  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle edit button press
  const handleEdit = (section: 'profile' | 'household') => {
    setEditingSection(section);
    setIsModalVisible(true);
  };

  // Handle save button press in the modal
  const handleSave = () => {
    setUserInfo(formData); 
    setIsModalVisible(false); 
    Alert.alert('Success', 'Profile information saved successfully');
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View> */}

        {/* Profile Image and Name */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {userInfo.profileImage ? (
              <Image
                source={{ uri: userInfo.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {userInfo.fullName.split(' ').map((name) => name[0]).join('')}
                </Text>
              </View>
            )}
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.userName}>{userInfo.fullName}</Text>
        </View>

        {/* Info Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Info Profile</Text>
            <TouchableOpacity onPress={() => handleEdit('profile')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{userInfo.fullName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Birthday</Text>
            <Text style={styles.infoValue}>{userInfo.birthday}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timezone</Text>
            <Text style={styles.infoValue}>{userInfo.timezone}</Text>
          </View>
        </View>

        {/* Household Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Household</Text>
            <TouchableOpacity onPress={() => handleEdit('household')}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userInfo.address}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{userInfo.city}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>State</Text>
            <Text style={styles.infoValue}>{userInfo.state}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Zip Code</Text>
            <Text style={styles.infoValue}>{userInfo.zipCode}</Text>
          </View>
        </View>

        {/* // Add this logout section to your JSX before the closing  */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      

      {/* Edit Modal */}
      <EditModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSave}
        formData={formData}
        handleInputChange={handleInputChange}
        editingSection={editingSection}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#666',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;