import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../../src/components/ChatMessage';
import { ChatInput } from '../../src/components/ChatInput';
import { SuggestedQuestions } from '../../src/components/SuggestedQuestions';
import { TypingIndicator } from '../../src/components/TypingIndicator';
import { FarmerProfileSetup } from '../../src/components/FarmerProfileSetup';
import { useChat } from '../../src/hooks/useChat';
import { geminiService } from '../../src/services/gemini';
import { farmerProfileService } from '../../src/services/farmerProfile';
import { FarmerProfile } from '../../src/types/farmerProfile';

export default function ChatScreen() {
  const { messages, isLoading, sendMessage, clearMessages, loadMessages } = useChat();
  const flatListRef = useRef<FlatList>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    loadMessages();
    checkProfile();
  }, [loadMessages]);

  const checkProfile = async () => {
    try {
      const profileExists = await farmerProfileService.hasProfile();
      setHasProfile(profileExists);
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearMessages,
        },
      ]
    );
  };

  const handleSaveProfile = async (profile: Partial<FarmerProfile>) => {
    try {
      await farmerProfileService.saveProfile(profile);
      setHasProfile(true);
      setShowProfileSetup(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleSkipProfile = () => {
    setHasProfile(true);
    setShowProfileSetup(false);
  };

  const suggestedQuestions = geminiService.getFarmingSuggestions();
  const showSuggestions = messages.length <= 1 && !isLoading;

  // Show profile setup if no profile exists
  if (showProfileSetup) {
    return (
      <FarmerProfileSetup
        onSave={handleSaveProfile}
        onSkip={handleSkipProfile}
        isModal={true}
        onClose={() => setShowProfileSetup(false)}
      />
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-500 rounded-full p-2 mr-3">
                <Ionicons name="chatbubbles" size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">KrishiRakshak AI</Text>
                <Text className="text-green-100 text-sm">
                  {hasProfile ? 'Personalized farming assistant' : 'Your farming assistant'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-2">
              {hasProfile === false && (
                <TouchableOpacity
                  onPress={() => setShowProfileSetup(true)}
                  className="bg-green-500 rounded-full p-2"
                >
                  <Ionicons name="person-add" size={20} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleClearChat}
                className="bg-green-500 rounded-full p-2"
              >
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Setup Prompt */}
        {hasProfile === false && (
          <View className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="information-circle" size={24} color="#F59E0B" />
              <View className="ml-3 flex-1">
                <Text className="text-yellow-800 font-semibold">Get Personalized Advice!</Text>
                <Text className="text-yellow-700 text-sm mt-1">
                  Set up your farmer profile to get personalized recommendations based on your crops, soil, and farming practices.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowProfileSetup(true)}
                  className="bg-yellow-500 rounded-lg px-4 py-2 mt-2 self-start"
                >
                  <Text className="text-white font-medium">Setup Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessage message={item} />}
          className="flex-1"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing Indicator */}
        <TypingIndicator isVisible={isLoading} />

        {/* Suggested Questions */}
        <SuggestedQuestions
          questions={suggestedQuestions}
          onQuestionPress={sendMessage}
          isVisible={showSuggestions}
        />

        {/* Chat Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </SafeAreaView>
    </>
  );
}