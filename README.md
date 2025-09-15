# KrishiRakshak - Digital Farming Assistant 🌾

A comprehensive React Native application that provides AI-powered farming assistance, crop analysis, community features, and location-based services for farmers.

## Features

### 🤖 AI Assistant
- Multilingual chat support (Malayalam, English, Hindi)
- Intelligent farming advice and recommendations
- Trust score system for AI responses
- Voice and text message support

### 📸 Image Analysis
- Crop health assessment
- Pest and disease detection
- Soil condition analysis
- Confidence scoring and detailed recommendations

### 👥 Community Features
- Group chats for farmers
- Crop-specific and location-based groups
- Real-time messaging
- Knowledge sharing platform

### 📍 Location Services
- Find nearby agricultural retailers
- Distance-based search with customizable radius
- Contact information and directions
- Verified retailer network

### 👤 Profile Management
- Personal and farm information
- Crop tracking and farm statistics
- Language preferences
- Account settings and privacy controls

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with Tab Navigation
- **State Management**: React Context + TanStack Query
- **Styling**: NativeWind (Tailwind CSS)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons
- **Image Handling**: Expo Image Picker
- **Location**: Expo Location
- **TypeScript**: Full type safety

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishiRakshak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**

   Update the `API_BASE_URL` in `src/config/app.ts`:
   ```typescript
   API_BASE_URL: __DEV__
     ? 'http://YOUR_LOCAL_IP:8000/api/v1'  // Replace with your machine's IP
     : 'https://your-production-api.com/api/v1'
   ```

   > **Important**: Replace `YOUR_LOCAL_IP` with your actual machine's IP address (not localhost) for mobile device testing.

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For web: `npm run web`

## Backend Integration

This app requires the KrishiRakshak FastAPI backend to be running. Make sure you have:

1. **Backend server running** on the configured URL
2. **Database setup** (PostgreSQL)
3. **Redis server** for caching
4. **Qdrant vector database** for AI features
5. **OpenAI API key** configured

### API Endpoints Used

- **Authentication**: `/auth/register`, `/auth/token`, `/auth/me`
- **Chat**: `/chat`, `/chat/history`
- **Analysis**: `/analysis/analyze`, `/analysis/history`
- **Community**: `/community/groups`, `/community/groups/{id}/messages`
- **Location**: `/location/retailers/nearby`, `/location/retailers/search`
- **Knowledge**: `/knowledge/search`, `/knowledge/popular`

## Development Notes

### Network Configuration

For development, ensure your mobile device/emulator can reach your backend:

1. **Use your machine's local IP** instead of `localhost`
2. **Disable firewall** or allow connections on the API port
3. **Ensure backend CORS** is configured to allow your development origin

### Environment Setup

1. **Android**: Enable Developer Options and USB Debugging
2. **iOS**: Have a valid Apple Developer account for device testing
3. **Expo Go**: Install the Expo Go app for quick testing

### Debugging

- Use React Native Debugger or Flipper
- Enable console logs for API calls
- Check network requests in developer tools
- Use Expo Developer Tools for debugging

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ProtectedRoute.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── services/          # API services
│   └── api.ts
├── types/            # TypeScript types
│   └── api.ts
├── config/           # App configuration
│   └── app.ts
├── hooks/            # Custom hooks
└── utils/            # Utility functions

app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home/Dashboard
│   ├── chat.tsx      # AI Chat
│   ├── analysis.tsx  # Image Analysis
│   ├── community.tsx # Community Groups
│   ├── locations.tsx # Retailer Locations
│   └── profile.tsx   # User Profile
├── auth.tsx          # Authentication
├── index.tsx         # Splash screen
└── _layout.tsx       # Root layout
```

## Key Features Implementation

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Persistent login state
- Secure token storage

### Real-time Features
- Chat history synchronization
- Community message updates
- Location-based services

### Offline Support
- Cached user data
- Offline-first authentication
- Error handling and retry mechanisms

## Permissions Required

- **Camera**: For taking crop photos
- **Photo Library**: For selecting existing images
- **Location**: For finding nearby retailers
- **Internet**: For API communication

## Production Deployment

1. **Update API URLs** in `src/config/app.ts`
2. **Configure app.json** with proper app identifiers
3. **Build for production**:
   ```bash
   expo build:android
   expo build:ios
   ```
4. **Deploy to app stores** using Expo's build service or EAS Build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript typing
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the backend API documentation
- Verify network connectivity
- Ensure proper environment configuration
- Review Expo and React Native documentation

---

**Happy Farming! 🚜🌱**
