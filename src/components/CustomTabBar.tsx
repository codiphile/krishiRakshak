import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AnimatedTabBar } from './AnimatedTabBar';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const handleTabPress = (index: number) => {
    const route = state.routes[index];
    navigation.navigate(route.name);
  };

  return (
    <View style={styles.container}>
      <AnimatedTabBar
        activeIndex={state.index}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});