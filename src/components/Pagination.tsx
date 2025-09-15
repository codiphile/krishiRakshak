import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue
} from 'react-native-reanimated';

interface PaginationProps {
  data: any[];
  scrollX: SharedValue<number>;
  index: number;
}

export const Pagination: React.FC<PaginationProps> = ({ data, scrollX, index }) => {
  return (
    <View className="flex-row justify-center mt-4">
      {data.map((_, i) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const widthAnimation = interpolate(
            scrollX.value,
            [(i - 1) * 300, i * 300, (i + 1) * 300],
            [8, 20, 8],
            Extrapolate.CLAMP
          );

          const opacityAnimation = interpolate(
            scrollX.value,
            [(i - 1) * 300, i * 300, (i + 1) * 300],
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
          );

          return {
            width: widthAnimation,
            opacity: opacityAnimation,
          };
        });

        return (
          <Animated.View
            key={i}
            style={[
              animatedDotStyle,
              {
                height: 8,
                borderRadius: 4,
                backgroundColor: '#16a34a',
                marginHorizontal: 4,
              }
            ]}
          />
        );
      })}
    </View>
  );
};