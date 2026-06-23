import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  BookOpen,
  Users,
  UserCircle,
  BarChart3,
  LogOut,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
    isActive
      ? 'bg-attendrix-rose text-white shadow-lg shadow-rose-500/25'
      : 'text-slate-600 hover:bg-rose-50 hover:text-attendrix-rose dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-attendrix-rose-light'
  }`;

const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/attendance', label: 'My Attendance', icon: BookOpen },
    { to: '/webcam', label: 'AI Attendance', icon: Camera },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const teacherLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/verification-center', label: 'Verification Center', icon: Shield },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: BookOpen },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/verification', label: 'Verification Center', icon: Shield },
    { to: '/admin/settings', label: 'Settings', icon: Sparkles },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const links =
    user?.role === 'admin' ? adminLinks : user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-black">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src="/logo.png" alt="Attendrix AI Logo" className="h-10 w-10 rounded-xl object-contain" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Attendrix AI</p>
          <p className="text-xs text-slate-400 capitalize">{user?.role} portal</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onNavigate}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-attendrix-rose dark:hover:bg-slate-900"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
};

export default Sidebar;
