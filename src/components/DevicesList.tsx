
import { useState } from "react";
import { Device, NetworkLog } from "@/types";
import { Laptop, Smartphone, Tv, Router, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DevicesListProps {
  devices: Device[];
  logs: NetworkLog[];
}

const DevicesList = ({ devices, logs }: DevicesListProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "smartphone":
        return <Smartphone className="h-5 w-5" />;
      case "tv":
        return <Tv className="h-5 w-5" />;
      default:
        return <Router className="h-5 w-5" />;
    }
  };
  
  const getDeviceLogs = (deviceId: string) => {
    return logs.filter(log => log.deviceId === deviceId);
  };
  
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">Connected Devices</h2>
      </div>
      
      <Tabs defaultValue="devices">
        <div className="px-4 pt-3">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="devices">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {devices.map(device => (
              <div 
                key={device.id}
                className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedDevice === device.id ? 'ring-2 ring-sky-500' : ''}`}
                onClick={() => setSelectedDevice(device.id === selectedDevice ? null : device.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-slate-600 p-2 rounded-full">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-xs text-slate-400">{device.ipAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={device.status === "online" ? "default" : "secondary"} className={device.status === "online" ? "bg-green-600" : "bg-slate-500"}>
                    {device.status}
                  </Badge>
                  <span className="text-slate-400">MAC: {device.macAddress}</span>
                </div>
                
                {selectedDevice === device.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <h4 className="text-sm font-semibold mb-2">Recent Activity</h4>
                    <ScrollArea className="h-40">
                      {getDeviceLogs(device.id).length > 0 ? (
                        <ul className="space-y-2">
                          {getDeviceLogs(device.id).slice(0, 5).map(log => (
                            <li key={log.id} className="text-xs bg-slate-800 p-2 rounded">
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTimestamp(log.timestamp)}
                                </span>
                              </div>
                              <p className="truncate">{log.activity}</p>
                              <p className="text-sky-400 truncate text-[10px]">{log.url}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No recent activity</p>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <ScrollArea className="h-96">
            <div className="p-4">
              <table className="w-full">
                <thead className="text-xs text-slate-400 uppercase">
                  <tr>
                    <th className="text-left pb-3">Time</th>
                    <th className="text-left pb-3">Device</th>
                    <th className="text-left pb-3">Activity</th>
                    <th className="text-left pb-3">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-t border-slate-700">
                      <td className="py-3 text-xs">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{log.deviceName}</span>
                          <span className="text-xs text-slate-400 ml-2">{log.ipAddress}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{log.activity}</td>
                      <td className="py-3 text-xs text-sky-400">{log.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevicesList;
