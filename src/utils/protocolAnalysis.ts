
export interface ProtocolData {
  protocol: string;
  port: number;
  isEncrypted: boolean;
  description: string;
}

export function analyzeProtocol(url: string): ProtocolData {
  const urlObj = new URL(url);
  
  switch (urlObj.protocol) {
    case 'https:':
      return {
        protocol: 'HTTPS',
        port: 443,
        isEncrypted: true,
        description: 'Secure HTTP traffic'
      };
    case 'http:':
      return {
        protocol: 'HTTP',
        port: 80,
        isEncrypted: false,
        description: 'Unencrypted HTTP traffic'
      };
    case 'ws:':
      return {
        protocol: 'WebSocket',
        port: 80,
        isEncrypted: false,
        description: 'WebSocket connection'
      };
    case 'wss:':
      return {
        protocol: 'WebSocket (Secure)',
        port: 443,
        isEncrypted: true,
        description: 'Secure WebSocket connection'
      };
    default:
      return {
        protocol: 'Unknown',
        port: 0,
        isEncrypted: false,
        description: 'Unrecognized protocol'
      };
  }
}
