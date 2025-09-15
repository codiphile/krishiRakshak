import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerProfile } from '../types/farmerProfile';

const FARMER_PROFILE_KEY = '@krishi_farmer_profile';

export class FarmerProfileService {

  async saveProfile(profile: Partial<FarmerProfile>): Promise<void> {
    try {
      const profileData = {
        ...profile,
        lastUpdated: new Date().toISOString(),
        isProfileComplete: true
      };

      await AsyncStorage.setItem(FARMER_PROFILE_KEY, JSON.stringify(profileData));
      console.log('✅ Farmer profile saved successfully');
    } catch (error) {
      console.error('❌ Error saving farmer profile:', error);
      throw new Error('Failed to save farmer profile');
    }
  }

  async getProfile(): Promise<FarmerProfile | null> {
    try {
      const storedProfile = await AsyncStorage.getItem(FARMER_PROFILE_KEY);

      if (!storedProfile) {
        console.log('📋 No farmer profile found');
        return null;
      }

      const profile = JSON.parse(storedProfile);

      // Convert date string back to Date object
      if (profile.lastUpdated) {
        profile.lastUpdated = new Date(profile.lastUpdated);
      }

      console.log('📋 Farmer profile loaded successfully');
      return profile as FarmerProfile;
    } catch (error) {
      console.error('❌ Error loading farmer profile:', error);
      return null;
    }
  }

  async updateProfile(updates: Partial<FarmerProfile>): Promise<void> {
    try {
      const existingProfile = await this.getProfile();

      const updatedProfile = {
        ...existingProfile,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(FARMER_PROFILE_KEY, JSON.stringify(updatedProfile));
      console.log('✅ Farmer profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating farmer profile:', error);
      throw new Error('Failed to update farmer profile');
    }
  }

  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FARMER_PROFILE_KEY);
      console.log('🗑️ Farmer profile cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing farmer profile:', error);
      throw new Error('Failed to clear farmer profile');
    }
  }

  async hasProfile(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile !== null && profile.isProfileComplete === true;
    } catch (error) {
      console.error('❌ Error checking farmer profile:', error);
      return false;
    }
  }

  generateProfileContext(profile: FarmerProfile): string {
    if (!profile) return '';

    const context = [];

    // Basic Information
    if (profile.farmSize) {
      context.push(`Farm Size: ${profile.farmSize}`);
    }

    if (profile.location?.state && profile.location?.district) {
      context.push(`Location: ${profile.location.district}, ${profile.location.state}`);
    }

    // Land and Soil
    if (profile.landType?.length) {
      context.push(`Land Type: ${profile.landType.join(', ')}`);
    }

    if (profile.soilType?.length) {
      context.push(`Soil Type: ${profile.soilType.join(', ')}`);
    }

    if (profile.soilHealth) {
      context.push(`Soil Health: ${profile.soilHealth}`);
    }

    // Crops
    if (profile.primaryCrops?.length) {
      context.push(`Primary Crops: ${profile.primaryCrops.join(', ')}`);
    }

    if (profile.farmingType?.length) {
      context.push(`Farming Type: ${profile.farmingType.join(', ')}`);
    }

    // Resources
    if (profile.irrigationMethod?.length) {
      context.push(`Irrigation: ${profile.irrigationMethod.join(', ')}`);
    }

    if (profile.waterSource?.length) {
      context.push(`Water Source: ${profile.waterSource.join(', ')}`);
    }

    if (profile.mechanizationLevel) {
      context.push(`Mechanization: ${profile.mechanizationLevel}`);
    }

    // Challenges and Goals
    if (profile.mainChallenges?.length) {
      context.push(`Main Challenges: ${profile.mainChallenges.join(', ')}`);
    }

    if (profile.goals?.length) {
      context.push(`Goals: ${profile.goals.join(', ')}`);
    }

    // Experience and Background
    if (profile.farmingExperience) {
      context.push(`Experience: ${profile.farmingExperience}`);
    }

    return context.length > 0 ? context.join(' | ') : '';
  }

  generateDetailedContext(profile: FarmerProfile): string {
    if (!profile) return '';

    let context = '### Farmer Profile Context:\n\n';

    // Farm Overview
    context += '**Farm Overview:**\n';
    if (profile.farmSize) context += `- Farm Size: ${profile.farmSize}\n`;
    if (profile.location?.state && profile.location?.district) {
      context += `- Location: ${profile.location.district}, ${profile.location.state}\n`;
    }
    if (profile.farmingExperience) context += `- Experience: ${profile.farmingExperience}\n`;

    // Land & Soil
    if (profile.landType?.length || profile.soilType?.length || profile.soilHealth) {
      context += '\n**Land & Soil:**\n';
      if (profile.landType?.length) context += `- Land Type: ${profile.landType.join(', ')}\n`;
      if (profile.soilType?.length) context += `- Soil Type: ${profile.soilType.join(', ')}\n`;
      if (profile.soilHealth) context += `- Soil Health: ${profile.soilHealth}\n`;
    }

    // Crops & Farming
    if (profile.primaryCrops?.length || profile.farmingType?.length) {
      context += '\n**Crops & Farming:**\n';
      if (profile.primaryCrops?.length) context += `- Primary Crops: ${profile.primaryCrops.join(', ')}\n`;
      if (profile.farmingType?.length) context += `- Farming Type: ${profile.farmingType.join(', ')}\n`;
    }

    // Resources
    if (profile.irrigationMethod?.length || profile.waterSource?.length || profile.mechanizationLevel) {
      context += '\n**Resources:**\n';
      if (profile.irrigationMethod?.length) context += `- Irrigation: ${profile.irrigationMethod.join(', ')}\n`;
      if (profile.waterSource?.length) context += `- Water Source: ${profile.waterSource.join(', ')}\n`;
      if (profile.mechanizationLevel) context += `- Mechanization: ${profile.mechanizationLevel}\n`;
    }

    // Current Challenges
    if (profile.mainChallenges?.length) {
      context += '\n**Current Challenges:**\n';
      profile.mainChallenges.forEach(challenge => {
        context += `- ${challenge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
      });
    }

    // Farmer Goals
    if (profile.goals?.length) {
      context += '\n**Farmer Goals:**\n';
      profile.goals.forEach(goal => {
        context += `- ${goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
      });
    }

    context += '\n---\n\n';

    return context;
  }

  getProfileCompleteness(profile: Partial<FarmerProfile>): number {
    const requiredFields = [
      'farmSize',
      'landType',
      'soilType',
      'primaryCrops',
      'farmingType',
      'irrigationMethod',
      'waterSource',
      'mechanizationLevel',
      'mainChallenges',
      'goals'
    ];

    const completedFields = requiredFields.filter(field => {
      const value = profile[field as keyof FarmerProfile];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }
}

export const farmerProfileService = new FarmerProfileService();