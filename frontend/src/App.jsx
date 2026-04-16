import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SignupPage from './components/SignupPage';
import AuthCallback from './components/AuthCallback';
import LoginModal from './components/LoginModal';
import SettingsPage from './components/SettingsPage';
import ResumePage from './components/ResumePage';
import DashboardPage from './components/DashboardPage';
import JobPage from './components/JobPage';

const DashboardLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="flex font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      <Sidebar onRequiresLogin={() => setShowLogin(true)} />
      <DashboardPage onRequiresLogin={() => setShowLogin(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const ChatLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="flex font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      <Sidebar onRequiresLogin={() => setShowLogin(true)} />
      <ChatWindow onRequiresLogin={() => setShowLogin(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const SettingsLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="flex font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      <Sidebar onRequiresLogin={() => setShowLogin(true)} />
      <SettingsPage />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const ResumeLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="flex font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      <Sidebar onRequiresLogin={() => setShowLogin(true)} />
      <ResumePage onRequiresLogin={() => setShowLogin(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const JobLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="flex font-sans h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden text-gray-900 dark:text-gray-200 relative transition-colors duration-200">
      <Sidebar onRequiresLogin={() => setShowLogin(true)} />
      <JobPage onRequiresLogin={() => setShowLogin(true)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/login" element={<LoginModal />} />
      <Route path="/settings" element={<SettingsLayout />} />
      <Route path="/resume" element={<ResumeLayout />} />
      <Route path="/job" element={<JobLayout />} />
    </Routes>
  );
};

export default App;