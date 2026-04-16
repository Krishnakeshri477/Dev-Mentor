import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { analyzeResumeText } from '../services/groqService.js';
import Resume from '../models/Resume.js';
import imagekit from '../config/imagekit.js';
import path from 'path';

export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided.' });
    }

    const userId = req.user._id;
    const { originalname, mimetype, buffer } = req.file;

    // 1. Upload to ImageKit
    const uniqueFileName = `${Date.now()}-${originalname}`;
    const ikResponse = await imagekit.upload({
      file: buffer.toString('base64'),
      fileName: uniqueFileName,
      folder: 'devmentor/resumes',
    });

    const resumeUrl = ikResponse.url;
    let extractedText = '';
    let aiAnalysis = {
      atsScore: 0,
      skills: [],
      missingKeywords: [],
      suggestions: [],
      summary: 'Analysis currently supported only for text-rich PDF resumes.'
    };

    // 2. Parse PDF buffer into text (Only if it's a PDF)
    if (mimetype === 'application/pdf') {
      try {
        const data = await pdf(buffer);
        extractedText = data.text;

        if (extractedText && extractedText.trim() !== '') {
          // 3. Send extracted text to AI (Groq) for analysis
          aiAnalysis = await analyzeResumeText(extractedText);
        }
      } catch (parseError) {
        console.error('PDF Parsing Error:', parseError);
        // We still save the upload even if parsing fails
      }
    }

    // 4. Save results to the database
    const newResume = await Resume.create({
      userId,
      resumeUrl,
      fileName: originalname,
      fileType: mimetype,
      extractedText,
      atsScore: aiAnalysis.atsScore,
      skills: aiAnalysis.skills,
      missingKeywords: aiAnalysis.missingKeywords,
      suggestions: aiAnalysis.suggestions,
      summary: aiAnalysis.summary
    });

    // 5. Send successful response
    res.status(200).json({
      message: 'Resume uploaded and analyzed successfully',
      url: resumeUrl,
      document: newResume
    });

  } catch (error) {
    console.error('Resume Processing Error:', error);
    res.status(500).json({ message: 'Failed to process and upload resume.', error: error.message });
  }
};
