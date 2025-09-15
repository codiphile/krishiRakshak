import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  FarmerProfile,
  FARMER_PROFILE_SECTIONS,
  ProfileField,
  ProfileOption
} from '../types/farmerProfile';

interface FarmerProfileSetupProps {
  initialProfile?: Partial<FarmerProfile>;
  onSave: (profile: Partial<FarmerProfile>) => void;
  onSkip?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const FarmerProfileSetup: React.FC<FarmerProfileSetupProps> = ({
  initialProfile = {},
  onSave,
  onSkip,
  isModal = false,
  onClose
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<FarmerProfile>>(initialProfile);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentSection = FARMER_PROFILE_SECTIONS[currentSectionIndex];
  const isLastSection = currentSectionIndex === FARMER_PROFILE_SECTIONS.length - 1;
  const progress = ((currentSectionIndex + 1) / FARMER_PROFILE_SECTIONS.length) * 100;

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const isFieldSelected = (fieldId: string, optionValue: string): boolean => {
    const fieldValue = formData[fieldId as keyof FarmerProfile];
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(optionValue);
    }
    return fieldValue === optionValue;
  };

  const toggleMultiSelectOption = (fieldId: string, optionValue: string) => {
    const currentValue = formData[fieldId as keyof FarmerProfile] as string[] || [];
    const newValue = currentValue.includes(optionValue)
      ? currentValue.filter(v => v !== optionValue)
      : [...currentValue, optionValue];

    updateField(fieldId, newValue);
  };

  const handleNext = () => {
    if (isLastSection) {
      handleComplete();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const profileData: Partial<FarmerProfile> = {
        ...formData,
        lastUpdated: new Date(),
        isProfileComplete: true
      };

      await onSave(profileData);

      Alert.alert(
        'Profile Saved! 🎉',
        'Your profile has been saved successfully. You will now get personalized farming advice!',
        [{ text: 'Great!', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const renderField = (field: ProfileField) => {
    switch (field.type) {
      case 'single-select':
        return (
          <View className="space-y-3">
            <Text className="text-gray-800 text-base font-medium mb-3">{field.label}</Text>
            <View className="space-y-2">
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => updateField(field.id, option.value)}
                  className={`flex-row items-center p-4 rounded-xl border-2 ${
                    isFieldSelected(field.id, option.value)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    {option.emoji && (
                      <Text className="text-2xl mr-3">{option.emoji}</Text>
                    )}
                    <View className="flex-1">
                      <Text className={`text-base font-medium ${
                        isFieldSelected(field.id, option.value) ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isFieldSelected(field.id, option.value)
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {isFieldSelected(field.id, option.value) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'multi-select':
        return (
          <View className="space-y-3">
            <Text className="text-gray-800 text-base font-medium mb-3">{field.label}</Text>
            <Text className="text-sm text-gray-600 mb-3">
              Select all that apply
            </Text>
            <View className="space-y-2">
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleMultiSelectOption(field.id, option.value)}
                  className={`flex-row items-center p-4 rounded-xl border-2 ${
                    isFieldSelected(field.id, option.value)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    {option.emoji && (
                      <Text className="text-2xl mr-3">{option.emoji}</Text>
                    )}
                    <View className="flex-1">
                      <Text className={`text-base font-medium ${
                        isFieldSelected(field.id, option.value) ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className={`w-6 h-6 rounded border-2 items-center justify-center ${
                    isFieldSelected(field.id, option.value)
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isFieldSelected(field.id, option.value) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderContent = () => (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-500 rounded-full p-2 mr-3">
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">Profile Setup</Text>
                <Text className="text-green-100 text-sm">
                  Step {currentSectionIndex + 1} of {FARMER_PROFILE_SECTIONS.length}
                </Text>
              </View>
            </View>
            {isModal && onClose && (
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Progress Bar */}
          <View className="mt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-green-100 text-sm">Progress</Text>
              <Text className="text-green-100 text-sm">{Math.round(progress)}%</Text>
            </View>
            <View className="h-2 bg-green-500 rounded-full">
              <View
                className="h-full bg-green-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        </View>

        {/* Content - Scrollable area */}
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="p-6">
            {/* Section Header */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {currentSection.title}
              </Text>
              <Text className="text-gray-600 text-base">
                {currentSection.description}
              </Text>
            </View>

            {/* Fields */}
            <View className="space-y-6">
              {currentSection.fields.map((field) => (
                <View key={field.id}>
                  {renderField(field)}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Navigation - Fixed bottom bar */}
        <View className="bg-white border-t border-gray-200 px-6 py-4" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8
        }}>
          <View className="flex-row justify-center items-center space-x-4">
            <TouchableOpacity
              onPress={currentSectionIndex === 0 ? onSkip : handlePrevious}
              className={`flex-row items-center justify-center px-6 py-3 rounded-xl border ${
                currentSectionIndex === 0 ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: currentSectionIndex === 0 ? 0.05 : 0.1,
                shadowRadius: 4,
                elevation: currentSectionIndex === 0 ? 1 : 3,
                opacity: currentSectionIndex === 0 ? 0.6 : 1
              }}
            >
              <Ionicons
                name={currentSectionIndex === 0 ? "close-outline" : "chevron-back-outline"}
                size={20}
                color="#6B7280"
                style={{ opacity: currentSectionIndex === 0 ? 0.7 : 1 }}
              />
              <Text className={`ml-2 font-semibold ${
                currentSectionIndex === 0 ? 'text-gray-500 opacity-80' : 'text-gray-700'
              }`}>
                {currentSectionIndex === 0 ? 'Skip' : 'Previous'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={isCompleting}
              className={`flex-row items-center justify-center px-6 py-3 rounded-xl ${
                isCompleting ? 'bg-green-400' :
                isLastSection ? 'bg-green-300' : 'bg-green-600'
              }`}
              style={{
                shadowColor: '#16a34a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isLastSection ? 0.1 : 0.2,
                shadowRadius: 4,
                elevation: isLastSection ? 2 : 4,
                opacity: isLastSection ? 0.7 : 1
              }}
            >
              <Text className={`font-bold mr-2 ${
                isLastSection ? 'text-white opacity-80' : 'text-white'
              }`}>
                {isLastSection ? (isCompleting ? 'Saving...' : 'Complete') : 'Next'}
              </Text>
              <Ionicons
                name={isLastSection ? "checkmark-circle" : "chevron-forward-outline"}
                size={20}
                color="white"
                style={{ opacity: isLastSection ? 0.8 : 1 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );

  if (isModal) {
    return (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {renderContent()}
      </Modal>
    );
  }

  return renderContent();
};