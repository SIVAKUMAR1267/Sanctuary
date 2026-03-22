import React from 'react';
import { Cloud, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import api from '../api';

const StorageConnections = ({ token, isConnected, isLoading }) => {
  const handleConnectGoogle = async () => {
    try {
      const res = await api.get('/auth/google/url', {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Failed to reach Google. The wind is currently blocked.");
    }
  };

  if (isLoading) return null;

  return (
    // We removed the hardcoded background color so it inherits the Card's glassmorphism
    <Card className="mb-8 relative overflow-hidden group">
      {/* A subtle background gradient that changes when connected */}
      <div className={`absolute inset-0 opacity-[0.03] transition-colors duration-1000 pointer-events-none ${isConnected ? 'bg-primary' : 'bg-muted'}`}></div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* The icon container matches the design system perfectly */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-105 ${isConnected ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
            <Cloud size={28} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground tracking-tight">Google Drive Canopy</h3>
            <p className="text-sm font-sans text-muted-foreground mt-1 leading-relaxed">
              Your files will be encrypted locally and planted safely here.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-start md:justify-end">
          {isConnected ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm transition-transform hover:-translate-y-0.5">
              <CheckCircle2 size={18} />
              <span className="font-sans font-bold text-sm tracking-wide">Connected</span>
            </div>
          ) : (
            <Button onClick={handleConnectGoogle} className="w-full md:w-auto shadow-sm">
              Connect to Upload
            </Button>
          )}
        </div>

      </div>
    </Card>
  );
};

export default StorageConnections;