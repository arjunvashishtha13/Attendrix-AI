import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, accent = 'rose', onClick }) => {
  const accents = {
    rose: 'from-rose-500/20 to-rose-600/5 text-attendrix-rose',
    green: 'from-emerald-500/20 to-emerald-600/5 text-emerald-500',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-500',
    slate: 'from-slate-500/20 to-slate-600/5 text-slate-400',
  };

  return (
    <div onClick={onClick} className={`card group animate-fade-in hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl bg-gradient-to-br p-3 ${accents[accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
