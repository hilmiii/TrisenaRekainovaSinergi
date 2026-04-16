import axios from 'axios';

export const base44 = axios.create({
  // Arahkan ke endpoint API Laravel Anda di Alwaysdata
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-trisena.alwaysdata.net/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Jika Anda menggunakan Sanctum untuk Auth, tambahkan interceptor untuk token
base44.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika Anda menggunakan Sanctum untuk Auth, tambahkan interceptor untuk token
base44.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});