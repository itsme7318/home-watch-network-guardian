
export interface HotspotClient {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  connectedSince: Date;
  bandwidth: {
    download: number;
    upload: number;
  };
}

export interface HotspotSettings {
  ssid: string;
  password: string;
  maxClients: number;
  channel: number;
  band: '2.4GHz' | '5GHz';
  security: 'WPA2' | 'WPA3';
}
