import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const LocationService = {
  async getCurrentLocation(): Promise<UserLocation | null> {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Permission to access location was denied. Please enable it in settings to use this feature.'
      );
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(2));
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  openExternalMaps(latitude: number, longitude: number, label: string = 'Destination') {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:'
    });
    const latLng = `${latitude},${longitude}`;
    const labelEncoded = encodeURIComponent(label);
    const url = Platform.select({
      ios: `${scheme}0,0?q=${labelEncoded}@${latLng}`,
      android: `${scheme}${latLng}?q=${labelEncoded}`
    });

    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Could not open maps application.');
    }
  },
};