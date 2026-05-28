import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#e11d48', '#64748b', '#f59e0b'];

export const MonthlyTrendChart = ({ data = [] }) => (
  <div className="card h-80">
    <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Monthly Trends</h3>
    <ResponsiveContainer width="100%" height="85%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff' }} />
        <Area type="monotone" dataKey="present" stroke="#e11d48" fill="url(#presentGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="absent" stroke="#64748b" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const CourseBarChart = ({ data = [] }) => (
  <div className="card h-80">
    <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Attendance by Course</h3>
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
        <XAxis dataKey="course" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff' }} />
        <Bar dataKey="percentage" fill="#e11d48" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PresentAbsentPie = ({ present = 0, absent = 0 }) => {
  const data = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ].filter((d) => d.value > 0);

  return (
    <div className="card h-80">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Present vs Absent</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
