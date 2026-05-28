import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { analyticsApi } from '../../services/api';
import { BookOpen, Users, Percent } from 'lucide-react';

const AdminPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.admin().then(({ data }) => {
      setOverview(data.overview);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout title="Admin Panel">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Total Courses" value={overview?.courses ?? 0} icon={BookOpen} />
            <StatCard title="Attendance Records" value={overview?.attendanceRecords ?? 0} icon={Users} accent="slate" />
            <StatCard title="Platform Rate" value={`${overview?.platformAttendanceRate ?? 0}%`} icon={Percent} accent="green" />
          </div>

          <div className="card">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Recent courses</h3>
            <div className="space-y-3">
              {overview?.recentCourses?.map((c) => (
                <div key={c._id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{c.code}</p>
                    <p className="text-sm text-slate-500">{c.name}</p>
                  </div>
                  <p className="text-xs text-slate-400">{c.teacher?.profile?.fullName || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPage;
