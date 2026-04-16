import Resume from '../models/Resume.js';
import Interaction from '../models/Interaction.js';
import { generateCareerIntelligence } from '../services/intelligenceService.js';

export const getDashboardAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch latest Resume and History
    const resumes = await Resume.find({ userId }).sort({ createdAt: 1 });
    const latestResume = resumes.length > 0 ? resumes[resumes.length - 1] : null;

    // 2. Fetch all Interactions
    const interactions = await Interaction.find({ userId }).sort({ createdAt: -1 }).limit(20);

    // 3. Generate Intelligence Report via Groq
    const intelligence = await generateCareerIntelligence({
      user: req.user,
      resume: latestResume,
      interactions
    });

    res.status(200).json({
      success: true,
      data: {
        ...intelligence,
        resumeHistory: resumes.map(r => ({
          date: r.createdAt,
          score: r.atsScore
        })),
        recentInteractions: interactions.slice(0, 5).map(i => ({
          query: i.query,
          date: i.createdAt
        }))
      },
      metadata: {
        lastResumeDate: latestResume?.createdAt || null,
        totalInteractions: await Interaction.countDocuments({ userId })
      }
    });

  } catch (error) {
    console.error('Dashboard Controller Error:', error);
    res.status(500).json({ message: 'Failed to generate dashboard intelligence', error: error.message });
  }
};
