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

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, attRes] = await Promise.all([
          analyticsApi.dashboard(),
          user.role === 'student' ? attendanceApi.mine() : Promise.resolve({ data: { records: [] } }),
        ]);
        setStats(statsRes.data.stats);
        setRecords(attRes.data.records?.slice(0, 8) || statsRes.data.stats.recentRecords || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.role]);

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Attendance %" value={`${stats?.attendancePercentage ?? 0}%`} icon={Percent} />
          <StatCard title="Present" value={stats?.present ?? 0} icon={UserCheck} accent="green" />
          <StatCard title="Absent" value={stats?.absent ?? 0} icon={UserX} accent="amber" />
          <StatCard title="Total Records" value={stats?.total ?? 0} icon={TrendingUp} accent="slate" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyTrendChart data={stats?.monthlyTrends || []} />
          </div>
          <PresentAbsentPie present={stats?.present} absent={stats?.absent} />
        </div>

        <CourseBarChart data={stats?.courseBreakdown || []} />

        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recent Attendance</h2>
          <AttendanceTable records={records} showConfidence />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
