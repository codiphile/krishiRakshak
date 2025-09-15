import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

interface TypingIndicatorProps {
  isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isVisible) {
      const animateTyping = () => {
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity1, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity1, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity2, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity2, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity3, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity3, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
        animation.start();
        return animation;
      };

      const animation = animateTyping();
      return () => animation.stop();
    }
  }, [isVisible, opacity1, opacity2, opacity3]);

  if (!isVisible) return null;

  return (
    <View className="mb-4 px-4 items-start">
      <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
        <View className="flex-row items-center">
          <Text className="text-gray-600 mr-2">KrishiRakshak AI is typing</Text>
          <View className="flex-row space-x-1">
            <Animated.View
              className="w-2 h-2 rounded-full bg-green-600"
              style={{ opacity: opacity1 }}
            />
            <Animated.View
              className="w-2 h-2 rounded-full bg-green-600"
              style={{ opacity: opacity2 }}
            />
            <Animated.View
              className="w-2 h-2 rounded-full bg-green-600"
              style={{ opacity: opacity3 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};