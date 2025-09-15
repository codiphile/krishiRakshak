export class MapService {

  // Test if Google Static Maps API is working
  static async testGoogleStaticMaps(lat: number, lng: number): Promise<boolean> {
    const apiKey = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ';
    const testUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=100x100&key=${apiKey}`;

    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Google Static Maps test failed:', error);
      return false;
    }
  }

  // Get static map URL with fallback providers
  static getStaticMapUrl(lat: number, lng: number, width: number = 400, height: number = 200, zoom: number = 16): string | null {
    // Validate coordinates
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates for static map:', { lat, lng });
      return null;
    }

    // Try different providers in order of preference

    // 1. OpenStreetMap static map (free, reliable)
    const osmUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},red-pushpin`;

    // 2. Alternative OSM provider
    // const osmUrl2 = `https://render.openstreetmap.org/cgi-bin/export?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&scale=5000&format=png`;

    // 3. Google Static Maps (if working)
    // const googleApiKey = 'AIzaSyCEr8q9AV2B6WjhqC0pLq7be08H-3F0UnQ';
    // const googleUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:green%7Clabel:S%7C${lat},${lng}&key=${googleApiKey}`;

    console.log('Using OpenStreetMap static map URL:', osmUrl);
    return osmUrl;
  }

  // Generate map image with custom marker
  static getStaticMapWithMarker(lat: number, lng: number, markerColor: string = 'red', width: number = 400, height: number = 200): string | null {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return null;
    }

    // Using a more reliable OSM static map service
    const zoom = 16;
    const url = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},${markerColor}-pushpin`;

    return url;
  }

  // Alternative: Generate a simple map placeholder
  static getMapPlaceholder(lat: number, lng: number, name: string): string {
    // This creates a data URL for a simple map placeholder
    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#e5f7e5"/>
        <circle cx="200" cy="100" r="10" fill="#16a34a"/>
        <text x="200" y="130" text-anchor="middle" font-family="Arial" font-size="12" fill="#374151">
          📍 ${name}
        </text>
        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">
          ${lat.toFixed(4)}, ${lng.toFixed(4)}
        </text>
        <text x="200" y="170" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">
          Tap to open in Maps
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

// Instructions to fix Google Static Maps API:
/*
To fix Google Static Maps API 403 errors:

1. Go to Google Cloud Console (console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for "Maps Static API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Edit your API key and ensure:
   - "Maps Static API" is in the list of restricted APIs
   - OR remove all API restrictions if you trust the usage
7. Ensure billing is enabled for your project
8. Check your quota limits in "APIs & Services" > "Quotas"

Alternative free solutions:
- OpenStreetMap static maps (implemented above)
- MapBox static maps (free tier: 50,000 requests/month)
- Here Maps static maps (free tier available)
*/