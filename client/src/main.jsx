import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("CEMS Frontend: Main.jsx is initializing...");

// Debugging helper for environment
console.log("Environment:", import.meta.env.PROD ? "Production" : "Development");

// Global error listener to catch crashes in Vercel
if (typeof window !== 'undefined') {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error("GLOBAL ERROR CAPTURED:", msg, error);
    // Optional: show alert for easier debugging on mobile/remote devices
    // alert("Runtime Error: " + msg);
    return false;
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
