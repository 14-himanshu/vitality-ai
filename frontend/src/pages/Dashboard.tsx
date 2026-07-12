import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
import { 
  Activity, Settings, Edit3, Check, Scale, 
  Flame, LayoutGrid, PlusCircle, Target 
} from "lucide-react";

import { Button } from "@/components/ui/button";

import ActivityRings from "../components/widgets/ActivityRings";
import StreaksWidget from "../components/widgets/StreaksWidget";
import WeightChart from "../components/widgets/WeightChart";
import MacroPieChart from "../components/widgets/MacroPieChart";
import ReadinessWidget from "../components/widgets/ReadinessWidget";
import AICopilot from "../components/AICopilot";
import LogMetricsModal from "../components/features/LogMetricsModal";
import GoalSettingsModal from "../components/features/GoalSettingsModal";

import { useMetrics } from "../hooks/useMetrics";

export default function Dashboard() {
  const { user } = useAuth();
  const { metrics, latest, goals, updateGoals, loading, logMetrics } = useMetrics();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Widget Configuration State for Drag and Drop
  const [widgets, setWidgets] = useState<any[]>([]);

  // Initialize widgets and respect saved order
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('widgetOrder') || 'null') || ['activity', 'streak', 'macros', 'weight', 'readiness'];
    
    const widgetMap: any = {
      activity: { id: 'activity', title: 'Activity Goals', component: <ActivityRings latest={latest} goals={goals} />, colSpan: 1 },
      streak: { id: 'streak', title: 'DB Streak Engine', component: <StreaksWidget metrics={metrics} />, colSpan: 1 },
      macros: { id: 'macros', title: 'Daily Macros', component: <MacroPieChart latest={latest} goals={goals} />, colSpan: 1 },
      readiness: { id: 'readiness', title: 'Readiness Score', component: <ReadinessWidget latest={latest} metrics={metrics} />, colSpan: 1 },
      weight: { id: 'weight', title: 'Weight History', component: <WeightChart metrics={metrics} />, colSpan: 2 }
    };
    
    // Build array based on saved order, ensuring all widgets exist
    const orderedWidgets = savedOrder.map((id: string) => widgetMap[id]).filter(Boolean);
    
    // Add any missing widgets that weren't in the saved order
    Object.keys(widgetMap).forEach(id => {
      if (!savedOrder.includes(id)) orderedWidgets.push(widgetMap[id]);
    });

    setWidgets(orderedWidgets);
  }, [metrics, latest, goals]);

  const handleReorder = (newWidgets: any[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('widgetOrder', JSON.stringify(newWidgets.map(w => w.id)));
  };

  const handleSaveLog = async (data) => {
    await logMetrics(data);
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-24 relative">
      {/* Header Banner */}
      <div className="bg-card text-foreground pt-24 pb-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-muted-foreground">Here's your health overview for today.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="h-10 bg-secondary border-border text-foreground hover:bg-secondary/80 font-semibold gap-2"
              onClick={() => setIsGoalModalOpen(true)}
            >
              <Target className="h-4 w-4" /> Goals
            </Button>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"} 
              className={`h-10 font-semibold gap-2 transition-colors ${
                isEditing 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary' 
                : 'bg-secondary border-border text-foreground hover:bg-secondary/80'
              }`}
            >
              {isEditing ? (
                <><Check className="h-4 w-4" /> Done Editing</>
              ) : (
                <><Edit3 className="h-4 w-4" /> Edit Layout</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        
        {/* Quick Stats Row (Live Data) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Current Weight', value: latest?.weight ? `${latest.weight} kg` : '-- kg', trend: 'Latest Log', icon: <Scale className="h-5 w-5 text-primary" /> },
            { label: 'Total Calories', value: latest?.calories ? `${latest.calories} kcal` : '-- kcal', trend: 'Consumed Today', icon: <Flame className="h-5 w-5 text-orange-500" /> },
            { label: 'Protein Int.', value: latest?.protein ? `${latest.protein} g` : '-- g', trend: 'Macros', icon: <Activity className="h-5 w-5 text-emerald-500" /> },
            { label: 'Total Logs', value: `${metrics.length} days`, trend: 'Active Streak', icon: <LayoutGrid className="h-5 w-5 text-purple-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-background p-2 rounded-xl">{stat.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Customizable Widget Grid */}
          <Reorder.Group 
            axis="y" 
            values={widgets} 
            onReorder={handleReorder} 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {widgets.map((widget) => (
              <Reorder.Item 
                key={widget.id} 
                value={widget} 
                drag={isEditing}
                className={`bg-card rounded-2xl shadow-sm border ${
                  isEditing 
                  ? 'border-primary border-dashed shadow-md cursor-grab active:cursor-grabbing origin-center' 
                  : 'border-border'
                } ${widget.colSpan === 3 ? 'md:col-span-3' : 'md:col-span-1'}`}
                whileDrag={{ scale: 1.02, zIndex: 50 }}
              >
                <div className={`p-5 flex justify-between items-center border-b ${isEditing ? 'border-primary/20 bg-primary/5 rounded-t-2xl' : 'border-border'}`}>
                  <h3 className="font-bold text-foreground">{widget.title}</h3>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">Drag to Move</span>
                    </div>
                  )}
                </div>
                <div className="p-4 h-[280px] flex items-center justify-center">
                  {widget.component}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        
        {/* Log Metrics Button (Always visible now to provide functionality) */}
        <div 
          onClick={() => setIsLogModalOpen(true)}
          className="mt-6 border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer bg-card group shadow-sm"
        >
          <div className="bg-card p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
             <PlusCircle className="h-8 w-8 text-primary" />
          </div>
          <span className="font-bold text-lg">Log Today's Data</span>
          <p className="text-sm text-muted-foreground mt-1">Keep your streak alive by adding new metrics</p>
        </div>

        {/* Modals */}
        <LogMetricsModal 
          isOpen={isLogModalOpen} 
          onClose={() => setIsLogModalOpen(false)} 
          onSave={handleSaveLog} 
        />
        
        <GoalSettingsModal 
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          currentGoals={goals}
          onSave={updateGoals}
        />
      </div>

      {/* Floating AI Copilot */}
      <AICopilot />
    </div>
  );
}
