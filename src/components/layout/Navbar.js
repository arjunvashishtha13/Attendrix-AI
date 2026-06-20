import React from 'react';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onMenuClick, title }) => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-black/80 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-xs text-slate-400">AI-Powered Attendance Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="ml-2 hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 dark:border-slate-700 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-xs font-bold text-white">
            {(user?.profile?.fullName || user?.username || 'U').charAt(0)}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              {user?.profile?.fullName || user?.username}
            </p>
            <p className="text-[10px] capitalize text-slate-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
