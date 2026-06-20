import React, { useEffect, useState } from 'react';
import { Percent, UserCheck, UserX, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { MonthlyTrendChart, CourseBarChart, PresentAbsentPie } from '../../components/charts/AttendanceCharts';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import { analyticsApi, attendanceApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState('all_time');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (dateFilter !== 'all_time') {
          const end = new Date();
          const start = new Date();
          if (dateFilter === 'today') {
            start.setHours(0,0,0,0);
          } else if (dateFilter === '7_days') {
            start.setDate(start.getDate() - 7);
          } else if (dateFilter === '30_days') {
            start.setDate(start.getDate() - 30);
          }
          params.startDate = start.toISOString();
          params.endDate = end.toISOString();
        }

        const [statsRes, teacherRes, attRes] = await Promise.all([
          analyticsApi.dashboard(params),
          user.role === 'teacher' ? analyticsApi.teacherDashboard(params) : Promise.resolve({ data: { stats: {} } }),
          user.role === 'student' ? attendanceApi.mine() : Promise.resolve({ data: { records: [] } }),
        ]);
        setStats({ ...statsRes.data.stats, ...teacherRes.data.stats });
        setRecords(attRes.data.records?.slice(0, 8) || statsRes.data.stats.recentRecords || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role, dateFilter]);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Welcome, ${user.profile?.fullName || user.username}`}>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overview</h2>
          <select 
            className="input-field max-w-xs" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all_time">All Time</option>
            <option value="today">Today</option>
            <option value="7_days">Last 7 Days</option>
            <option value="30_days">Last 30 Days</option>
          </select>
        </div>
        {user.role === 'teacher' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={UserCheck} accent="blue" />
            <StatCard title="Active Courses" value={stats?.activeCourses ?? 0} icon={TrendingUp} accent="slate" />
            <StatCard title="Total Sessions" value={stats?.totalSessions ?? 0} icon={TrendingUp} accent="slate" />
            <StatCard title="Students At Risk" value={stats?.studentsAtRisk ?? 0} icon={UserX} accent="rose" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Attendance %" value={`${stats?.attendancePercentage ?? 0}%`} icon={Percent} />
            <StatCard title="Present" value={stats?.present ?? 0} icon={UserCheck} accent="green" />
            <StatCard title="Absent" value={stats?.absent ?? 0} icon={UserX} accent="amber" />
            <StatCard title="Total Records" value={stats?.total ?? 0} icon={TrendingUp} accent="slate" />
          </div>
        )}

        {user.role !== 'teacher' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <MonthlyTrendChart data={stats?.monthlyTrends || []} />
            </div>
            <PresentAbsentPie present={stats?.present} absent={stats?.absent} />
          </div>
        )}
        
        {user.role === 'teacher' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyTrendChart data={stats?.monthlyTrends || []} />
            <CourseBarChart data={stats?.courseBreakdown || []} />
          </div>
        )}

        {user.role !== 'teacher' && (
          <CourseBarChart data={stats?.courseBreakdown || []} />
        )}

        {user.role !== 'teacher' && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <AttendanceTable records={records} showConfidence hideStudent={true} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
