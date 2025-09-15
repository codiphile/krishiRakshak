import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageAnalysis, ImageAnalysisResult } from '../types/api';

const ANALYSIS_HISTORY_KEY = '@analysis_history';

export const localAnalysisService = {
  async getAnalysisHistory(): Promise<ImageAnalysis[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ANALYSIS_HISTORY_KEY);
      const history = jsonValue != null ? JSON.parse(jsonValue) : [];
      // Sort by date, newest first
      history.sort((a: ImageAnalysis, b: ImageAnalysis) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return history;
    } catch (e) {
      console.error('Failed to fetch analysis history from storage', e);
      return [];
    }
  },

  async saveAnalysis(analysisResult: ImageAnalysisResult, analysisType: string, imageUri: string): Promise<ImageAnalysis> {
    try {
      const history = await this.getAnalysisHistory();
      const newAnalysis: ImageAnalysis = {
        id: `local-${Date.now()}`,
        user_id: 'local-user', // Placeholder for local demo
        image_url: imageUri,
        analysis_type: analysisType,
        results: analysisResult,
        recommendations: 'See treatment and prevention plans.', // Placeholder
        confidence_score: analysisResult.confidence_score,
        created_at: new Date().toISOString(),
      };
      const newHistory = [newAnalysis, ...history];
      const jsonValue = JSON.stringify(newHistory);
      await AsyncStorage.setItem(ANALYSIS_HISTORY_KEY, jsonValue);
      console.log('💾 Analysis saved locally.');
      return newAnalysis;
    } catch (e) {
      console.error('Failed to save analysis to storage', e);
      throw e;
    }
  },
};
