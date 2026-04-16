import React, { useState, useEffect, useContext } from 'react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Target, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Zap,
  TrendingUp,
  Cpu,
  Globe,
  Star
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const JobPage = () => {
  const { token, user } = useContext(AuthContext);
  const [experience, setExperience] = useState('1-3 years');
  const [locationPreference, setLocationPreference] = useState('Remote');
  const [matchingResults, setMatchingResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiveJobs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/intelligence/discover-real-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experienceLevel: experience,
          preferredLocation: locationPreference
        })
      });

      const result = await response.json();
      if (result.success) {
        setMatchingResults(result.data);
      } else {
        setError(result.message || 'Live discovery failed');
      }
    } catch (err) {
      setError('Connection to intelligence engine failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    if (!token) return;
    setDiscovering(true);
    try {
      const response = await fetch('http://localhost:5000/api/intelligence/discover-real-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          experienceLevel: experience,
          preferredLocation: locationPreference
        })
      });

      const result = await response.json();
      if (result.success && result.data.jobs) {
        setMatchingResults(prev => ({
          ...prev,
          jobs: [...(prev?.jobs || []), ...result.data.jobs],
          overallSummary: result.data.overallSummary || prev?.overallSummary
        }));
      } else {
        console.warn('Live discovery returned no results');
      }
    } catch (err) {
      console.error('Discovery error:', err);
    } finally {
      setDiscovering(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLiveJobs();
    }
  }, [token]);

  const getProbabilityColor = (prob) => {
    if (prob >= 85) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (prob >= 40) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  if (loading && !matchingResults) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-lg tracking-wide">Searching Live Opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 dark:bg-[#0A0A0A] p-4 lg:p-8 transition-colors duration-200 scrollbar-hide">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            AI Talent Matcher <Target className="w-8 h-8 text-purple-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Predicting your fit across elite opportunities</p>
        </div>
        
        {/* Dynamic Inputs */}
        <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-[#111] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-purple-500/5">
          <div className="flex items-center gap-3 px-4 border-r border-gray-200 dark:border-gray-800">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Exp Level</span>
            <select 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)}
              className="bg-transparent font-black text-sm text-purple-500 focus:outline-none cursor-pointer hover:text-purple-400 transition-colors appearance-none"
            >
              <option value="Internship" className="bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100">Internship</option>
              <option value="1-3 years" className="bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100">1-3 Years</option>
              <option value="3-5 years" className="bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100">3-5 Years</option>
              <option value="5+ years" className="bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100">5+ Years</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 border-r border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target</span>
            <input 
              type="text" 
              value={locationPreference} 
              onChange={(e) => setLocationPreference(e.target.value)}
              placeholder="Location..."
              className="bg-transparent font-bold text-emerald-500 focus:outline-none w-24"
            />
          </div>
          <button 
            onClick={fetchLiveJobs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
            Refresh Search
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 font-medium">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Main Jobs Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-20">
        {matchingResults?.jobs?.map((job, idx) => {
          const score = job.matchScore || 0;
          const probability = job.shortlistProbability || 0;
          
          return (
            <div key={idx} className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden">
              {/* Score Background Glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                      {job.experienceRequired}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getProbabilityColor(probability)}`}>
                      {job.matchLevel || 'Pending'}
                    </span>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors uppercase tracking-tight leading-tight">
                      {job.jobTitle}
                    </h2>
                    <p className="text-gray-500 font-bold text-sm mt-1 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-gray-400" /> {job.companyName || job.company} <span className="text-gray-300 mx-1">|</span> <MapPin className="w-4 h-4 text-emerald-500/70" /> {job.location}
                    </p>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 italic">
                    {job.jobDescription}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-900" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke={score > 80 ? "#10b981" : score > 50 ? "#f59e0b" : "#6366f1"}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{score}%</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Match</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Probability</span>
                    <span className={`text-sm font-black ${probability >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{probability}%</span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-8 space-y-4 relative z-10">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <Cpu className="w-3 h-3" /> Core Skills Alignment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(job.requiredSkills || []).map((skill, i) => {
                    const isMissing = job.missingSkills?.includes(skill);
                    return (
                      <span key={i} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${isMissing ? 'bg-rose-500/5 text-rose-500 border-rose-500/10 grayscale' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'}`}>
                        {isMissing ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* AI Insight Overlay/Bottom */}
              {job.insight && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800/50 group-hover:border-purple-500/20 transition-all">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">AI Recommendation</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed">
                        {job.insight}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button 
                  onClick={() => window.open(job.applyUrl || '#', '_blank')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 active:scale-95 flex items-center gap-2 uppercase tracking-[0.2em]"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {(!matchingResults?.jobs || matchingResults.jobs.length === 0) && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-400" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active results matching your criteria</h3>
             <p className="text-gray-500 max-w-sm">Try adjusting your experience level or target location to find more live opportunities.</p>
          </div>
        )}
      </div>

      {/* show more button */}
      <div className="flex justify-center mt-8 mb-20">
        <button 
          onClick={handleShowMore}
          disabled={discovering || loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-[10px] font-black transition-all shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 active:scale-95 flex items-center gap-2 uppercase tracking-[0.2em] disabled:opacity-50"
        >
          {discovering ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Searching Live Web...
            </>
          ) : (
            <>
              Show More Live Jobs <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default JobPage;
