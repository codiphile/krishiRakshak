import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRouter, useFocusEffect } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '../../src/services/api';
import { localAnalysisService } from '../../src/services/localAnalysisService';
import { ImageAnalysis, ImageAnalysisResponse } from '../../src/types/api';

type AnalysisType = 'crop' | 'pest' | 'disease' | 'soil';

interface AnalysisOption {
  type: AnalysisType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function AnalysisScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType>('crop');
  const [selectedDetailAnalysis, setSelectedDetailAnalysis] = useState<ImageAnalysis | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch analysis history from local storage
  const { data: analysisHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['analysisHistory'],
    queryFn: localAnalysisService.getAnalysisHistory,
  });

  // Refetch history when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refetchHistory();
    }, [refetchHistory])
  );

  // Image analysis mutation using direct Gemini service
  const analyzeImageMutation = useMutation({
    mutationFn: ({ imageUri, analysisType }: { imageUri: string; analysisType: AnalysisType }) =>
      apiService.analyzeImageWithGemini(imageUri, analysisType),
    onSuccess: (result, variables) => {
      console.log('📱 Gemini analysis result received:', JSON.stringify(result, null, 2));

      // Convert Gemini result to the expected format for the result screen
      const formattedResult = {
        id: `gemini-${Date.now()}`,
        analysis_type: variables.analysisType,
        results: result,
        confidence_score: result.confidence_score,
        recommendations: result.treatment_plan,
        created_at: new Date().toISOString(),
      };

      router.push({
        pathname: '/AnalysisResult',
        params: {
          result: JSON.stringify(formattedResult),
          analysisType: variables.analysisType,
          imageUri: variables.imageUri,
        },
      });
    },
    onError: (error: any) => {
      Alert.alert('Analysis Failed', error.message || 'Failed to analyze image with AI. Please try again.');
    }
  });

  const analysisOptions: AnalysisOption[] = [
    {
      type: 'crop',
      title: 'Crop Health',
      description: 'Analyze overall plant health',
      icon: 'leaf',
      color: 'bg-green-500'
    },
    {
      type: 'pest',
      title: 'Pest Detection',
      description: 'Identify pest infestations',
      icon: 'bug',
      color: 'bg-red-500'
    },
    {
      type: 'disease',
      title: 'Disease Detection',
      description: 'Detect plant diseases',
      icon: 'medical',
      color: 'bg-orange-500'
    },
    {
      type: 'soil',
      title: 'Soil Analysis',
      description: 'Assess soil conditions',
      icon: 'earth',
      color: 'bg-brown-500'
    }
  ];

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and media library permissions are required to analyze images.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    analyzeImageMutation.mutate({
      imageUri: selectedImage,
      analysisType: selectedAnalysis
    });
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedAnalysis('crop');
  };

  const handleAnalysisClick = (analysis: ImageAnalysis) => {
    setSelectedDetailAnalysis(analysis);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDetailAnalysis(null);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-green-600 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-green-500 rounded-full p-2 mr-3">
                <MaterialIcons name="photo-camera" size={24} color="white" />
              </View>
              <View>
                <Text className="text-white text-lg font-semibold">Image Analysis</Text>
                <Text className="text-green-100 text-sm">AI-powered crop analysis</Text>
              </View>
            </View>
            {selectedImage && (
              <TouchableOpacity onPress={resetAnalysis}>
                <Ionicons name="refresh" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView className="flex-1">
          {!selectedImage ? (
            <View className="p-6">
              {/* Image Selection */}
              <Text className="text-gray-800 text-lg font-semibold mb-4">Select Image</Text>

              <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                  className="bg-white rounded-xl p-6 flex-1 mr-3 items-center shadow-sm border border-gray-200"
                  onPress={pickImageFromCamera}
                >
                  <View className="bg-blue-100 rounded-full p-4 mb-3">
                    <Ionicons name="camera" size={32} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-800 font-semibold">Take Photo</Text>
                  <Text className="text-gray-500 text-sm text-center mt-1">Use camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-xl p-6 flex-1 ml-3 items-center shadow-sm border border-gray-200"
                  onPress={pickImageFromGallery}
                >
                  <View className="bg-purple-100 rounded-full p-4 mb-3">
                    <Ionicons name="images" size={32} color="#8B5CF6" />
                  </View>
                  <Text className="text-gray-800 font-semibold">Gallery</Text>
                  <Text className="text-gray-500 text-sm text-center mt-1">Choose existing</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Analysis */}
              {analysisHistory && analysisHistory.length > 0 && (
                <View>
                  <Text className="text-gray-800 text-lg font-semibold mb-4">Recent Analysis</Text>
                  {analysisHistory.slice(0, 3).map((analysis) => (
                    <TouchableOpacity
                      key={analysis.id}
                      className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                      onPress={() => handleAnalysisClick(analysis)}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-gray-800 font-medium capitalize">
                            {analysis.analysis_type} Analysis
                          </Text>
                          <Text className="text-gray-500 text-sm mt-1">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </Text>
                          {analysis.confidence_score && (
                            <Text className="text-green-600 text-sm font-medium mt-1">
                              Confidence: {Math.round(analysis.confidence_score * 100)}%
                            </Text>
                          )}
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View className="p-6">
              {/* Selected Image */}
              <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-64 rounded-lg"
                  resizeMode="cover"
                />
              </View>

              {/* Analysis Type Selection */}
              <Text className="text-gray-800 text-lg font-semibold mb-4">Analysis Type</Text>
              <View className="flex-row flex-wrap justify-between mb-6">
                {analysisOptions.map((option) => (
                  <TouchableOpacity
                    key={option.type}
                    className={`w-[48%] mb-4 rounded-xl p-4 border-2 ${
                      selectedAnalysis === option.type
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onPress={() => setSelectedAnalysis(option.type)}
                  >
                    <View className={`${option.color} rounded-full p-2 self-start mb-2`}>
                      <Ionicons name={option.icon as any} size={20} color="white" />
                    </View>
                    <Text className="text-gray-800 font-semibold text-sm">{option.title}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{option.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Analyze Button */}
              <TouchableOpacity
                className={`rounded-xl py-4 mb-6 ${
                  analyzeImageMutation.isPending ? 'bg-green-400' : 'bg-green-600'
                }`}
                onPress={handleAnalyze}
                disabled={analyzeImageMutation.isPending}
              >
                <View className="flex-row items-center justify-center">
                  {analyzeImageMutation.isPending && (
                    <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                  )}
                  <Text className="text-white text-lg font-semibold">
                    {analyzeImageMutation.isPending ? 'Analyzing...' : 'Analyze Image'}
                  </Text>
                </View>
              </TouchableOpacity>

              
            </View>
          )}
        </ScrollView>

        {/* Detailed Analysis Modal */}
        <Modal
          visible={showDetailModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeDetailModal}
        >
          <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-green-600 px-6 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-lg font-semibold">Analysis Details</Text>
                <TouchableOpacity onPress={closeDetailModal}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 p-6">
              {selectedDetailAnalysis && (
                <>
                  {/* Analysis Type & Date */}
                  <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-800 text-lg font-semibold capitalize">
                        {selectedDetailAnalysis.analysis_type} Analysis
                      </Text>
                      {selectedDetailAnalysis.confidence_score && (
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                          <Text className="text-green-800 text-sm font-medium">
                            {Math.round(selectedDetailAnalysis.confidence_score * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-500 text-sm">
                      {new Date(selectedDetailAnalysis.created_at).toLocaleString()}
                    </Text>
                  </View>

                  {/* Analysis Results */}
                  {selectedDetailAnalysis.results && (
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                      <Text className="text-gray-800 text-lg font-semibold mb-3">Results</Text>

                      {selectedDetailAnalysis.results.primary_analysis && (
                        <View className="mb-3">
                          <Text className="text-gray-700 font-medium mb-1">Primary Analysis:</Text>
                          <Text className="text-gray-600 text-sm">
                            {selectedDetailAnalysis.results.primary_analysis}
                          </Text>
                        </View>
                      )}

                      {selectedDetailAnalysis.results.detailed_findings && (
                        <View className="mb-3">
                          <Text className="text-gray-700 font-medium mb-1">Detailed Findings:</Text>
                          <Text className="text-gray-600 text-sm">
                            {selectedDetailAnalysis.results.detailed_findings}
                          </Text>
                        </View>
                      )}

                      {selectedDetailAnalysis.results.severity_level && (
                        <View className="mb-3">
                          <Text className="text-gray-700 font-medium mb-1">Severity Level:</Text>
                          <View className={`px-3 py-1 rounded-full self-start ${
                            selectedDetailAnalysis.results.severity_level === 'high' ? 'bg-red-100' :
                            selectedDetailAnalysis.results.severity_level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            <Text className={`text-sm font-medium capitalize ${
                              selectedDetailAnalysis.results.severity_level === 'high' ? 'text-red-800' :
                              selectedDetailAnalysis.results.severity_level === 'medium' ? 'text-yellow-800' : 'text-green-800'
                            }`}>
                              {selectedDetailAnalysis.results.severity_level}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Recommendations */}
                  {selectedDetailAnalysis.recommendations && (
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                      <Text className="text-gray-800 text-lg font-semibold mb-3">Recommendations</Text>
                      <View className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Text className="text-blue-800 text-sm">
                          {selectedDetailAnalysis.recommendations}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Enhanced AI Analysis Details */}
                  {selectedDetailAnalysis.results?.treatment_plan && (
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                      <Text className="text-gray-800 text-lg font-semibold mb-3">Treatment Plan</Text>
                      <View className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <Text className="text-green-800 text-sm">
                          {selectedDetailAnalysis.results.treatment_plan}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedDetailAnalysis.results?.prevention_measures && (
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                      <Text className="text-gray-800 text-lg font-semibold mb-3">Prevention Measures</Text>
                      <View className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <Text className="text-purple-800 text-sm">
                          {selectedDetailAnalysis.results.prevention_measures}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Metadata */}
                  {selectedDetailAnalysis.results?.enhanced_analysis && (
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                      <Text className="text-gray-800 text-lg font-semibold mb-3">Analysis Details</Text>
                      <View className="space-y-2">
                        {selectedDetailAnalysis.results.model_used && (
                          <View className="flex-row items-center">
                            <Ionicons name="cpu" size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">
                              Model: {selectedDetailAnalysis.results.model_used}
                            </Text>
                          </View>
                        )}
                        {selectedDetailAnalysis.results.local_context && (
                          <View className="flex-row items-center">
                            <Ionicons name="location" size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">
                              Context: {selectedDetailAnalysis.results.local_context}
                            </Text>
                          </View>
                        )}
                        {selectedDetailAnalysis.results.seasonal_factors && (
                          <View className="flex-row items-center">
                            <Ionicons name="leaf" size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">
                              Seasonal: {selectedDetailAnalysis.results.seasonal_factors}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
}