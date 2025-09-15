import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue
} from 'react-native-reanimated';
import { ImageSliderType } from '../data/sliderData';

interface SliderItemProps {
  item: ImageSliderType;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
}

export const SliderItem: React.FC<SliderItemProps> = ({
  item,
  index,
  scrollX,
  itemWidth
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
      [-itemWidth * 0.25, 0, itemWidth * 0.25],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateX }],
    };
  });

  const handlePress = () => {
    Alert.alert(
      item.title,
      item.description,
      [{ text: 'Learn More', style: 'default' }, { text: 'Close', style: 'cancel' }]
    );
  };

  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          paddingHorizontal: 16,
        },
        animatedStyle
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View
          style={{
            width: 300,
            height: 500,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
            resizeMode="cover"
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
            }}
          />

          <View className="absolute top-4 right-4">
            <View className="bg-white bg-opacity-20 rounded-full p-2">
              <Ionicons name="heart-outline" size={24} color="white" />
            </View>
          </View>

          <View className="absolute bottom-0 left-0 right-0 p-6">
            <Text
              className="text-white text-xl font-bold mb-2"
              numberOfLines={2}
              style={{ fontSize: 18 }}
            >
              {item.title}
            </Text>
            <Text
              className="text-white text-opacity-90"
              numberOfLines={3}
              style={{ fontSize: 12, lineHeight: 16 }}
            >
              {item.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};