import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import LoginModal from './LoginModal';
import { AuthContext } from '../context/AuthContext';

const MainLayout = ({ onRequiresLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useContext(AuthContext);

  const handleRequiresLogin = () => {
    setShowLogin(true);
    if (onRequiresLogin) onRequiresLogin();
  };

  return (
    <div className="flex flex-col lg:flex-row font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      
      {/* Guest Intercept Overlay */}
      {!user && !showLogin && (
        <div 
          onClick={handleRequiresLogin}
          className="fixed inset-0 z-[45] cursor-pointer bg-black/5 backdrop-blur-[2px] active:bg-black/10 transition-all duration-300 flex items-center justify-center group"
        >
          <div className="bg-white/90 dark:bg-[#0f0f13]/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 px-6 py-3 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
             <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Login to Access Features</span>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar onRequiresLogin={handleRequiresLogin} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-full bg-gray-50 dark:bg-[#0A0A0A]">
        {/* Mobile Header (Optional, for logo/profile) */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-[#070707] border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-black">AI</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">DevMentor</h1>
          </div>
        </div>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 scrollbar-hide">
          <Outlet context={{ onRequiresLogin: handleRequiresLogin }} />
        </div>
      </main>

      {/* Bottom Bar - Mobile/Tablet Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomBar onRequiresLogin={handleRequiresLogin} />
      </div>

      {/* Global Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default MainLayout;
