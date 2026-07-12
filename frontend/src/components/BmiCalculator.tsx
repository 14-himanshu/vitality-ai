import React, { useState, useEffect } from "react";
import { Calculator, Scale, User, RefreshCw, Activity, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

function BmiCalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Live BMI calculation for the UI
  const calculateLiveBMI = (w, h) => {
    if (w > 0 && h > 0) {
      const hMeters = h / 100;
      return parseFloat((w / (hMeters * hMeters)).toFixed(1));
    }
    return 0;
  };

  const currentLiveBmi = calculateLiveBMI(weight, height);

  const calculateBMI = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const bmiValue = calculateLiveBMI(weight, height);
      setBmi(bmiValue);

      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue >= 18.5 && bmiValue < 25) setCategory("Normal");
      else if (bmiValue >= 25 && bmiValue < 30) setCategory("Overweight");
      else setCategory("Obese");
      
      setIsCalculating(false);
    }, 600); // Fake delay for animation
  };

  const getBMIColorClass = (val) => {
    if (!val) return "text-muted-foreground";
    if (val < 18.5) return "text-yellow-500";
    if (val >= 18.5 && val < 25) return "text-green-500";
    if (val >= 25 && val < 30) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressValue = (val) => {
    if (!val) return 0;
    const minBmi = 15;
    const maxBmi = 40;
    let percentage = ((val - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const reset = () => {
    setWeight(70);
    setHeight(175);
    setBmi(null);
    setCategory("");
  };

  // Calculate healthy weight range based on current height
  const getHealthyRange = () => {
    const hMeters = height / 100;
    const minWeight = (18.5 * (hMeters * hMeters)).toFixed(1);
    const maxWeight = (24.9 * (hMeters * hMeters)).toFixed(1);
    return `${minWeight} - ${maxWeight} kg`;
  };

  return (
    <div className="flex items-center justify-center font-sans w-full max-w-2xl mx-auto relative z-10">
      
      {/* Background glowing blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none"></div>
      
      <Card className="w-full border-border/50 shadow-2xl shadow-primary/10 bg-background/60 backdrop-blur-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-b from-primary/10 to-transparent pb-8 pt-10 border-b border-border/50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto p-4 bg-primary rounded-2xl w-fit mb-6 shadow-xl shadow-primary/30"
          >
            <Activity className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <CardTitle className="text-3xl font-semibold tracking-tight">Health Calculator</CardTitle>
          <CardDescription className="text-base mt-2 text-muted-foreground/80 font-medium">Discover your body mass index and health category</CardDescription>
        </CardHeader>

        <CardContent className="p-8 md:p-10 space-y-10">
          
          <div className="space-y-10">
            {/* Weight Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label htmlFor="weight" className="flex items-center space-x-3 text-lg font-semibold text-foreground">
                  <div className="p-2 bg-muted rounded-lg"><Scale className="h-5 w-5 text-primary" /></div>
                  <span>Weight</span>
                </Label>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-3xl tracking-tighter text-primary">{weight}</span>
                  <span className="text-muted-foreground font-medium">kg</span>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary outline-none focus:ring-4 focus:ring-primary/20 transition-all"
              />
              <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                <span>30 kg</span>
                <span>150 kg</span>
              </div>
            </div>

            {/* Height Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Label htmlFor="height" className="flex items-center space-x-3 text-lg font-semibold text-foreground">
                  <div className="p-2 bg-muted rounded-lg"><User className="h-5 w-5 text-primary" /></div>
                  <span>Height</span>
                </Label>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-3xl tracking-tighter text-primary">{height}</span>
                  <span className="text-muted-foreground font-medium">cm</span>
                </div>
              </div>
              <input
                type="range"
                min="100"
                max="220"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary outline-none focus:ring-4 focus:ring-primary/20 transition-all"
              />
              <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                <span>100 cm</span>
                <span>220 cm</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={calculateBMI} 
              disabled={isCalculating}
              className="flex-1 font-medium text-lg h-14 rounded-xl shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
            >
              {isCalculating ? <RefreshCw className="animate-spin h-5 w-5 mr-2" /> : <Calculator className="h-5 w-5 mr-2" />}
              {isCalculating ? "Analyzing..." : "Calculate My BMI"}
            </Button>
            <Button variant="outline" onClick={reset} size="icon" className="h-14 w-14 shrink-0 rounded-xl border-border/50 hover:bg-muted/50">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Results Panel */}
          <AnimatePresence>
            {bmi && (
              <motion.div 
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-8 bg-background border border-border/50 rounded-2xl shadow-inner relative overflow-hidden">
                  
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-green-500 to-red-500 opacity-20"></div>

                  <div className="text-center space-y-4 relative z-10">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                      <HeartPulse className="h-4 w-4" /> Result Analysis
                    </p>
                    
                    <div className="flex items-center justify-center py-2">
                      <span className={`text-7xl font-bold tracking-tighter ${getBMIColorClass(bmi)} drop-shadow-md`}>
                        {bmi}
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className={`inline-flex items-center justify-center mx-auto px-4 py-1.5 rounded-full text-sm font-medium bg-muted/50 border ${getBMIColorClass(bmi)}`}>
                        Category: {category}
                      </div>
                      
                      <div className="w-full max-w-sm mx-auto mt-4">
                        <Progress value={getProgressValue(bmi)} className="h-4 rounded-full bg-secondary shadow-inner" />
                        <div className="flex justify-between mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          <span>15</span>
                          <span>25</span>
                          <span>40</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ideal Weight</p>
                      <p className="text-lg font-medium text-foreground">{getHealthyRange()}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-center">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                      <p className={`text-lg font-medium ${getBMIColorClass(bmi)}`}>{category}</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default BmiCalculator;
