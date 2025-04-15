
// Known malicious domains for demo purposes
const maliciousDomains = [
  'malware.com',
  'phishing-site.com',
  'dangerous-downloads.net',
  'fake-bank.com',
  'trojan-site.org',
  'malicious-scripts.com',
  'evil-tracker.net',
  'ransomware-delivery.com',
  'suspicious-login.net',
  'data-stealer.org'
];

/**
 * Check if a URL is potentially malicious
 * This is a simple demo implementation 
 * In a real system, this would use more sophisticated detection
 */
export function detectMaliciousSite(url: string): boolean {
  // Extract domain from URL for simplified checking
  let domain = '';
  try {
    if (url.startsWith('http')) {
      domain = new URL(url).hostname;
    } else {
      domain = url.split('/')[0];
    }
    
    // Check against known malicious domains
    if (maliciousDomains.some(bad => domain.includes(bad))) {
      return true;
    }
    
    // Randomly trigger malicious detection for demo purposes (5% chance)
    if (Math.random() < 0.05) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return false;
  }
}

/**
 * Get severity level based on various factors
 * This would be more complex in a real system
 */
export function getThreatSeverity(url: string): 'low' | 'medium' | 'high' {
  // Simple severity determination for demo
  if (maliciousDomains.some(bad => url.includes(bad))) {
    return 'high';
  }
  
  const random = Math.random();
  if (random < 0.2) return 'low';
  if (random < 0.5) return 'medium';
  return 'high';
}
