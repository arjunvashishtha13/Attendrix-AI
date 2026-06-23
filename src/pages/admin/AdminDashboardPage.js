import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { Users, Building2, BookOpen, Activity, ShieldCheck } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics/overview');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} color="blue" />
        <StatCard title="Total Teachers" value={stats?.totalTeachers || 0} icon={Users} color="indigo" />
        <StatCard title="Total Departments" value={stats?.totalDepartments || 0} icon={Building2} color="emerald" />
        <StatCard title="Total Courses" value={stats?.totalCourses || 0} icon={BookOpen} color="amber" />
        <StatCard title="Active Sessions" value={stats?.activeSessions || 0} icon={Activity} color="rose" />
        <StatCard title="Verification Success Rate" value={`${stats?.verificationSuccessRate || 0}%`} icon={ShieldCheck} color="teal" />
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <p className="text-sm text-slate-500 mb-6">Manage institution resources directly from here.</p>
        <div className="flex flex-wrap gap-4">
           {/* Add buttons or quick links here */}
           <Link to="/admin/users" className="btn-primary">Add New User</Link>
           <Link to="/admin/departments" className="btn-secondary">Create Department</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
