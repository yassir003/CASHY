import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera, 
  User, 
  Mail, 
  LogOut, 
  AlertCircle,
  Pencil,
  Lock
} from 'lucide-react-native';
import EditProfileModal from '@/components/EditProfileModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';

// Define the user profile data type
interface UserProfileData {
  username: string;
  email: string;
  profileImage?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, updateProfile, changePassword, isLoading, error, clearError } = useAuth();
  
  // Initialize state with user data from auth context
  const [userInfo, setUserInfo] = useState<UserProfileData>({
    username: user?.username || '',
    email: user?.email || '',
    profileImage: undefined // You can add a profileImage property to your User type if needed
  });

  // Update local state when auth context user changes
  useEffect(() => {
    if (user) {
      setUserInfo({
        username: user.username,
        email: user.email,
        profileImage: undefined // Update if you have profile image in your user object
      });
    }
  }, [user]);

  // State for modals visibility
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  
  // State for forms data
  const [profileFormData, setProfileFormData] = useState<UserProfileData>(userInfo);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Show error alerts from auth context
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by auth context or a navigation listener
    } catch (error) {
      // Error handling is managed by the auth context
      console.error('Logout error in component:', error);
    }
  };

  const handleEditProfile = () => {
    setProfileFormData(userInfo);
    setIsProfileModalVisible(true);
  };

  const handleEditPassword = () => {
    // Reset password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Only update if changes were made
      if (
        profileFormData.username !== userInfo.username ||
        profileFormData.email !== userInfo.email
      ) {
        // Send only fields that need updating to the API
        const updateData: Partial<UserProfileData> = {};
        if (profileFormData.username !== userInfo.username) {
          updateData.username = profileFormData.username;
        }
        if (profileFormData.email !== userInfo.email) {
          updateData.email = profileFormData.email;
        }

        await updateProfile(updateData);
        Alert.alert('Success', 'Profile information updated successfully');
      }
      
      setIsProfileModalVisible(false);
    } catch (error) {
      // Error handling is managed by the auth context
      console.error('Profile update error in component:', error);
    }
  };

  const handleSavePassword = async () => {
    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      
      // Call the auth context function to change password
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      Alert.alert('Success', 'Password changed successfully');
      setIsPasswordModalVisible(false);
    } catch (error) {
      // Error handling is managed by the auth context
      console.error('Password change error in component:', error);
    }
  };

  const handleProfileInputChange = (field: keyof UserProfileData, value: string) => {
    setProfileFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image and Username */}
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
                  {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userInfo.username}</Text>
        </View>

        {/* Warning Container */}
        <View style={styles.warningContainer}>
          <AlertCircle size={20} color="#f59e0b" />
          <Text style={styles.warningText}>
            Keep your profile information up to date for account security
          </Text>
        </View>

        {/* Info Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
              <Pencil size={16} color="#3b82f6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <User size={18} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{userInfo.username}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Mail size={18} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
          </View>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity 
          style={styles.passwordButton}
          onPress={handleEditPassword}
          disabled={isLoading}
        >
          <Lock size={20} color="white" />
          <Text style={styles.passwordButtonText}>
            {isLoading ? 'Please wait...' : 'Change Password'}
          </Text>
        </TouchableOpacity>

        {/* Logout Section */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.logoutButtonText}>
            {isLoading ? 'Please wait...' : 'Log Out'}
          </Text>
        </TouchableOpacity>

        {/* Bottom space for better UX */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        onSave={handleSaveProfile}
        formData={profileFormData}
        handleInputChange={handleProfileInputChange}
        isLoading={isLoading}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
        onSave={handleSavePassword}
        passwordData={passwordData}
        handleInputChange={handlePasswordInputChange}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
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
    color: '#3b82f6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  warningContainer: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    marginLeft: 8,
    color: '#92400e',
    fontSize: 14,
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
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
    color: '#1e293b',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  passwordButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordButtonText: {
    color: 'white', 
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 40,
  },
});

export default ProfileScreen;