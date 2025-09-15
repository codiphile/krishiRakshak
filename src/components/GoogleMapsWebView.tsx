import React from 'react';
import { View, Linking, TouchableOpacity, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Retailer, UserLocation } from '../types/retailer';

interface GoogleMapsWebViewProps {
  retailers: Retailer[];
  userLocation: UserLocation;
  onRetailerSelect: (retailer: Retailer) => void;
  onSwitchToList: () => void;
}

export const GoogleMapsWebView: React.FC<GoogleMapsWebViewProps> = ({
  retailers,
  userLocation,
  onRetailerSelect,
  onSwitchToList
}) => {
  // Generate Google Maps HTML with markers
  const generateMapHTML = () => {
    const apiKey = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ'; // Your API key

    // Create markers data with debugging
    const markersData = retailers.map((retailer, index) => {
      console.log(`📍 Retailer ${index + 1}: ${retailer.name}`);
      console.log(`   Coordinates: ${retailer.latitude}, ${retailer.longitude}`);

      return {
        lat: Number(retailer.latitude),
        lng: Number(retailer.longitude),
        title: retailer.name,
        category: retailer.category,
        distance: retailer.distance,
        id: retailer.id,
        rank: index + 1
      };
    });

    console.log('🗺️ User Location:', userLocation);
    console.log('📌 All Markers:', markersData);

    const markersJson = JSON.stringify(markersData);

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agricultural Retailers Map</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        #map { height: 100vh; width: 100%; }
        .info-window {
            padding: 10px;
            max-width: 200px;
        }
        .retailer-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .retailer-distance {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .navigate-btn {
            background: #16a34a;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
        }
        .rank-badge {
            background: #2563eb;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        let map;
        let markers = [];

        function initMap() {
            console.log('🗺️ Initializing map with user location:', ${userLocation.latitude}, ${userLocation.longitude});

            // Initialize map centered on user location
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
                mapTypeId: 'roadmap'
            });

            // Add user location marker
            new google.maps.Marker({
                position: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
                map: map,
                title: 'Your Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%232563eb"%3E%3Ccircle cx="12" cy="12" r="8"/%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="%23ffffff"/%3E%3C/svg%3E',
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            // Add retailer markers
            const retailersData = ${markersJson};
            console.log('📌 Received retailers data:', retailersData);

            retailersData.forEach((retailer, index) => {
                console.log(\`Adding marker for \${retailer.title} at \${retailer.lat}, \${retailer.lng}\`);

                const marker = new google.maps.Marker({
                    position: { lat: retailer.lat, lng: retailer.lng },
                    map: map,
                    title: retailer.title,
                    icon: {
                        url: getMarkerIcon(retailer.category, retailer.rank),
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: \`
                        <div class="info-window">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <div class="rank-badge">#\${retailer.rank}</div>
                                <div style="margin-left: 8px;">
                                    <div class="retailer-name">\${retailer.title}</div>
                                </div>
                            </div>
                            <div class="retailer-distance">📍 \${retailer.distance} km away</div>
                            <button class="navigate-btn" onclick="navigateToRetailer(\${retailer.lat}, \${retailer.lng}, '\${retailer.title}')">
                                🧭 Navigate
                            </button>
                        </div>
                    \`
                });

                marker.addListener('click', () => {
                    // Close all other info windows
                    markers.forEach(m => m.infoWindow.close());
                    infoWindow.open(map, marker);
                });

                markers.push({ marker, infoWindow });
            });
        }

        function getMarkerIcon(category, rank) {
            return \`data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="%2316a34a"/%3E%3Ccircle cx="12" cy="9" r="3" fill="white"/%3E%3Ctext x="12" y="13" text-anchor="middle" font-size="8" fill="white" font-weight="bold">\${rank}%3C/text%3E%3C/svg%3E\`;
        }

        function navigateToRetailer(lat, lng, name) {
            console.log('Navigation requested for:', { lat, lng, name });

            // Primary URL with proper encoding
            const primaryUrl = \`https://www.google.com/maps/dir/?api=1&destination=\${lat},\${lng}&travelmode=driving\`;

            // Fallback URL without API parameter
            const fallbackUrl = \`https://maps.google.com/maps?daddr=\${lat},\${lng}\`;

            // Alternative URL for mobile apps
            const mobileUrl = \`geo:\${lat},\${lng}?q=\${lat},\${lng}(\${encodeURIComponent(name)})\`;

            console.log('Primary URL:', primaryUrl);

            // Use postMessage to communicate with React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'navigate',
                url: primaryUrl,
                fallbackUrl: fallbackUrl,
                mobileUrl: mobileUrl,
                name: name,
                coordinates: { lat, lng }
            }));
        }

        // Initialize map when Google Maps API loads
        window.initMap = initMap;
    </script>

    <script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap"></script>
</body>
</html>`;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'navigate') {
        console.log('📍 Navigation data received:', data);

        // Try primary URL first
        Linking.openURL(data.url).catch(primaryError => {
          console.error('Primary URL failed:', primaryError);
          console.log('🔄 Trying fallback URL:', data.fallbackUrl);

          // Try fallback URL
          Linking.openURL(data.fallbackUrl).catch(fallbackError => {
            console.error('Fallback URL failed:', fallbackError);
            console.log('🔄 Trying mobile URL:', data.mobileUrl);

            // Try mobile geo URL
            Linking.openURL(data.mobileUrl).catch(mobileError => {
              console.error('All navigation URLs failed:', {
                primary: primaryError.message,
                fallback: fallbackError.message,
                mobile: mobileError.message
              });

              // Final fallback - basic maps URL
              const basicUrl = `https://maps.google.com/?q=${data.coordinates.lat},${data.coordinates.lng}`;
              console.log('🔄 Trying basic URL:', basicUrl);

              Linking.openURL(basicUrl).catch(basicError => {
                console.error('Basic URL also failed:', basicError);
                Alert.alert(
                  'Navigation Error',
                  'Unable to open maps. Please check if Google Maps is installed on your device.',
                  [{ text: 'OK' }]
                );
              });
            });
          });
        });
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View className="flex-1">
      {/* Header with controls */}
      <View className="absolute top-4 left-4 right-4 z-10 flex-row justify-between">
        <TouchableOpacity
          onPress={onSwitchToList}
          className="bg-white rounded-full p-3 shadow-lg"
        >
          <Ionicons name="list" size={24} color="#16a34a" />
        </TouchableOpacity>

        <View className="bg-white rounded-full px-4 py-2 shadow-lg">
          <Text className="text-gray-800 font-medium">📍 {retailers.length} Retailers</Text>
        </View>
      </View>

      {/* Google Maps WebView */}
      <WebView
        source={{ html: generateMapHTML() }}
        style={{ flex: 1 }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};