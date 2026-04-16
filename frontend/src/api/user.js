import apiClient from './apiClient';

export const updateProfile = async (updates) => {
  const response = await apiClient.put('/auth/profile', updates);
  return response.data;
};

export const uploadAvatar = async (formData) => {
  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
