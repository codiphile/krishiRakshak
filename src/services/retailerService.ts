import { Retailer, SearchFilters, UserLocation } from '../types/retailer';
import { mockRetailers } from '../data/retailersData';
import { LocationService } from './locationService';
import { GoogleMapsSearchService } from './googleMapsSearchService';

export class RetailerService {
  static async searchRetailersWithAI(
    userLocation: UserLocation,
    filters: SearchFilters
  ): Promise<Retailer[]> {
    try {
      console.log('Searching retailers with AI for location:', userLocation);

      // Call Gemini AI to search for retailers
      const aiResponse = await geminiService.searchRetailersWithAI(
        userLocation.latitude,
        userLocation.longitude,
        filters.category,
        filters.maxDistance
      );

      console.log('AI Response:', aiResponse);

      // Try to parse JSON from AI response
      let aiRetailers: Retailer[] = [];
      try {
        // Extract JSON from AI response (sometimes AI adds extra text)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.retailers && Array.isArray(parsed.retailers)) {
            aiRetailers = parsed.retailers.map((retailer: any, index: number) => ({
              id: `ai-${index}`,
              name: retailer.name || 'Unknown Store',
              address: retailer.address || 'Address not available',
              latitude: retailer.latitude || userLocation.latitude,
              longitude: retailer.longitude || userLocation.longitude,
              phone: retailer.phone || '+91 98765 43210',
              email: retailer.email || '',
              category: retailer.category || 'general',
              rating: retailer.rating || 4.0,
              reviews: retailer.reviews || 50,
              openHours: retailer.openHours || '9:00 AM - 6:00 PM',
              isGovernmentCertified: retailer.isGovernmentCertified || true,
              subsidyAvailable: retailer.subsidyAvailable || true,
              description: retailer.description || 'Agricultural retailer',
              products: (retailer.products || []).map((product: any, idx: number) => ({
                ...product,
                id: product.id || `product-${index}-${idx}`,
                name: product.name || 'Agricultural Product',
                category: product.category || 'General',
                price: product.price || 0,
                subsidyPrice: product.subsidyPrice || undefined,
                subsidyPercentage: product.subsidyPercentage || undefined,
                description: product.description || 'Agricultural product'
              })),
              distance: LocationService.calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                retailer.latitude || userLocation.latitude,
                retailer.longitude || userLocation.longitude
              )
            }));
          }
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
      }

      // If AI search failed or returned no results, fall back to mock data
      if (aiRetailers.length === 0) {
        console.log('AI search returned no results, using mock data as fallback');
        return this.searchMockRetailers(userLocation, filters);
      }

      // Apply additional filters to AI results
      let filteredRetailers = aiRetailers;

      if (filters.subsidyOnly) {
        filteredRetailers = filteredRetailers.filter(
          retailer => retailer.subsidyAvailable
        );
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        filteredRetailers = filteredRetailers.filter(retailer =>
          retailer.name.toLowerCase().includes(query) ||
          retailer.description.toLowerCase().includes(query) ||
          retailer.products.some(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          )
        );
      }

      return filteredRetailers.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    } catch (error) {
      console.error('Error in AI retailer search:', error);
      // Fallback to mock data if AI search fails
      return this.searchMockRetailers(userLocation, filters);
    }
  }

  // Fallback method using mock data
  static async searchMockRetailers(
    userLocation: UserLocation,
    filters: SearchFilters
  ): Promise<Retailer[]> {
    let filteredRetailers = [...mockRetailers];

    if (filters.category && filters.category !== 'all') {
      filteredRetailers = filteredRetailers.filter(
        retailer => retailer.category === filters.category
      );
    }

    if (filters.subsidyOnly) {
      filteredRetailers = filteredRetailers.filter(
        retailer => retailer.subsidyAvailable
      );
    }

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filteredRetailers = filteredRetailers.filter(retailer =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.description.toLowerCase().includes(query) ||
        retailer.products.some(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      );
    }

    const retailersWithDistance = filteredRetailers.map(retailer => ({
      ...retailer,
      distance: LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        retailer.latitude,
        retailer.longitude
      )
    }));

    const filteredByDistance = retailersWithDistance.filter(
      retailer => retailer.distance! <= filters.maxDistance
    );

    return filteredByDistance.sort((a, b) => a.distance! - b.distance!);
  }

  // Google Maps search method
  static async searchRetailersWithGoogleMaps(
    userLocation: UserLocation,
    filters: SearchFilters
  ): Promise<Retailer[]> {
    try {
      console.log('🗺️ Searching retailers with Google Maps for location:', userLocation);

      // Convert max distance from km to meters for Google Maps search
      const radiusInMeters = filters.maxDistance * 1000;

      // Search using Google Maps API
      const mapsResults = await GoogleMapsSearchService.searchNearbyRetailers(
        userLocation,
        filters.category,
        radiusInMeters
      );

      console.log('✅ Google Maps found:', mapsResults.length, 'retailers');

      // Convert Google Maps results to our format
      const convertedRetailers = mapsResults.map((result, index) =>
        GoogleMapsSearchService.convertToRetailerFormat(result, index)
      );

      // Apply additional filters
      let filteredRetailers = convertedRetailers;

      if (filters.subsidyOnly) {
        filteredRetailers = filteredRetailers.filter(
          retailer => retailer.subsidyAvailable
        );
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        filteredRetailers = filteredRetailers.filter(retailer =>
          retailer.name.toLowerCase().includes(query) ||
          retailer.description.toLowerCase().includes(query) ||
          retailer.address.toLowerCase().includes(query)
        );
      }

      return filteredRetailers.sort((a, b) => {
        const distanceA = typeof a.distance === 'string' ? parseFloat(a.distance) : (a.distance || 0);
        const distanceB = typeof b.distance === 'string' ? parseFloat(b.distance) : (b.distance || 0);
        return distanceA - distanceB;
      });

    } catch (error) {
      console.error('❌ Error in Google Maps retailer search:', error);
      // Fallback to mock data if Google Maps search fails
      console.log('📋 Falling back to mock data');
      return this.searchMockRetailers(userLocation, filters);
    }
  }

  // Main search method - tries Google Maps first, falls back to mock data
  static async searchRetailers(
    userLocation: UserLocation,
    filters: SearchFilters
  ): Promise<Retailer[]> {
    return this.searchRetailersWithGoogleMaps(userLocation, filters);
  }

  static async getAllRetailers(userLocation?: UserLocation): Promise<Retailer[]> {
    if (!userLocation) {
      return mockRetailers;
    }

    return mockRetailers.map(retailer => ({
      ...retailer,
      distance: LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        retailer.latitude,
        retailer.longitude
      )
    })).sort((a, b) => a.distance! - b.distance!);
  }

  static getRetailerById(id: string): Retailer | undefined {
    return mockRetailers.find(retailer => retailer.id === id);
  }
}