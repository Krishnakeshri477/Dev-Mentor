import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, Target, Search, Zap, Award, AlertCircle, ChevronRight, RefreshCcw, Sparkles, MessageSquare, History, CheckCircle2, XCircle, PieChart as PieChartIcon } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getDashboardAnalysis } from '../api/dashboard';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await getDashboardAnalysis();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Connection to intelligence engine failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse text-lg tracking-wide">Syncing Career Intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] p-10 text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Intelligence Engine Offline</h2>
        <p className="text-gray-500 max-w-md mb-8">{error}</p>
        <button 
          onClick={fetchAnalysis} 
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg"
        >
          <RefreshCcw className="w-4 h-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const chartData = data?.resumeHistory?.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score
  })) || [];

  const hasData = data && (data.atsScore > 0 || chartData.length > 0);

  if (!hasData && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0A0A0A] p-10 text-center">
        <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
          <Target className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Initialize Your Intelligence</h2>
        <p className="text-gray-500 max-w-md mb-8">Upload your first resume or start a chat session to generate your AI career roadmap and see real analytics.</p>
        <div className="flex gap-4">
          <button onClick={() => window.location.href = '/resume'} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30">Upload Resume</button>
          <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl font-bold">Start Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-50 dark:bg-[#0A0A0A] p-4 lg:p-8 transition-colors duration-200 scrollbar-hide">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            Career Dashboard <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Real-time resume & interaction intelligence</p>
        </div>
        <button onClick={fetchAnalysis} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold text-sm">
          <RefreshCcw className="w-4 h-4" /> Sync Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">

        {/* 2. ATS Score Card (Highlight) */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm transition-all hover:shadow-purple-500/5">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <h3 className="text-gray-400 font-bold mb-6 text-xs uppercase tracking-[0.2em]">ATS Master Score</h3>
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-900" />
              <circle
                cx="80" cy="80" r="70"
                stroke="url(#dash_grad_hi)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="439.8"
                strokeDashoffset={439.8 - (439.8 * (data?.atsScore || 0)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="dash_grad_hi" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">{data?.atsScore}</span>
              <span className="text-[10px] font-bold text-purple-500 tracking-widest uppercase mt-0 sm:mt-1">Ready</span>
            </div>
          </div>
        </div>

        {/* 3. Skills + Missing Skills */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="space-y-4">
              <h3 className="text-emerald-500 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Detected Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(data?.skills || []).map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-xl text-xs font-bold uppercase tracking-wider">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-rose-500 text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <XCircle className="w-4 h-4" /> Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2 text-gray-400">
                {data?.weakAreas?.filter(w => !data.skills.includes(w)).slice(0, 6).map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-500/5 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-xl text-xs font-bold uppercase tracking-wider">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Resume Insights (AI Summary + Suggestions) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm group">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-6">
            <TrendingUp className="w-5 h-5 text-purple-500" /> Resume Intelligence
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">"{data?.userSummary}"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.actionPlan?.slice(0, 2).map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Weakness Analysis (from interactions) */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-900 dark:text-white">
            <AlertCircle className="w-5 h-5 text-rose-500" /> Coaching Gaps
          </h3>
          <div className="space-y-4">
            {data?.weakAreas?.slice(0, 4).map((weak, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wide">{weak}</span>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${40 + i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Progress Chart (Improvement over time) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <History className="w-5 h-5 text-purple-500" /> Improvement Vector
            </h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-500 text-[10px] font-bold">ATS TREND</span>
            </div>
          </div>
          <div className="h-48 w-full">
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#222' : '#eee'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} dy={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#000' : '#fff', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm font-medium border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                Insufficient history to plot trend.
              </div>
            )}
          </div>
        </div>

        {/* 7. Recent AI Conversations */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-6">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> Recent Sessions
          </h3>
          <div className="space-y-4">
            {data?.recentInteractions?.length > 0 ? data.recentInteractions.map((session, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-transparent hover:border-purple-500/20 transition-all cursor-pointer group">
                <span className="text-xs font-bold text-gray-400">{new Date(session.date).toLocaleDateString()}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate w-full group-hover:text-purple-400 transition-colors">{session.query}</span>
              </div>
            )) : (
              <p className="text-xs text-gray-500 italic">No recent sessions found.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
