export interface Device {
  id: string;
  name: string;
  type: string;
  ipAddress: string;
  macAddress: string;
  status: 'online' | 'offline';
}

export interface NetworkLog {
  id: string;
  timestamp: Date;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  activity: string;
  url: string;
  protocol?: string;
  isEncrypted?: boolean;
  transferSize?: number;
  duration?: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  deviceId: string;
  deviceName: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  url: string;
  acknowledged: boolean;
  eventLevel?: 'info' | 'low' | 'medium' | 'high' | 'critical';
  protocolInfo?: string;
}

export interface NetworkScanResult {
  devices: Device[];
  scanTime: string;
}

export interface NetworkTrafficData {
  source: string;
  destination: string;
  protocol: string;
  port: number;
  bytes: number;
  timestamp: Date;
}

export interface BandwidthData {
  timestamp: Date;
  download: number;
  upload: number;
  latency: number;
}

export interface GeoLocation {
  ip: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  sourceIp: string;
  destinationIp: string;
  eventType: 'intrusion' | 'malware' | 'anomaly' | 'policy_violation';
  severity: 'low' | 'medium' | 'high';
  description: string;
}
