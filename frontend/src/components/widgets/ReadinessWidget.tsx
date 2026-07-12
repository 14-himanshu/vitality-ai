import React from 'react';
import { HeartPulse, Zap, ShieldAlert, Bed } from 'lucide-react';
import { Metric } from '../../types';

export default function ReadinessWidget({ latest, metrics }: { latest: Metric, metrics: Metric[] }) {
  if (!latest || !latest.hrv || !latest.resting_heart_rate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <HeartPulse className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-semibold text-muted-foreground">Clinical Data Missing</p>
        <p className="text-xs text-muted-foreground mt-1">Log HRV and RHR to unlock your Readiness Score.</p>
      </div>
    );
  }

  // Calculate 7-day averages for baseline
  const recentMetrics = metrics.slice(Math.max(metrics.length - 7, 0));
  const avgHrv = recentMetrics.reduce((acc, m) => acc + (m.hrv || 0), 0) / (recentMetrics.filter(m => m.hrv).length || 1);
  const avgRhr = recentMetrics.reduce((acc, m) => acc + (m.resting_heart_rate || 0), 0) / (recentMetrics.filter(m => m.resting_heart_rate).length || 1);

  // Advanced Algorithm: Readiness Score (0-100)
  // Higher HRV is good, Lower RHR is good.
  let score = 80; // Baseline
  
  const hrvDiff = latest.hrv - avgHrv;
  const rhrDiff = avgRhr - latest.resting_heart_rate;

  // Adjust score based on deviations from baseline
  score += (hrvDiff / 2); // E.g., +10ms HRV = +5 points
  score += (rhrDiff * 2); // E.g., -5bpm RHR = +10 points
  
  score = Math.max(0, Math.min(100, Math.round(score)));

  let status, color, Icon, advice;
  if (score >= 85) {
    status = "Peak Performance";
    color = "text-emerald-500";
    Icon = Zap;
    advice = "Your body is primed for strain. Push hard today!";
  } else if (score >= 60) {
    status = "Moderate Recovery";
    color = "text-primary";
    Icon = HeartPulse;
    advice = "Normal readiness. Proceed with your planned routine.";
  } else {
    status = "Needs Recovery";
    color = "text-rose-500";
    Icon = ShieldAlert;
    advice = "Your metrics are suppressed. Prioritize active recovery and sleep.";
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${color.replace('text', 'bg').replace('500', '100')} ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-medium tracking-widest text-muted-foreground">Score</span>
          <div className={`text-4xl font-bold ${color}`}>{score}</div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-foreground text-lg mb-1">{status}</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{advice}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs">
        <div>
          <span className="text-muted-foreground">HRV:</span> <span className="font-medium text-foreground">{latest.hrv}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">RHR:</span> <span className="font-medium text-foreground">{latest.resting_heart_rate}bpm</span>
        </div>
      </div>
    </div>
  );
}
