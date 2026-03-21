import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button'; 
import { Card } from '../ui/Card';

const Register = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // NEW STATE
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // --- 1. FRONTEND VALIDATION ---
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!username.trim() || !password || !confirmPassword) {
      return setError("Please fill in all fields to build your sanctuary.");
    }

    if (!passwordRegex.test(password)) {
      return setError(
        "Password must be at least 8 characters long, and contain an uppercase letter, a lowercase letter, and a number."
      );
    }

    // NEW: Check if the keys match exactly
    if (password !== confirmPassword) {
      return setError("Your passwords do not match. The keys must be identical.");
    }

    // --- 2. BACKEND SUBMISSION ---
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/register', {
        username,
        password
      });
      
      alert(res.data.message); 
      setUsername('');
      setPassword('');
      setConfirmPassword(''); // Clear the new field
      if (onNavigateToLogin) onNavigateToLogin();

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
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-serif text-foreground mb-6 text-center">Forge Your Key</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-border bg-muted/20 focus:border-primary focus:outline-none transition-colors"
              placeholder="Choose a name..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-border bg-muted/20 focus:border-primary focus:outline-none transition-colors"
              placeholder="Min 8 chars, 1 uppercase, 1 number..."
            />
          </div>

          {/* NEW: Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-border bg-muted/20 focus:border-primary focus:outline-none transition-colors"
              placeholder="Repeat your password..."
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Forging..." : "Create Sanctuary"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Register;