import React, { useContext } from 'react';
import { MessageSquare, LayoutDashboard, FileText, Search, Settings, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BottomBar = ({ onRequiresLogin }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { icon: MessageSquare, label: 'Chat', path: '/' },
    { icon: LayoutDashboard, label: 'Dash', path: '/dashboard' },
    { icon: FileText, label: 'Resume', path: '/resume' },
    { icon: Search, label: 'Job', path: '/job' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleAction = (e, path) => {
    if (!user && onRequiresLogin) {
      // Allow viewing landing pages if applicable, but for this app most need login
      // Adjust logic if some pages are public
      if (path !== '/' && path !== '/signup') {
         e.preventDefault();
         onRequiresLogin();
      }
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-[#070707]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-2 py-3 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              to={item.path}
              onClick={(e) => handleAction(e, item.path)}
              key={index}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400 scale-110' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
              )}
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-purple-500/10' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomBar;
