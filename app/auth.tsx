import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, Keyboard, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { UserCreate, UserLogin } from '../src/types/api';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    location: ''
  });
  const router = useRouter();
  const { login, register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  // Prevent back navigation to splash screen
  useEffect(() => {
    const backAction = () => {
      // Return true to prevent default behavior (going back)
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleAuth = async () => {
    if (isLoading) return;

    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    if (!isLogin && !formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required for registration');
      return;
    }

    try {
      setIsLoading(true);

      if (isLogin) {
        const loginData: UserLogin = {
          username: formData.email,
          password: formData.password
        };
        await login(loginData);
      } else {
        const registerData: UserCreate = {
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber || undefined,
          location: formData.location || undefined
        };
        await register(registerData);
      }

      // Navigation will happen automatically via the useEffect above
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  value={formData.fullName}
                  onChangeText={(value) => updateFormData('fullName', value)}
                  autoCapitalize="words"
                />
              </View>
            )}
            
            <View>
              <Text className="text-gray-700 text-sm font-medium mb-2">{isLogin ? 'Email or Phone' : 'Email'}</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                placeholder={isLogin ? "Enter your email or phone" : "Enter your email"}
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {!isLogin && (
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">Phone Number (Optional)</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  value={formData.phoneNumber}
                  onChangeText={(value) => updateFormData('phoneNumber', value)}
                  keyboardType="phone-pad"
                />
              </View>
            )}
            
            <View>
              <Text className="text-gray-700 text-sm font-medium mb-2">Password</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {!isLogin && (
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">Farm Location (Optional)</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                  placeholder="Enter your farm location"
                  placeholderTextColor="#9CA3AF"
                  value={formData.location}
                  onChangeText={(value) => updateFormData('location', value)}
                  autoCapitalize="words"
                />
              </View>
            )}
          </View>

          {/* Auth Button */}
          <TouchableOpacity
            className={`${isLoading ? 'bg-green-400' : 'bg-green-600'} rounded-xl py-4 mb-6 flex-row justify-center items-center`}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
            <Text className="text-white text-center text-lg font-semibold">
              {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
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
              What you&apos;ll get with KrishiRakshak:
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