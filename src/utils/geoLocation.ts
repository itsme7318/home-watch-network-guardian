
import { GeoLocation } from "@/types";

// Cache for storing location data to reduce API calls
const locationCache: Record<string, GeoLocation> = {};

/**
 * Track location based on IP address
 * Uses ipapi.co service for geolocation
 */
export async function trackLocation(ip: string): Promise<GeoLocation | null> {
  // Return from cache if available
  if (locationCache[ip]) {
    return locationCache[ip];
  }
  
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle rate limiting or errors from the API
    if (data.error) {
      console.error('IP API error:', data.reason || data.error);
      return null;
    }
    
    // Create geolocation data from response
    const location = {
      ip,
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0
    };
    
    // Cache result
    locationCache[ip] = location;
    
    return location;
  } catch (error) {
    console.error('Error tracking location:', error);
    return null;
  }
}

/**
 * Generate mock geolocation data for testing
 */
export function generateMockGeoData(count: number = 5): GeoLocation[] {
  const countries = [
    { name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'] },
    { name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Glasgow'] },
    { name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'] },
    { name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'] },
    { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
    { name: 'Brazil', cities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador'] },
    { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'] },
    { name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'] }
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = country.cities[Math.floor(Math.random() * country.cities.length)];
    
    // Generate a random IP
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    // Generate coordinates roughly matching the region
    let latitude, longitude;
    
    switch (country.name) {
      case 'United States':
        latitude = 37 + (Math.random() * 10 - 5);
        longitude = -100 + (Math.random() * 30 - 15);
        break;
      case 'United Kingdom':
        latitude = 52 + (Math.random() * 4 - 2);
        longitude = -1 + (Math.random() * 4 - 2);
        break;
      case 'Germany':
        latitude = 51 + (Math.random() * 4 - 2);
        longitude = 10 + (Math.random() * 4 - 2);
        break;
      case 'Japan':
        latitude = 36 + (Math.random() * 4 - 2);
        longitude = 138 + (Math.random() * 4 - 2);
        break;
      case 'Australia':
        latitude = -25 + (Math.random() * 10 - 5);
        longitude = 135 + (Math.random() * 10 - 5);
        break;
      case 'Brazil':
        latitude = -15 + (Math.random() * 10 - 5);
        longitude = -50 + (Math.random() * 10 - 5);
        break;
      case 'Canada':
        latitude = 55 + (Math.random() * 10 - 5);
        longitude = -105 + (Math.random() * 20 - 10);
        break;
      case 'India':
        latitude = 20 + (Math.random() * 10 - 5);
        longitude = 77 + (Math.random() * 10 - 5);
        break;
      default:
        latitude = (Math.random() * 180 - 90);
        longitude = (Math.random() * 360 - 180);
    }
    
    return {
      ip,
      country: country.name,
      city,
      latitude,
      longitude
    };
  });
}
