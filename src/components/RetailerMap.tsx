import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, Text } from 'react-native';
import { MapView, Marker } from 'expo-maps';
import { Ionicons } from '@expo/vector-icons';
import { Retailer, UserLocation, SearchFilters } from '../types/retailer';
import { LocationService } from '../services/locationService';
import { RetailerService } from '../services/retailerService';

interface RetailerMapProps {
  onRetailerSelect: (retailer: Retailer) => void;
  filters: SearchFilters;
}

export const RetailerMap: React.FC<RetailerMapProps> = ({ onRetailerSelect, filters }) => {
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

  const getMarkerIcon = (category: string) => {
    switch (category) {
      case 'fertilizers': return 'leaf';
      case 'pesticides': return 'bug';
      case 'seeds': return 'flower';
      case 'equipment': return 'construct';
      default: return 'storefront';
    }
  };

  if (loading || !userLocation) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-600 mt-2">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {retailers.map((retailer) => (
          <Marker
            key={retailer.id}
            coordinate={{
              latitude: retailer.latitude,
              longitude: retailer.longitude,
            }}
            onPress={() => onRetailerSelect(retailer)}
          >
            <View className="items-center">
              <View
                className="rounded-full p-2 shadow-lg"
                style={{ backgroundColor: getMarkerColor(retailer.category) }}
              >
                <Ionicons
                  name={getMarkerIcon(retailer.category) as any}
                  size={20}
                  color="white"
                />
              </View>
              {retailer.subsidyAvailable && (
                <View className="bg-green-500 rounded-full px-2 py-1 mt-1">
                  <Text className="text-white text-xs font-bold">SUBSIDY</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {retailers.length === 0 && !loading && (
        <View className="absolute inset-0 justify-center items-center bg-white bg-opacity-80">
          <Ionicons name="search" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-lg font-medium mt-2">No retailers found</Text>
          <Text className="text-gray-400 text-sm text-center mt-1">
            Try adjusting your filters or search area
          </Text>
        </View>
      )}
    </View>
  );
};