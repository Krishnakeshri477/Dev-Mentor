import apiClient from './apiClient';

export const getChatHistory = async () => {
  const response = await apiClient.get('/chat/history');
  return response.data;
};

export const sendMessage = async (message) => {
  const response = await apiClient.post('/chat/message', { message });
  return response.data;
};
