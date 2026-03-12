import React, { useState } from 'react';
import axios from 'axios';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card asymmetric className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-4xl text-foreground mb-2">Join Us</h2>
          <p className="text-muted-foreground font-sans">Secure your files with nature-inspired encryption.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <input 
            type="text" 
            placeholder="Username" 
            required
            className="w-full h-12 px-6 rounded-full border border-border bg-white/50 focus-visible:ring-2 ring-primary/30 outline-none transition-all font-sans text-foreground placeholder:text-muted-foreground"
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full h-12 px-6 rounded-full border border-border bg-white/50 focus-visible:ring-2 ring-primary/30 outline-none transition-all font-sans text-foreground placeholder:text-muted-foreground"
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <Button type="submit" className="w-full">Register Securely</Button>
        </form>
        
        <p 
          onClick={() => setView('login')} 
          className="mt-6 text-center text-primary font-sans cursor-pointer hover:underline underline-offset-4 decoration-primary/30 transition-all"
        >
          Already have an account? Login
        </p>
      </Card>
    </div>
  );
};

export default Register;