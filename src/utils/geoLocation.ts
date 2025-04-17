
import { GeoLocation } from "@/types";

export async function trackLocation(ip: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      ip,
      country: data.country_name,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error tracking location:', error);
    return null;
  }
}
