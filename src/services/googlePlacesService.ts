import { UserLocation } from '../types/retailer';
import Constants from 'expo-constants';

// New Places API interfaces
interface PlaceNew {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  types: string[];
  regularOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
}

interface GooglePlacesNewResponse {
  places: PlaceNew[];
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export class GooglePlacesService {
  private apiKey: string;

  constructor() {
    // Use the latest working API key
    this.apiKey = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ';

    console.log('Google Places API (New) key loaded:', this.apiKey.substring(0, 15) + '...');
    console.log('Note: This API key needs Places API (New) enabled in Google Cloud Console');
  }

  async searchNearbyRetailers(
    location: UserLocation,
    radius: number = 25000, // 25km in meters
    category: string = 'all'
  ): Promise<any[]> {
    console.log('🎯 Searching for TOP 10 nearest agricultural retailers');
    console.log('📍 Your location:', location.latitude, location.longitude);
    console.log('🔍 Search radius:', radius / 1000, 'km');
    console.log('🏪 Category:', category);

    try {
      // Define comprehensive search queries for agricultural retailers
      const getSearchQueries = (cat: string): string[] => {
        const baseQueries = [
          'agricultural supplies',
          'farm supply store',
          'agricultural store',
          'krishi kendra',
          'agricultural input dealer',
          'farm equipment dealer'
        ];

        switch (cat) {
          case 'fertilizers':
            return [
              'fertilizer dealer',
              'agricultural fertilizer shop',
              'farm fertilizer store',
              'NPK fertilizer dealer',
              'organic fertilizer shop'
            ];
          case 'pesticides':
            return [
              'pesticide dealer',
              'agricultural pesticide shop',
              'farm chemicals store',
              'crop protection dealer',
              'agricultural chemicals'
            ];
          case 'seeds':
            return [
              'seed dealer',
              'agricultural seeds shop',
              'farm seeds store',
              'hybrid seeds dealer',
              'crop seeds supplier'
            ];
          case 'equipment':
            return [
              'agricultural equipment dealer',
              'farm machinery dealer',
              'tractor dealer',
              'agricultural implements',
              'farm tools supplier'
            ];
          default:
            return baseQueries;
        }
      };

      const queries = getSearchQueries(category);
      const allResults: any[] = [];

      console.log('🔍 Will search for:', queries.join(', '));

      // Search for each query using Places API (New)
      for (const query of queries) {
        try {
          console.log('🔍 Searching for:', query);

          // Use the new Places API with optimized location-based search
          const url = 'https://places.googleapis.com/v1/places:searchText';

          const requestBody = {
            textQuery: `${query} near ${location.latitude},${location.longitude}`,
            locationBias: {
              circle: {
                center: {
                  latitude: location.latitude,
                  longitude: location.longitude
                },
                radius: radius
              }
            },
            maxResultCount: 10, // Get more results per query to find the closest ones
            languageCode: 'en',
            rankPreference: 'DISTANCE' // Prioritize by distance
          };

          console.log('Making request with API key:', this.apiKey);
          console.log('Request body:', JSON.stringify(requestBody, null, 2));

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': this.apiKey,
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.regularOpeningHours,places.nationalPhoneNumber'
            },
            body: JSON.stringify(requestBody)
          });

          console.log('Places API (New) response status:', response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.warn('Places API (New) request failed:', response.status, errorText);

            if (response.status === 403 || response.status === 401) {
              console.warn('API access denied - checking API key and billing');
            }
            continue;
          }

          const data: GooglePlacesNewResponse = await response.json();

          if (data.places && data.places.length > 0) {
            console.log(`✅ Found ${data.places.length} places for: ${query}`);

            // Transform new Places API results to our retailer format with distance calculation
            const retailers = data.places.map((place, index) => {
              const distance = this.calculateDistance(
                location.latitude,
                location.longitude,
                place.location?.latitude || location.latitude,
                place.location?.longitude || location.longitude
              );

              return {
                id: place.id,
                name: place.displayName?.text || 'Unknown Store',
                address: place.formattedAddress || 'Address not available',
                latitude: place.location?.latitude || location.latitude,
                longitude: place.location?.longitude || location.longitude,
                phone: place.nationalPhoneNumber || '+91 98765 43210',
                email: '',
                category: this.categorizePlaceNew(place, category),
                rating: place.rating || 4.0,
                reviews: place.userRatingCount || 50,
                openHours: place.regularOpeningHours?.openNow ?
                  (place.regularOpeningHours.weekdayDescriptions?.[0] || '9:00 AM - 7:00 PM') :
                  'Hours not available',
                isGovernmentCertified: Math.random() > 0.5, // Random for demo
                subsidyAvailable: Math.random() > 0.3, // Random for demo
                description: `Agricultural retailer specializing in ${category}`,
                products: this.generateProducts(category),
                distance: distance
              };
            });

            // Log the distances for debugging
            retailers.forEach(retailer => {
              console.log(`📍 ${retailer.name}: ${retailer.distance} km away`);
            });

            allResults.push(...retailers);
          } else {
            console.log(`❌ No places found for: ${query}`);
          }
        } catch (error) {
          console.error(`Error searching for ${query}:`, error);
        }
      }

      console.log(`🔍 Total results found: ${allResults.length}`);

