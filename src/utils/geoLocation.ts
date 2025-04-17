
import { GeoLocation } from "@/types";
import { toast } from "@/components/ui/sonner";

export const trackLocation = async (ip: string): Promise<GeoLocation | null> => {
  try {
    // For security reasons, we only track the user's own IP location
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'Failed to get location data');
    }

    return {
      ip: data.ip,
      country: data.country_code,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error("Error tracking location:", error);
    toast.error("Failed to get location data");
    return null;
  }
};
