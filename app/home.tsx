import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/auth');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-xl font-bold">
                Welcome to Home! 🏠
              </Text>
              <Text className="text-green-100 text-sm">
                Good morning, Farmer
              </Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <View className="bg-green-500 rounded-full p-2">
                <Text className="text-white text-xs font-medium px-2">Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1">
          {/* Welcome Card */}
          <View className="p-6">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Text className="text-gray-800 text-2xl font-bold text-center mb-4">
                🎉 Welcome to KrishiRakshak!
              </Text>
              <Text className="text-gray-600 text-center text-base leading-6">
                Your digital farming companion is ready to help you grow better crops, 
                monitor weather, get market updates, and connect with fellow farmers.
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="px-6 mb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-4">Quick Overview</Text>
            <View className="flex-row justify-between">
              <View className="bg-blue-50 rounded-xl p-4 flex-1 mr-3">
                <Text className="text-blue-600 text-2xl font-bold">25°C</Text>
                <Text className="text-blue-700 text-sm">Today's Temp</Text>
              </View>
              <View className="bg-green-50 rounded-xl p-4 flex-1 mr-3">
                <Text className="text-green-600 text-2xl font-bold">85%</Text>
                <Text className="text-green-700 text-sm">Soil Moisture</Text>
              </View>
              <View className="bg-yellow-50 rounded-xl p-4 flex-1">
                <Text className="text-yellow-600 text-2xl font-bold">₹45</Text>
                <Text className="text-yellow-700 text-sm">Wheat/Kg</Text>
              </View>
            </View>
          </View>

          {/* Feature Cards */}
          <View className="px-6 mb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-4">Available Features</Text>
            <View className="space-y-4">
              <View className="bg-white rounded-xl p-4 flex-row items-center border border-gray-100">
                <View className="bg-green-100 rounded-full p-3 mr-4">
                  <Text className="text-2xl">🌱</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">Crop Monitoring</Text>
                  <Text className="text-gray-500 text-sm">Track your crop health and growth</Text>
                </View>
                <Text className="text-green-600 font-medium">→</Text>
              </View>

              <View className="bg-white rounded-xl p-4 flex-row items-center border border-gray-100">
                <View className="bg-blue-100 rounded-full p-3 mr-4">
                  <Text className="text-2xl">🌤️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">Weather Updates</Text>
                  <Text className="text-gray-500 text-sm">Get accurate weather forecasts</Text>
                </View>
                <Text className="text-blue-600 font-medium">→</Text>
              </View>

              <View className="bg-white rounded-xl p-4 flex-row items-center border border-gray-100">
                <View className="bg-yellow-100 rounded-full p-3 mr-4">
                  <Text className="text-2xl">💰</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">Market Prices</Text>
                  <Text className="text-gray-500 text-sm">Live commodity prices and trends</Text>
                </View>
                <Text className="text-yellow-600 font-medium">→</Text>
              </View>

              <View className="bg-white rounded-xl p-4 flex-row items-center border border-gray-100">
                <View className="bg-purple-100 rounded-full p-3 mr-4">
                  <Text className="text-2xl">🎓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">Expert Advice</Text>
                  <Text className="text-gray-500 text-sm">Get tips from agricultural experts</Text>
                </View>
                <Text className="text-purple-600 font-medium">→</Text>
              </View>
            </View>
          </View>

          {/* Bottom Message */}
          <View className="px-6 pb-8">
            <View className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <Text className="text-green-800 text-center font-semibold text-base">
                🌾 Ready to revolutionize your farming experience?
              </Text>
              <Text className="text-green-700 text-center text-sm mt-2">
                Explore all features and start your digital farming journey today!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}