import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Activity, LineChart, Target, ShieldCheck, 
  Smartphone, Zap, ChevronDown, CheckCircle2, User, Star 
} from "lucide-react";
import BmiCalculator from "../components/BmiCalculator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// --- Custom Framer Motion Accordion ---
const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-border">
      <button 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-foreground">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    { icon: <Zap className="h-6 w-6 text-primary" />, title: "Instant BMI Calculation", desc: "Get real-time, clinically accurate BMI metrics the moment you slide the scales." },
    { icon: <LineChart className="h-6 w-6 text-primary" />, title: "Daily Progress Tracking", desc: "Log your weight, diet, and exercise daily. Watch your progress compound over time." },
    { icon: <Activity className="h-6 w-6 text-primary" />, title: "Calorie Estimator", desc: "Automatically calculate your required daily maintenance and deficit calories." },
    { icon: <Target className="h-6 w-6 text-primary" />, title: "Health Insights", desc: "Receive personalized, actionable advice based on your current health category." },
    { icon: <ShieldCheck className="h-6 w-6 text-primary" />, title: "Secure Data Storage", desc: "Your health data is encrypted and securely stored. Only you have access to it." },
    { icon: <Smartphone className="h-6 w-6 text-primary" />, title: "Responsive Dashboard", desc: "Access your metrics seamlessly across mobile, tablet, and desktop devices." }
  ];

  const faqs = [
    { q: "What is BMI?", a: "Body Mass Index (BMI) is a person's weight in kilograms divided by the square of height in meters. It is an inexpensive and easy screening method for weight category." },
    { q: "Is BMI accurate?", a: "BMI is a highly useful population-level indicator of body fatness. However, it may overestimate body fat in athletes and others who have a muscular build." },
    { q: "How often should I check my BMI?", a: "For general wellness tracking, checking your BMI once a week alongside your weight is sufficient to monitor long-term trends." },
    { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and secure authentication via Supabase to ensure your health data remains completely private." }
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Fitness Enthusiast", text: "This is hands down the cleanest, most professional health tracker I've ever used. The UI is gorgeous and it just works.", rating: 5 },
    { name: "Michael Chen", role: "Marathon Runner", text: "I love the dark mode and the absolute speed of the calculator. It's my daily driver for tracking my cut.", rating: 5 },
    { name: "Emma Thompson", role: "Yoga Instructor", text: "Simple, elegant, and secure. I recommend Vitality.io to all my clients who are just starting their wellness journey.", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 lg:pt-48 pb-20 px-4">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Copy & CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-sm font-medium text-primary">v2.0 Now Live</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                Master Your Health with <br/>
                <span className="text-primary">
                  Vitality.io
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                The most elegant, professional, and accurate way to calculate your Body Mass Index, track daily calories, and hit your fitness goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-border/50">
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 mt-4 pt-8 border-t border-border/50">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-foreground">50K+</span>
                  <span className="text-sm font-medium text-muted-foreground">Active Users</span>
                </div>
                <div className="w-px h-12 bg-border/50"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-foreground">98%</span>
                  <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                </div>
                <div className="w-px h-12 bg-border/50"></div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-2xl font-bold text-foreground"><CheckCircle2 className="h-6 w-6 text-primary"/> WHO</span>
                  <span className="text-sm font-medium text-muted-foreground">Standards</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Floating BMI Calculator */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <BmiCalculator />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. How It Works (Timeline) */}
      <section className="py-24 px-4 border-y border-border/30 bg-muted/20">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">Three simple steps to understanding and improving your physical health.</p>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 -z-10"></div>
            
            {[
              { step: 1, title: "Enter Metrics", desc: "Input your weight and height using our beautiful, interactive sliders." },
              { step: 2, title: "Instant Analysis", desc: "Our engine immediately calculates your BMI and classifies your health category." },
              { step: 3, title: "Track Progress", desc: "Save your results to your private dashboard and monitor your journey daily." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center bg-background p-8 rounded-3xl border border-border/50 shadow-sm relative"
              >
                <div className="h-16 w-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Premium Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to track your wellness, beautifully designed.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full p-8 rounded-2xl border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl w-fit mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics Section (Scroll Animated) */}
      <section className="py-24 px-4 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { num: "50K+", label: "Active Users" },
              { num: "1M+", label: "Calculations" },
              { num: "98%", label: "Satisfaction" },
              { num: "WHO", label: "Standards" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-5xl md:text-6xl font-extrabold text-primary"
                >
                  {stat.num}
                </motion.span>
                <span className="text-lg md:text-xl font-medium text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 px-4 bg-muted/10">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <Card key={i} className="p-8 rounded-3xl border-border/50 bg-background shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[...Array(test.rating)].map((_, j) => <Star key={j} className="h-5 w-5 fill-primary text-primary" />)}
                </div>
                <p className="text-lg font-medium leading-relaxed mb-8">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="border-t border-border">
          {faqs.map((faq, i) => (
            <AccordionItem 
              key={i} 
              title={faq.q} 
              content={faq.a} 
              isOpen={openFaq === i} 
              onClick={() => setOpenFaq(openFaq === i ? null : i)} 
            />
          ))}
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join 50,000+ users who have already taken control of their physical health.
          </p>
          <Button size="lg" className="h-16 px-10 text-xl font-semibold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link to="/signup">Create Your Free Account</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}

export default Home;
