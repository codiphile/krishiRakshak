import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Retailer } from '../types/retailer';

interface RetailersListProps {
  retailers: Retailer[];
  onRetailerSelect: (retailer: Retailer) => void;
  loading: boolean;
}

export const RetailersList: React.FC<RetailersListProps> = ({
  retailers,
  onRetailerSelect,
  loading
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fertilizers': return 'bg-green-500';
      case 'pesticides': return 'bg-red-500';
      case 'seeds': return 'bg-yellow-500';
      case 'equipment': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fertilizers': return 'leaf';
      case 'pesticides': return 'bug';
      case 'seeds': return 'flower';
      case 'equipment': return 'construct';
      default: return 'storefront';
    }
  };

  const renderRetailer = ({ item, index }: { item: Retailer; index: number }) => (
    <TouchableOpacity
      onPress={() => onRetailerSelect(item)}
      className="bg-white mx-4 mb-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          {/* Rank Badge */}
          <View className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center mr-3">
            <Text className="text-white text-sm font-bold">#{index + 1}</Text>
          </View>

          <View className="bg-green-600 rounded-full p-2 mr-3">
            <Ionicons name="storefront" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-600 capitalize">{item.category}</Text>
          </View>
          {item.distance && (
            <View className="bg-green-100 rounded-full px-3 py-1">
              <Text className="text-green-700 text-xs font-medium">{item.distance} km</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text className="text-gray-600 text-sm ml-1 flex-1">{item.address}</Text>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text className="text-gray-600 text-sm ml-1">{item.rating} ({item.reviews})</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1">{item.openHours}</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          {item.isGovernmentCertified && (
            <View className="bg-green-100 rounded-full px-2 py-1 mr-2">
              <Text className="text-green-700 text-xs font-medium">Govt Certified</Text>
            </View>
          )}
          {item.subsidyAvailable && (
            <View className="bg-blue-100 rounded-full px-2 py-1">
              <Text className="text-blue-700 text-xs font-medium">Subsidy Available</Text>
            </View>
          )}
        </View>

        {item.products && item.products.length > 0 && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-700 text-sm font-medium mb-1">Featured Products:</Text>
            <Text className="text-gray-600 text-sm">
              {item.products.slice(0, 2).map(p => p.name).join(', ')}
              {item.products.length > 2 && ` +${item.products.length - 2} more`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Ionicons name="refresh" size={48} color="#16a34a" />
        <Text className="text-gray-600 mt-2">Loading retailers...</Text>
      </View>
    );
  }

  if (retailers.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="storefront-outline" size={64} color="#9ca3af" />
        <Text className="text-gray-500 text-lg font-medium mt-4 text-center">No retailers found</Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Try adjusting your filters or search criteria
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={retailers}
      renderItem={renderRetailer}
      keyExtractor={(item) => item.id}
      contentContainerClassName="py-4"
      showsVerticalScrollIndicator={false}
    />
  );
};