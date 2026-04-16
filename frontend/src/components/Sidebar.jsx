import React, { useContext } from 'react';
import { MessageSquare, LayoutDashboard, FileText, Search, Settings, HelpCircle, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onRequiresLogin }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { icon: MessageSquare, label: 'Chat', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Resume', path: '/resume' },
    { icon: Search, label: 'Job', path: '/job' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleAction = (e, path) => {
    if (!user && onRequiresLogin) {
      e.preventDefault();
      onRequiresLogin();
    }
  };

  return (
    <aside className="w-64 h-screen bg-gray-50 dark:bg-[#070707] border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between shrink-0 z-10 transition-colors duration-200">
      <div className="p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide transition-colors">DevMentor <span className="text-purple-500">AI</span></h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Premium AI Mentor</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                onClick={(e) => handleAction(e, item.path)}
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-purple-600/10 text-purple-400 shadow-[0_0_10px_rgba(124,58,237,0.1)]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6">
        <div className="space-y-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6 transition-colors">
          {user && (
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:text-rose-400 transition-colors mt-2">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>

        {/* User Profile / Login Prompt */}
        {user ? (
          <div className="flex items-center gap-3 px-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden ring-2 ring-gray-200 dark:ring-gray-800 flex items-center justify-center text-white font-bold">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </h4>
              <span className="text-xs text-purple-400 font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">Pro Member</span>
            </div>
          </div>
        ) : (
          <button onClick={onRequiresLogin} className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-700 text-left">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">Guest Mode</h4>
              <span className="text-xs text-gray-500 font-medium">Click to Login</span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
