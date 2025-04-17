
import { useState, useEffect, useCallback } from "react";
import DevicesList from "@/components/DevicesList";
import TrafficMonitor from "@/components/TrafficMonitor";
import AlertSystem from "@/components/AlertSystem";
import { NetworkStats } from "@/components/NetworkStats";
import { Header } from "@/components/Header";
import BandwidthMonitor from "@/components/BandwidthMonitor";
import MapView from "@/components/MapView";
import SecurityDashboard from "@/components/SecurityDashboard";
import { Device, NetworkLog, Alert, SecurityEvent, GeoLocation } from "@/types";
import { scanLocalNetwork, monitorNetworkActivity } from "@/utils/networkUtils";
import { toast } from "@/components/ui/sonner";
import { useToast } from "@/hooks/use-toast";
import { generateMockGeoData } from "@/utils/geoLocation";

const Index = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [geoData, setGeoData] = useState<GeoLocation[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast: uiToast } = useToast();

  // Network scanning function - enhanced for real-time detection
  const scanNetwork = useCallback(async () => {
    setIsScanning(true);
    try {
      const result = await scanLocalNetwork();
      setDevices(result.devices);
      
      // Generate mock geo data for demo purposes
      setGeoData(generateMockGeoData(Math.min(result.devices.length, 8)));
      
      uiToast({
        title: "Network Scan Complete",
        description: `Found ${result.devices.length} devices in ${result.scanTime}`
      });
    } catch (error) {
      console.error("Network scan error:", error);
      uiToast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Unable to complete network scan"
      });
    } finally {
      setIsScanning(false);
    }
  }, [uiToast]);

  // Add a new log entry in real-time
  const addLogEntry = useCallback((newLog: NetworkLog) => {
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100));
  }, []);

  // Add a new security alert in real-time
  const addAlert = useCallback((newAlert: Alert) => {
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    
    // Show a toast notification for new alerts
    toast.error(`Security Alert: ${newAlert.message}`, {
      description: `Device: ${newAlert.deviceName}`
    });
  }, []);
  
  // Add a new security event in real-time
  const addSecurityEvent = useCallback((newEvent: SecurityEvent) => {
    setSecurityEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 100));
  }, []);

  // Generate mock security events for demonstration
  useEffect(() => {
    const eventTypes: SecurityEvent['eventType'][] = ['intrusion', 'malware', 'anomaly', 'policy_violation'];
    const severities: SecurityEvent['severity'][] = ['low', 'medium', 'high'];
    
    const generateMockEvent = (): SecurityEvent => {
      const device = devices[Math.floor(Math.random() * Math.max(devices.length, 1))];
      return {
        id: Date.now().toString(),
        timestamp: new Date(),
        sourceIp: device?.ipAddress || `192.168.1.${Math.floor(Math.random() * 255)}`,
        destinationIp: `203.0.113.${Math.floor(Math.random() * 255)}`,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: `Detected suspicious ${eventTypes[Math.floor(Math.random() * eventTypes.length)]} activity`
      };
    };
    
    // Generate initial events
    const initialEvents = Array.from({ length: 15 }, () => generateMockEvent());
    setSecurityEvents(initialEvents);
    
    // Periodically add new events for demo purposes
    const intervalId = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new event
        addSecurityEvent(generateMockEvent());
      }
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [devices, addSecurityEvent]);

  // Set up network monitoring
  useEffect(() => {
    // Initial network scan
    scanNetwork();
    
    // Set up real-time network monitoring regardless of device count
    // This ensures we're always monitoring network traffic
    const cleanup = monitorNetworkActivity(addLogEntry, addAlert, devices);
    
    return () => {
      cleanup();
    };
  }, [scanNetwork, addLogEntry, addAlert, devices]);

  // Add periodic scan every 2 minutes to detect new hotspot clients
  useEffect(() => {
    const intervalId = setInterval(() => {
      scanNetwork();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [scanNetwork]);

  // Acknowledge an alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header scanNetwork={scanNetwork} isScanning={isScanning} />
      
      <main className="container mx-auto px-4 py-6">
        <NetworkStats 
          deviceCount={devices.length} 
          logCount={logs.length} 
          alertCount={alerts.filter(a => !a.acknowledged).length} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <TrafficMonitor logs={logs} />
          </div>
          <div>
            <AlertSystem alerts={alerts} onAcknowledge={acknowledgeAlert} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BandwidthMonitor />
          <SecurityDashboard events={securityEvents} alerts={alerts} />
        </div>
        
        <div className="mt-6">
          <MapView geoData={geoData} />
        </div>
        
        <div className="mt-6">
          <DevicesList devices={devices} logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default Index;
