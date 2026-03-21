import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react'; // Adds a beautiful security icon
import api from '../api';

const ServerWakeup = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [statusText, setStatusText] = useState("Awakening the Sanctuary");
  const [dots, setDots] = useState("");

  // Creates a smooth "..." typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const wakeUpServer = async () => {
      try {
        await api.get('/ping');
        if (isMounted) setIsAwake(true);
      } catch (error) {
        if (isMounted) {
          setStatusText("Forging secure connections");
          setTimeout(wakeUpServer, 5000);
        }
      }
    };

    wakeUpServer();
    return () => { isMounted = false; };
  }, []);

  if (!isAwake) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* The Animated Shield & Rings */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-10 z-10">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-[spin_2s_linear_infinite]"></div>
          
          {/* Inner reverse-spinning ring */}
          <div className="absolute inset-3 rounded-full border-4 border-primary/40 border-b-primary animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Pulsing Center Icon */}
          <Shield className="w-10 h-10 text-primary animate-pulse" />
        </div>
        
        {/* Typography */}
        <div className="z-10 flex flex-col items-center">
          <h2 className="text-3xl font-serif text-foreground mb-4 w-full flex justify-center">
            <span className="inline-block w-[320px] text-left">
              {statusText}{dots}
            </span>
          </h2>
          <p className="text-muted-foreground font-sans max-w-md mx-auto leading-relaxed">
            Your secure relay is waking up from its dormant state. This eco-friendly boot process takes about 30 to 60 seconds. Thank you for your patience!
          </p>
        </div>

      </div>
    );
  }

  return children;
};

export default ServerWakeup;