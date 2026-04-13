import axios from 'axios';

export const base44 = axios.create({
  // Arahkan ke endpoint API Laravel Anda
  baseURL: 'http://127.0.0.1:8000/api', 
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