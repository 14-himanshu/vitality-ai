import React from 'react';
import { Target, Zap, Activity as ActivityIcon } from 'lucide-react';
import { Metric } from '../../types';

export default function ActivityRings({ latest, goals }: { latest: Metric, goals?: any }) {
  const calories = latest?.calories || 0;
  const protein = latest?.protein || 0;
  const hrv = latest?.hrv || 0;

  // Use dynamic goals if available, else default
  const CALORIE_GOAL = goals?.daily_calories || 2000;
  const PROTEIN_GOAL = goals?.daily_protein || 150;
  const HRV_GOAL = 60; // HRV is generally static optimal >60ms

  const caloriePercent = Math.min((calories / CALORIE_GOAL) * 100, 100);
  const proteinPercent = Math.min((protein / PROTEIN_GOAL) * 100, 100);
  const hrvPercent = Math.min((hrv / HRV_GOAL) * 100, 100);

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const getOffset = (percent: number) => circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col h-full justify-between p-2">
      <div className="flex justify-center relative h-[180px] w-full items-center">
        <svg className="w-[180px] h-[180px] -rotate-90 transform">
          {/* Base Rings */}
          <circle cx="90" cy="90" r="75" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-rose-100 dark:text-foreground" />
          <circle cx="90" cy="90" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-100 dark:text-foreground" />
          <circle cx="90" cy="90" r="35" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-sky-100 dark:text-foreground" />
          
          {/* Progress Rings */}
          <circle cx="90" cy="90" r="75" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 75} strokeDashoffset={(2 * Math.PI * 75) - (caloriePercent/100) * (2 * Math.PI * 75)} strokeLinecap="round" className="text-rose-500 transition-all duration-1000" />
          <circle cx="90" cy="90" r="55" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 55} strokeDashoffset={(2 * Math.PI * 55) - (proteinPercent/100) * (2 * Math.PI * 55)} strokeLinecap="round" className="text-emerald-500 transition-all duration-1000 delay-100" />
          <circle cx="90" cy="90" r="35" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={getOffset(hrvPercent)} strokeLinecap="round" className="text-sky-500 transition-all duration-1000 delay-200" />
        </svg>
      </div>

      <div className="flex justify-between px-2 w-full mt-4">
        <div className="text-center">
          <div className="flex justify-center"><Zap className="h-4 w-4 text-rose-500" /></div>
          <div className="font-medium text-foreground mt-1">{calories}</div>
          <div className="text-[10px] text-muted-foreground">/{CALORIE_GOAL} kcal</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center"><Target className="h-4 w-4 text-emerald-500" /></div>
          <div className="font-medium text-foreground mt-1">{protein}g</div>
          <div className="text-[10px] text-muted-foreground">/{PROTEIN_GOAL}g Pro</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center"><ActivityIcon className="h-4 w-4 text-sky-500" /></div>
          <div className="font-medium text-foreground mt-1">{hrv}</div>
          <div className="text-[10px] text-muted-foreground">ms HRV</div>
        </div>
      </div>
    </div>
  );
}
