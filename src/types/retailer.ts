export interface Retailer {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  phone: string;
  email?: string;
  category: 'fertilizers' | 'pesticides' | 'seeds' | 'equipment' | 'general';
  products: Product[];
  rating: number;
  reviews: number;
  openHours: string;
  isGovernmentCertified: boolean;
  subsidyAvailable: boolean;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  subsidyPrice?: number;
  subsidyPercentage?: number;
  inStock: boolean;
  description: string;
}

export interface SearchFilters {
  category: string;
  maxDistance: number;
  subsidyOnly: boolean;
  searchQuery: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}