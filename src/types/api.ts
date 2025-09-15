// API Types based on backend schemas
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  crops_grown?: string[];
  farm_size?: number;
  farming_experience?: number;
  preferred_language: string;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserLogin {
  username: string; // email or phone
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'voice' | 'image';
  response?: string;
  trust_score?: number;
  created_at: string;
}

export interface ChatMessageCreate {
  message: string;
  message_type: 'text' | 'voice' | 'image';
}

export interface ImageAnalysis {
  id: string;
  user_id: string;
  image_path: string;
  analysis_type: 'crop' | 'pest' | 'disease' | 'soil';
  results?: Record<string, any>;
  confidence_score?: number;
  recommendations?: string;
  created_at: string;
}

// Response from backend API /analysis/analyze endpoint (for workflow processing)
export interface ImageAnalysisResponse {
  status: string;
  message: string;
  estimated_time?: string;
  analysis_id?: string;
  workflow_triggered?: boolean;
  enhanced_processing?: boolean;
  trigger_result?: any;
}

// Response from Gemini service (for direct analysis results)
export interface ImageAnalysisResult {
  primary_analysis: string;
  detailed_findings: string;
  severity_level: string;
  treatment_plan: string;
  prevention_measures: string;
  confidence_score: number;
}

export interface QARepository {
  id: string;
  question: string;
  answer: string;
  crop_type?: string;
  category?: string;
  language: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at?: string;
  similarity_score?: number;
}

export interface GroupChat {
  id: string;
  name: string;
  description?: string;
  crop_type?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  message_type: string;
  created_at: string;
  user: User;
}

export interface Retailer {
  id: string;
  name: string;
  contact_person?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  latitude: number;
  longitude: number;
  services?: string[];
  rating: number;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  distance?: number;
}

export interface APIError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}