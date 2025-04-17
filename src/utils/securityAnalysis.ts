
import { SecurityEvent } from "@/types";

const SUSPICIOUS_PATTERNS = [
  /malware|virus|trojan/i,
  /phishing|scam/i,
  /hack|exploit/i,
  /bruteforce|injection/i
];

const SUSPICIOUS_PORTS = [
  22, // SSH
  23, // Telnet
  3389, // RDP
  445, // SMB
];

export function analyzeTraffic(url: string, port: number): SecurityEvent | null {
  const timestamp = new Date();
  const id = `event-${timestamp.getTime()}`;
  
  // Check for suspicious URLs
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return {
        id,
        timestamp,
        sourceIp: "local",
        destinationIp: new URL(url).hostname,
        eventType: "malware",
        severity: "high",
        description: `Suspicious URL pattern detected: ${pattern}`
      };
    }
  }

  // Check for suspicious ports
  if (SUSPICIOUS_PORTS.includes(port)) {
    return {
      id,
      timestamp,
      sourceIp: "local",
      destinationIp: new URL(url).hostname,
      eventType: "policy_violation",
      severity: "medium",
      description: `Suspicious port ${port} accessed`
    };
  }

  // Analyze traffic patterns for anomalies
  if (Math.random() < 0.05) { // Simulated anomaly detection
    return {
      id,
      timestamp,
      sourceIp: "local",
      destinationIp: new URL(url).hostname,
      eventType: "anomaly",
      severity: "low",
      description: "Unusual traffic pattern detected"
    };
  }

  return null;
}
