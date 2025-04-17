
import { useState, useEffect } from "react";
import { GeoLocation } from "@/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Map, Globe2 } from "lucide-react";

interface MapViewProps {
  geoData: GeoLocation[];
}

const MapView = ({ geoData }: MapViewProps) => {
  const [viewType, setViewType] = useState<"map" | "list">("map");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold">Geolocation Tracking</h2>
        <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as "map" | "list")}>
          <ToggleGroupItem value="map" aria-label="Map View" className="px-3">
            <Map className="h-4 w-4 mr-1" />
            Map
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View" className="px-3">
            <Globe2 className="h-4 w-4 mr-1" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : viewType === "map" ? (
          <div className="h-80 bg-slate-900 rounded relative">
            {/* Simplified world map visualization */}
            <div className="absolute inset-0 bg-[url('https://cdn.jsdelivr.net/npm/world-map-svg@0.0.2/map.svg')] bg-no-repeat bg-center bg-contain opacity-10"></div>
            
            {/* Plot points for each location */}
            {geoData.map((loc, index) => {
              // Convert lat/long to x/y coordinates (simplified)
              const x = ((loc.longitude + 180) / 360) * 100;
              const y = ((90 - loc.latitude) / 180) * 100;
              
              return (
                <div 
                  key={index}
                  className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={`${loc.ip} - ${loc.city}, ${loc.country}`}
                >
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                </div>
              );
            })}
            
            <div className="absolute bottom-2 right-2 text-xs text-slate-400">
              Simplified world map visualization
            </div>
          </div>
        ) : (
          <div className="h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-400 uppercase">
                <tr>
                  <th className="text-left py-2">IP Address</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {geoData.length > 0 ? (
                  geoData.map((loc, index) => (
                    <tr key={index} className="border-t border-slate-700">
                      <td className="py-3">{loc.ip}</td>
                      <td className="py-3">{loc.city}, {loc.country}</td>
                      <td className="py-3">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      No geolocation data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
