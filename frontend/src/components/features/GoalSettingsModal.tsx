import React, { useState, useEffect } from 'react';
import { X, Target, Save, Zap, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalSettingsModal({ isOpen, onClose, currentGoals, onSave }: { isOpen: boolean, onClose: () => void, currentGoals: any, onSave: (goals: any) => Promise<void> }) {
  const [formData, setFormData] = useState({
    target_weight: '',
    daily_calories: '2000',
    daily_protein: '150',
    daily_carbs: '200',
    daily_fats: '65'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentGoals) {
      setFormData({
        target_weight: currentGoals.target_weight || '',
        daily_calories: currentGoals.daily_calories?.toString() || '2000',
        daily_protein: currentGoals.daily_protein?.toString() || '150',
        daily_carbs: currentGoals.daily_carbs?.toString() || '200',
        daily_fats: currentGoals.daily_fats?.toString() || '65'
      });
    }
  }, [currentGoals, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await onSave({
      target_weight: parseFloat(formData.target_weight) || null,
      daily_calories: parseInt(formData.daily_calories, 10),
      daily_protein: parseInt(formData.daily_protein, 10),
      daily_carbs: parseInt(formData.daily_carbs, 10),
      daily_fats: parseInt(formData.daily_fats, 10),
    });
    
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-card/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
        >
          <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-medium text-indigo-950">Set Your Goals</h2>
            </div>
            <button onClick={onClose} className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-100/50">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Target Weight (kg)</label>
                <input 
                  type="number" step="0.1" 
                  value={formData.target_weight} onChange={e => setFormData({...formData, target_weight: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. 75.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1"><Zap className="h-4 w-4 text-rose-500"/> Daily Calories (kcal)</label>
                <input 
                  type="number" required
                  value={formData.daily_calories} onChange={e => setFormData({...formData, daily_calories: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Protein (g)</label>
                  <input 
                    type="number" required
                    value={formData.daily_protein} onChange={e => setFormData({...formData, daily_protein: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Carbs (g)</label>
                  <input 
                    type="number" required
                    value={formData.daily_carbs} onChange={e => setFormData({...formData, daily_carbs: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Fats (g)</label>
                  <input 
                    type="number" required
                    value={formData.daily_fats} onChange={e => setFormData({...formData, daily_fats: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

            </div>

            <div className="mt-8">
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="h-5 w-5" /> Save Goals</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
