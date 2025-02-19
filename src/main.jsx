import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Optional, for global styles if needed
import { AuthProvider } from './context/AuthContext';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  immediate: true, // Ensure it registers immediately
  onNeedRefresh() {
    if (confirm('New version available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('PWA is ready to work offline');
  },
});


// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
