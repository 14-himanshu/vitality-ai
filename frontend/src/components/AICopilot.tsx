import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Activity, Sparkles, User as UserIcon, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { useMetrics } from '../hooks/useMetrics';

export default function AICopilot() {
  const { refreshData } = useMetrics();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your Vitality Agent. You can ask me to log your daily calories, update your target weight, or just ask how you're doing!" }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMsg = input.trim();
    
    // Add user message to UI
    if (selectedImage) {
      setMessages(prev => [...prev, { role: 'user', text: userMsg || "Sent an image", image: selectedImage }]);
    } else {
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    }
    
    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/agent/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          command: userMsg,
          imageBase64: imageToSend
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.message, actionType: data.actionType, data: data.data }]);
        if (data.requiresRefresh) {
          await refreshData();
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I had trouble processing that command." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to the agent." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-foreground rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
          >
            <Sparkles className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-card rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.12)] border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-foreground">
                <div className="bg-card/20 p-2 rounded-xl backdrop-blur-sm">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Vitality Agent</h3>
                  <p className="text-[10px] text-blue-100 font-medium">Action-taking Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/70 hover:text-foreground transition-colors p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((msg: any, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-blue-200">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm flex flex-col gap-2 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : msg.actionType === 'EMERGENCY_TRIAGE'
                        ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-sm shadow-red-500/20'
                      : msg.actionType === 'LOG_METRIC'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-tl-sm'
                      : msg.actionType === 'FACT_CHECK'
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-tl-sm'
                      : 'bg-card border border-border text-foreground rounded-tl-sm'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="User upload" className="rounded-lg w-full object-cover max-h-48" />
                    )}
                    
                    {msg.actionType === 'EMERGENCY_TRIAGE' && (
                      <div className="flex items-center gap-2 font-medium text-red-700 mb-1 border-b border-red-200 pb-2">
                        <AlertTriangle className="h-5 w-5 animate-pulse" />
                        Medical Alert
                      </div>
                    )}
                    {msg.actionType === 'LOG_METRIC' && (
                      <div className="flex items-center gap-2 font-medium text-emerald-700 mb-1 border-b border-emerald-200 pb-2">
                        <CheckCircle className="h-5 w-5" />
                        Nutrition Logged
                      </div>
                    )}
                    {msg.actionType === 'FACT_CHECK' && (
                      <div className="flex items-center gap-2 font-medium text-indigo-700 mb-1 border-b border-indigo-200 pb-2">
                        <BookOpen className="h-5 w-5" />
                        Verified Source
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-blue-200">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border shrink-0">
              {selectedImage && (
                <div className="relative inline-block mb-2">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-border" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-foreground rounded-full p-0.5 shadow-sm hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10 shrink-0 bg-muted text-muted-foreground rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your health..."
                  className="w-full h-12 bg-muted rounded-full pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all border border-transparent focus:border-blue-200"
                />
                <button
                  type="submit"
                  disabled={!input.trim() && !selectedImage}
                  className="absolute right-1.5 h-9 w-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                >
                  <Send className="h-4 w-4 -ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
