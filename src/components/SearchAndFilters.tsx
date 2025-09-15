import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchFilters } from '../types/retailer';

interface SearchAndFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFiltersChange,
  onToggleFilters,
  showFilters
}) => {
  const categories = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'fertilizers', name: 'Fertilizers', icon: 'leaf' },
    { id: 'pesticides', name: 'Pesticides', icon: 'bug' },
    { id: 'seeds', name: 'Seeds', icon: 'flower' },
    { id: 'equipment', name: 'Equipment', icon: 'construct' }
  ];

  const distanceOptions = [5, 10, 25, 50, 100];

  return (
    <View className="bg-white shadow-sm">
      <View className="px-4 py-3">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Search retailers or products..."
              value={filters.searchQuery}
              onChangeText={(text) => onFiltersChange({ ...filters, searchQuery: text })}
            />
          </View>
          <TouchableOpacity
            onPress={onToggleFilters}
            className={`p-3 rounded-xl ${showFilters ? 'bg-green-600' : 'bg-gray-100'}`}
          >
            <Ionicons
              name="options"
              size={20}
              color={showFilters ? 'white' : '#6b7280'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showFilters && (
        <View className="px-4 pb-4 border-t border-gray-100">
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Category</Text>
            <View className="flex-row flex-wrap">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => onFiltersChange({ ...filters, category: category.id })}
                  className={`flex-row items-center mr-3 mb-2 px-3 py-2 rounded-full ${
                    filters.category === category.id
                      ? 'bg-green-100 border border-green-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={filters.category === category.id ? '#16a34a' : '#6b7280'}
                  />
                  <Text className={`ml-1 text-sm ${
                    filters.category === category.id ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Distance (km)</Text>
            <View className="flex-row flex-wrap">
              {distanceOptions.map((distance) => (
                <TouchableOpacity
                  key={distance}
                  onPress={() => onFiltersChange({ ...filters, maxDistance: distance })}
                  className={`mr-3 mb-2 px-4 py-2 rounded-full ${
                    filters.maxDistance === distance
                      ? 'bg-green-100 border border-green-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-sm ${
                    filters.maxDistance === distance ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {distance} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onFiltersChange({ ...filters, subsidyOnly: !filters.subsidyOnly })}
            className="flex-row items-center"
          >
            <View className={`w-5 h-5 rounded mr-3 border-2 items-center justify-center ${
              filters.subsidyOnly
                ? 'bg-green-600 border-green-600'
                : 'border-gray-300'
            }`}>
              {filters.subsidyOnly && (
                <Ionicons name="checkmark" size={12} color="white" />
              )}
            </View>
            <Text className="text-gray-700">Show only subsidized retailers</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};