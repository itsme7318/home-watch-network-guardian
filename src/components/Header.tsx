
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Radar, Wifi } from "lucide-react";
import { getNetworkInfo } from "@/utils/networkUtils";

interface HeaderProps {
  scanNetwork: () => void;
  isScanning: boolean;
}

export function Header({ scanNetwork, isScanning }: HeaderProps) {
  const [networkInfo, setNetworkInfo] = useState({ type: 'unknown', downlink: 0, rtt: 0 });

  useEffect(() => {
    // Get initial network info
    setNetworkInfo(getNetworkInfo());
    
    // Update network info every 10 seconds
    const intervalId = setInterval(() => {
      setNetworkInfo(getNetworkInfo());
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Radar className="h-8 w-8 text-sky-500" />
          <h1 className="text-2xl font-bold text-white">HomeGuard SIEM</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-slate-700 px-3 py-1 rounded-md">
            <Wifi className="h-4 w-4 text-sky-400" />
            <span className="text-sm text-slate-300">
              {networkInfo.type !== 'unknown' ? networkInfo.type : 'Network'} | 
              {networkInfo.downlink > 0 ? ` ${networkInfo.downlink.toFixed(1)} Mbps` : ''}
            </span>
          </div>
          
          <Button 
            onClick={scanNetwork} 
            disabled={isScanning}
            variant="outline"
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
          >
            {isScanning ? "Scanning..." : "Scan Network"}
          </Button>
        </div>
      </div>
    </header>
  );
}
