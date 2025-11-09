// API Configuration
// Automatically uses the correct API URL based on environment

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '' // Use relative URLs in production (same domain)
    : 'http://localhost:5000'); // Use localhost in development

export { API_BASE_URL };
