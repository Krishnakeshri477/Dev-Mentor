import apiClient from './apiClient';

export const uploadResume = async (formData) => {
  const response = await apiClient.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
