import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceInputService } from '../services/voiceInputService';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (isSpeaking) {
      await VoiceInputService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await VoiceInputService.speakText(message.text);
      } catch (error) {
        console.error('Failed to speak text:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  return (
    <View
      className={`mb-4 px-4 ${
        message.isUser ? 'items-end' : 'items-start'
      }`}
    >
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          message.isUser
            ? 'bg-green-600 rounded-br-md'
            : 'bg-white rounded-bl-md shadow-sm border border-gray-100'
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            message.isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.text}
        </Text>

        <View className={`flex-row items-center justify-between mt-2 ${
          message.isUser ? '' : 'mt-1'
        }`}>
          <Text
            className={`text-xs ${
              message.isUser ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {message.timestamp.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>

          {/* Text-to-Speech button for AI messages */}
          {!message.isUser && (
            <TouchableOpacity
              onPress={handleSpeak}
              className="ml-3 bg-green-50 rounded-full p-2"
              style={{
                shadowColor: '#16a34a',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons
                name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                size={14}
                color="#16a34a"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};