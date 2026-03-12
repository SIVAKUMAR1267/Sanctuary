import React, { useState } from 'react';
import { exportRecoveryKey, importRecoveryKey } from '../utils/encryption';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const KeyManager = ({ onKeysRestored }) => {
  const [seedInput, setSeedInput] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [copyText, setCopyText] = useState("Copy Sanctuary Seed");

  const handleCopySeed = () => {
    const seed = exportRecoveryKey();
    if (seed) {
      navigator.clipboard.writeText(seed);
      setCopyText("✨ Seed Copied!");
      setTimeout(() => setCopyText("Copy Sanctuary Seed"), 3000);
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
    <Card className="mb-12 bg-primary/5 !border-primary/20">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        
        <div className="flex-1">
          <h3 className="text-2xl font-serif text-foreground mb-2">Your Roots</h3>
          <p className="text-muted-foreground font-sans text-sm mb-4">
            If you clear your browser or change devices, you will lose access to your files. 
            Keep your Sanctuary Seed safe.
          </p>
          <Button variant="outline" size="sm" onClick={handleCopySeed}>
            {copyText}
          </Button>
        </div>

        <div className="hidden md:block w-px h-24 bg-border/50"></div>

        <div className="flex-1 w-full">
          {!isRestoring ? (
            <div className="text-center md:text-left">
              <p className="text-muted-foreground font-sans text-sm mb-4">
                Lost your local keys? Plant an old seed to restore access.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setIsRestoring(true)}>
                Restore from Seed
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Paste your Sanctuary Seed..." 
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="w-full h-10 px-4 rounded-full border border-border bg-white focus-visible:ring-2 ring-primary/30 outline-none transition-all font-sans text-sm text-foreground"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={handleRestore}>
                  Plant Seed
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsRestoring(false)}>
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