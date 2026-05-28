import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WebcamCapture from '../../components/attendance/WebcamCapture';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { courseApi } from '../../services/api';

const WebcamPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.list().then(({ data }) => {
      setCourses(data.courses);
      if (data.courses[0]) setCourseId(data.courses[0]._id);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout title="AI Attendance">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-500">Select course session</label>
            <select className="input-field" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          <WebcamCapture courseId={courseId} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default WebcamPage;
