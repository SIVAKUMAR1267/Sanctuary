// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- Import it here
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App component so EVERYTHING inside it can use routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);