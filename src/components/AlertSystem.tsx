
import { useState } from "react";
import { Alert } from "@/types";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AlertSystemProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

const AlertSystem = ({ alerts, onAcknowledge }: AlertSystemProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("active");
  
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);
  
  const formatAlertTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 h-full">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          Security Alerts
        </h2>
        
        {activeAlerts.length > 0 && (
          <div className="px-2 py-1 bg-red-500/20 rounded text-red-500 text-sm font-semibold">
            {activeAlerts.length} Active
          </div>
        )}
      </div>
      
      <Tabs defaultValue="active" onValueChange={setSelectedTab}>
        <div className="px-4 pt-3">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="active">
              Active
              {activeAlerts.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="active">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="p-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-2" />
                  <p className="text-slate-400">No active alerts</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {activeAlerts.map(alert => (
                    <li key={alert.id} className="bg-red-950/20 border border-red-900/50 rounded p-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{alert.message}</p>
                            <span className="text-xs text-slate-400 ml-2">
                              {formatAlertTime(alert.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="text-slate-400">Device: </span>
                            <span>{alert.deviceName}</span>
                          </div>
                          <p className="text-xs text-red-400 mt-1 truncate">
                            {alert.url}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 h-7 bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-xs"
                            onClick={() => onAcknowledge(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="history">
          <ScrollArea className="h-[calc(100vh-25rem)]">
            <div className="p-4">
              {acknowledgedAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400">No alert history</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {acknowledgedAlerts.map(alert => (
                    <li key={alert.id} className="bg-slate-700/50 border border-slate-600 rounded p-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-slate-300">{alert.message}</p>
                            <span className="text-xs text-slate-400 ml-2">
                              {formatAlertTime(alert.timestamp)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm">
                            <span className="text-slate-400">Device: </span>
                            <span className="text-slate-300">{alert.deviceName}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            {alert.url}
                          </p>
                          <div className="mt-2 text-xs text-slate-400 flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Acknowledged
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertSystem;
