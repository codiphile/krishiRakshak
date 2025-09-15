import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ImageAnalysisResult } from '../types/api';
import { localAnalysisService } from '../services/localAnalysisService';

export default function AnalysisResultScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  console.log('📱 AnalysisResult params received:', params);

  let analysisResult: any = null;
  try {
    if (params.result) {
      const parsedResult = JSON.parse(params.result as string);
      console.log('📱 Parsed analysis result:', parsedResult);

      // Check if the result has the expected structure
      if (parsedResult.results) {
        // If results are nested, extract them
        analysisResult = parsedResult.results;
      } else {
        // If it's already in the correct format
        analysisResult = parsedResult;
      }

      console.log('📱 Final analysis result for display:', analysisResult);
    }
  } catch (error) {
    console.error('❌ Error parsing analysis result:', error);
  }

  const analysisType = params.analysisType as string;
  const imageUri = params.imageUri as string;

  const saveMutation = useMutation({
    mutationFn: () => localAnalysisService.saveAnalysis(analysisResult, analysisType, imageUri),
    onSuccess: () => {
      Alert.alert('Success', 'Report saved successfully!');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', 'Failed to save report: ' + error.message);
    },
  });

  if (!analysisResult) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-500 text-lg">Error: Analysis data not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-green-600 px-6 py-4 flex-row items-center justify-between">
        <Text className="text-white text-lg font-semibold">Analysis Result</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          {/* ... existing result display ... */}
          <View className="flex-row items-center mb-4">
            <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            <Text className="text-gray-800 text-lg font-semibold ml-2">Analysis Complete</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Primary Analysis:</Text>
            <View className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <Text className="text-blue-800 text-sm">
                {analysisResult?.primary_analysis || 'Analysis in progress...'}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Detailed Findings:</Text>
            <View className="bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-700 text-sm">
                {analysisResult?.detailed_findings || 'Detailed findings will appear here...'}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Severity Level:</Text>
            <View className={`px-3 py-1 rounded-full self-start ${
              analysisResult?.severity_level === 'high' ? 'bg-red-100' :
              analysisResult?.severity_level === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <Text className={`text-sm font-medium capitalize ${
                analysisResult?.severity_level === 'high' ? 'text-red-800' :
                analysisResult?.severity_level === 'medium' ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {analysisResult?.severity_level || 'Unknown'}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Treatment Plan:</Text>
            <View className="bg-green-50 rounded-lg p-3 border border-green-200">
              <Text className="text-green-800 text-sm">
                {analysisResult?.treatment_plan || 'Treatment recommendations will appear here...'}
              </Text>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-800 font-medium mb-2">Prevention Measures:</Text>
            <View className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <Text className="text-purple-800 text-sm">
                {analysisResult?.prevention_measures || 'Prevention measures will appear here...'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="stats-chart" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">
              Confidence: {analysisResult?.confidence_score ? Math.round(analysisResult.confidence_score * 100) : 95}%
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className={`rounded-xl py-4 ${saveMutation.isPending ? 'bg-green-400' : 'bg-green-600'}`}>
          <View className="flex-row items-center justify-center">
            {saveMutation.isPending && (
              <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
            )}
            <Text className="text-white text-lg font-semibold">
              {saveMutation.isPending ? 'Saving...' : 'Save Report'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
