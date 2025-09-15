import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, useWindowDimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface GovernmentScheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  howToApply: string;
  icon: string;
  color: string;
}

interface GovernmentSchemesSliderProps {
  schemes: GovernmentScheme[];
}

// Simple Dot Component
const Dot: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <View
      style={{
        height: 8,
        width: isActive ? 24 : 8,
        borderRadius: 4,
        backgroundColor: isActive ? '#16a34a' : '#d1d5db',
        marginHorizontal: 4,
      }}
    />
  );
};

// Pagination Component
const Pagination: React.FC<{
  schemes: GovernmentScheme[];
  currentIndex: number;
}> = ({ schemes, currentIndex }) => {
  return (
    <View className="flex-row justify-center mt-4 py-2">
      {schemes.map((_, index) => (
        <Dot key={index} isActive={index === currentIndex} />
      ))}
    </View>
  );
};

// Render Item Component with Reanimated
const RenderSchemeItem: React.FC<{
  item: GovernmentScheme;
  index: number;
  width: number;
  scrollX: Animated.SharedValue<number>;
  onPress: (scheme: GovernmentScheme) => void;
}> = ({ item, index, width, scrollX, onPress }) => {
  // Glowing animation for ACTIVE badge
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    glowAnimation.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  // Scale animation for carousel item
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  // Glowing style for ACTIVE badge
  const glowingStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      glowAnimation.value,
      [0, 0.5, 1],
      ['#B20000', '#FF0000', '#B20000']
    );

    const shadowOpacity = interpolate(
      glowAnimation.value,
      [0, 0.5, 1],
      [0.3, 1, 0.3]
    );

    const shadowRadius = interpolate(
      glowAnimation.value,
      [0, 0.5, 1],
      [3, 20, 3]
    );

    return {
      backgroundColor,
      shadowColor: backgroundColor,
      shadowOpacity,
      shadowRadius,
      shadowOffset: { width: 0, height: 0 },
      elevation: shadowRadius,
    };
  });

  return (
    <Animated.View style={[{ width, paddingHorizontal: 16 }, animatedStyle]}>
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          height: 220,
          backgroundColor: '#16a34a',
          shadowColor: '#16a34a',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
          {/* Header Section */}
          <View className="p-4 pb-0">
            <View className="flex-row justify-between items-center mb-3">
              <View className="bg-white bg-opacity-20 rounded-2xl p-2">
                <Text className="text-xl">💰</Text>
              </View>
              <Animated.View
                className="rounded-full px-4 py-2"
                style={glowingStyle}
              >
                <Text className="text-white text-sm font-black">ACTIVE</Text>
              </Animated.View>
            </View>
            
            <Text className="text-white text-xl font-black leading-tight mb-2" numberOfLines={2}>
              {item.title}
            </Text>
          </View>

          {/* Content Section */}
          <View className="px-4 pb-6 flex-1 justify-between">
            <Text className="text-white text-opacity-95 text-base leading-relaxed mb-5" numberOfLines={2}>
              {item.description}
            </Text>

            <TouchableOpacity
              className="bg-white rounded-xl py-2 px-6 mb-2"
              onPress={() => onPress(item)}
              activeOpacity={0.8}
            >
              <Text className="text-green-600 font-bold text-base text-center">
                Know More →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </Animated.View>
  );
};

export const GovernmentSchemesSlider: React.FC<GovernmentSchemesSliderProps> = ({ schemes }) => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const flatListRef = useRef<FlatList<GovernmentScheme>>(null);

  const SLIDE_WIDTH = width;


  // Reanimated shared values
  const scrollX = useSharedValue(0);

  // Scroll handler for regular FlatList
  const scrollHandler = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  // Handle viewable items changed
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null) {
      setCurrentIndex(viewableItems[0].index);
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  // Update pagination index when scrolling
  const updatePaginationIndex = (index: number) => {
    setPaginationIndex(index);
  };

  // No auto-slide - pagination responds only to manual scrolling

  // Show scheme details
  const showSchemeDetails = (scheme: GovernmentScheme) => {
    Alert.alert(
      scheme.title,
      `📋 Description: ${scheme.description}\n\n✅ Eligibility: ${scheme.eligibility}\n\n💰 Benefits: ${scheme.benefits}\n\n📝 How to Apply: ${scheme.howToApply}`,
      [{ text: 'Close', style: 'default' }]
    );
  };



  if (schemes.length === 0) {
    return (
      <View className="mx-4 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <Text className="text-blue-800 text-center font-medium">
          Government schemes information will be displayed here
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between px-4 mb-3">
        <View className="flex-row items-center">
          <View className="bg-blue-100 rounded-full p-2 mr-3">
            <Ionicons name="information-circle" size={20} color="#1e40af" />
          </View>
          <Text className="text-gray-800 text-lg font-semibold">Latest Government Schemes</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        style={{ height: 240, flexGrow: 0 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        data={schemes}
        keyExtractor={(item, index) => `scheme_${item.id}_${index}`}
        contentContainerStyle={{}}
        getItemLayout={(_, index) => ({
          length: SLIDE_WIDTH,
          offset: SLIDE_WIDTH * index,
          index,
        })}
        snapToInterval={SLIDE_WIDTH}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <RenderSchemeItem
            item={item}
            index={index}
            width={SLIDE_WIDTH}
            scrollX={scrollX}
            onPress={showSchemeDetails}
          />
        )}
      />

      <Pagination schemes={schemes} currentIndex={paginationIndex} />
    </View>
  );
};