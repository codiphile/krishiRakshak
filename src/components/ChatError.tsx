import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatErrorProps {
  onRetry: () => void;
  message?: string;
}

export const ChatError: React.FC<ChatErrorProps> = ({
  onRetry,
  message = "Failed to send message. Please try again."
}) => {
  return (
    <View className="px-4 py-2">
      <View className="bg-red-50 border border-red-200 rounded-xl p-4">
        <View className="flex-row items-center mb-3">
          <View className="bg-red-100 rounded-full p-2 mr-3">
            <Ionicons name="warning" size={16} color="#dc2626" />
          </View>
          <Text className="text-red-800 font-medium flex-1">Error</Text>
        </View>
        <Text className="text-red-700 text-sm mb-3">{message}</Text>
        <TouchableOpacity
          onPress={onRetry}
          className="bg-red-600 rounded-full px-4 py-2 self-start"
        >
          <Text className="text-white font-medium text-sm">Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};