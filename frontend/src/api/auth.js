import apiClient from './apiClient';

export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};
