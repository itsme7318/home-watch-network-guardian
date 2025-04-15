
import { 
  Activity, 
  Wifi, 
  AlertTriangle 
} from "lucide-react";

interface NetworkStatsProps {
  deviceCount: number;
  logCount: number;
  alertCount: number;
}

export function NetworkStats({ deviceCount, logCount, alertCount }: NetworkStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center">
        <div className="bg-sky-500/20 p-3 rounded-full mr-4">
          <Wifi className="h-6 w-6 text-sky-500" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Connected Devices</p>
          <h3 className="text-2xl font-bold">{deviceCount}</h3>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center">
        <div className="bg-emerald-500/20 p-3 rounded-full mr-4">
          <Activity className="h-6 w-6 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Network Logs</p>
          <h3 className="text-2xl font-bold">{logCount}</h3>
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center">
        <div className={`${alertCount > 0 ? 'bg-red-500/20' : 'bg-slate-500/20'} p-3 rounded-full mr-4`}>
          <AlertTriangle className={`h-6 w-6 ${alertCount > 0 ? 'text-red-500' : 'text-slate-400'}`} />
        </div>
        <div>
          <p className="text-sm text-slate-400">Active Alerts</p>
          <h3 className={`text-2xl font-bold ${alertCount > 0 ? 'text-red-500' : 'text-white'}`}>
            {alertCount}
          </h3>
        </div>
      </div>
    </div>
  );
}
