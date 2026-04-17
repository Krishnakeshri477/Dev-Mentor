import Resume from '../models/Resume.js';
import { matchJobsWithResume, searchJobsOnWeb } from '../services/intelligenceService.js';

/**
 * @desc    Search live web for jobs and match them with user profile
 * @route   POST /api/intelligence/discover-real-jobs
 * @access  Private
 */
export const discoverRealJobs = async (req, res) => {
  try {
    const { experienceLevel, preferredLocation, jobTitle } = req.body;
    const userId = req.user._id;

    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestResume) {
      return res.status(404).json({ success: false, message: 'Upload resume first' });
    }

    // 1. Search live results
    const realJobs = await searchJobsOnWeb(latestResume, preferredLocation, experienceLevel, jobTitle);

    if (realJobs.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: { jobs: [], overallSummary: 'No live jobs found for the current search criteria.' } 
      });
    }

    // 2. Perform matching
    const matchingResults = await matchJobsWithResume({
      experienceLevel,
      preferredLocation,
      resume: latestResume,
      jobs: realJobs
    });

    res.status(200).json({
      success: true,
      data: matchingResults
    });

  } catch (error) {
    console.error('Discover Real Jobs Controller Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Live job discovery failed', 
      error: error.message 
    });
  }
};
