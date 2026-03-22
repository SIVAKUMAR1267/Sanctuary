import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button'; 
import { Card } from '../ui/Card';
import api from '../api';

const Register = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!username.trim() || !password || !confirmPassword) {
      return setError("Please fill in all fields to build your sanctuary.");
    }

    if (!passwordRegex.test(password)) {
      return setError(
        "Password must be at least 8 characters long, and contain an uppercase letter, a lowercase letter, and a number."
      );
    }

    if (password !== confirmPassword) {
      return setError("Your passwords do not match. The keys must be identical.");
    }

    setIsLoading(true);
    try {
      const res = await api.post('/register', {
        username,
        password
      });
      
      alert(res.data.message); 
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      
      // Navigate to login or trigger prop
      if (onNavigateToLogin) {
        onNavigateToLogin();
      } else {
        navigate('/login');
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("The wind is blocked. Could not reach the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ADDED: pt-24 pb-4 and min-h-screen to clear the navigation bar!
    <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-4 relative overflow-hidden">
      
      {/* Ambient Wabi-Sabi Blobs to match Login */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] max-w-[500px] h-[500px] bg-secondary/10 rounded-blob-1 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] max-w-[500px] h-[500px] bg-primary/10 rounded-blob-2 blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-md p-8 md:p-10 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl text-foreground font-serif tracking-tight mb-3">Forge Your Key</h2>
          <p className="text-muted-foreground font-sans">Plant your roots in the sanctuary.</p>
        </div>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-primary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              placeholder="Choose a name..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-primary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              placeholder="Min 8 chars, 1 uppercase, 1 number..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-primary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              placeholder="Repeat your password..."
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-sans text-center">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full mt-2 shadow-soft" disabled={isLoading}>
            {isLoading ? "Forging..." : "Create Sanctuary"}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')} 
            className="text-primary font-sans font-bold text-sm hover:text-primary/80 transition-colors"
          >
            Already have roots? Enter here
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Register;