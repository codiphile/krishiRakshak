import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_API_KEY'; // TODO: Replace with your API key
const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const geocodingService = {
  async getCoordinates(locationName: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await axios.get(API_URL, {
        params: {
          address: locationName,
          key: API_KEY,
        },
      });

      if (response.data.status === 'OK') {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error(response.data.error_message || 'Could not find coordinates for the location.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw new Error('Could not fetch coordinates.');
    }
  },
};
