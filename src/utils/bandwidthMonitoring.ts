
import { BandwidthData } from "@/types";

class BandwidthMonitor {
  private lastDownloadBytes = 0;
  private lastUploadBytes = 0;
  private lastTimestamp = Date.now();

  measureBandwidth(): BandwidthData {
    const connection = (navigator as any).connection;
    const now = Date.now();
    const timeDiff = (now - this.lastTimestamp) / 1000; // Convert to seconds

    // Get current network performance data
    const currentData = performance.getEntriesByType('resource');
    const downloadBytes = currentData.reduce((total, entry) => {
      // Need to check if transferSize exists on the entry
      return total + ((entry as PerformanceResourceTiming).transferSize || 0);
    }, 0);
    
    const uploadBytes = currentData.reduce((total, entry) => {
      // Estimate upload size based on request headers and body
      return total + ((entry as any).requestBodySize || 0);
    }, 0);

    // Calculate bandwidth
    const downloadSpeed = ((downloadBytes - this.lastDownloadBytes) / timeDiff) / 125000; // Convert to Mbps
    const uploadSpeed = ((uploadBytes - this.lastUploadBytes) / timeDiff) / 125000; // Convert to Mbps

    // Update last values
    this.lastDownloadBytes = downloadBytes;
    this.lastUploadBytes = uploadBytes;
    this.lastTimestamp = now;

    return {
      timestamp: new Date(),
      download: downloadSpeed,
      upload: uploadSpeed,
      latency: connection?.rtt || 0
    };
  }
}

export const bandwidthMonitor = new BandwidthMonitor();
