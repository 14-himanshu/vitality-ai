import React from "react";
import { Link } from "react-router-dom";
import { Activity, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Vitality<span className="text-primary">.io</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Your intelligent companion for tracking body mass index, daily habits, and achieving a healthier lifestyle.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 lg:ml-12">
            <h3 className="font-semibold text-lg text-foreground mb-2">Quick Links</h3>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">Resources</h3>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Health Blog</Link>
            <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          </div>

          {/* Newsletter / Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">Stay Updated</h3>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest health tips.</p>
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button size="icon" className="shrink-0 bg-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Vitality.io Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for a healthier world</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
