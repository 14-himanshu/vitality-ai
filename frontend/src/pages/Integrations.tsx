import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Watch, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntegrations } from '../hooks/useIntegrations';

export default function Integrations() {
  const { connections, loading, isConnecting, toggleConnection } = useIntegrations();

  const handleConnect = (provider) => {
    toggleConnection(provider);
  };

  const providers = [
    {
      id: 'apple',
      name: 'Apple Health',
      description: 'Sync your steps, workouts, heart rate, and sleep data automatically from your iPhone or Apple Watch.',
      color: 'bg-card',
      icon: <Watch className="h-6 w-6 text-foreground" />
    },
    {
      id: 'google',
      name: 'Google Fit',
      description: 'Connect to Google Fit to pull in your daily activity data across all your Android devices.',
      color: 'bg-blue-500',
      icon: <Activity className="h-6 w-6 text-foreground" />
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      description: 'Import your advanced sleep stages, readiness scores, and body temperature metrics.',
      color: 'bg-secondary',
      icon: <div className="h-6 w-6 rounded-full border-4 border-white"></div>
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Sync your Fitbit tracker data including steps, active zone minutes, and resting heart rate.',
      color: 'bg-emerald-500',
      icon: <Activity className="h-6 w-6 text-foreground" />
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-10">
          <h1 className="text-3xl font-medium text-foreground mb-2">Connected Devices</h1>
          <p className="text-muted-foreground text-lg">Sync your health data automatically from your favorite wearables and apps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => {
            const isConnected = connections[provider.id] === 'connected';
            const connecting = isConnecting === provider.id;

            return (
              <motion.div 
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card p-6 rounded-2xl border transition-all ${isConnected ? 'border-primary/20 shadow-md ring-1 ring-primary/10' : 'border-border shadow-sm'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${provider.color}`}>
                    {provider.icon}
                  </div>
                  
                  {isConnected ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium border border-border">
                      Not Connected
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-medium text-foreground mb-2">{provider.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[40px] leading-relaxed">
                  {provider.description}
                </p>

                <Button 
                  onClick={() => handleConnect(provider.id)}
                  disabled={isConnecting !== null && !connecting}
                  variant={isConnected ? "outline" : "default"}
                  className={`w-full font-medium h-11 rounded-xl ${isConnected ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-primary hover:bg-primary/90 shadow-sm'}`}
                >
                  {connecting ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Connecting...</>
                  ) : isConnected ? (
                    "Disconnect"
                  ) : (
                    "Connect"
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Data Privacy Guarantee</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We only sync the metrics necessary for your dashboard. Your health data is encrypted end-to-end and never sold to third parties. You can revoke access at any time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
