import apiClient from './apiClient';

export const getDashboardAnalysis = async () => {
  const response = await apiClient.get('/dashboard/analysis');
  return response.data;
};
