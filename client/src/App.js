// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  // It is now safe to use this because App is wrapped by BrowserRouter in index.js!
  const navigate = useNavigate(); 

  // Read from localStorage on initial load so refreshes don't log you out
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => localStorage.getItem('authUser'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    navigate('/'); // Glide smoothly back to the home page
  };

  const handleLoginSuccess = (newToken, username) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', username);
    setToken(newToken);
    setUser(username);
    navigate('/dashboard'); // Glide smoothly to the dashboard
  };

  // A helper component to protect the /dashboard route
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* The persistent navigation bar */}
      <Navigation user={user} logout={handleLogout} />
      
      {/* The content area */}
      <div className="pt-24">
        <Routes>
          <Route path="/" element={<div className="page-transition"><Home /></div>} />
          
          <Route 
            path="/login" 
            element={
              <div className="page-transition">
                {/* Match the new prop name we just created! */}
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            } 
          />
          
          <Route path="/register" element={<div className="page-transition"><Register /></div>} />
          
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
          
          {/* Catch-all route for typos: redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
    </div>
  );
}

export default App;