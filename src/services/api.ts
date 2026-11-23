import axios from 'axios';

export const API_BASE_URL = 'https://ecommerce.routemisr.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests if available in localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.token = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
