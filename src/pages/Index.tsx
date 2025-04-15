
import { useState, useEffect } from "react";
import DevicesList from "@/components/DevicesList";
import TrafficMonitor from "@/components/TrafficMonitor";
import AlertSystem from "@/components/AlertSystem";
import { NetworkStats } from "@/components/NetworkStats";
import { Header } from "@/components/Header";
import { detectMaliciousSite } from "@/utils/securityUtils";
import { Device, NetworkLog, Alert } from "@/types";
import { mockDevices, mockLogs } from "@/data/mockData";

const Index = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate network scanning
  const scanNetwork = () => {
    setIsScanning(true);
    // Simulate network scan delay
    setTimeout(() => {
      setDevices(mockDevices);
      setIsScanning(false);
    }, 2000);
  };

  // Initial scan on component mount
  useEffect(() => {
    scanNetwork();
    
    // Set up mock log generation
    const logInterval = setInterval(() => {
      if (devices.length > 0) {
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          deviceId: randomDevice.id,
          deviceName: randomDevice.name,
          ipAddress: randomDevice.ipAddress,
          activity: mockLogs[Math.floor(Math.random() * mockLogs.length)].activity,
          url: mockLogs[Math.floor(Math.random() * mockLogs.length)].url,
        };
        
        setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100));
        
        // Check for malicious activity
        const isMalicious = detectMaliciousSite(newLog.url);
        if (isMalicious) {
          const newAlert: Alert = {
            id: Date.now().toString(),
            timestamp: new Date(),
            deviceId: randomDevice.id,
            deviceName: randomDevice.name,
            severity: "high",
            message: `Potential malicious site detected: ${newLog.url}`,
            url: newLog.url,
            acknowledged: false
          };
          setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
        }
      }
    }, 5000);

    return () => clearInterval(logInterval);
  }, [devices]);

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
      
      <main className="container mx-auto px-4 py-8">
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
        
        <div className="mt-8">
          <DevicesList devices={devices} logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default Index;
