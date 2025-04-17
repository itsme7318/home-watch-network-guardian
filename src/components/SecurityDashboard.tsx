
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityEvent, Alert } from "@/types";
import { Shield, AlertTriangle, CheckCircle2, Clock, BadgeAlert, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

interface SecurityDashboardProps {
  events: SecurityEvent[];
  alerts: Alert[];
}

const SecurityDashboard = ({ events, alerts }: SecurityDashboardProps) => {
  const [anomalyDetection, setAnomalyDetection] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [realtimeMonitoring, setRealtimeMonitoring] = useState(true);
  
  // Calculate security stats
  const totalEvents = events.length;
  const criticalEvents = events.filter(e => e.severity === 'high').length;
  const pendingAlerts = alerts.filter(a => !a.acknowledged).length;
  
  // Prepare event type distribution data for pie chart
  const eventTypesData = [
    { name: 'Intrusion', value: events.filter(e => e.eventType === 'intrusion').length, color: '#ef4444' },
    { name: 'Malware', value: events.filter(e => e.eventType === 'malware').length, color: '#f97316' },
    { name: 'Anomaly', value: events.filter(e => e.eventType === 'anomaly').length, color: '#eab308' },
    { name: 'Policy', value: events.filter(e => e.eventType === 'policy_violation').length, color: '#3b82f6' }
  ];
  
  // Prepare severity distribution data for pie chart
  const severityData = [
    { name: 'High', value: events.filter(e => e.severity === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: events.filter(e => e.severity === 'medium').length, color: '#f97316' },
    { name: 'Low', value: events.filter(e => e.severity === 'low').length, color: '#10b981' }
  ];

  // Custom Active Shape for Pie Chart
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xs">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999" fontSize={12}>{`${value} events`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };
  
  // Recent events list
  const RecentEventsList = () => (
    <div className="mt-4 h-64 overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-slate-400 uppercase">
          <tr>
            <th className="text-left py-2">Time</th>
            <th className="text-left py-2">Type</th>
            <th className="text-left py-2">Source</th>
            <th className="text-left py-2">Severity</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.slice(0, 10).map((event, index) => (
              <tr key={index} className="border-t border-slate-700">
                <td className="py-2 text-xs">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  }).format(event.timestamp)}
                </td>
                <td className="py-2">
                  <div className="flex items-center">
                    {event.eventType === 'intrusion' && <ShieldX className="h-4 w-4 mr-1 text-red-500" />}
                    {event.eventType === 'malware' && <ShieldAlert className="h-4 w-4 mr-1 text-orange-500" />}
                    {event.eventType === 'anomaly' && <BadgeAlert className="h-4 w-4 mr-1 text-yellow-500" />}
                    {event.eventType === 'policy_violation' && <ShieldCheck className="h-4 w-4 mr-1 text-blue-500" />}
                    <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="py-2">{event.sourceIp}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.severity === 'high' ? 'bg-red-900/50 text-red-300' : 
                    event.severity === 'medium' ? 'bg-orange-900/50 text-orange-300' : 
                    'bg-green-900/50 text-green-300'
                  }`}>
                    {event.severity}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-6 text-center text-slate-400">
                No security events detected
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Shield className="mr-2 h-5 w-5 text-sky-500" />
            Security & Anomaly Detection
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="anomaly-detection"
                checked={anomalyDetection}
                onCheckedChange={setAnomalyDetection}
              />
              <label htmlFor="anomaly-detection" className="text-sm cursor-pointer">
                AI Detection
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="realtime-monitoring"
                checked={realtimeMonitoring}
                onCheckedChange={setRealtimeMonitoring}
              />
              <label htmlFor="realtime-monitoring" className="text-sm cursor-pointer">
                Realtime
              </label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-sky-500/20 p-2 rounded-full mr-3">
              <AlertTriangle className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Security Events</p>
              <h3 className="text-xl font-bold">{totalEvents}</h3>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-red-500/20 p-2 rounded-full mr-3">
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Critical Events</p>
              <h3 className="text-xl font-bold">{criticalEvents}</h3>
            </div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg flex items-center">
            <div className="bg-orange-500/20 p-2 rounded-full mr-3">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pending Alerts</p>
              <h3 className="text-xl font-bold">{pendingAlerts}</h3>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="distribution" className="mt-6">
          <TabsList className="bg-slate-700 mb-4">
            <TabsTrigger value="distribution">Event Distribution</TabsTrigger>
            <TabsTrigger value="severity">Severity Analysis</TabsTrigger>
            <TabsTrigger value="recent">Recent Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="m-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={eventTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                  >
                    {eventTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="severity" className="m-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [`${value} events (${(value / totalEvents * 100).toFixed(0)}%)`, name]}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#475569',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="m-0">
            <RecentEventsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SecurityDashboard;
