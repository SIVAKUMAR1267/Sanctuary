import React from 'react';
import axios from 'axios';
import { Cloud, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const StorageConnections = ({ token, isConnected, isLoading }) => {
  const handleConnectGoogle = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/google/url', {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.url;
    } catch (err) {
      alert("Failed to reach Google. The wind is currently blocked.");
    }
  };

  if (isLoading) return null;

  return (
    <Card className="mb-12 bg-[#FEFEFA] border-border/50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft transition-colors duration-500 ${isConnected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
            <Cloud size={28} />
          </div>
          <div>
            <h3 className="text-xl font-serif text-foreground">Google Drive</h3>
            <p className="text-sm font-sans text-muted-foreground mt-1">
              Your files will be encrypted locally and planted here.
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end">
          {isConnected ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-sans font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>Canopy Connected</span>
            </div>
          ) : (
            <Button onClick={handleConnectGoogle} className="w-full md:w-auto">
              Connect to Upload
            </Button>
          )}
        </div>

      </div>
    </Card>
  );
};

export default StorageConnections;