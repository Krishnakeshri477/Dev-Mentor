import apiClient from './apiClient';

export const uploadResume = async (formData) => {
  const response = await apiClient.post('/api/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
