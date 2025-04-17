import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BandwidthData } from "@/types";
import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { bandwidthMonitor } from "@/utils/bandwidthMonitoring";

const BandwidthMonitor = () => {
  const [dataHistory, setDataHistory] = useState<BandwidthData[]>([]);
  const [liveUpdate, setLiveUpdate] = useState(true);
  const [chartType, setChartType] = useState<"line" | "area">("area");
  
  useEffect(() => {
    if (!liveUpdate) return;
    
    // Update bandwidth data every second
    const intervalId = setInterval(() => {
      const newData = bandwidthMonitor.measureBandwidth();
      setDataHistory(prev => {
        // Keep last 60 data points (1 minute of data)
        const newHistory = [...prev, newData];
        if (newHistory.length > 60) {
          return newHistory.slice(newHistory.length - 60);
        }
        return newHistory;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [liveUpdate]);
  
  // Format time for x-axis
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };
  
  // Calculate current speeds
  const currentDownload = dataHistory.length > 0 ? dataHistory[dataHistory.length - 1].download : 0;
  const currentUpload = dataHistory.length > 0 ? dataHistory[dataHistory.length - 1].upload : 0;
  const currentLatency = dataHistory.length > 0 ? dataHistory[dataHistory.length - 1].latency : 0;
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Bandwidth Monitoring</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="live-update"
                checked={liveUpdate}
                onCheckedChange={setLiveUpdate}
              />
              <label htmlFor="live-update" className="text-sm cursor-pointer">
                Live Update
              </label>
            </div>
            <div className="flex gap-1">
              <Toggle 
                pressed={chartType === "line"} 
                onPressedChange={() => setChartType("line")}
                className="h-8 w-8 p-0"
                title="Line Chart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </Toggle>
              <Toggle 
                pressed={chartType === "area"} 
                onPressedChange={() => setChartType("area")}
                className="h-8 w-8 p-0"
                title="Area Chart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z"></path>
                </svg>
              </Toggle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-sky-500/20 p-2 rounded-full mr-3">
              <ArrowDownToLine className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Download</p>
              <h3 className="text-xl font-bold">{currentDownload.toFixed(1)} <span className="text-sm font-normal">Mbps</span></h3>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-emerald-500/20 p-2 rounded-full mr-3">
              <ArrowUpFromLine className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Upload</p>
              <h3 className="text-xl font-bold">{currentUpload.toFixed(1)} <span className="text-sm font-normal">Mbps</span></h3>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-amber-500/20 p-2 rounded-full mr-3">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Latency</p>
              <h3 className="text-xl font-bold">{currentLatency.toFixed(0)} <span className="text-sm font-normal">ms</span></h3>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={dataHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                  label={{ 
                    value: 'Mbps', 
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
                  formatter={(value: number) => [`${value.toFixed(2)} Mbps`, '']}
                  labelFormatter={label => formatTime(label as Date)}
                />
                <Line 
                  type="monotone" 
                  dataKey="download" 
                  name="Download"
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#0ea5e9' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="upload" 
                  name="Upload"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981' }} 
                />
              </LineChart>
            ) : (
              <AreaChart data={dataHistory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fill: '#94a3b8' }} 
                  label={{ 
                    value: 'Mbps', 
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
                  formatter={(value: number) => [`${value.toFixed(2)} Mbps`, '']}
                  labelFormatter={label => formatTime(label as Date)}
                />
                <Area 
                  type="monotone" 
                  dataKey="download" 
                  name="Download"
                  stroke="#0ea5e9" 
                  fill="#0ea5e9" 
                  fillOpacity={0.2} 
                  activeDot={{ r: 6, fill: '#0ea5e9' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="upload" 
                  name="Upload"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2}
                  activeDot={{ r: 6, fill: '#10b981' }} 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BandwidthMonitor;
