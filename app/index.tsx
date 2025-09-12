import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function KrishiRakshakSplash() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing your farming companion...');

  // Separate effect to handle navigation when progress reaches 100%
  useEffect(() => {
    if (loadingProgress >= 100) {
      router.replace('/auth');
    }
  }, [loadingProgress, router]);

  useEffect(() => {
    // Loading messages sequence
    const loadingMessages = [
      'Initializing your farming companion...',
      'Loading crop data...',
      'Connecting to weather services...',
      'Fetching market prices...',
      'Preparing expert advice...',
      'Setting up your dashboard...',
      'Almost ready...',
      'Welcome to KrishiRakshak!'
    ];

    // Progress animation - ultra smooth for 4 seconds
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 1.25; // Increase by 1.25% every 50ms
        if (newProgress >= 100) {
          return 100; // Just return 100, navigation handled in separate useEffect
        }
        return newProgress;
      });
    }, 50);

    // Text animation - change message every 500ms
    const textInterval = setInterval(() => {
      const messageIndex = Math.floor(loadingProgress / 12.5); // Change message every 12.5%
      if (messageIndex < loadingMessages.length) {
        setLoadingText(loadingMessages[messageIndex]);
      }
    }, 500);

    // Backup timer (in case something goes wrong with progress)
    const backupTimer = setTimeout(() => {
      router.replace('/auth');
    }, 4500);

    return () => {
      clearTimeout(backupTimer);
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [router, loadingProgress]);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <View className="flex-1 bg-green-600">
        {/* Background Pattern */}
        <View className="absolute inset-0">
          <View className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10"></View>
          <View className="absolute top-32 right-16 w-16 h-16 rounded-full bg-white opacity-10"></View>
          <View className="absolute bottom-40 left-8 w-24 h-24 rounded-full bg-white opacity-10"></View>
          <View className="absolute bottom-20 right-12 w-12 h-12 rounded-full bg-white opacity-10"></View>
        </View>

        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center px-8">
            {/* App Logo Container with Circular Progress */}
            <View className="relative mb-8 items-center justify-center">
              {/* Circular Progress Background Ring */}
              <View className="w-44 h-44 rounded-full border-4 border-white border-opacity-20"></View>
              
              {/* Circular Progress Indicator - Green Ring */}
              <View 
                className="absolute w-44 h-44 rounded-full"
                style={{
                  borderWidth: 4,
                  borderColor: 'transparent',
                  borderTopColor: '#22c55e', // Green color for visibility
                  borderRightColor: loadingProgress > 25 ? '#22c55e' : 'transparent',
                  borderBottomColor: loadingProgress > 50 ? '#22c55e' : 'transparent',
                  borderLeftColor: loadingProgress > 75 ? '#22c55e' : 'transparent',
                  transform: [{ rotate: `${(loadingProgress * 3.6) - 90}deg` }] // Smooth rotation
                }}
              />
              
              {/* Additional smooth overlay for better visibility */}
              <View 
                className="absolute w-44 h-44 rounded-full"
                style={{
                  borderWidth: 2,
                  borderColor: 'transparent',
                  borderTopColor: '#16a34a', // Darker green for depth
                  opacity: 0.6,
                  transform: [{ rotate: `${(loadingProgress * 3.6) - 90}deg` }]
                }}
              />
              
              {/* Center Logo */}
              <View className="absolute justify-center items-center">
                <View className="bg-white rounded-full p-7 shadow-2xl border-2 border-green-100">
                  <View className="bg-green-500 rounded-full p-5 shadow-lg">
                    <Text className="text-5xl text-center">🌾</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* App Name */}
            <View className="bg-white bg-opacity-20 rounded-3xl px-8 py-6 mb-4">
              <Text className="text-black text-5xl font-bold text-center">
                KrishiRakshak
              </Text>
              <Text className="text-black text-lg text-center mt-2 font-medium">
                कृषि रक्षक
              </Text>
            </View>

            {/* Tagline */}
            <View className="bg-emerald-700 bg-opacity-40 rounded-full px-6 py-3 mb-12">
              <Text className="text-white text-xl font-semibold text-center">
                Helping the Farmers
              </Text>
            </View>

            {/* Feature Icons Row */}
            <View className="flex-row justify-center items-center mb-8">
              <View className="bg-white bg-opacity-20 rounded-2xl p-4 mx-2">
                <Text className="text-4xl text-center">🚜</Text>
                <Text className="text-white text-xs text-center mt-1 font-medium">Smart Farm</Text>
              </View>
              <View className="bg-white bg-opacity-20 rounded-2xl p-4 mx-2">
                <Text className="text-4xl text-center">📱</Text>
                <Text className="text-white text-xs text-center mt-1 font-medium">Digital Tools</Text>
              </View>
              <View className="bg-white bg-opacity-20 rounded-2xl p-4 mx-2">
                <Text className="text-4xl text-center">🌱</Text>
                <Text className="text-white text-xs text-center mt-1 font-medium">Crop Care</Text>
              </View>
            </View>

            {/* Loading Progress Info */}
            <View className="items-center mb-8">
              <Text className="text-white text-2xl font-bold mb-2">
                {Math.round(loadingProgress)}%
              </Text>
              <Text className="text-white text-sm font-medium text-center px-4">
                {loadingText}
              </Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View className="pb-8 px-8">
            <View className="bg-white bg-opacity-10 rounded-2xl p-4">
              <Text className="text-black text-center text-sm font-medium">
                Empowering Agriculture • Nurturing Growth • Building Tomorrow
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}