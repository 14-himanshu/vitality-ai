import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Scale, Flame, Check, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LogMetricsModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    weight: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: '',
    move_progress: '0.5',
    exercise_progress: '0.5',
    stand_progress: '0.5',
    hrv: '',
    resting_heart_rate: '',
    blood_pressure: '',
    blood_glucose: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClinical, setShowClinical] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      weight: parseFloat(formData.weight) || 0,
      protein: parseInt(formData.protein) || 0,
      carbs: parseInt(formData.carbs) || 0,
      fats: parseInt(formData.fats) || 0,
      calories: parseInt(formData.calories) || 0,
      move_progress: parseFloat(formData.move_progress),
      exercise_progress: parseFloat(formData.exercise_progress),
      stand_progress: parseFloat(formData.stand_progress),
      hrv: parseInt(formData.hrv) || null,
      resting_heart_rate: parseInt(formData.resting_heart_rate) || null,
      blood_pressure: formData.blood_pressure || null,
      blood_glucose: parseInt(formData.blood_glucose) || null,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card/40 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-[2rem] w-full max-w-lg shadow-2xl relative border border-border my-8"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-slate-600 transition-colors">
          <X className="h-6 w-6" />
        </button>

        <div className="p-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-medium text-foreground">Log Today's Data</h2>
          </div>
          <p className="text-muted-foreground text-sm">Keep your streak alive by logging your daily health metrics.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold flex items-center gap-2"><Scale className="h-4 w-4" /> Weight (kg)</Label>
                <Input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} required className="h-11 rounded-xl bg-background border-border" placeholder="e.g. 78.5" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold flex items-center gap-2"><Flame className="h-4 w-4" /> Calories (kcal)</Label>
                <Input type="number" name="calories" value={formData.calories} onChange={handleChange} required className="h-11 rounded-xl bg-background border-border" placeholder="e.g. 2100" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs text-center block text-primary">Protein (g)</Label>
                <Input type="number" name="protein" value={formData.protein} onChange={handleChange} required className="h-10 rounded-xl bg-background border-border text-center" placeholder="150" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs text-center block text-emerald-600">Carbs (g)</Label>
                <Input type="number" name="carbs" value={formData.carbs} onChange={handleChange} required className="h-10 rounded-xl bg-background border-border text-center" placeholder="200" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold text-xs text-center block text-amber-500">Fats (g)</Label>
                <Input type="number" name="fats" value={formData.fats} onChange={handleChange} required className="h-10 rounded-xl bg-background border-border text-center" placeholder="65" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
               <Label className="text-foreground font-semibold mb-3 block">Activity Rings Progress (0.0 to 1.0)</Label>
               <div className="grid grid-cols-3 gap-4">
                  <Input type="number" step="0.1" max="1" min="0" name="move_progress" value={formData.move_progress} onChange={handleChange} className="h-10 rounded-xl text-center border-red-200 bg-red-50 text-red-700" placeholder="Move" title="Move (Red)" />
                  <Input type="number" step="0.1" max="1" min="0" name="exercise_progress" value={formData.exercise_progress} onChange={handleChange} className="h-10 rounded-xl text-center border-green-200 bg-green-50 text-green-700" placeholder="Exercise" title="Exercise (Green)" />
                  <Input type="number" step="0.1" max="1" min="0" name="stand_progress" value={formData.stand_progress} onChange={handleChange} className="h-10 rounded-xl text-center border-blue-200 bg-blue-50 text-blue-700" placeholder="Stand" title="Stand (Blue)" />
               </div>
            </div>

            {/* Advanced Clinical Toggle */}
            <div className="pt-4">
              <button 
                type="button" 
                onClick={() => setShowClinical(!showClinical)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-background hover:bg-muted border border-border transition-colors text-foreground font-semibold text-sm"
              >
                <span className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-indigo-500" /> Advanced Clinical Metrics (Optional)</span>
                {showClinical ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              <AnimatePresence>
                {showClinical && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-xs">HRV (ms)</Label>
                        <Input type="number" name="hrv" value={formData.hrv} onChange={handleChange} className="h-10 rounded-lg bg-card" placeholder="e.g. 65" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-xs">Resting HR (bpm)</Label>
                        <Input type="number" name="resting_heart_rate" value={formData.resting_heart_rate} onChange={handleChange} className="h-10 rounded-lg bg-card" placeholder="e.g. 58" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-xs">Blood Pressure</Label>
                        <Input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} className="h-10 rounded-lg bg-card" placeholder="120/80" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-xs">Fasting Glucose (mg/dL)</Label>
                        <Input type="number" name="blood_glucose" value={formData.blood_glucose} onChange={handleChange} className="h-10 rounded-lg bg-card" placeholder="e.g. 90" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-4">
            {isSubmitting ? 'Saving...' : <><Check className="h-5 w-5" /> Save Today's Log</>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
