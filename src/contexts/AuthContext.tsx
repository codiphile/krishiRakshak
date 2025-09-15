import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserCreate, UserLogin, UserProfile } from '../types/api';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Development: Provide dummy user data to avoid null references
  const dummyUser: User = {
    id: 'dev-user',
    email: 'dev@example.com',
    full_name: 'Development User',
    location: 'Development Location',
    is_active: true
  };

  const [user, setUser] = useState<User | null>(dummyUser); // Development: Use dummy user
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Development: Set to false immediately

  // Development: Always return true to bypass authentication
  const isAuthenticated = true; // TODO: Change back to `!!user` for production

  const clearAuthData = async () => {
    await AsyncStorage.multiRemove(['@auth_token', '@user_data', '@user_profile']);
    setUser(null);
    setUserProfile(null);
  };

  const refreshUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));

      try {
        const profileData = await apiService.getUserProfile();
        setUserProfile(profileData);
        await AsyncStorage.setItem('@user_profile', JSON.stringify(profileData));
      } catch {
        // Profile might not exist
        console.log('No profile found during refresh');
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
      throw error;
    }
  };

  const initializeAuth = useCallback(async () => {
    try {
      console.log('🚀 Initializing auth...');
      const token = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('@user_data');
      const profileData = await AsyncStorage.getItem('@user_profile');

      console.log('📦 Storage check:', {
        hasToken: !!token,
        hasUserData: !!userData,
        hasProfile: !!profileData
      });

      if (token && userData) {
        console.log('✅ Found stored auth data, setting user');
        setUser(JSON.parse(userData));
        if (profileData) {
          setUserProfile(JSON.parse(profileData));
        }

        // Verify token is still valid and refresh user data
        try {
          await refreshUserData();
          console.log('✅ Token verified and data refreshed');
        } catch {
          // Token invalid, clear storage
          console.log('❌ Token invalid, clearing storage');
          await clearAuthData();
        }
      } else {
        console.log('⚠️ No stored auth data found');
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Development: Skip auth initialization
  // useEffect(() => {
  //   initializeAuth();
  // }, [initializeAuth]);

  const login = async (credentials: UserLogin) => {
    try {
      setIsLoading(true);

      // Get token
      console.log('🔐 Starting login process...');
      const tokenResponse = await apiService.login(credentials);
      console.log('🎫 Token response:', tokenResponse ? 'Received' : 'No response');

      if (tokenResponse?.access_token) {
        await AsyncStorage.setItem('@auth_token', tokenResponse.access_token);
        console.log('💾 Token saved to storage');

        // Verify token was saved
        const savedToken = await AsyncStorage.getItem('@auth_token');
        console.log('✅ Token verification:', savedToken ? 'Found in storage' : 'NOT FOUND in storage');
      } else {
        console.error('❌ No access_token in response');
      }

      // Get user data
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));

      // Try to get user profile
      try {
        const profileData = await apiService.getUserProfile();
        setUserProfile(profileData);
        await AsyncStorage.setItem('@user_profile', JSON.stringify(profileData));
      } catch {
        // Profile doesn't exist yet, that's ok
        console.log('No profile found, user can create one later');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserCreate) => {
    try {
      setIsLoading(true);

      // Register user
      await apiService.register(userData);

      // Auto-login after registration
      await login({
        username: userData.email,
        password: userData.password
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateUser(userData);
      setUser(updatedUser);
      await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      let updatedProfile: UserProfile;

      if (userProfile) {
        // Update existing profile
        updatedProfile = await apiService.updateUserProfile(profileData);
      } else {
        // Create new profile
        updatedProfile = await apiService.createUserProfile(profileData);
      }

      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;