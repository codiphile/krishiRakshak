import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GovernmentSchemesSlider } from '../../src/components/GovernmentSchemesSlider';
import { governmentSchemes } from '../../src/data/governmentSchemes';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const quickActions = [
    {
      title: 'Chat with AI',
      description: 'Get farming advice',
      icon: 'chatbubbles',
      color: 'bg-blue-500',
      route: '/chat'
    },
    {
      title: 'AI Farming Timeline',
      description: 'Plan your cultivation period',
      icon: 'calendar',
      color: 'bg-red-500',
      route: '/timeline'
    },
    {
      title: 'Find Retailers',
      description: 'Locate nearby stores',
      icon: 'location',
      color: 'bg-orange-500',
      route: '/locations'
    },
    {
      title: 'Analyze Crops',
      description: 'Camera analysis',
      icon: 'camera',
      color: 'bg-green-600',
      route: '/analysis'
    }
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-white">

        <View className="flex-1">
          {/* Government Schemes Slider */}
          <View className="pt-4 pb-2">
            <GovernmentSchemesSlider schemes={governmentSchemes} />
          </View>

          {/* Quick Actions - Fixed height */}
          <View className="px-6 pb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-2">Quick Actions</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" style={{ height: 280 }}>
              {/* Top Row - Chat and Community */}
              <View className="flex-row justify-between mb-6 flex-1">
                {quickActions.slice(0, 2).map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 flex-1 mx-2 justify-center items-center"
                    onPress={() => router.push(action.route as any)}
                  >
                    <View className={`${action.color} rounded-full p-3 self-center mb-3`}>
                      <Ionicons name={action.icon as any} size={32} color="white" />
                    </View>
                    <Text className="text-gray-800 font-semibold text-center text-base">{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Bottom Row - Find Retailers and Profile */}
              <View className="flex-row justify-between flex-1">
                {quickActions.slice(2, 4).map((action, index) => (
                  <TouchableOpacity
                    key={index + 2}
                    className="bg-gray-50 rounded-xl p-4 flex-1 mx-2 justify-center items-center"
                    onPress={() => router.push(action.route as any)}
                  >
                    <View className={`${action.color} rounded-full p-3 self-center mb-3`}>
                      <Ionicons name={action.icon as any} size={32} color="white" />
                    </View>
                    <Text className="text-gray-800 font-semibold text-center text-base">{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}