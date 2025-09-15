import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  User,
  UserCreate,
  UserLogin,
  Token,
  ChatMessage,
  ChatMessageCreate,
  ImageAnalysis,
  ImageAnalysisResponse,
  ImageAnalysisResult,
  QARepository,
  GroupChat,
  GroupMessage,
  Retailer,
  UserProfile
} from '../types/api';
import { AppConfig } from '../config/app';
import { geminiService } from './gemini';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: AppConfig.API_BASE_URL,
      timeout: AppConfig.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('@auth_token');
          console.log('🔑 Token from storage:', token ? 'Found' : 'Not found');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Authorization header set');
          }
        } catch (error) {
          console.warn('❌ Failed to get auth token from storage:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage
          await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async register(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: UserLogin): Promise<Token> {
    console.log('🔑 API Login called with:', { username: credentials.username });

    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const response: AxiosResponse<Token> = await this.client.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      console.log('✅ Login API success:', {
        status: response.status,
        hasToken: !!response.data?.access_token,
        tokenType: response.data?.token_type
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Login API failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/me');
    return response.data;
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.client.put('/auth/me', userData);
    return response.data;
  }

  // User Profile endpoints
  async getUserProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.client.get('/auth/profile');
    return response.data;
  }

  async createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.client.post('/auth/profile', profileData);
    return response.data;
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.client.put('/auth/profile', profileData);
    return response.data;
  }

  // Chat endpoints
  async sendChatMessage(message: ChatMessageCreate): Promise<ChatMessage> {
    const response: AxiosResponse<ChatMessage> = await this.client.post('/chat', message);
    return response.data;
  }

  async getChatHistory(page: number = 1, size: number = 20): Promise<ChatMessage[]> {
    const response: AxiosResponse<ChatMessage[]> = await this.client.get('/chat/history', {
      params: { page, size }
    });
    return response.data;
  }

  // Image Analysis endpoints
  async analyzeImage(imageUri: string, analysisType: 'crop' | 'pest' | 'disease' | 'soil'): Promise<ImageAnalysisResponse> {
    console.log('🔍 Making backend API call for image analysis:', { imageUri: imageUri.substring(0, 50) + '...', analysisType });

    try {
      const formData = new FormData();
      formData.append('analysis_type', analysisType);
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'analysis.jpg',
      } as any);

      const response: AxiosResponse<ImageAnalysisResponse> = await this.client.post('/analysis/analyze', formData, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      console.log('✅ Backend analysis API successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Backend analysis API failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Gemini-based image analysis (for direct results)
  async analyzeImageWithGemini(imageUri: string, analysisType: 'crop' | 'pest' | 'disease' | 'soil'): Promise<ImageAnalysisResult> {
    console.log('🔍 Starting image analysis with Gemini:', { imageUri: imageUri.substring(0, 50) + '...', analysisType });

    try {
      const geminiResponse = await geminiService.analyzeImage(imageUri, analysisType);

      // The Gemini response is already in the correct format, so we can return it directly.
      // However, we should validate it to ensure it matches the ImageAnalysisResult interface.
      const response: ImageAnalysisResult = {
        primary_analysis: geminiResponse.primary_analysis || 'No primary analysis provided.',
        detailed_findings: geminiResponse.detailed_findings || 'No detailed findings provided.',
        severity_level: geminiResponse.severity_level || 'N/A',
        treatment_plan: geminiResponse.treatment_plan || 'No treatment plan provided.',
        prevention_measures: geminiResponse.prevention_measures || 'No prevention measures provided.',
        confidence_score: geminiResponse.confidence_score || 0,
      };

      console.log('✅ Gemini analysis successful:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Gemini analysis failed:', {
        message: error.message,
      });
      throw error;
    }
  }

  async getAnalysisHistory(page: number = 1, size: number = 20): Promise<ImageAnalysis[]> {
    const response: AxiosResponse<ImageAnalysis[]> = await this.client.get('/analysis/history', {
      params: { page, size }
    });
    return response.data;
  }

  // Knowledge base endpoints
  async searchKnowledge(query: string, cropType?: string, category?: string): Promise<QARepository[]> {
    const response: AxiosResponse<QARepository[]> = await this.client.get('/knowledge/search', {
      params: { query, crop_type: cropType, category }
    });
    return response.data;
  }

  async getPopularQuestions(): Promise<QARepository[]> {
    const response: AxiosResponse<QARepository[]> = await this.client.get('/knowledge/popular');
    return response.data;
  }

  async voteQuestion(questionId: string, vote: 'up' | 'down'): Promise<void> {
    await this.client.post(`/knowledge/${questionId}/vote`, { vote });
  }

  // Community endpoints
  async getGroupChats(): Promise<GroupChat[]> {
    const response: AxiosResponse<GroupChat[]> = await this.client.get('/community/groups');
    return response.data;
  }

  async createGroupChat(groupData: { name: string; description?: string; crop_type?: string; location?: string }): Promise<GroupChat> {
    const response: AxiosResponse<GroupChat> = await this.client.post('/community/groups', groupData);
    return response.data;
  }

  async getGroupMessages(groupId: string, page: number = 1, size: number = 50): Promise<GroupMessage[]> {
    const response: AxiosResponse<GroupMessage[]> = await this.client.get(`/community/groups/${groupId}/messages`, {
      params: { page, size }
    });
    return response.data;
  }

  async sendGroupMessage(groupId: string, message: string): Promise<GroupMessage> {
    const response: AxiosResponse<GroupMessage> = await this.client.post(`/community/groups/${groupId}/messages`, {
      message,
      message_type: 'text'
    });
    return response.data;
  }

  async joinGroup(groupId: string): Promise<void> {
    await this.client.post(`/community/groups/${groupId}/join`);
  }

  async leaveGroup(groupId: string): Promise<void> {
    await this.client.post(`/community/groups/${groupId}/leave`);
  }

  // Location endpoints
  async getNearbyRetailers(latitude: number, longitude: number, radius: number = 10): Promise<Retailer[]> {
    const response: AxiosResponse<Retailer[]> = await this.client.get('/location/retailers/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data;
  }

  async searchRetailers(query: string, latitude?: number, longitude?: number): Promise<Retailer[]> {
    const response: AxiosResponse<Retailer[]> = await this.client.get('/location/retailers/search', {
      params: { query, latitude, longitude }
    });
    return response.data;
  }

  async getRetailerById(retailerId: string): Promise<Retailer> {
    const response: AxiosResponse<Retailer> = await this.client.get(`/location/retailers/${retailerId}`);
    return response.data;
  }

  // Utility methods
  async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    const response: AxiosResponse<{ file_path: string }> = await this.client.post('/upload/', formData, {
      headers: {
        // Remove Content-Type - let Axios set it automatically with boundary for FormData
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data.file_path;
  }

  // Error handler
  handleError(error: any): string {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

export const apiService = new APIService();
export default apiService;