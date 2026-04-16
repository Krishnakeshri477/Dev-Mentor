import apiClient from './apiClient';

export const discoverRealJobs = async (experienceLevel, preferredLocation) => {
  const response = await apiClient.post('/intelligence/discover-real-jobs', {
    experienceLevel,
    preferredLocation,
  });
  return response.data;
};
