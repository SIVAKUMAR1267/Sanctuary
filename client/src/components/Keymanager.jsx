import React, { useState } from 'react';
import { KeyRound, Copy, RefreshCcw, Check } from 'lucide-react';
import { exportRecoveryKey, importRecoveryKey } from '../utils/encryption';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const KeyManager = ({ onKeysRestored }) => {
  const [seedInput, setSeedInput] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySeed = () => {
    const seed = exportRecoveryKey();
    if (seed) {
      navigator.clipboard.writeText(seed);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleRestore = () => {
    if (!seedInput.trim()) return;
    
    const success = importRecoveryKey(seedInput.trim());
    if (success) {
      alert("✨ Sanctuary restored successfully. Your old memories are unlocked.");
      setSeedInput("");
      setIsRestoring(false);
      if (onKeysRestored) onKeysRestored();
    } else {
      alert("❌ This seed is invalid or withered. Please check it and try again.");
    }
  };

  return (
    <Card className="mb-12 relative overflow-hidden group border-secondary/20 bg-secondary/5">
      {/* Ambient Terracotta Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-blob-2 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:scale-110"></div>
      
      <div className="flex flex-col md:flex-row gap-10 items-start md:items-center justify-between relative z-10">
        
        {/* Left Side: Copy Seed */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-[2rem] bg-secondary/20 text-secondary flex items-center justify-center shadow-sm">
              <KeyRound size={24} />
            </div>
            <h3 className="text-3xl font-serif text-foreground tracking-tight">Your Roots</h3>
          </div>
          
          <p className="text-muted-foreground font-sans text-base leading-relaxed mb-6 max-w-sm">
            If you clear your browser or change devices, you will lose access to your files. Keep your Sanctuary Seed safe.
          </p>
          
          <Button 
            variant={copied ? "primary" : "outline"} 
            className={`shadow-sm transition-all duration-300 ${!copied && '!border-secondary !text-secondary hover:!bg-secondary/10'}`}
            onClick={handleCopySeed}
          >
            {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
            {copied ? "Seed Copied Safely" : "Copy Sanctuary Seed"}
          </Button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-32 bg-border/60"></div>

        {/* Right Side: Restore */}
        <div className="flex-1 w-full">
          {!isRestoring ? (
            <div className="text-center md:text-left p-6 md:p-0 rounded-3xl md:rounded-none bg-white/40 md:bg-transparent border md:border-transparent border-border/50">
              <h4 className="font-serif text-2xl text-foreground mb-3">Withered Connection?</h4>
              <p className="text-muted-foreground font-sans text-base leading-relaxed mb-6">
                Lost your local keys? Plant an old seed to restore access to your encrypted memories.
              </p>
              <Button variant="ghost" onClick={() => setIsRestoring(true)} className="!text-foreground hover:!bg-white/60 shadow-sm md:shadow-none">
                <RefreshCcw size={18} className="mr-2" />
                Restore from Seed
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-6 rounded-[2rem] bg-white/60 backdrop-blur-sm border border-border/50 shadow-sm transition-all duration-500">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">
                Enter Your Seed
              </label>
              <input 
                type="text" 
                placeholder="Paste your Sanctuary Seed..." 
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-secondary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              />
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 shadow-soft bg-secondary text-white hover:bg-secondary/90 hover:shadow-float" onClick={handleRestore}>
                  Plant Seed
                </Button>
                <Button variant="ghost" onClick={() => setIsRestoring(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
};

export default KeyManager;