      // Remove duplicates based on place_id
      const uniqueResults = allResults.filter((retailer, index, self) =>
        index === self.findIndex(r => r.id === retailer.id)
      );

      console.log(`🔄 After removing duplicates: ${uniqueResults.length}`);

      // Sort by distance (nearest first) and get TOP 10
      const top10Nearest = uniqueResults
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);

      console.log(`🎯 TOP 10 NEAREST RETAILERS:`);
      top10Nearest.forEach((retailer, index) => {
        console.log(`${index + 1}. ${retailer.name} - ${retailer.distance} km`);
      });

      // If no results from Google Places API, use demo data
      if (top10Nearest.length === 0) {
        console.log('❌ No Google Places results - using demo retailers');
        return this.getDemoRetailers(location, category);
      }

      console.log(`✅ Returning ${top10Nearest.length} nearest retailers`);
      return top10Nearest;

    } catch (error) {
      console.error('Error in Google Places search:', error);
      console.log('Falling back to demo retailers due to error');
      return this.getDemoRetailers(location, category);
    }
  }

  private categorizePlaceNew(place: PlaceNew, searchCategory: string): string {
    // Try to determine category based on place types and name
    const name = place.displayName?.text?.toLowerCase() || '';
    const types = place.types?.join(' ').toLowerCase() || '';

    if (searchCategory !== 'all') {
      return searchCategory;
    }

    if (name.includes('fertilizer') || types.includes('fertilizer')) {
      return 'fertilizers';
    }
    if (name.includes('pesticide') || name.includes('chemical') || types.includes('pesticide')) {
      return 'pesticides';
    }
    if (name.includes('seed') || types.includes('seed')) {
      return 'seeds';
    }
    if (name.includes('equipment') || name.includes('tractor') || types.includes('equipment')) {
      return 'equipment';
    }

    return 'general';
  }

  private generateProducts(category: string): any[] {
    const productsByCategory = {
      fertilizers: [
        { id: 'f1', name: 'NPK 12:32:16', category: 'Fertilizer', price: 1200, subsidyPrice: 840, subsidyPercentage: 30, description: 'Complete fertilizer for all crops' },
        { id: 'f2', name: 'Urea (50kg bag)', category: 'Fertilizer', price: 800, subsidyPrice: 560, subsidyPercentage: 30, description: 'High quality urea fertilizer' }
      ],
      pesticides: [
        { id: 'p1', name: 'Chlorpyrifos 20% EC', category: 'Pesticide', price: 450, subsidyPrice: 315, subsidyPercentage: 30, description: 'Effective insecticide' },
        { id: 'p2', name: 'Neem Oil (1L)', category: 'Organic Pesticide', price: 300, subsidyPrice: 210, subsidyPercentage: 30, description: 'Natural pest control' }
      ],
      seeds: [
        { id: 's1', name: 'Hybrid Rice Seeds', category: 'Seeds', price: 2500, subsidyPrice: 1750, subsidyPercentage: 30, description: 'High yield variety' }
      ],
      equipment: [
        { id: 'e1', name: 'Power Tiller', category: 'Equipment', price: 85000, subsidyPrice: 51000, subsidyPercentage: 40, description: '8HP power tiller' }
      ]
    };

    return productsByCategory[category as keyof typeof productsByCategory] || productsByCategory.fertilizers;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const lat1Rad = this.toRad(lat1);
    const lat2Rad = this.toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Math.round(d * 10) / 10; // Round to 1 decimal place
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private getDemoRetailers(location: UserLocation, category: string): any[] {
    // Create realistic demo retailers based on location
    const baseRetailers = [
      { name: 'Local Agricultural Store', offset: { lat: 0.01, lng: 0.01 } },
      { name: 'Farm Supply Center', offset: { lat: -0.015, lng: 0.02 } },
      { name: 'Krishi Kendra', offset: { lat: 0.02, lng: -0.01 } },
      { name: 'Agricultural Supplies Hub', offset: { lat: -0.005, lng: -0.015 } },
      { name: 'Fertilizer & Seeds Store', offset: { lat: 0.008, lng: 0.025 } }
    ];

    return baseRetailers.map((retailer, index) => ({
      id: `demo-${index}`,
      name: retailer.name,
      address: `Near ${retailer.name}, Local Area`,
      latitude: location.latitude + retailer.offset.lat,
      longitude: location.longitude + retailer.offset.lng,
      phone: `+91 98765 432${10 + index}`,
      email: '',
      category: category === 'all' ? ['fertilizers', 'pesticides', 'seeds'][index % 3] : category,
      rating: 4.0 + Math.random(),
      reviews: 50 + Math.floor(Math.random() * 100),
      openHours: '9:00 AM - 7:00 PM',
      isGovernmentCertified: Math.random() > 0.3,
      subsidyAvailable: Math.random() > 0.2,
      description: `Local agricultural retailer specializing in ${category}`,
      products: this.generateProducts(category),
      distance: this.calculateDistance(
        location.latitude,
        location.longitude,
        location.latitude + retailer.offset.lat,
        location.longitude + retailer.offset.lng
      )
    }));
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        return data.result;
      }

      return null;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }
}

export const googlePlacesService = new GooglePlacesService();