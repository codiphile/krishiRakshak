import { UserLocation } from '../types/retailer';

export class GoogleMapsSearchService {
  private static readonly API_KEY = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ';

  static async searchNearbyRetailers(
    location: UserLocation,
    category: string = 'all',
    radius: number = 25000
  ): Promise<any[]> {
    try {
      console.log('🗺️ Searching Google Maps for agricultural retailers...');

      const searchQueries = this.getSearchQueries(category);
      const allResults: any[] = [];

      for (const query of searchQueries) {
        try {
          const results = await this.performSearch(location, query, radius);
          allResults.push(...results);
        } catch (error) {
          console.warn(`Search failed for query: ${query}`, error);
        }
      }

      // Remove duplicates based on place_id
      const uniqueResults = this.removeDuplicates(allResults);

      // Calculate distances and sort
      const resultsWithDistance = this.calculateDistances(uniqueResults, location);

      // Return top 10 nearest
      return resultsWithDistance.slice(0, 10);
    } catch (error) {
      console.error('Google Maps search error:', error);
      throw error;
    }
  }

  private static getSearchQueries(category: string): string[] {
    const baseQueries = [
      'agricultural supply store',
      'farm supply store',
      'fertilizer dealer',
      'pesticide dealer',
      'seeds dealer',
      'agricultural equipment dealer',
      'krishi seva kendra',
      'agriculture input dealer'
    ];

    switch (category) {
      case 'fertilizers':
        return [
          'fertilizer dealer',
          'fertilizer shop',
          'agricultural fertilizer store',
          'urea dealer',
          'DAP fertilizer dealer'
        ];
      case 'pesticides':
        return [
          'pesticide dealer',
          'insecticide shop',
          'agricultural pesticide store',
          'fungicide dealer',
          'herbicide dealer'
        ];
      case 'seeds':
        return [
          'seeds dealer',
          'agricultural seeds store',
          'hybrid seeds dealer',
          'vegetable seeds shop',
          'crop seeds dealer'
        ];
      case 'equipment':
        return [
          'agricultural equipment dealer',
          'farm machinery dealer',
          'tractor dealer',
          'agricultural tools shop',
          'farming equipment store'
        ];
      default:
        return baseQueries;
    }
  }

  private static async performSearch(
    location: UserLocation,
    query: string,
    radius: number
  ): Promise<any[]> {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location.latitude},${location.longitude}&radius=${radius}&key=${this.API_KEY}`;

    console.log(`🔍 Searching: "${query}" near ${location.latitude},${location.longitude}`);

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status === 'OK') {
      console.log(`✅ Found ${data.results.length} results for "${query}"`);
      return data.results || [];
    } else {
      console.warn(`❌ Search failed for "${query}":`, data.status, data.error_message);
      return [];
    }
  }

  private static removeDuplicates(results: any[]): any[] {
    const seen = new Set();
    return results.filter(result => {
      if (seen.has(result.place_id)) {
        return false;
      }
      seen.add(result.place_id);
      return true;
    });
  }

  private static calculateDistances(results: any[], userLocation: UserLocation): any[] {
    return results
      .map(result => ({
        ...result,
        distance: this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          result.geometry.location.lat,
          result.geometry.location.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static convertToRetailerFormat(googleResult: any, index: number): any {
    const photos = googleResult.photos || [];
    const photoUrl = photos.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${this.API_KEY}`
      : null;

    // Determine category based on name/types
    const category = this.determineCategory(googleResult);

    return {
      id: googleResult.place_id,
      name: googleResult.name,
      address: googleResult.formatted_address || googleResult.vicinity || 'Address not available',
      latitude: googleResult.geometry.location.lat,
      longitude: googleResult.geometry.location.lng,
      distance: googleResult.distance ? googleResult.distance.toFixed(1) : 'N/A',
      rating: googleResult.rating || 4.0,
      reviews: googleResult.user_ratings_total || 0,
      category: category,
      phone: googleResult.formatted_phone_number || 'Not available',
      openHours: this.formatOpeningHours(googleResult.opening_hours),
      isGovernmentCertified: Math.random() > 0.6, // Random for demo
      subsidyAvailable: Math.random() > 0.5, // Random for demo
      description: `${category} dealer providing quality agricultural supplies`,
      photoUrl: photoUrl,
      priceLevel: googleResult.price_level || 2,
      products: this.generateProducts(category)
    };
  }

  private static determineCategory(result: any): string {
    const name = result.name.toLowerCase();
    const types = result.types || [];

    if (name.includes('fertilizer') || name.includes('urea') || name.includes('dap')) {
      return 'fertilizers';
    }
    if (name.includes('pesticide') || name.includes('insecticide') || name.includes('fungicide')) {
      return 'pesticides';
    }
    if (name.includes('seed') || name.includes('hybrid')) {
      return 'seeds';
    }
    if (name.includes('equipment') || name.includes('machinery') || name.includes('tractor')) {
      return 'equipment';
    }

    // Check Google Place types
    if (types.includes('store') || types.includes('establishment')) {
      return 'general';
    }

    return 'general';
  }

  private static formatOpeningHours(openingHours: any): string {
    if (!openingHours || !openingHours.weekday_text) {
      return '9:00 AM - 6:00 PM';
    }

    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Saturday=6

    return openingHours.weekday_text[dayIndex] || '9:00 AM - 6:00 PM';
  }

  private static generateProducts(category: string): any[] {
    const productTemplates = {
      fertilizers: [
        { name: 'Urea', price: 280, subsidyPrice: 220 },
        { name: 'DAP', price: 1400, subsidyPrice: 1200 },
        { name: 'NPK 10:26:26', price: 950, subsidyPrice: 850 }
      ],
      pesticides: [
        { name: 'Chlorpyrifos', price: 450, subsidyPrice: 400 },
        { name: 'Imidacloprid', price: 320, subsidyPrice: 280 },
        { name: 'Mancozeb', price: 280, subsidyPrice: 250 }
      ],
      seeds: [
        { name: 'Hybrid Tomato Seeds', price: 1200, subsidyPrice: 1000 },
        { name: 'BT Cotton Seeds', price: 900, subsidyPrice: 750 },
        { name: 'Wheat Seeds', price: 35, subsidyPrice: 28 }
      ],
      equipment: [
        { name: 'Sprayer Pump', price: 8500, subsidyPrice: 7000 },
        { name: 'Cultivator', price: 15000, subsidyPrice: 12000 },
        { name: 'Thresher', price: 25000, subsidyPrice: 20000 }
      ],
      general: [
        { name: 'Mixed Fertilizers', price: 500, subsidyPrice: 450 },
        { name: 'General Pesticides', price: 350, subsidyPrice: 300 },
        { name: 'Farm Tools', price: 1200, subsidyPrice: 1000 }
      ]
    };

    const products = productTemplates[category as keyof typeof productTemplates] || productTemplates.general;

    return products.slice(0, 2).map((product, index) => ({
      id: `product-${index}`,
      name: product.name,
      category: category,
      price: product.price,
      subsidyPrice: product.subsidyPrice
    }));
  }
}