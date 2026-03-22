// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import ServerWakeup from './components/ServerWakeup';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const navigate = useNavigate(); 

  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => localStorage.getItem('authUser'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    navigate('/'); 
  };

  const handleLoginSuccess = (newToken, username) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', username);
    setToken(newToken);
    setUser(username);
    navigate('/dashboard'); 
  };

  // Guard 1: Protects the Dashboard from unauthenticated users
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Guard 2: Protects Login/Register pages from users who are already logged in
  const PublicRoute = ({ children }) => {
    if (token) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <ServerWakeup>
      {/* We removed pt-24 here earlier, and ensured bg-background covers the whole app */}
      <div className="min-h-screen relative overflow-x-hidden bg-background">
        
        <Navigation user={user} logout={handleLogout} />
        
        <div className="w-full">
          <Routes>
            <Route path="/" element={<div className="page-transition"><Home /></div>} />
            
            {/* Wrapped Login in PublicRoute */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <div className="page-transition">
                    <Login onLoginSuccess={handleLoginSuccess} />
                  </div>
                </PublicRoute>
              } 
            />
            
            {/* Wrapped Register in PublicRoute */}
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <div className="page-transition">
                    <Register />
                  </div>
                </PublicRoute>
              } 
            />
            
            {/* Dashboard remains wrapped in ProtectedRoute */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="page-transition">
                    <Dashboard token={token} user={user} logout={handleLogout} />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
      </div>
    </ServerWakeup>
  );
}

export default App;