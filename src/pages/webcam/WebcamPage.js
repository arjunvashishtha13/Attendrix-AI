import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WebcamCapture from '../../components/attendance/WebcamCapture';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { courseApi, sessionApi } from '../../services/api';
import { AlertCircle } from 'lucide-react';

const WebcamPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    courseApi.list().then(({ data }) => {
      setCourses(data.courses);
      if (data.courses[0]) {
        setCourseId(data.courses[0]._id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (courseId) {
      setSessionLoading(true);
      sessionApi.getActive(courseId)
        .then(({ data }) => setActiveSession(data.session))
        .catch(() => setActiveSession(null))
        .finally(() => setSessionLoading(false));
    }
  }, [courseId]);

  return (
    <DashboardLayout title="AI Attendance">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="card">
            <label className="mb-1.5 block text-sm font-medium text-slate-500">Select course to check for active sessions</label>
            <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {sessionLoading ? (
            <LoadingSpinner label="Checking for active session..." />
          ) : activeSession ? (
            <WebcamCapture sessionId={activeSession._id} />
          ) : (
            <div className="card flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Session</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                The teacher has not started an attendance session for this course yet, or the session has expired.
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default WebcamPage;
