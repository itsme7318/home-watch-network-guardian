
// Get network information using the Network Information API
export const getNetworkInfo = (): { type: string; downlink: number; rtt: number } => {
  if ('connection' in navigator) {
    // @ts-ignore - The Network Information API is not fully typed in TypeScript
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return {
        type: connection.effectiveType || connection.type || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      };
    }
  }
  return { type: 'unknown', downlink: 0, rtt: 0 };
};
