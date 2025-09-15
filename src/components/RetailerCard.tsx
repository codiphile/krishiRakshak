import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Retailer } from '../types/retailer';
import { LocationService } from '../services/locationService';

interface RetailerCardProps {
  retailer: Retailer;
  onClose: () => void;
}

export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer, onClose }) => {
  const [showMap, setShowMap] = useState(true);

  const handleCall = () => {
    Linking.openURL(`tel:${retailer.phone}`);
  };

  const handleNavigate = () => {
    const lat = retailer.latitude;
    const lng = retailer.longitude;

    if (!lat || !lng) {
      console.error('No coordinates available for navigation');
      return;
    }

    // Use a simple Google Maps URL that works reliably
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    Linking.openURL(googleMapsUrl).catch(error => {
      console.error('Failed to open maps:', error);
      // Fallback to basic maps URL
      const fallbackUrl = `https://maps.google.com/?q=${lat},${lng}`;
      Linking.openURL(fallbackUrl).catch(fallbackError => {
        console.error('Fallback maps URL also failed:', fallbackError);
      });
    });
  };

  const generateSimpleMapHTML = () => {
    const apiKey = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ';
    const lat = retailer.latitude;
    const lng = retailer.longitude;

    if (!lat || !lng) return '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }
        #map { height: 100%; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        function initMap() {
            const location = { lat: ${lat}, lng: ${lng} };
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 17,
                center: location,
                disableDefaultUI: true,
                gestureHandling: 'none',
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true
            });

            new google.maps.Marker({
                position: location,
                map: map,
                title: '${retailer.name.replace(/'/g, "\\'")}',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"%3E%3Cpath fill="%2316a34a" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32)
                }
            });
        }
        window.initMap = initMap;
    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap"></script>
</body>
</html>`;
  };

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

  return (
    <View className="bg-white rounded-t-3xl shadow-lg flex-1">
      {/* Map Section - Fixed height */}
      <View style={{ height: 200 }} className="rounded-t-3xl overflow-hidden bg-gray-100">
        {retailer.latitude && retailer.longitude ? (
          <WebView
            source={{ html: generateSimpleMapHTML() }}
            style={{ height: 200, width: '100%' }}
            scrollEnabled={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            javaScriptEnabled={true}
            onError={() => setShowMap(false)}
          />
        ) : (
          <TouchableOpacity
            onPress={handleNavigate}
            className="flex-1 justify-center items-center bg-green-50"
          >
            <Ionicons name="map" size={48} color="#16a34a" />
            <Text className="text-green-700 font-semibold mt-2">{retailer.name}</Text>
            <Text className="text-green-600 text-sm">
              📍 {retailer.distance ? `${retailer.distance} km away` : 'Location available'}
            </Text>
            <Text className="text-green-600 text-xs mt-1">Tap to open in Maps</Text>
          </TouchableOpacity>
        )}

        {/* Tap overlay to navigate */}
        <TouchableOpacity
          onPress={handleNavigate}
          className="absolute inset-0 bg-transparent"
        />
      </View>

      {/* Content Section */}
      <View className="p-6">
        <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className={`${getCategoryColor(retailer.category)} rounded-full p-2 mr-3`}>
              <Ionicons name={getCategoryIcon(retailer.category) as any} size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">{retailer.name}</Text>
              <Text className="text-sm text-gray-600 capitalize">{retailer.category}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={16} color="#666" />
          <Text className="text-gray-600 ml-2 flex-1">{retailer.address}</Text>
        </View>

        {retailer.distance && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="navigate" size={16} color="#666" />
            <Text className="text-gray-600 ml-2 font-semibold">{retailer.distance} km away</Text>
            <View className="bg-orange-100 rounded-full px-2 py-1 ml-2">
              <Text className="text-orange-700 text-xs font-medium">📍 Distance</Text>
            </View>
          </View>
        )}

        <View className="flex-row items-center mb-2">
          <Ionicons name="time" size={16} color="#666" />
          <Text className="text-gray-600 ml-2">{retailer.openHours}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text className="text-gray-600 ml-2">{retailer.rating} ({retailer.reviews} reviews)</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        {retailer.isGovernmentCertified && (
          <View className="bg-green-100 rounded-full px-3 py-1 mr-2">
            <Text className="text-green-700 text-xs font-medium">Govt Certified</Text>
          </View>
        )}
        {retailer.subsidyAvailable && (
          <View className="bg-blue-100 rounded-full px-3 py-1">
            <Text className="text-blue-700 text-xs font-medium">Subsidy Available</Text>
          </View>
        )}
      </View>

      <Text className="text-gray-700 mb-4">{retailer.description}</Text>

      {retailer.products && retailer.products.length > 0 && (
        <View className="mb-4">
          <Text className="text-gray-800 font-semibold mb-2">Featured Products:</Text>
          {retailer.products.slice(0, 3).map((product, index) => (
            <View key={product.id || `product-${index}`} className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">{product.name}</Text>
                <Text className="text-gray-600 text-sm">{product.category}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-800 font-semibold">₹{product.price}</Text>
                {product.subsidyPrice && (
                  <Text className="text-green-600 text-sm">₹{product.subsidyPrice} (subsidized)</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row space-x-3 mt-4">
        <TouchableOpacity
          onPress={handleCall}
          className="flex-1 bg-green-600 rounded-xl py-3 flex-row items-center justify-center"
        >
          <Ionicons name="call" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigate}
          className="flex-1 bg-blue-600 rounded-xl py-3 flex-row items-center justify-center"
        >
          <Ionicons name="navigate" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Navigate</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};