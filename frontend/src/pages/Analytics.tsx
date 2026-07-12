import React, { useMemo } from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { motion } from 'framer-motion';
import { 
  Download, ArrowLeft, HeartPulse, Activity, 
  Stethoscope, Droplet, BrainCircuit, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';

export default function Analytics() {
  const { metrics, forecast, loading, exportCSV } = useMetrics();

  // Data preparation for charts
  const chartData = useMemo(() => {
    if (!metrics || metrics.length === 0) return [];
    return metrics.map((m, i) => ({
      name: new Date(m.logged_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hrv: m.hrv || 0,
      rhr: m.resting_heart_rate || 0,
      glucose: m.blood_glucose || 0,
      actual_weight: m.weight || 0
    })).reverse(); // oldest to newest
  }, [metrics]);

  const combinedWeightData = useMemo(() => {
    const data = [...chartData];
    if (forecast && forecast.forecast && forecast.forecast.length > 0) {
      forecast.forecast.forEach((f: any) => {
        data.push({
          name: new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          predicted_weight: f.predicted_weight
        });
      });
    }
    return data;
  }, [chartData, forecast]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading Advanced AI Analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-24">
      
      {/* Header */}
      <div className="border-b border-border bg-card pt-24 pb-8 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Activity className="h-6 w-6 text-indigo-400" /> Clinical Analytics
              </h1>
            </div>
            <p className="text-muted-foreground ml-8">Advanced physiological data and AI-driven trend analysis.</p>
          </div>
          
          <Button 
            onClick={exportCSV}
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-none h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-900/50"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV Data
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        
        {metrics.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-muted-foreground">No Clinical Data Found</h2>
            <p className="mt-2">Log your daily metrics with the 'Advanced Clinical' toggle to see your charts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ROW 1: AI Predictive Weight (Full Width) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-xl md:col-span-2"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-purple-400" /> Predictive Weight Trajectory
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">Linear regression AI model predicting your next 30 days based on recent habits.</p>
                </div>
                {forecast && forecast.ratePerDay !== undefined && (
                  <div className="bg-secondary px-4 py-2 rounded-xl text-right border border-border">
                    <p className="text-xs font-bold text-purple-400 uppercase">Predicted Trend</p>
                    <p className="text-lg font-black text-purple-300">
                      {forecast.ratePerDay > 0 ? '+' : ''}{(forecast.ratePerDay * 7).toFixed(2)} kg / week
                    </p>
                  </div>
                )}
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedWeightData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" name="Logged Weight" dataKey="actual_weight" stroke="#c084fc" strokeWidth={4} dot={{ r: 4, fill: '#c084fc', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="AI Forecast (30 Days)" dataKey="predicted_weight" stroke="#64748b" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* HRV Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-indigo-400" /> Heart Rate Variability
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">Measured in ms (Higher is generally better recovery)</p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorHrv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area type="monotone" dataKey="hrv" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorHrv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Resting HR Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-400" /> Resting Heart Rate
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">Measured in bpm (Lower indicates better cardiovascular fitness)</p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRhr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#fb7185' }}
                    />
                    <Area type="monotone" dataKey="rhr" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorRhr)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Fasting Glucose Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-xl md:col-span-2"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-teal-400" /> Fasting Blood Glucose
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">Measured in mg/dL</p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Bar dataKey="glucose" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
}
