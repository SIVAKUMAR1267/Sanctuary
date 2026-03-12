import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

// 1. We correctly accept onLoginSuccess here
const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. We use navigate to send users to the register page if they click the bottom link
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      
      // 3. We pass BOTH the token and username up to App.js
      onLoginSuccess(res.data.token, res.data.username);
      
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card asymmetric className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-4xl text-foreground font-serif tracking-tight mb-2">Welcome Back</h2>
          <p className="text-muted-foreground font-sans">Enter your secure sanctuary.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              required
              className="w-full h-12 px-6 rounded-full border border-border bg-white/50 focus-visible:ring-2 ring-primary/30 outline-none transition-all font-sans text-foreground placeholder:text-muted-foreground"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full h-12 px-6 rounded-full border border-border bg-white/50 focus-visible:ring-2 ring-primary/30 outline-none transition-all font-sans text-foreground placeholder:text-muted-foreground"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {error && (
            <p className="text-destructive font-sans text-sm text-center bg-destructive/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Unlocking...' : 'Enter Sanctuary'}
          </Button>
        </form>
        
        {/* 4. This is where navigate is used! */}
        <p 
          onClick={() => navigate('/register')} 
          className="mt-8 text-center text-primary font-sans cursor-pointer hover:underline underline-offset-4 decoration-primary/30 transition-all"
        >
          New to the sanctuary? Plant your roots here
        </p>
      </Card>
    </div>
  );
};

export default Login;