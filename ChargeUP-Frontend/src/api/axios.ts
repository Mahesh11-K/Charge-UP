// src/api/axios.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
export const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ⚡ Request Interceptor: Dynamically attach Bearer Token to outgoing requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chargeup_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⚡ Response Interceptor: Global Error Handling & Token Expiration Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or unauthorized - clear local storage
      localStorage.removeItem('chargeup_token');
      localStorage.removeItem('chargeup_user');
      
      // Dispatch custom auth event if app is already running
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default API;
