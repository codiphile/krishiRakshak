export interface FarmerProfile {
  // Basic Information
  farmSize: string; // '0-1 acre', '1-2 acres', '2-5 acres', '5-10 acres', '10+ acres'
  location: {
    state: string;
    district: string;
    taluka?: string;
    village?: string;
  };

  // Land and Soil Information
  landType: string[]; // 'irrigated', 'rainfed', 'both'
  soilType: string[]; // 'alluvial', 'black', 'red', 'laterite', 'desert', 'mountain', 'other'
  soilHealth: string; // 'excellent', 'good', 'average', 'poor', 'unknown'

  // Crops Information
  primaryCrops: string[]; // 'rice', 'wheat', 'sugarcane', 'cotton', 'maize', 'pulses', 'oilseeds', 'vegetables', 'fruits', 'spices', 'other'
  seasonalCrops: {
    kharif: string[]; // monsoon crops
    rabi: string[]; // winter crops
    zaid: string[]; // summer crops
  };

  // Farming Practices
  farmingType: string[]; // 'organic', 'conventional', 'mixed', 'natural'
  irrigationMethod: string[]; // 'drip', 'sprinkler', 'flood', 'furrow', 'rainfed'
  mechanizationLevel: string; // 'fully-mechanized', 'semi-mechanized', 'manual', 'mixed'

  // Resources and Infrastructure
  waterSource: string[]; // 'borewell', 'canal', 'river', 'pond', 'rainwater', 'government-supply'
  electricityAccess: string; // 'available', 'limited', 'none'
  storageCapacity: string; // 'adequate', 'limited', 'none'
  transportAccess: string; // 'own-vehicle', 'local-transport', 'limited', 'none'

  // Economic Information
  annualIncome: string; // '0-1L', '1-3L', '3-5L', '5-10L', '10L+'
  farmingExperience: string; // '0-2 years', '2-5 years', '5-10 years', '10-20 years', '20+ years'
  educationLevel: string; // 'no-formal', 'primary', 'secondary', 'graduate', 'post-graduate'

  // Technology and Information
  phoneType: string; // 'smartphone', 'feature-phone', 'both'
  internetAccess: string; // 'regular', 'limited', 'none'
  informationSources: string[]; // 'extension-officer', 'tv', 'radio', 'apps', 'newspapers', 'neighbors', 'cooperative'

  // Challenges and Goals
  mainChallenges: string[]; // 'pest-disease', 'water-shortage', 'poor-yield', 'market-price', 'input-cost', 'weather', 'labor-shortage', 'storage', 'transport'
  goals: string[]; // 'increase-yield', 'reduce-cost', 'organic-farming', 'new-crops', 'better-marketing', 'modern-techniques'

  // Government Schemes
  governmentSchemes: string[]; // 'pm-kisan', 'soil-health-card', 'pradhan-mantri-fasal-bima', 'kcc', 'other'

  // Last Updated
  lastUpdated: Date;
  isProfileComplete: boolean;
}

export interface ProfileFormSection {
  id: string;
  title: string;
  description: string;
  fields: ProfileField[];
}

