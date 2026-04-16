import React, { useState, useRef, useContext } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Lightbulb, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ResumePage = ({ onRequiresLogin }) => {
  const { user, token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Supported formats: PDF, JPG, PNG');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size should not exceed 10MB.');
      return;
    }
    setFile(selectedFile);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!user) {
      onRequiresLogin && onRequiresLogin();
      return;
    }

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze resume');
      }

      setResults(data.document);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 dark:bg-[#0A0A0A] p-8 transition-colors duration-200">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Resume AI Analysis</h1>
          <p className="text-gray-500 mt-2">Upload your resume and let our cutting-edge AI extract skills, calculate ATS score, and suggest improvements.</p>
        </div>

        {/* Upload Section */}
        <div 
          className={`relative w-full rounded-2xl border-2 border-dashed p-12 transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden
            ${isDragActive 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-gray-300 dark:border-gray-800 bg-white dark:bg-[#111] hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-[#151515]'
            }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Background Gradient Blob */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>

          <UploadCloud className={`w-16 h-16 mb-4 ${isDragActive ? 'text-purple-500' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold mb-2">Drag & Drop your resume</h3>
          <p className="text-gray-500 mb-6 font-medium text-sm">PDF, JPG, or PNG (Max 10MB)</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleChange} 
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden" 
          />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            Browse Files
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Selected File & Action */}
        {file && !results && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white truncate max-w-sm">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 transition-all ${
                isAnalyzing ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/50 hover:-translate-y-0.5'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : 'Analyze Resume'}
            </button>
          </div>
        )}

        {/* Results UI */}
        {results && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Top Row: Score & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ATS Score Card */}
              <div className="col-span-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-lg shadow-black/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                <h3 className="text-gray-500 font-medium mb-4 z-10 text-lg">ATS Match Score</h3>
                <div className="relative w-36 h-36 flex items-center justify-center z-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-gray-800" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="url(#gradient)" 
                      strokeWidth="12" 
                      fill="transparent" 
                      strokeDasharray="376.99" 
                      strokeDashoffset={376.99 - (376.99 * results.atsScore) / 100} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{results.atsScore}</span>
                    <span className="text-sm text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-lg shadow-black/5 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-purple-500" /> 
                  Professional Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{results.summary}</p>
              </div>

            </div>

             {/* Bottom Row: Skills, Missing, Suggestions */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Verified Skills */}
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg shadow-black/5">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-500/20">
                      {skill}
                    </span>
                  ))}
                  {results.skills.length === 0 && <p className="text-gray-500">No skills identified.</p>}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg shadow-black/5">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium transition-colors hover:bg-rose-500/20">
                      {kw}
                    </span>
                  ))}
                   {results.missingKeywords.length === 0 && <p className="text-gray-500">Great job! No major keywords missing.</p>}
                </div>
              </div>

            </div>

            {/* Suggestions */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-lg shadow-black/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <Lightbulb className="w-6 h-6 text-amber-500" />
                Improvement Suggestions
              </h3>
              <ul className="space-y-4">
                {results.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-[#151515] rounded-xl border border-gray-100 dark:border-gray-800/50">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{suggestion}</p>
                  </li>
                ))}
                {results.suggestions.length === 0 && <p className="text-gray-500">Your resume looks perfect!</p>}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 pb-12">
              <button 
                onClick={() => {
                  setFile(null);
                  setResults(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                Analyze Another Resume
              </button>
            </div>

          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default ResumePage;
