import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, Mail, Lock, Activity, Eye, EyeOff, 
  ArrowRight, HeartPulse, Flame, Scale, ShieldCheck, 
  Server, User as UserIcon, CheckCircle2, ChevronRight, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    // Validate only Step 1 fields before proceeding
    const isStep1Valid = await trigger(["name", "email"]);
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");
    try {
      await signup(data.email, data.password, data.name);
      navigate("/dashboard");
    } catch (error) {
      setAuthError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const reqs = [
    { label: "8+ characters", met: passwordValue.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "Number", met: /[0-9]/.test(passwordValue) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  return (
    <div className="min-h-screen relative bg-background overflow-hidden font-sans pt-20 pb-12 flex flex-col items-center">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 bg-slate-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-card rounded-2xl shadow-sm border border-border mb-6">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Join the Health Revolution.
          </h1>
          <p className="text-lg text-slate-600">
            Create an account to access your intelligent health dashboard, track your progress, and stay on top of your personalized fitness goals.
          </p>
        </motion.div>

        {/* DASHBOARD PREVIEW WIDGETS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full flex flex-wrap justify-center gap-4 md:gap-6 mb-16"
        >
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-border w-40 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <HeartPulse className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Heart Rate</p>
            <p className="text-xl font-medium text-foreground">72 <span className="text-sm font-medium text-muted-foreground">BPM</span></p>
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-border w-40 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <Scale className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">BMI</p>
            <p className="text-xl font-medium text-foreground">22.1 <span className="text-sm font-medium text-emerald-600">Healthy</span></p>
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-border w-40 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center mb-3">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Calories</p>
            <p className="text-xl font-medium text-foreground">1,850 <span className="text-sm font-medium text-muted-foreground">kcal</span></p>
          </div>
        </motion.div>

        {/* AUTHENTICATION PANEL (2-Step Form) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[440px] bg-card rounded-2xl p-8 sm:p-10 shadow-sm border border-border relative overflow-hidden"
        >


          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-foreground mb-2">Create Account</h2>
            
            {/* Animated Progress Indicator */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Step 1</span>
              </div>
              <div className="w-8 h-px bg-slate-200">
                <div className={`h-full bg-primary transition-all duration-500 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                <span className={`text-xs font-semibold ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Step 2</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 mb-5 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-3"
              >
                <Activity className="h-4 w-4 shrink-0" />
                {authError}
              </motion.div>
            )}

            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Personal Info */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 relative">
                      <Label htmlFor="name" className="text-foreground font-semibold text-sm">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register("name")}
                          className={`pl-11 h-12 rounded-xl bg-card/50 border-border focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.name ? "border-red-500 focus:ring-red-500/10" : ""}`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5 relative">
                      <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          {...register("email")}
                          className={`pl-11 h-12 rounded-xl bg-card/50 border-border focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.email ? "border-red-500 focus:ring-red-500/10" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                    </div>

                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="w-full h-12 rounded-xl text-base font-medium shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all mt-4"
                    >
                      Continue <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: Password */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 relative">
                      <Label htmlFor="password" className="text-foreground font-semibold text-sm">Create Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("password", {
                            onChange: (e) => setPasswordValue(e.target.value)
                          })}
                          className={`pl-11 pr-11 h-12 rounded-xl bg-card/50 border-border focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.password ? "border-red-500 focus:ring-red-500/10" : ""}`}
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-2 bg-background/50 p-3 rounded-xl border border-border">
                        {reqs.map((req, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium">
                            <CheckCircle2 className={`h-3.5 w-3.5 transition-colors duration-300 ${req.met ? "text-emerald-500" : "text-muted-foreground"}`} />
                            <span className={req.met ? "text-foreground" : "text-muted-foreground"}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5 relative">
                      <Label htmlFor="confirmPassword" className="text-foreground font-semibold text-sm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          {...register("confirmPassword")}
                          className={`pl-11 h-12 rounded-xl bg-card/50 border-border focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500/10" : ""}`}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={prevStep}
                        className="h-12 w-12 rounded-xl shrink-0 p-0"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl text-base font-medium shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Social Logins */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mt-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Or continue with</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-11 rounded-xl border-border bg-card hover:bg-background font-semibold gap-2 text-foreground">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-border bg-card hover:bg-background font-semibold gap-2 text-foreground">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.79 1.56 0 2.95.69 3.77 1.84-3.13 1.93-2.6 6.32.61 7.63-1.01 1.4-1.95 2.52-3.05 3.49zm-3.8-13.69c-.06-1.57.73-2.9 1.77-3.8-.93-1.48-2.6-1.74-3.15-1.77-.16 1.62.67 3.03 1.61 3.96.9.91 2.37 1.73 3.19 1.62-.23-.01-.42-.01-1.42 0z" />
                  </svg>
                  Apple
                </Button>
              </div>
            </motion.div>
          )}

          <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in &rarr;
            </Link>
          </div>
        </motion.div>

        {/* SECURITY & TRUST BADGES */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-4 text-muted-foreground text-xs font-medium"
        >
          <div className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> 256-bit Encryption
          </div>
          <div className="flex items-center gap-1.5 bg-card/50 px-3 py-1.5 rounded-full border border-border backdrop-blur-sm">
            <Server className="h-4 w-4 text-primary" /> 99.9% Uptime
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default SignUp;
