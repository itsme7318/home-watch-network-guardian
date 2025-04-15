
import { Button } from "./ui/button";
import { Radar } from "lucide-react";

interface HeaderProps {
  scanNetwork: () => void;
  isScanning: boolean;
}

export function Header({ scanNetwork, isScanning }: HeaderProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Radar className="h-8 w-8 text-sky-500" />
          <h1 className="text-2xl font-bold text-white">HomeGuard SIEM</h1>
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
    </header>
  );
}
