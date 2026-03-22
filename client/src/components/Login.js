import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import api from '../api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await api.post('/login', formData);
      onLoginSuccess(res.data.token, res.data.username);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pt-24 pb-4 relative overflow-hidden">
      
      {/* Ambient Wabi-Sabi Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] max-w-[500px] h-[500px] bg-primary/10 rounded-blob-1 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] max-w-[500px] h-[500px] bg-secondary/10 rounded-blob-2 blur-[100px] pointer-events-none"></div>

      <Card asymmetric className="w-full max-w-md p-8 md:p-10 relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl text-foreground font-serif tracking-tight mb-3">Welcome Back</h2>
          <p className="text-muted-foreground font-sans">Enter your secure sanctuary.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Username</label>
            <input 
              type="text" 
              placeholder="Your name..." 
              required
              className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-primary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-4">Password</label>
            <input 
              type="password" 
              placeholder="Your key..." 
              required
              className="w-full h-12 px-6 rounded-full border-2 border-border/50 bg-white/50 focus:border-primary focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-inner"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-sans text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-4 shadow-soft" disabled={isLoading}>
            {isLoading ? 'Unlocking...' : 'Enter Sanctuary'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary font-sans font-bold text-sm hover:text-primary/80 transition-colors"
          >
            New to the sanctuary? Plant your roots here
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;