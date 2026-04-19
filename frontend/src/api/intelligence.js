import apiClient from './apiClient';

export const discoverRealJobs = async (experienceLevel, preferredLocation, jobTitle = '') => {
  const response = await apiClient.post('/api/intelligence/discover-real-jobs', {
    experienceLevel,
    preferredLocation,
    jobTitle,
  });
  return response.data;
};
