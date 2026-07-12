import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, Activity, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full left-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-border py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Vitality<span className="text-primary">.io</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          {user && <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>}
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full overflow-hidden relative">
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {!user ? (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-foreground hover:bg-muted/50 rounded-lg">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <Button variant="outline" className="font-semibold rounded-xl" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary">Home</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary">About</Link>
              {user && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex w-full items-center py-3 text-lg font-semibold hover:text-primary transition-colors border-b border-border/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/integrations" 
                    className="flex w-full items-center py-3 text-lg font-semibold hover:text-primary transition-colors border-b border-border/50 gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Activity className="h-5 w-5" /> Integrations
                  </Link>
                </>
              )}
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-primary">Contact</Link>
              <hr className="border-border my-2" />
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full h-12 rounded-lg text-lg font-medium" onClick={() => { setIsOpen(false); navigate('/login'); }}>Log in</Button>
                  <Button className="w-full h-12 rounded-lg text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" onClick={() => { setIsOpen(false); navigate('/signup'); }}>Start Free Trial</Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full h-12 rounded-lg text-lg font-medium" onClick={() => { setIsOpen(false); handleLogout(); }}>Sign Out</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
