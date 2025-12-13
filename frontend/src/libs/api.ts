import axios from 'axios';

// Pega a URL do .env (VITE_API_URL) ou usa o localhost
// No seu .env deve estar: VITE_API_URL=http://localhost:8000/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Interceptor: Antes de cada requisição, coloca o Token no Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Opcional: Tratamento global de erros (ex: token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido.");
      // localStorage.removeItem('auth_token');
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);