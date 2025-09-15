import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionPress: (question: string) => void;
  isVisible: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onQuestionPress,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <View className="px-4 pb-4">
      <View className="bg-green-50 rounded-xl p-4 border border-green-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="bg-green-100 rounded-full p-2 mr-3">
              <Ionicons name="bulb" size={16} color="#16a34a" />
            </View>
            <Text className="text-green-800 font-medium">Suggested Questions</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="mic" size={14} color="#16a34a" />
            <Text className="text-green-600 text-xs ml-1">Voice Demo</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {questions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onQuestionPress(question)}
                className="bg-white rounded-full px-4 py-2 border border-green-300 shadow-sm"
                style={{ minWidth: 200 }}
              >
                <Text className="text-green-700 text-sm font-medium text-center">
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};