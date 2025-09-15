import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchFilters, Retailer } from '../../src/types/retailer';
import { SimpleRetailerFinder } from '../../src/components/SimpleRetailerFinder';
import { GoogleMapsWebView } from '../../src/components/GoogleMapsWebView';
import { RetailerCard } from '../../src/components/RetailerCard';
import { SearchAndFilters } from '../../src/components/SearchAndFilters';

export default function LocationsScreen() {
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    maxDistance: 25,
    subsidyOnly: false,
    searchQuery: '',
  });

  const handleRetailerSelect = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
  };

  const handleCloseCard = () => {
    setSelectedRetailer(null);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSwitchToMap = () => {
    setViewMode('map');
  };

  const handleSwitchToList = () => {
    setViewMode('list');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-500 rounded-full p-2 mr-3">
                <Ionicons name="location" size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">Nearby Retailers</Text>
                <Text className="text-green-100 text-sm">Find agricultural suppliers</Text>
              </View>
            </View>

            {/* View Mode Toggle */}
            <View className="flex-row bg-green-500 rounded-full">
              <TouchableOpacity
                onPress={handleSwitchToList}
                className={`px-3 py-1 rounded-full ${viewMode === 'list' ? 'bg-white' : ''}`}
              >
                <Ionicons
                  name="list"
                  size={16}
                  color={viewMode === 'list' ? '#16a34a' : 'white'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSwitchToMap}
                className={`px-3 py-1 rounded-full ${viewMode === 'map' ? 'bg-white' : ''}`}
              >
                <Ionicons
                  name="map"
                  size={16}
                  color={viewMode === 'map' ? '#16a34a' : 'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SearchAndFilters
          filters={filters}
          onFiltersChange={setFilters}
          onToggleFilters={handleToggleFilters}
          showFilters={showFilters}
        />

        <View className="flex-1">
          {viewMode === 'list' ? (
            <SimpleRetailerFinder
              filters={filters}
              onRetailerSelect={handleRetailerSelect}
              onDataChange={(retailers, userLocation) => {
                setRetailers(retailers);
                setUserLocation(userLocation);
              }}
            />
          ) : userLocation && retailers.length > 0 ? (
            <GoogleMapsWebView
              retailers={retailers}
              userLocation={userLocation}
              onRetailerSelect={handleRetailerSelect}
              onSwitchToList={handleSwitchToList}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-600">Loading map...</Text>
            </View>
          )}
        </View>

        <Modal
          visible={selectedRetailer !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseCard}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            {selectedRetailer && (
              <RetailerCard
                retailer={selectedRetailer}
                onClose={handleCloseCard}
              />
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}