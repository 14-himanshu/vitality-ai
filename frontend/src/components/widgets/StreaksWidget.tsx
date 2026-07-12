import React, { useMemo } from 'react';
import { Flame, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Metric } from '../../types';

export default function StreaksWidget({ metrics = [] }: { metrics: Metric[] }) {
  
  const { currentStreak, history, days } = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return { currentStreak: 0, history: Array(7).fill(false), days: ['M','T','W','T','F','S','S'] };
    }

    // Sort descending by date
    const sorted = [...metrics].sort((a, b) => new Date(b.logged_date!).getTime() - new Date(a.logged_date!).getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let currentDate = today;

    // Check if today or yesterday is the start of the streak
    if (sorted.length > 0) {
      const lastLogDate = new Date(sorted[0].logged_date!);
      lastLogDate.setHours(0,0,0,0);
      
      const diffTime = Math.abs(today.getTime() - lastLogDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 1) {
        streak = 1;
        currentDate = lastLogDate;
        
        for (let i = 1; i < sorted.length; i++) {
          const prevLogDate = new Date(sorted[i].logged_date!);
          prevLogDate.setHours(0,0,0,0);
          
          const stepDiff = (currentDate.getTime() - prevLogDate.getTime()) / (1000 * 60 * 60 * 24);
          if (stepDiff === 1) {
            streak++;
            currentDate = prevLogDate;
          } else if (stepDiff === 0) {
            // Same day log, ignore
            continue;
          } else {
            break; // Streak broken
          }
        }
      }
    }

    // Generate last 7 days history
    const last7Days = [];
    const dayLabels = [];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      dayLabels.push(dayNames[d.getDay()]);
      last7Days.push(sorted.some(m => m.logged_date === dateStr));
    }

    return { currentStreak: streak, history: last7Days, days: dayLabels };
  }, [metrics]);

  return (
    <div className="p-2 flex flex-col items-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="h-24 w-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex flex-col items-center justify-center text-foreground shadow-lg shadow-orange-500/30 relative z-10 border-4 border-white">
          <Flame className="h-8 w-8 mb-0.5 text-orange-100" />
          <span className="text-2xl font-bold leading-none">{currentStreak}</span>
        </div>
        
        {/* Dynamic Badge */}
        {currentStreak >= 7 && (
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1.5 shadow-md border-2 border-white z-20">
            <Medal className="h-4 w-4" />
          </div>
        )}
      </motion.div>
      
      <h3 className="font-medium text-foreground mb-1">
        {currentStreak >= 7 ? "7-Day Warrior!" : currentStreak > 0 ? "On Fire!" : "Start Your Streak"}
      </h3>
      <p className="text-[11px] text-muted-foreground mb-5 text-center px-4 leading-tight">
        You've tracked your health {currentStreak} consecutive days.
      </p>

      <div className="flex justify-between w-full px-2 gap-1.5">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${history[i] ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
              {history[i] ? <Flame className="h-3 w-3" /> : null}
            </div>
            <span className="text-[9px] font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
