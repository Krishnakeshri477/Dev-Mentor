import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ChatWindow from './components/ChatWindow';
import SignupPage from './components/SignupPage';
import AuthCallback from './components/AuthCallback';
import LoginModal from './components/LoginModal';
import SettingsPage from './components/SettingsPage';
import ResumePage from './components/ResumePage';
import DashboardPage from './components/DashboardPage';
import JobPage from './components/JobPage';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ChatWindow />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/job" element={<JobPage />} />
      </Route>
      
      {/* Pages without MainLayout */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/login" element={<LoginModal />} />
    </Routes>
  );
};

export default App;