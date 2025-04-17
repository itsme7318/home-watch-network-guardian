
import { GeoLocation } from "@/types";
import { toast } from "@/components/ui/sonner";

export const generateMockGeoData = (count: number): GeoLocation[] => {
  return Array.from({ length: count }, () => ({
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    country: ["US", "UK", "CA", "AU", "DE"][Math.floor(Math.random() * 5)],
    city: ["New York", "London", "Toronto", "Sydney", "Berlin"][Math.floor(Math.random() * 5)],
    latitude: (Math.random() * 180) - 90,
    longitude: (Math.random() * 360) - 180
  }));
};

export const trackLocation = async (ip: string): Promise<GeoLocation | null> => {
  try {
    // For demo purposes, generate mock data instead of real API calls
    const mockLocation: GeoLocation = {
      ip,
      country: ["US", "UK", "CA"][Math.floor(Math.random() * 3)],
      city: ["New York", "London", "Toronto"][Math.floor(Math.random() * 3)],
      latitude: (Math.random() * 180) - 90,
      longitude: (Math.random() * 360) - 180
    };
    
    return mockLocation;
  } catch (error) {
    console.error("Error tracking location:", error);
    return null;
  }
};

