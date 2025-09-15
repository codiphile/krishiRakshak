import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { FarmerProfileSetup } from '../../src/components/FarmerProfileSetup';
import { farmerProfileService } from '../../src/services/farmerProfile';
import { FarmerProfile } from '../../src/types/farmerProfile';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showFarmerProfileSetup, setShowFarmerProfileSetup] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  // Hardcoded user profile data
  const hardcodedUser = {
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone_number: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu',
  };

  const [editedUser, setEditedUser] = useState(hardcodedUser);

  useEffect(() => {
    loadFarmerProfile();
  }, []);

  const loadFarmerProfile = async () => {
    try {
      const profile = await farmerProfileService.getProfile();
      setFarmerProfile(profile);
    } catch (error) {
      console.error('Error loading farmer profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSaveFarmerProfile = async (profile: Partial<FarmerProfile>) => {
    try {
      await farmerProfileService.saveProfile(profile);
      await loadFarmerProfile();
      setShowFarmerProfileSetup(false);
      Alert.alert('Success', 'Farmer profile updated successfully!');
    } catch (error) {
      console.error('Error saving farmer profile:', error);
      Alert.alert('Error', 'Failed to save farmer profile. Please try again.');
    }
  };

  const profileData = [
    {
      title: 'Personal Information',
      items: [
        { icon: 'person', label: 'Full Name', value: hardcodedUser.full_name, key: 'full_name' },
        { icon: 'mail', label: 'Email', value: hardcodedUser.email, key: 'email' },
        { icon: 'call', label: 'Phone', value: hardcodedUser.phone_number, key: 'phone_number' },
        { icon: 'location', label: 'Location', value: hardcodedUser.location, key: 'location' },
      ]
    },
    {
      title: 'Farm Information',
      items: [
        { icon: 'leaf', label: 'Farm Size', value: '2.5 acres', key: 'farm_size' },
        { icon: 'flower', label: 'Crop Type', value: 'Rice, Wheat', key: 'crop_type' },
        { icon: 'calendar', label: 'Experience', value: '5 years', key: 'experience' },
      ]
    }
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with Profile Image */}
          <View className="bg-gradient-to-b from-green-600 to-green-700 px-6 pt-6 pb-20">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">Profile</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                className="bg-white bg-opacity-20 rounded-full p-2"
              >
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View className="bg-white rounded-2xl p-6 shadow-lg" style={{ marginTop: 0, marginBottom: -50 }}>
              <View className="items-center -mt-16">
                {/* Profile Image */}
                <View className="relative">
                  <View className="w-32 h-32 rounded-full bg-green-100 border-4 border-white shadow-lg items-center justify-center">
                    <Image
                      source={require('../images/farmer-profile.png')}
                      className="w-28 h-28 rounded-full"
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-2">
                    <Ionicons name="camera" size={18} color="white" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-800 text-2xl font-bold mt-4">
                  {hardcodedUser.full_name}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Farmer • KrishiRakshak Member
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Information Sections */}
          <View className="px-6 pt-16 pb-24">
            {profileData.map((section, sectionIndex) => (
              <View key={sectionIndex} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-gray-800 font-semibold text-lg">{section.title}</Text>
                  <TouchableOpacity
                    onPress={() => setEditModalVisible(true)}
                    className="bg-green-50 rounded-full p-2"
                  >
                    <Ionicons name="pencil" size={16} color="#16a34a" />
                  </TouchableOpacity>
                </View>

                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} className="flex-row items-center py-3">
                    <View className="bg-green-50 rounded-full p-2 mr-3">
                      <Ionicons name={item.icon as any} size={18} color="#16a34a" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-600 text-sm">{item.label}</Text>
                      <Text className="text-gray-800 font-medium">{item.value}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </View>
                ))}
              </View>
            ))}

            {/* Farmer Profile Section */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="leaf" size={20} color="#16a34a" />
                  <Text className="text-gray-800 font-semibold text-lg ml-2">AI Profile</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowFarmerProfileSetup(true)}
                  className="bg-green-50 rounded-full p-2"
                >
                  <Ionicons name={farmerProfile ? "pencil" : "add"} size={16} color="#16a34a" />
                </TouchableOpacity>
              </View>

              {farmerProfile ? (
                <View>
                  <Text className="text-green-600 text-sm mb-3">✅ Profile complete - AI gives personalized advice</Text>

                  {farmerProfile.farmSize && (
                    <View className="flex-row items-center py-2">
                      <View className="bg-green-50 rounded-full p-2 mr-3">
                        <Ionicons name="resize" size={16} color="#16a34a" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-600 text-sm">Farm Size</Text>
                        <Text className="text-gray-800 font-medium">{farmerProfile.farmSize}</Text>
                      </View>
                    </View>
                  )}

                  {farmerProfile.primaryCrops?.length > 0 && (
                    <View className="flex-row items-center py-2">
                      <View className="bg-green-50 rounded-full p-2 mr-3">
                        <Ionicons name="leaf" size={16} color="#16a34a" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-600 text-sm">Primary Crops</Text>
                        <Text className="text-gray-800 font-medium">{farmerProfile.primaryCrops.slice(0, 3).join(', ')}{farmerProfile.primaryCrops.length > 3 ? '...' : ''}</Text>
                      </View>
                    </View>
                  )}

                  {farmerProfile.soilType?.length > 0 && (
                    <View className="flex-row items-center py-2">
                      <View className="bg-green-50 rounded-full p-2 mr-3">
                        <Ionicons name="earth" size={16} color="#16a34a" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-600 text-sm">Soil Type</Text>
                        <Text className="text-gray-800 font-medium">{farmerProfile.soilType.join(', ')}</Text>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => setShowFarmerProfileSetup(true)}
                    className="bg-green-50 rounded-lg p-3 mt-2 flex-row items-center justify-center"
                  >
                    <Ionicons name="create-outline" size={16} color="#16a34a" />
                    <Text className="text-green-600 font-medium ml-2">Update Profile</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text className="text-amber-600 text-sm mb-3">⚠️ Setup your profile for personalized AI advice</Text>
                  <Text className="text-gray-600 text-sm mb-4">
                    Complete your farmer profile to get personalized recommendations based on your crops, soil type, farming practices, and challenges.
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowFarmerProfileSetup(true)}
                    className="bg-green-600 rounded-lg p-3 flex-row items-center justify-center"
                  >
                    <Ionicons name="add-circle" size={16} color="white" />
                    <Text className="text-white font-medium ml-2">Setup AI Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Actions */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text className="text-red-600 font-semibold ml-2">Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Farmer Profile Setup Modal */}
        {showFarmerProfileSetup && (
          <FarmerProfileSetup
            initialProfile={farmerProfile || {}}
            onSave={handleSaveFarmerProfile}
            onSkip={() => setShowFarmerProfileSetup(false)}
            isModal={true}
            onClose={() => setShowFarmerProfileSetup(false)}
          />
        )}

        {/* Edit Profile Modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text className="text-green-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Edit Profile</Text>
                <TouchableOpacity onPress={handleSaveProfile}>
                  <Text className="text-green-600 font-medium">Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 px-6 py-6">
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
                  <TextInput
                    value={editedUser.full_name}
                    onChangeText={(text) => setEditedUser(prev => ({ ...prev, full_name: text }))}
                    className="bg-gray-50 rounded-xl p-4 text-gray-800"
                    placeholder="Enter your full name"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Email</Text>
                  <TextInput
                    value={editedUser.email}
                    onChangeText={(text) => setEditedUser(prev => ({ ...prev, email: text }))}
                    className="bg-gray-50 rounded-xl p-4 text-gray-800"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
                  <TextInput
                    value={editedUser.phone_number}
                    onChangeText={(text) => setEditedUser(prev => ({ ...prev, phone_number: text }))}
                    className="bg-gray-50 rounded-xl p-4 text-gray-800"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Location</Text>
                  <TextInput
                    value={editedUser.location}
                    onChangeText={(text) => setEditedUser(prev => ({ ...prev, location: text }))}
                    className="bg-gray-50 rounded-xl p-4 text-gray-800"
                    placeholder="Enter your location"
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
}