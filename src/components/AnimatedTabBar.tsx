import React, { useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface TabBarProps {
  activeIndex: number;
  onTabPress: (index: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60;
const CIRCLE_RADIUS = 30;

const tabs = [
  { icon: 'home', iconType: 'ionicons', title: 'Home' },
  { icon: 'photo-camera', iconType: 'material', title: 'Camera' },
  { icon: 'user', iconType: 'fontawesome', title: 'Profile' },
];

export const AnimatedTabBar: React.FC<TabBarProps> = ({ activeIndex, onTabPress }) => {
  const circleX = useSharedValue(screenWidth / 6); // Start at first tab position

  useEffect(() => {
    const tabWidth = screenWidth / tabs.length;
    const newX = tabWidth * activeIndex + tabWidth / 2;

    circleX.value = withSpring(newX, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex]);

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: circleX.value - CIRCLE_RADIUS }],
    };
  });


  const renderIcon = (tab: any, index: number, isActive: boolean) => {
    const iconColor = isActive ? '#ffffff' : '#9CA3AF';
    const iconSize = isActive ? 24 : 20;

    // Safeguard against undefined tab
    if (!tab || !tab.iconType) {
      return <Ionicons name="home" size={iconSize} color={iconColor} />;
    }

    switch (tab.iconType) {
      case 'ionicons':
        return <Ionicons name={tab.icon as any} size={iconSize} color={iconColor} />;
      case 'material':
        return <MaterialIcons name={tab.icon as any} size={iconSize} color={iconColor} />;
      case 'fontawesome':
        return <FontAwesome name={tab.icon as any} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name="home" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      {/* Floating Circle */}
      <Animated.View style={[styles.floatingCircle, circleAnimatedStyle]}>
        <View style={styles.circle}>
          {renderIcon(tabs[activeIndex] || tabs[0], activeIndex, true)}
        </View>
      </Animated.View>

      {/* Tab Items */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <TouchableOpacity
              key={index}
              style={styles.tabItem}
              onPress={() => onTabPress(index)}
              activeOpacity={0.7}
            >
              {!isActive && renderIcon(tab, index, false)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT + 15,
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingCircle: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT - CIRCLE_RADIUS + 5,
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    zIndex: 10,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: screenWidth,
    height: TAB_BAR_HEIGHT,
    paddingBottom: 15,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});