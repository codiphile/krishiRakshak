import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_WEATHER_API_KEY'; // TODO: Replace with your API key
const API_URL = 'https://weather.googleapis.com/v1/forecast';

export const weatherService = {
  getWeatherForecast: async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          'location.latitude': latitude,
          'location.longitude': longitude,
          key: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Could not fetch weather forecast.');
    }
  },
};
