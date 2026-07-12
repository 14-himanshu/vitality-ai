import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Metric } from '../../types';

export default function MacroPieChart({ latest, goals }: { latest: Metric, goals?: any }) {
  const data = [
    { name: 'Protein', value: latest?.protein || 0, color: '#10b981' },
    { name: 'Carbs', value: latest?.carbs || 0, color: '#3b82f6' },
    { name: 'Fats', value: latest?.fats || 0, color: '#f59e0b' },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  const GOAL_P = goals?.daily_protein || 150;
  const GOAL_C = goals?.daily_carbs || 200;
  const GOAL_F = goals?.daily_fats || 65;

  return (
    <div className="h-full flex flex-col p-2">
      <div className="flex-1 min-h-[140px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={total === 0 ? [{ value: 1, color: '#f1f5f9' }] : data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {total === 0 
                ? <Cell fill="#f1f5f9" /> 
                : data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-foreground">{total}g</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase">Macros</span>
        </div>
      </div>

      <div className="flex justify-between text-xs mt-2 px-2">
        {data.map(item => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
              <span className="font-semibold text-slate-600">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">
              {item.value}g <span className="text-[10px] text-muted-foreground font-normal">/ {item.name === 'Protein' ? GOAL_P : item.name === 'Carbs' ? GOAL_C : GOAL_F}g</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
