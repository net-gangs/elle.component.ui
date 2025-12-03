import axios from 'axios';
import { toast } from 'sonner';

function getTokenFromCookie() {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 401) {
      document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
      window.location.href = '/login';
    } else {
      toast.error("Error", {
        description: message,
      });
    }

    return Promise.reject(error);
  }
);