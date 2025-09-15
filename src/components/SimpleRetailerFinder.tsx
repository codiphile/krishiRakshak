import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Retailer, UserLocation, SearchFilters } from '../types/retailer';
import { LocationService } from '../services/locationService';
import { RetailerService } from '../services/retailerService';
import { RetailersList } from './RetailersList';

interface SimpleRetailerFinderProps {
  filters: SearchFilters;
  onRetailerSelect: (retailer: Retailer) => void;
  onDataChange?: (retailers: Retailer[], userLocation: UserLocation) => void;
}

export const SimpleRetailerFinder: React.FC<SimpleRetailerFinderProps> = ({
  filters,
  onRetailerSelect,
  onDataChange
}) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<string>('Getting your location...');

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
      setLocationStatus('Getting your location...');
      const location = await LocationService.getCurrentLocation();

      if (location) {
        setUserLocation(location);
        setLocationStatus('');
      } else {
        // Use Delhi as default location
        setUserLocation({
          latitude: 28.7041,
          longitude: 77.1025,
        });
        setLocationStatus('Using Delhi as default location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setUserLocation({
        latitude: 28.7041,
        longitude: 77.1025,
      });
      setLocationStatus('Using Delhi as default location');
    }
  };

  const loadRetailers = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      setLocationStatus('🎯 Finding TOP 10 nearest agricultural retailers using Google Places API...');

      const searchResults = await RetailerService.searchRetailers(userLocation, filters);
      setRetailers(searchResults);

      // Pass data to parent component for map view
      if (onDataChange) {
        onDataChange(searchResults, userLocation);
      }

      if (searchResults.length > 0) {
        // Clear the status message once retailers are loaded
        setLocationStatus('');
      } else {
        setLocationStatus('No retailers found in your area. Try expanding the search radius.');
      }
    } catch (error) {
      console.error('Error loading retailers:', error);
      setLocationStatus('Error searching for retailers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {locationStatus && (
        <View className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mx-4 my-2">
          <Text className="text-yellow-800 text-sm">{locationStatus}</Text>
        </View>
      )}

      <RetailersList
        retailers={retailers}
        onRetailerSelect={onRetailerSelect}
        loading={loading}
      />
    </View>
  );
};