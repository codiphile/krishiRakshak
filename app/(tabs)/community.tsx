import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CommunityScreen() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center">
            <View className="bg-green-500 rounded-full p-2 mr-3">
              <FontAwesome name="users" size={24} color="white" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">Community</Text>
              <Text className="text-green-100 text-sm">Connect with fellow farmers</Text>
            </View>
          </View>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">Community feature coming soon!</Text>
        </View>
      </SafeAreaView>
    </>
  );
}