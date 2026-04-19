import apiClient from './apiClient';

export const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await apiClient.post('/api/auth/register', { name, email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/api/auth/profile');
  return response.data;
};

export const redirectToGoogleAuth = () => {
  const baseUrl = import.meta.env.VITE_API_URL.endsWith('/') 
    ? import.meta.env.VITE_API_URL.slice(0, -1) 
    : import.meta.env.VITE_API_URL;
  window.location.href = `${baseUrl}/api/auth/google`;
};
