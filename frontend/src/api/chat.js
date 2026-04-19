import apiClient from './apiClient';

export const getChatHistory = async () => {
  const response = await apiClient.get('/api/chat/history');
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await apiClient.post('/api/chat/message', { message });
  return response.data;
};
