
import { Device, NetworkLog } from "@/types";

// Mock connected devices
export const mockDevices: Device[] = [
  {
    id: "device-1",
    name: "John's Laptop",
    type: "laptop",
    ipAddress: "192.168.1.100",
    macAddress: "00:1A:2B:3C:4D:5E",
    status: "online"
  },
  {
    id: "device-2",
    name: "Sarah's Phone",
    type: "smartphone",
    ipAddress: "192.168.1.101",
    macAddress: "A1:B2:C3:D4:E5:F6",
    status: "online"
  },
  {
    id: "device-3",
    name: "Living Room TV",
    type: "tv",
    ipAddress: "192.168.1.102",
    macAddress: "G7:H8:I9:J0:K1:L2",
    status: "online"
  },
  {
    id: "device-4",
    name: "Kitchen Tablet",
    type: "smartphone",
    ipAddress: "192.168.1.103",
    macAddress: "M3:N4:O5:P6:Q7:R8",
    status: "online"
  },
  {
    id: "device-5",
    name: "Home Office PC",
    type: "laptop",
    ipAddress: "192.168.1.104",
    macAddress: "S9:T0:U1:V2:W3:X4",
    status: "offline"
  }
];

// Mock network activity types with URLs
export const mockLogs: Partial<NetworkLog>[] = [
  { 
    activity: "Web browsing",
    url: "https://www.google.com/search?q=home+security+tips"
  },
  { 
    activity: "Streaming video",
    url: "https://netflix.com/watch/12345"
  },
  { 
    activity: "Social media",
    url: "https://facebook.com/home"
  },
  { 
    activity: "Email access",
    url: "https://mail.google.com/mail/u/0/#inbox"
  },
  { 
    activity: "Online shopping",
    url: "https://amazon.com/shop/deals"
  },
  { 
    activity: "News reading",
    url: "https://news.bbc.co.uk/world"
  },
  { 
    activity: "File download",
    url: "https://download.com/software/utilities.exe"
  },
  { 
    activity: "Video conference",
    url: "https://zoom.us/j/123456789"
  },
  { 
    activity: "Banking access",
    url: "https://banking.chase.com/accounts"
  },
  { 
    activity: "Music streaming",
    url: "https://spotify.com/playlist/top"
  },
  // Occasional suspicious/malicious sites for demo alerts
  { 
    activity: "Suspicious download",
    url: "http://malware.com/free-game.exe"
  },
  { 
    activity: "Phishing attempt",
    url: "https://phishing-site.com/login"
  },
  { 
    activity: "Malicious site",
    url: "https://dangerous-downloads.net/cracked-software"
  }
];
