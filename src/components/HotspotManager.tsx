
import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const HotspotManager = () => {
  const [isHotspotEnabled, setIsHotspotEnabled] = useState(false);
  const [connectedClients, setConnectedClients] = useState<string[]>([]);
  const [hotspotSettings, setHotspotSettings] = useState({
    ssid: "SIEM_LAB_Hotspot",
    password: "securepass123",
    maxClients: 5
  });

  useEffect(() => {
    // Simulate checking hotspot status
    const checkHotspotStatus = () => {
      if (isHotspotEnabled) {
        // Simulate random number of connected clients
        const numClients = Math.floor(Math.random() * hotspotSettings.maxClients);
        const mockClients = Array.from({ length: numClients }, (_, i) => 
          `Client_${i + 1} (192.168.1.${10 + i})`
        );
        setConnectedClients(mockClients);
      } else {
        setConnectedClients([]);
      }
    };

    const interval = setInterval(checkHotspotStatus, 5000);
    return () => clearInterval(interval);
  }, [isHotspotEnabled, hotspotSettings.maxClients]);

  const toggleHotspot = () => {
    setIsHotspotEnabled(!isHotspotEnabled);
    toast[!isHotspotEnabled ? "success" : "info"](
      !isHotspotEnabled ? "Hotspot enabled" : "Hotspot disabled",
      {
        description: !isHotspotEnabled 
          ? `SSID: ${hotspotSettings.ssid}` 
          : "Network sharing stopped"
      }
    );
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>Hotspot Manager</span>
          <Switch
            checked={isHotspotEnabled}
            onCheckedChange={toggleHotspot}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
            <div className="flex items-center space-x-3">
              {isHotspotEnabled ? (
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Wifi className="h-5 w-5 text-green-500" />
                </div>
              ) : (
                <div className="bg-slate-600/20 p-2 rounded-full">
                  <WifiOff className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <div>
                <p className="font-medium">{hotspotSettings.ssid}</p>
                <p className="text-sm text-slate-400">
                  {connectedClients.length} connected clients
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-600 hover:bg-slate-500"
              onClick={() => {
                if (isHotspotEnabled) {
                  toast.warning("Restart required", {
                    description: "Hotspot needs to be disabled first"
                  });
                  return;
                }
                toast.info("Settings updated", {
                  description: "New settings will apply on next start"
                });
              }}
            >
              Configure
            </Button>
          </div>

          {isHotspotEnabled && connectedClients.length > 0 && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <h3 className="text-sm font-medium mb-2">Connected Devices</h3>
              <div className="space-y-2">
                {connectedClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-slate-700 p-2 rounded">
                    <span>{client}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setConnectedClients(prev => 
                          prev.filter((_, i) => i !== index)
                        );
                        toast.success("Client disconnected", {
                          description: `${client} has been disconnected`
                        });
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotspotManager;