export interface ProfileField {
  id: keyof FarmerProfile | string;
  label: string;
  type: 'single-select' | 'multi-select' | 'text' | 'number' | 'nested-object';
  options?: ProfileOption[];
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ProfileOption {
  value: string;
  label: string;
  description?: string;
  emoji?: string;
}

export const FARMER_PROFILE_SECTIONS: ProfileFormSection[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Tell us about your farm and location',
    fields: [
      {
        id: 'farmSize',
        label: 'Farm Size',
        type: 'single-select',
        required: true,
        options: [
          { value: '0-1 acre', label: '0-1 acre', emoji: '🏡' },
          { value: '1-2 acres', label: '1-2 acres', emoji: '🌾' },
          { value: '2-5 acres', label: '2-5 acres', emoji: '🚜' },
          { value: '5-10 acres', label: '5-10 acres', emoji: '🌻' },
          { value: '10+ acres', label: '10+ acres', emoji: '🌽' }
        ]
      }
    ]
  },
  {
    id: 'land-soil',
    title: 'Land & Soil',
    description: 'Information about your land and soil conditions',
    fields: [
      {
        id: 'landType',
        label: 'Land Type',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'irrigated', label: 'Irrigated', emoji: '💧' },
          { value: 'rainfed', label: 'Rainfed', emoji: '🌧️' },
          { value: 'both', label: 'Both', emoji: '🌱' }
        ]
      },
      {
        id: 'soilType',
        label: 'Soil Type',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'alluvial', label: 'Alluvial', emoji: '🏞️' },
          { value: 'black', label: 'Black Cotton', emoji: '⚫' },
          { value: 'red', label: 'Red Soil', emoji: '🔴' },
          { value: 'laterite', label: 'Laterite', emoji: '🟠' },
          { value: 'desert', label: 'Desert', emoji: '🏜️' },
          { value: 'mountain', label: 'Mountain', emoji: '⛰️' },
          { value: 'other', label: 'Other', emoji: '🌍' }
        ]
      },
      {
        id: 'soilHealth',
        label: 'Soil Health',
        type: 'single-select',
        required: true,
        options: [
          { value: 'excellent', label: 'Excellent', emoji: '💚' },
          { value: 'good', label: 'Good', emoji: '🟢' },
          { value: 'average', label: 'Average', emoji: '🟡' },
          { value: 'poor', label: 'Poor', emoji: '🔴' },
          { value: 'unknown', label: 'Unknown', emoji: '❓' }
        ]
      }
    ]
  },
  {
    id: 'crops',
    title: 'Crops & Farming',
    description: 'What do you grow and how?',
    fields: [
      {
        id: 'primaryCrops',
        label: 'Primary Crops',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'rice', label: 'Rice', emoji: '🌾' },
          { value: 'wheat', label: 'Wheat', emoji: '🌾' },
          { value: 'sugarcane', label: 'Sugarcane', emoji: '🎋' },
          { value: 'cotton', label: 'Cotton', emoji: '🌿' },
          { value: 'maize', label: 'Maize/Corn', emoji: '🌽' },
          { value: 'pulses', label: 'Pulses/Lentils', emoji: '🫘' },
          { value: 'oilseeds', label: 'Oilseeds', emoji: '🌻' },
          { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
          { value: 'fruits', label: 'Fruits', emoji: '🍎' },
          { value: 'spices', label: 'Spices', emoji: '🌶️' },
          { value: 'other', label: 'Other', emoji: '🌱' }
        ]
      },
      {
        id: 'farmingType',
        label: 'Farming Type',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'organic', label: 'Organic', emoji: '🌿' },
          { value: 'conventional', label: 'Conventional', emoji: '🚜' },
          { value: 'mixed', label: 'Mixed', emoji: '🔄' },
          { value: 'natural', label: 'Natural/Zero Budget', emoji: '🌱' }
        ]
      },
      {
        id: 'irrigationMethod',
        label: 'Irrigation Method',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'drip', label: 'Drip Irrigation', emoji: '💧' },
          { value: 'sprinkler', label: 'Sprinkler', emoji: '🌊' },
          { value: 'flood', label: 'Flood Irrigation', emoji: '🌊' },
          { value: 'furrow', label: 'Furrow Irrigation', emoji: '🚰' },
          { value: 'rainfed', label: 'Rainfed Only', emoji: '🌧️' }
        ]
      }
    ]
  },
  {
    id: 'resources',
    title: 'Resources & Infrastructure',
    description: 'Your farm resources and facilities',
    fields: [
      {
        id: 'waterSource',
        label: 'Water Source',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'borewell', label: 'Borewell', emoji: '🕳️' },
          { value: 'canal', label: 'Canal', emoji: '🌊' },
          { value: 'river', label: 'River', emoji: '🏞️' },
          { value: 'pond', label: 'Pond/Tank', emoji: '🏊' },
          { value: 'rainwater', label: 'Rainwater Harvesting', emoji: '🌧️' },
          { value: 'government-supply', label: 'Government Supply', emoji: '🏛️' }
        ]
      },
      {
        id: 'mechanizationLevel',
        label: 'Mechanization Level',
        type: 'single-select',
        required: true,
        options: [
          { value: 'fully-mechanized', label: 'Fully Mechanized', emoji: '🚜' },
          { value: 'semi-mechanized', label: 'Semi-Mechanized', emoji: '🔧' },
          { value: 'manual', label: 'Manual/Traditional', emoji: '👨‍🌾' },
          { value: 'mixed', label: 'Mixed Approach', emoji: '🔄' }
        ]
      }
    ]
  },
  {
    id: 'challenges-goals',
    title: 'Challenges & Goals',
    description: 'What challenges do you face and what are your goals?',
    fields: [
      {
        id: 'mainChallenges',
        label: 'Main Challenges',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'pest-disease', label: 'Pest & Disease', emoji: '🐛' },
          { value: 'water-shortage', label: 'Water Shortage', emoji: '💧' },
          { value: 'poor-yield', label: 'Poor Yield', emoji: '📉' },
          { value: 'market-price', label: 'Market Prices', emoji: '💰' },
          { value: 'input-cost', label: 'High Input Costs', emoji: '💸' },
          { value: 'weather', label: 'Weather Issues', emoji: '🌩️' },
          { value: 'labor-shortage', label: 'Labor Shortage', emoji: '👷' },
          { value: 'storage', label: 'Storage Problems', emoji: '🏠' },
          { value: 'transport', label: 'Transportation', emoji: '🚚' }
        ]
      },
      {
        id: 'goals',
        label: 'Your Goals',
        type: 'multi-select',
        required: true,
        options: [
          { value: 'increase-yield', label: 'Increase Yield', emoji: '📈' },
          { value: 'reduce-cost', label: 'Reduce Costs', emoji: '💰' },
          { value: 'organic-farming', label: 'Switch to Organic', emoji: '🌿' },
          { value: 'new-crops', label: 'Try New Crops', emoji: '🌱' },
          { value: 'better-marketing', label: 'Better Marketing', emoji: '🛒' },
          { value: 'modern-techniques', label: 'Modern Techniques', emoji: '🔬' }
        ]
      }
    ]
  }
];