import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar, ActivityIndicator, Animated } from 'react-native';
import { localTimelineService, TimelineData } from '../services/localTimelineService';
import { Ionicons } from '@expo/vector-icons';

export default function TimelineResultScreen() {
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const blinkAnimation = new Animated.Value(1);

  useEffect(() => {
    loadLatestTimeline();
    startBlinkAnimation();
  }, []);

  const startBlinkAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadLatestTimeline = async () => {
    try {
      const history = await localTimelineService.getTimelineHistory();
      if (history.length > 0) {
        setTimeline(history[0]); // Get the most recent timeline
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
      Alert.alert('Error', 'Failed to load timeline data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!timeline) return;

    try {
      Alert.alert(
        'Export Timeline',
        'Timeline export feature coming soon! You can view this timeline anytime in your saved timelines.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export timeline.');
    }
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-600 mt-4">Loading timeline...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!timeline) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="flex-1 justify-center items-center">
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text className="text-gray-800 text-lg font-semibold mt-4">No Timeline Found</Text>
            <Text className="text-gray-600 mt-2">Please generate a timeline first.</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-gray-800 text-2xl font-bold mb-2">
              Cultivation Timeline for {timeline.crop}
            </Text>
            <Text className="text-gray-600 text-sm mb-4">
              Based on your location: {timeline.location} for {timeline.landSize}.
            </Text>

            {timeline.timeline.map((item: any, index: number) => {
              // Check if this month is the current month
              const currentDate = new Date();
              const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
              const isCurrentMonth = item.month === currentMonth;

              return (
                <View
                  key={index}
                  className={`mb-6 p-5 rounded-xl shadow-sm border relative ${
                    isCurrentMonth
                      ? 'border-green-300 bg-green-50 shadow-green-100'
                      : 'border-gray-200 bg-white shadow-gray-100'
                  }`}
                  style={{
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                >
                  {isCurrentMonth && (
                    <Animated.View
                      className="absolute top-4 left-4 bg-green-500 rounded-full px-3 py-1 z-10 shadow-lg"
                      style={{
                        opacity: blinkAnimation,
                        shadowColor: '#16a34a',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5
                      }}
                    >
                      <Text className="text-white font-bold text-xs">CURRENT</Text>
                    </Animated.View>
                  )}

                  <View className="mb-4">
                    <Text className="text-gray-800 font-bold text-lg">{item.month} - {item.phase}</Text>
                  </View>

                <View className="mb-4">
                  <Text className="text-gray-700 font-semibold mb-3">📋 Recommended Activities:</Text>
                  <View className="bg-gray-50 rounded-lg p-3">
                    {item.activities.map((activity: string, taskIndex: number) => (
                      <Text key={taskIndex} className="text-gray-700 mb-1 leading-5">
                        • {activity.replace('- ', '')}
                      </Text>
                    ))}
                  </View>
                </View>

                <View className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-blue-700 font-semibold text-sm">🤖 AI Recommendation</Text>
                  </View>
                  <Text className="text-blue-800 text-sm leading-5">
                    {item.recommendation.replace('AI Recommendation: ', '')}
                  </Text>
                </View>
              </View>
              );
            })}

            <View className="mt-4">
              <Text className="text-gray-800 text-lg font-semibold">Next Suggested Crop</Text>
              <Text className="text-green-600 text-xl font-bold mt-1">{timeline.nextCrop}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 mt-6 flex-row justify-center items-center"
            onPress={handleDownload}
          >
            <Ionicons name="download" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-lg font-semibold">Export Timeline</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
