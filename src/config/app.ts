// App Configuration
export const AppConfig = {
  // API Configuration
  API_BASE_URL: 'https://overbright-soledad-dhooly.ngrok-free.app/fastapi/api/v1',

  // Image upload base URL
  IMAGE_BASE_URL: 'https://overbright-soledad-dhooly.ngrok-free.app/fastapi',

  // App Settings
  API_TIMEOUT: 10000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],

  // Location Settings
  DEFAULT_SEARCH_RADIUS: 10, // km
  MAX_SEARCH_RADIUS: 100, // km

  // Chat Settings
  MAX_MESSAGE_LENGTH: 500,
  CHAT_HISTORY_LIMIT: 50,

  // Languages
  SUPPORTED_LANGUAGES: ['malayalam', 'english', 'hindi'],
  DEFAULT_LANGUAGE: 'malayalam'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  PROFILE: '/auth/profile',

  // Chat
  CHAT: '/chat',
  CHAT_HISTORY: '/chat/history',

  // Analysis
  ANALYZE: '/analysis/analyze',
  ANALYSIS_HISTORY: '/analysis/history',

  // Knowledge
  KNOWLEDGE_SEARCH: '/knowledge/search',
  KNOWLEDGE_POPULAR: '/knowledge/popular',
  KNOWLEDGE_VOTE: '/knowledge/{id}/vote',

  // Community
  GROUPS: '/community/groups',
  GROUP_MESSAGES: '/community/groups/{id}/messages',
  JOIN_GROUP: '/community/groups/{id}/join',
  LEAVE_GROUP: '/community/groups/{id}/leave',

  // Location
  NEARBY_RETAILERS: '/location/retailers/nearby',
  SEARCH_RETAILERS: '/location/retailers/search',
  RETAILER_DETAILS: '/location/retailers/{id}',

  // Upload
  UPLOAD: '/upload/'
};