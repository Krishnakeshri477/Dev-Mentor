import React, { useState, useContext, useRef, useEffect } from 'react';
import { Pencil, Sparkles, Moon, Sun, Monitor, Bell, Mail, Loader2, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, uploadAvatar } from '../api/user';

const SettingsPage = () => {
  const { user, token, setUser, logout } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleProfileUpdate = async (updates) => {
    try {
      const data = await updateProfile(updates);
      setUser({ isLoggedIn: true, ...data });
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadData = await uploadAvatar(formData);

      if (uploadData.url) {
        await handleProfileUpdate({ photoUrl: uploadData.url });
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0b0b0e] transition-colors duration-200 h-screen overflow-y-auto px-4 sm:px-8 py-6 sm:py-10 font-sans text-gray-900 dark:text-gray-200 scrollbar-hide">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-200">Settings</h1>
          <div className="flex items-center gap-2 bg-[#0d161a] border border-[#16333c] text-[#4dbacc] px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            <div className="w-1.5 h-1.5 bg-[#4dbacc] rounded-full"></div>
            SYSTEM STABLE
          </div>
        </div>

        {/* Profile Information */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">Profile Information</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 transition-colors">Update your personal details and how others see you.</p>
          <div className="bg-white dark:bg-[#101014] border border-gray-200 dark:border-[#1a1a24] shadow-sm dark:shadow-none transition-colors rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-gray-700 bg-gray-800">
                {isUploading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                  </div>
                ) : (
                  <img src={user?.photoUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Guest'}`} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#a87ffb] rounded-full flex items-center justify-center shadow-lg border-2 border-[#101014] hover:bg-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Pencil className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="w-full bg-gray-50 dark:bg-[#0a0a0d] border border-gray-200 dark:border-[#1a1a24] text-gray-500 dark:text-gray-200 transition-colors rounded-lg px-4 py-3 text-sm cursor-not-allowed">
                  {user?.name || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="w-full bg-gray-50 dark:bg-[#0a0a0d] border border-gray-200 dark:border-[#1a1a24] text-gray-500 dark:text-gray-200 transition-colors rounded-lg px-4 py-3 text-sm cursor-not-allowed">
                  {user?.email || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage & Subscription */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">Usage & Subscription</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 transition-colors">Manage your credits and plan details.</p>

          <div className="bg-white dark:bg-[#101014] border border-gray-200 dark:border-[#1a1a24] shadow-sm dark:shadow-none transition-colors rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#4dbacc]" />
              <span className="text-xs font-bold text-[#4dbacc] tracking-widest uppercase">Premium Insights</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white transition-colors tracking-tight">1,200</span>
                <span className="text-sm text-gray-500 font-medium">/ 5,000 credits</span>
              </div>
              <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1c24] dark:hover:bg-[#252530] text-gray-900 dark:text-gray-200 text-sm font-medium py-2 px-4 rounded-lg transition border border-gray-200 dark:border-[#2a2a35]">
                Upgrade Plan
              </button>
            </div>

            <div className="w-full h-2 bg-[#1a1a24] rounded-full mb-3 overflow-hidden">
              <div className="h-full w-[24%] bg-gradient-to-r from-[#4dbacc] to-[#a87ffb] rounded-full"></div>
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>24% of monthly quota used</span>
              <span>Resets in 12 days</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">Preferences</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 transition-colors">Customize your visual and notification experience.</p>

          <div className="bg-white dark:bg-[#101014] border border-gray-200 dark:border-[#1a1a24] shadow-sm dark:shadow-none transition-colors rounded-2xl overflow-hidden divide-y divide-gray-200 dark:divide-[#1a1a24]">
            {/* Interface Theme */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-[#1a1a24] transition-colors flex items-center justify-center">
                  {theme === 'light' ? <Sun className="w-5 h-5 text-[#a87ffb]" /> : theme === 'dark' ? <Moon className="w-5 h-5 text-[#a87ffb]" /> : <Monitor className="w-5 h-5 text-[#a87ffb]" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors">Interface Theme</h3>
                  <p className="text-xs text-gray-500">Switch between dark, light, and system standard.</p>
                </div>
              </div>
              <div className="flex bg-gray-100 dark:bg-[#0a0a0d] border border-gray-200 dark:border-[#1a1a24] transition-colors rounded-lg p-1">
                <button onClick={() => setTheme('light')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-[#1c1c24] text-gray-900 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-[#2a2a35]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Light</button>
                <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${theme === 'dark' ? 'bg-white dark:bg-[#1c1c24] text-gray-900 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-[#2a2a35]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Dark</button>
                <button onClick={() => setTheme('system')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${theme === 'system' ? 'bg-white dark:bg-[#1c1c24] text-gray-900 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-[#2a2a35]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>System</button>
              </div>
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <div className="mb-20">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">Account & Security</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 transition-colors">Manage your account access and sessions.</p>

          <div className="bg-white dark:bg-[#101014] border border-gray-200 dark:border-[#1a1a24] shadow-sm dark:shadow-none transition-colors rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">Sign Out</h3>
                  <p className="text-xs text-gray-500">Safely log out of your DevMentor AI account.</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full sm:w-auto px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl font-bold transition-all"
              >
                Logout Now
              </button>
            </div>

            {/* Push Notifications */}
            {/* <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-[#1a1a24] transition-colors flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#4dbacc]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors">Push Notifications</h3>
                  <p className="text-xs text-gray-500">Receive alerts about your career progress.</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-[#a87ffb] rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div> */}

            {/* Weekly Digest */}
            {/* <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-[#1a1a24] transition-colors flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#f472b6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors">Weekly Digest</h3>
                  <p className="text-xs text-gray-500">A summary of your AI mentor's weekly advice.</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-[#2a2a35] rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
              </div>
            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
