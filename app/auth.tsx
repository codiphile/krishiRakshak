import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, Keyboard, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Prevent back navigation to splash screen
  useEffect(() => {
    const backAction = () => {
      // Return true to prevent default behavior (going back)
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleAuth = () => {
    // Navigate to home after "login/signup"
    router.replace('/home'); // Use replace instead of push
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View className="flex-1 px-6 py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-green-500 rounded-full p-4 mb-4">
              <Text className="text-4xl">🌾</Text>
            </View>
            <Text className="text-gray-800 text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back!' : 'Join KrishiRakshak'}
            </Text>
            <Text className="text-gray-600 text-center text-base">
              {isLogin 
                ? 'Sign in to continue your farming journey' 
                : 'Create your account to get started'
              }
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-8">
            {!isLogin && (
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">Full Name</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
            
            <View>
              <Text className="text-gray-700 text-sm font-medium mb-2">Phone Number</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
            
            <View>
              <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            </View>

            {!isLogin && (
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">Farm Location</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                  placeholder="Enter your farm location"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
          </View>

          {/* Auth Button */}
          <TouchableOpacity
            className="bg-green-600 rounded-xl py-4 mb-6"
            onPress={handleAuth}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password (Login only) */}
          {isLogin && (
            <TouchableOpacity className="mb-4">
              <Text className="text-green-600 text-center font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Toggle Auth Mode */}
          <View className="items-center">
            <Text className="text-gray-600 mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text className="text-green-600 font-semibold text-lg">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          <View className="mt-8 bg-white rounded-2xl p-6">
            <Text className="text-gray-800 font-semibold text-center mb-4">
              What you'll get with KrishiRakshak:
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-2xl mb-1">🌱</Text>
                <Text className="text-gray-600 text-xs text-center">Crop{"\n"}Monitoring</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">🌤️</Text>
                <Text className="text-gray-600 text-xs text-center">Weather{"\n"}Updates</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">💰</Text>
                <Text className="text-gray-600 text-xs text-center">Market{"\n"}Prices</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl mb-1">🎓</Text>
                <Text className="text-gray-600 text-xs text-center">Expert{"\n"}Advice</Text>
              </View>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}