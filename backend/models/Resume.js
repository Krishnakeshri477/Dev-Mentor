import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: false,
    },
    atsScore: {
      type: Number,
      required: true,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
