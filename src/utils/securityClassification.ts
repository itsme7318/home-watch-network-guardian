
// Security event classification levels
export type SecurityEventLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

interface SecuritySignature {
  pattern: RegExp;
  level: SecurityEventLevel;
  description: string;
}

// Common security signatures for detection
const securitySignatures: SecuritySignature[] = [
  {
    pattern: /\.(exe|bat|cmd|sh|msi)$/i,
    level: 'high',
    description: 'Potentially malicious file download detected'
  },
  {
    pattern: /password|login|signin|signup/i,
    level: 'medium',
    description: 'Credential-related activity detected'
  },
  {
    pattern: /admin|administrator|root/i,
    level: 'medium',
    description: 'Administrative access attempt detected'
  },
  {
    pattern: /(sql\s*injection|xss|csrf)/i,
    level: 'critical',
    description: 'Common attack pattern detected'
  }
];

export function classifySecurityEvent(url: string, activity: string): SecurityEventLevel {
  for (const signature of securitySignatures) {
    if (signature.pattern.test(url) || signature.pattern.test(activity)) {
      return signature.level;
    }
  }
  return 'info';
}

export function analyzeTrafficSafety(url: string): {
  isSafe: boolean;
  level: SecurityEventLevel;
  reason: string;
} {
  // Check against security signatures
  for (const signature of securitySignatures) {
    if (signature.pattern.test(url)) {
      return {
        isSafe: false,
        level: signature.level,
        reason: signature.description
      };
    }
  }

  // Add common malicious patterns
  if (url.includes('malware') || url.includes('phishing')) {
    return {
      isSafe: false,
      level: 'critical',
      reason: 'Known malicious keywords detected'
    };
  }

  // Check for suspicious TLD domains
  if (/\.(xyz|tk|ml|ga|cf)$/.test(url)) {
    return {
      isSafe: false,
      level: 'medium',
      reason: 'Suspicious domain TLD detected'
    };
  }

  return {
    isSafe: true,
    level: 'info',
    reason: 'No threats detected'
  };
}
