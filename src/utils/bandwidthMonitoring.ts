import { BandwidthData } from "@/types";

class BandwidthMonitor {
  private lastDownloadBytes = 0;
  private lastUploadBytes = 0;
  private lastTimestamp = Date.now();
  private samples: BandwidthData[] = [];

  measureBandwidth(): BandwidthData {
    const now = Date.now();
    const timeDiff = (now - this.lastTimestamp) / 1000; // Convert to seconds

    // Get current network performance data
    const currentData = performance.getEntriesByType('resource');
    const downloadBytes = currentData.reduce((total, entry) => {
      return total + ((entry as PerformanceResourceTiming).transferSize || 0);
    }, 0);
    
    const uploadBytes = currentData.reduce((total, entry) => {
      return total + ((entry as any).encodedBodySize || 0);
    }, 0);

    // Calculate bandwidth
    const downloadSpeed = Math.max(0, ((downloadBytes - this.lastDownloadBytes) / timeDiff) / 125000); // Convert to Mbps
    const uploadSpeed = Math.max(0, ((uploadBytes - this.lastUploadBytes) / timeDiff) / 125000); // Convert to Mbps

    // Update last values
    this.lastDownloadBytes = downloadBytes;
    this.lastUploadBytes = uploadBytes;
    this.lastTimestamp = now;

    // Generate simulated latency (for demo purposes)
    const latency = Math.floor(Math.random() * 50) + 10; // 10-60ms

    const bandwidthData: BandwidthData = {
      timestamp: new Date(),
      download: downloadSpeed,
      upload: uploadSpeed,
      latency
    };

    // Keep last 60 samples for trending
    this.samples.push(bandwidthData);
    if (this.samples.length > 60) {
      this.samples.shift();
    }

    return bandwidthData;
  }

  getSamples(): BandwidthData[] {
    return this.samples;
  }
}

export const bandwidthMonitor = new BandwidthMonitor();
