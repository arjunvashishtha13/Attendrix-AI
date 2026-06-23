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
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all_time');

  const load = async (cid) => {
    setLoading(true);
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

      const [statsRes, coursesRes, studentsRes] = await Promise.all([
        analyticsApi.dashboard(cid ? { ...params, courseId: cid } : params),
        courseApi.list(),
        analyticsApi.students({ courseId: cid, sort: 'attendancePercentage', order: 'asc', ...params }).catch(() => ({ data: { students: [] } }))
      ]);
      setStats(statsRes.data.stats);
      setCourses(coursesRes.data.courses);
      setStudents(studentsRes.data.students || []);
      if (!cid && coursesRes.data.courses[0]) setCourseId(coursesRes.data.courses[0]._id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, dateFilter]);

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

  const handleRemind = async (studentId) => {
    if (!courseId) return;
    try {
      await attendanceApi.remind({ courseId, studentId });
      toast.success('Reminder sent');
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
            <div className="flex-1 min-w-[150px]">
              <label className="mb-1.5 block text-sm font-medium text-slate-500">Filter by date</label>
              <select className="input-field" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="all_time">All Time</option>
                <option value="today">Today</option>
                <option value="7_days">Last 7 Days</option>
                <option value="30_days">Last 30 Days</option>
              </select>
            </div>
            <button onClick={() => handleExport('csv')} className="btn-secondary">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="btn-secondary">
              <Download className="h-4 w-4" /> Export PDF
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

          {courseId && students.length > 0 && (
            <div className="card mt-8 overflow-hidden p-0">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Students at Risk</h3>
                  <p className="text-sm text-slate-500 mt-1">Students with attendance below 75%</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 font-semibold">Student Name</th>
                      <th className="px-6 py-4 font-semibold">Attendance %</th>
                      <th className="px-6 py-4 font-semibold">Present / Absent</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {students.filter(s => s.attendancePercentage < 75).map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {student.profile?.fullName || student.username}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold">
                            {student.attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          <span className="text-emerald-600 font-medium">{student.present}</span> / <span className="text-rose-600 font-medium">{student.absent}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemind(student._id)}
                            className="btn-secondary py-1.5 px-3 text-xs"
                          >
                            <Mail className="w-3.5 h-3.5 mr-1" /> Warn
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.filter(s => s.attendancePercentage < 75).length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                          No students are currently at risk.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AnalyticsPage;
