import React, { useEffect, useState } from 'react';
import { Download, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatCard from '../../components/ui/StatCard';
import { MonthlyTrendChart, PresentAbsentPie, CourseBarChart, SessionBarChart } from '../../components/charts/AttendanceCharts';
import { analyticsApi, courseApi, attendanceApi, downloadWithAuth, exportApi } from '../../services/api';
import { Percent, UserCheck, UserX } from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (cid) => {
    setLoading(true);
    try {
      const [statsRes, coursesRes] = await Promise.all([
        analyticsApi.dashboard(cid ? { courseId: cid } : {}),
        courseApi.list(),
      ]);
      setStats(statsRes.data.stats);
      setCourses(coursesRes.data.courses);
      if (!cid && coursesRes.data.courses[0]) setCourseId(coursesRes.data.courses[0]._id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(courseId);
  }, [courseId]);

  const handleExport = async (type) => {
    if (!courseId) return toast.error('Select a course');
    try {
      const url = type === 'csv' ? exportApi.csvUrl(courseId) : exportApi.pdfUrl(courseId);
      await downloadWithAuth(url, `attendrix-report.${type}`);
      toast.success(`${type.toUpperCase()} exported`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleRemind = async () => {
    if (!courseId) return;
    const course = courses.find((c) => c._id === courseId);
    const studentId = course?.students?.[0];
    if (!studentId) return toast.error('No students enrolled');
    try {
      await attendanceApi.remind({ courseId, studentId: studentId._id || studentId });
      toast.success('Reminder sent (or queued)');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout title="Analytics">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1.5 block text-sm font-medium text-slate-500">Filter by course</label>
              <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => handleExport('csv')} className="btn-secondary">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="btn-secondary">
              <Download className="h-4 w-4" /> Export PDF
            </button>
            <button onClick={handleRemind} className="btn-primary">
              <Mail className="h-4 w-4" /> Send reminder
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Attendance %" value={`${stats?.attendancePercentage ?? 0}%`} icon={Percent} />
            <StatCard title="Present" value={stats?.present ?? 0} icon={UserCheck} accent="green" />
            <StatCard title="Absent" value={stats?.absent ?? 0} icon={UserX} accent="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyTrendChart data={stats?.monthlyTrends || []} />
            <PresentAbsentPie present={stats?.present} absent={stats?.absent} />
          </div>
          {courseId ? (
            <SessionBarChart data={stats?.sessionBreakdown || []} />
          ) : (
            <CourseBarChart data={stats?.courseBreakdown || []} />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AnalyticsPage;
