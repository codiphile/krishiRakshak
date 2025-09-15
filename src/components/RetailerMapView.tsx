import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Retailer, UserLocation, SearchFilters } from '../types/retailer';
import { LocationService } from '../services/locationService';
import { RetailerService } from '../services/retailerService';

interface RetailerMapViewProps {
  onRetailerSelect: (retailer: Retailer) => void;
  filters: SearchFilters;
  onSwitchToList: () => void;
}

export const RetailerMapView: React.FC<RetailerMapViewProps> = ({
  onRetailerSelect,
  filters,
  onSwitchToList
}) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadRetailers();
    }
  }, [userLocation, filters]);

  const initializeLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
      } else {
        setUserLocation({
          latitude: 28.7041,
          longitude: 77.1025,
        });
        Alert.alert(
          'Location Access',
          'Using default location. Please enable location permissions for accurate results.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      setUserLocation({
        latitude: 28.7041,
        longitude: 77.1025,
      });
    }
  };

  const loadRetailers = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const searchResults = await RetailerService.searchRetailers(userLocation, filters);
      setRetailers(searchResults);
    } catch (error) {
      console.error('Error loading retailers:', error);
      Alert.alert('Error', 'Failed to load retailers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'fertilizers': return '#10b981';
      case 'pesticides': return '#ef4444';
      case 'seeds': return '#f59e0b';
      case 'equipment': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading || !userLocation) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-600 mt-2">Loading map...</Text>
        <TouchableOpacity
          onPress={onSwitchToList}
          className="mt-4 bg-green-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Switch to List View</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // For now, show a message about map view and fallback to encourage list view
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-8">
      <Ionicons name="map" size={64} color="#9ca3af" />
      <Text className="text-gray-700 text-xl font-semibold mt-4 text-center">
        Map View Coming Soon
      </Text>
      <Text className="text-gray-500 text-center mt-2 mb-6">
        Google Maps integration requires additional setup. For now, please use the list view to find nearby retailers.
      </Text>

      <TouchableOpacity
        onPress={onSwitchToList}
        className="bg-green-600 px-6 py-3 rounded-xl flex-row items-center"
      >
        <Ionicons name="list" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">Switch to List View</Text>
      </TouchableOpacity>

      <View className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <Text className="text-blue-800 font-medium mb-2">
          📍 List View Features:
        </Text>
        <Text className="text-blue-700 text-sm">
          • Shows distance from your location{'\n'}
          • Government subsidy information{'\n'}
          • Contact details and navigation{'\n'}
          • Product listings with prices{'\n'}
          • Powered by Gemini AI search
        </Text>
      </View>
    </View>
  );
};