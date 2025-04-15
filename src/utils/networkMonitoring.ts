import { NetworkLog, Alert, Device } from "@/types";
import { toast } from "@/components/ui/sonner";
import { detectMaliciousSite, getThreatSeverity } from "./securityUtils";
import { analyzeProtocol } from "./protocolAnalysis";
import { analyzeTrafficSafety, classifySecurityEvent } from "./securityClassification";

// Monitor real network activity using the Performance API
export const monitorNetworkActivity = (
  callback: (log: NetworkLog) => void,
  alertCallback: (alert: Alert) => void,
  devices: Device[]
) => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming;
        const url = resourceEntry.name;
        
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
          return;
        }
        
        // Get device information
        const device = devices.find(d => d.id === 'this-device') || 
                     (devices.length > 0 ? devices[Math.floor(Math.random() * devices.length)] : 
                     { id: 'unknown', name: 'Unknown Device', ipAddress: '0.0.0.0' });
        
        const activity = getActivityTypeFromURL(url);
        
        // Analyze protocol and security
        const protocolInfo = analyzeProtocol(url);
        const securityAnalysis = analyzeTrafficSafety(url);
        const eventLevel = classifySecurityEvent(url, activity);
        
        // Create network log with enhanced information
        const newLog: NetworkLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          deviceId: device.id,
          deviceName: device.name,
          ipAddress: device.ipAddress,
          activity,
          url,
          protocol: protocolInfo.protocol,
          isEncrypted: protocolInfo.isEncrypted,
          transferSize: resourceEntry.transferSize || 0,
          duration: resourceEntry.duration || 0
        };
        
        callback(newLog);
        
        // Enhanced security alerts
        if (!securityAnalysis.isSafe || eventLevel !== 'info') {
          const severity = getThreatSeverity(url);
          const newAlert: Alert = {
            id: Date.now().toString(),
            timestamp: new Date(),
            deviceId: device.id,
            deviceName: device.name,
            severity,
            message: securityAnalysis.reason,
            url,
            acknowledged: false,
            eventLevel,
            protocolInfo: protocolInfo.description
          };
          
          alertCallback(newAlert);
          
          toast.error(`Security Alert: ${securityAnalysis.reason}`, {
            description: `${device.name} - ${new URL(url).hostname}`,
          });
        }
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
  
  const interfaceCheckInterval = setInterval(() => {
    // Interface check placeholder
  }, 30000);

  return () => {
    observer.disconnect();
    clearInterval(interfaceCheckInterval);
  };
};

// Determine activity type based on URL patterns
const getActivityTypeFromURL = (url: string): string => {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    if (hostname.includes('google')) return 'Web search';
    if (hostname.includes('youtube') || hostname.includes('netflix') || hostname.includes('hulu')) return 'Video streaming';
    if (hostname.includes('facebook') || hostname.includes('twitter') || hostname.includes('instagram')) return 'Social media';
    if (hostname.includes('gmail') || hostname.includes('outlook') || hostname.includes('mail')) return 'Email access';
    if (hostname.includes('amazon') || hostname.includes('ebay') || hostname.includes('shop')) return 'Online shopping';
    if (hostname.includes('news') || hostname.includes('cnn') || hostname.includes('bbc')) return 'News reading';
    if (url.includes('.exe') || url.includes('.zip') || url.includes('.dmg')) return 'File download';
    if (hostname.includes('zoom') || hostname.includes('meet') || hostname.includes('teams')) return 'Video conference';
    if (hostname.includes('bank') || hostname.includes('chase') || hostname.includes('paypal')) return 'Banking access';
    if (hostname.includes('spotify') || hostname.includes('apple.com/music') || hostname.includes('pandora')) return 'Music streaming';
    
    return 'Web browsing';
  } catch (error) {
    return 'Web browsing';
  }
};
