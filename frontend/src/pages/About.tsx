import React from "react";
import { Activity, Shield, Zap, HeartPulse, BrainCircuit, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function About() {
  return (
    <div className="min-h-screen bg-background font-sans pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              <Activity className="h-4 w-4" /> The New Standard in Health Tech
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight">
              Pioneering Holistic <br/>
              <span className="text-indigo-600">Health Intelligence</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Vitality.io was born from a simple belief: your health data shouldn't be scattered across five different apps. We've built a clinical-grade platform that aggregates your biometrics, analyzes your trends using advanced AI, and provides actionable insights.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              From Heart Rate Variability (HRV) readiness scores to predictive weight forecasting, we give you the tools that professional athletes and physicians use, packaged in a beautiful, intuitive interface.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 px-8 rounded-xl shadow-sm">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col items-start gap-4">
              <div className="bg-rose-100 p-3 rounded-2xl">
                <HeartPulse className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-medium text-foreground">Clinical Metrics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track HRV, Resting Heart Rate, Fasting Glucose, and Blood Pressure with clinical precision.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col items-start gap-4 sm:-mt-6 sm:mb-6">
              <div className="bg-purple-100 p-3 rounded-2xl">
                <BrainCircuit className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium text-foreground">AI Forecasting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our linear regression models predict your weight trajectory based on your actual caloric intake and burn.
              </p>
            </div>

            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-medium text-foreground">Readiness Score</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Know exactly when to push hard and when to recover based on your daily biometrics and sleep data.
              </p>
            </div>

            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col items-start gap-4 sm:-mt-6 sm:mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-foreground">Privacy First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your health data is highly sensitive. We use state-of-the-art encryption to ensure your data is always yours.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default About;
