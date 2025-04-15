
import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkLog } from "@/types";

interface TrafficMonitorProps {
  logs: NetworkLog[];
}

const TrafficMonitor = ({ logs }: TrafficMonitorProps) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [protocolData, setProtocolData] = useState<any[]>([]);
  
  // Generate mock traffic data
  useEffect(() => {
    // Traffic over time (last 12 time periods)
    const trafficOverTime = Array.from({ length: 12 }, (_, i) => {
      const timeLabel = new Date();
      timeLabel.setMinutes(timeLabel.getMinutes() - (11 - i) * 5);
      const hour = timeLabel.getHours().toString().padStart(2, '0');
      const min = timeLabel.getMinutes().toString().padStart(2, '0');
      
      return {
        time: `${hour}:${min}`,
        inbound: Math.floor(Math.random() * 50) + 10,
        outbound: Math.floor(Math.random() * 40) + 5,
      };
    });
    
    setTrafficData(trafficOverTime);
    
    // Protocol distribution
    setProtocolData([
      { name: 'HTTP', value: Math.floor(Math.random() * 30) + 10 },
      { name: 'HTTPS', value: Math.floor(Math.random() * 40) + 50 },
      { name: 'DNS', value: Math.floor(Math.random() * 15) + 5 },
      { name: 'DHCP', value: Math.floor(Math.random() * 5) + 2 },
      { name: 'Other', value: Math.floor(Math.random() * 10) + 3 },
    ]);
  }, [logs.length]);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold">Network Traffic</h2>
      </div>
      
      <Tabs defaultValue="traffic">
        <div className="px-4 pt-3">
          <TabsList className="bg-slate-700">
            <TabsTrigger value="traffic">Traffic Over Time</TabsTrigger>
            <TabsTrigger value="protocols">Protocol Distribution</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="traffic" className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trafficData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                  label={{ 
                    value: 'KB/s', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#94a3b8'
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    color: '#f8fafc'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="inbound" 
                  stroke="#0ea5e9" 
                  strokeWidth={2} 
                  dot={{ fill: '#0ea5e9', r: 4 }}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="outbound" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div>
              <span className="text-sm">Inbound</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm">Outbound</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="protocols" className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={protocolData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: '#94a3b8'
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#475569',
                    color: '#f8fafc'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#0ea5e9" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrafficMonitor;
