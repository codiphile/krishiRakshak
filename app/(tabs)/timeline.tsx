import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { localTimelineService, TimelineData } from '../../src/services/localTimelineService';

export default function TimelineScreen() {
  const [crop, setCrop] = useState('');
  const [landSize, setLandSize] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedTimelines, setSavedTimelines] = useState<TimelineData[]>([]);

  const fetchSavedTimelines = useCallback(async () => {
    const history = await localTimelineService.getTimelineHistory();
    setSavedTimelines(history);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSavedTimelines();
    }, [fetchSavedTimelines])
  );

  const handleGenerateTimeline = async () => {
    if (!crop || !landSize || !location) {
      Alert.alert('Missing Information', 'Please fill in all fields to generate a timeline.');
      return;
    }
    setIsLoading(true);
    // Mock timeline generation based on new design
    setTimeout(async () => {
      // Generate timeline starting from current month
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-11
      const currentYear = currentDate.getFullYear();

      // Generate 6 months timeline starting from current month
      const generateTimelineMonths = () => {
        const months = [];
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        for (let i = 0; i < 6; i++) {
          const monthIndex = (currentMonth + i) % 12;
          const year = currentYear + Math.floor((currentMonth + i) / 12);
          months.push(`${monthNames[monthIndex]} ${year}`);
        }
        return months;
      };

      const timelineMonths = generateTimelineMonths();

      const mockTimeline: Omit<TimelineData, 'id' | 'createdAt'> = {
        crop: crop,
        landSize: landSize,
        location: location,
        timeline: [
          {
            month: timelineMonths[0],
            phase: 'Pre-Sowing',
            activities: [
              '- Plough the land thoroughly to create a fine tilth.',
              '- Incorporate 10-12 tons of farmyard manure per acre.',
              '- Level the field to ensure uniform water distribution.',
            ],
            recommendation: 'AI Recommendation: Given the forecast for minimal rainfall, consider an extra round of ploughing to improve soil moisture retention.',
            isCurrent: false,
          },
          {
            month: timelineMonths[1],
            phase: 'Sowing & Early Growth',
            activities: [
              '- Procure high-quality certified seeds suitable for the region.',
              '- Sow seeds at a depth of 2-3 cm with a spacing of 20x15 cm.',
              '- Apply a pre-emergence herbicide within 3 days of sowing.',
            ],
            recommendation: 'AI Recommendation: The current temperature is optimal for germination; ensure consistent light irrigation for the next 10 days.',
            isCurrent: false,
          },
          {
            month: timelineMonths[2],
            phase: 'Tillering Stage',
            activities: [
              '- Apply the first top dressing of nitrogen fertilizer (30% of total).',
              '- Maintain a thin layer of water (2-3 cm) in the field.',
              '- Monitor for early signs of stem borer and leaf folder pests.',
            ],
            recommendation: 'AI Recommendation: Weather patterns suggest a high probability of pest attacks; be prepared with neem oil-based pesticides.',
            isCurrent: false,
          },
          {
            month: timelineMonths[3],
            phase: 'Panicle Initiation',
            activities: [
              '- Apply the second dose of nitrogen and the full dose of potassium.',
              '- Increase water level to 5 cm to support reproductive growth.',
              '- Implement bird scaring measures as grains start to form.',
            ],
            recommendation: 'AI Recommendation: Nutrient uptake is critical now; a soil moisture check suggests a 10% increase in irrigation is needed.',
            isCurrent: false,
          },
          {
            month: timelineMonths[4],
            phase: 'Flowering & Milking',
            activities: [
              '- Ensure the field is continuously irrigated to avoid water stress.',
              '- Monitor for fungal diseases like blast and sheath blight.',
              '- Avoid spraying any pesticides that could harm pollinators.',
            ],
            recommendation: 'AI Recommendation: High humidity is forecasted, increasing the risk of fungal infection; ensure good air circulation around the plants.',
            isCurrent: false,
          },
          {
            month: timelineMonths[5],
            phase: 'Harvest & Post-Harvest',
            activities: [
              '- Harvest the crop when 80-85% of the grains are golden yellow.',
              '- Dry the harvested paddy to a moisture content of 12-14%.',
              '- Store the grains in a clean, dry, and well-ventilated facility.',
            ],
            recommendation: 'AI Recommendation: To maximize yield, plan your harvest for a day with clear skies and low humidity as per the 5-day forecast.',
            isCurrent: false,
          },
        ],
        nextCrop: 'Black Gram or Green Gram',
      };

      try {
        setIsLoading(false);
        // Store timeline in AsyncStorage and navigate
        await localTimelineService.saveTimeline(mockTimeline);
        router.push('/(tabs)/TimelineResult');
      } catch (error) {
        console.error('Error saving timeline:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Failed to save timeline. Please try again.');
      }
    }, 1500);
  };

  const handleViewTimeline = async (timeline: TimelineData) => {
    // No need to save again since it's already saved, just navigate
    router.push('/(tabs)/TimelineResult');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center">
            <View className="bg-green-500 rounded-full p-2 mr-3">
              <Ionicons name="calendar" size={24} color="white" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">AI Farming Timeline</Text>
              <Text className="text-green-100 text-sm">Plan your cultivation period</Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Input Form */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-gray-800 text-lg font-semibold mb-4">Cultivation Details</Text>
            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Crop Name</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 border border-gray-200"
                placeholder="Enter crop name (e.g., Rice, Wheat, Maize)"
                placeholderTextColor="#9CA3AF"
                value={crop}
                onChangeText={setCrop}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Land Size</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 border border-gray-200"
                placeholder="Enter land size (e.g., 2 acres, 1 hectare)"
                placeholderTextColor="#9CA3AF"
                value={landSize}
                onChangeText={setLandSize}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 text-sm mb-2 font-medium">Location</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 border border-gray-200"
                placeholder="Enter your location (e.g., Chennai, Tamil Nadu)"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <TouchableOpacity
              className={`rounded-xl py-4 ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
              onPress={handleGenerateTimeline}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">Generate Timeline</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Saved Timelines */}
          {savedTimelines.length > 0 && (
            <View className="bg-white rounded-xl p-6 shadow-sm">
              <Text className="text-gray-800 text-lg font-semibold mb-4">Saved Timelines</Text>
              {savedTimelines.map((timeline) => (
                <TouchableOpacity
                  key={timeline.id}
                  className="bg-gray-100 rounded-lg p-4 mb-3"
                  onPress={() => handleViewTimeline(timeline)}
                >
                  <Text className="text-gray-800 font-semibold">{timeline.crop} - {timeline.location}</Text>
                  <Text className="text-gray-600 text-sm mt-1">Saved on {new Date(timeline.createdAt).toLocaleDateString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
