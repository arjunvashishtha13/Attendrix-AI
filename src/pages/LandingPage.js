import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const LandingPage = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Attendrix AI Logo" className="h-10 w-10 rounded-xl object-contain shadow-sm" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">Attendrix AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/login" className="btn-secondary hidden sm:inline-flex">Sign in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-24 pt-12 lg:pt-20">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-rose-600/10 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-attendrix-rose dark:border-rose-900 dark:bg-rose-950/50">
              <Sparkles className="h-3 w-3" /> AI-Powered Attendance Platform
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Attendance intelligence{' '}
              <span className="bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                built for modern teams
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Attendrix AI combines facial recognition, real-time analytics, and automated reminders —
              so teachers focus on teaching, not spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary">View demo</Link>
            </div>
          </div>

          <div className="card relative animate-fade-in border-rose-200/50 bg-gradient-to-br from-white to-rose-50 dark:from-slate-900 dark:to-black">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Camera, title: 'Webcam AI', desc: 'Mark attendance in seconds with confidence scoring' },
                { icon: BarChart3, title: 'Analytics', desc: 'Trends, percentages, and exportable reports' },
                { icon: Shield, title: 'Role-based', desc: 'Admin, teacher, and student portals' },
                { icon: Sparkles, title: 'Smart alerts', desc: 'Email reminders when attendance drops' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
                  <Icon className="mb-2 h-5 w-5 text-attendrix-rose" />
                  <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-1 text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
