import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceInputService } from '../services/voiceInputService';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const pulseAnim = new Animated.Value(1);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start pulse animation
      const startPulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isRecording) startPulse();
        });
      };
      startPulse();
    } else {
      setRecordingDuration(0);
      pulseAnim.setValue(1);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      VoiceInputService.cleanup();
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && !isLoading && !isRecording) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleVoicePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const success = await VoiceInputService.startRecording();
      if (success) {
        setIsRecording(true);
        setRecordingDuration(0);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);

      const recording = await VoiceInputService.stopRecording();
      if (recording) {
        // Convert speech to text
        const transcription = await VoiceInputService.speechToText(recording.uri);
        if (transcription) {
          setMessage(transcription);
        }
      }
    } catch (error) {
      console.error('Failed to process recording:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="bg-white border-t border-gray-200 px-4 pt-3" style={{ paddingBottom: 40 }}>
        {/* Recording Status Bar */}
        {isRecording && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-red-500 rounded-full w-3 h-3 mr-2" />
              <Text className="text-red-700 font-medium">Recording your voice...</Text>
            </View>
            <Text className="text-red-600 font-mono">{formatDuration(recordingDuration)}</Text>
          </View>
        )}

        {/* Recording Instructions */}
        {isRecording && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <Text className="text-blue-700 text-sm text-center">
              🎤 Speak clearly about your farming question in Hindi or English. Tap the stop button when done.
            </Text>
          </View>
        )}

        {/* Transcribing Status */}
        {isTranscribing && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <View className="flex-row items-center justify-center mb-2">
              <Ionicons name="sync" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text className="text-blue-700 font-medium">Converting speech to text with AI...</Text>
            </View>
            <Text className="text-blue-600 text-xs text-center">
              🎯 Demo: Intelligent voice recognition for farming questions
            </Text>
          </View>
        )}

        <View className="flex-row items-center space-x-3">
          {/* Voice Input Button */}
          <Animated.View style={{ transform: [{ scale: isRecording ? pulseAnim : 1 }] }}>
            <TouchableOpacity
              onPress={handleVoicePress}
              disabled={isLoading || isTranscribing}
              className={`rounded-full p-3 ${
                isRecording
                  ? 'bg-red-500'
                  : isTranscribing
                    ? 'bg-blue-400'
                    : 'bg-green-600'
              }`}
              style={{
                shadowColor: isRecording ? '#EF4444' : '#16a34a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons
                name={
                  isRecording
                    ? "stop"
                    : isTranscribing
                      ? "sync"
                      : "mic"
                }
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Text Input */}
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-3">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={
                isRecording
                  ? "🎤 Recording your voice..."
                  : isTranscribing
                    ? "🤖 AI converting speech to text..."
                    : "Ask about farming, crops, diseases... or use voice with AI 🎤"
              }
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              className="text-gray-800 text-base min-h-[24px] max-h-[96px]"
              style={{ textAlignVertical: 'center' }}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
              editable={!isRecording && !isTranscribing}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim() || isLoading || isRecording || isTranscribing}
            className={`rounded-full p-3 ${
              message.trim() && !isLoading && !isRecording && !isTranscribing
                ? 'bg-green-600'
                : 'bg-gray-300'
            }`}
          >
            <Ionicons
              name={isLoading ? "hourglass" : "send"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Voice Input Hint */}
        {!isRecording && !isTranscribing && message.trim() === '' && (
          <View className="mt-2 flex-row items-center justify-center">
            <Ionicons name="mic" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs ml-1">🎯 Smart voice input demo - speak your farming questions</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};