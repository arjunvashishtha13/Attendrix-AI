import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { attendanceApi, courseApi } from '../../services/api';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [cRes, aRes] = await Promise.all([
        courseApi.get(id),
        attendanceApi.byCourse(id),
      ]);
      setCourse(cRes.data.course);
      setRecords(aRes.data.records);
      setLoading(false);
    };
    load();
  }, [id]);

  const markPresent = async (studentId) => {
    try {
      await attendanceApi.mark({ courseId: id, studentId, status: 'present' });
      toast.success('Attendance marked');
      const { data } = await attendanceApi.byCourse(id);
      setRecords(data.records);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <DashboardLayout title={course ? `${course.code} — ${course.name}` : 'Course'}>
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          <div className="card">
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick mark present</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.students?.map((s) => (
                <button key={s._id} onClick={() => markPresent(s._id)} className="btn-secondary text-xs">
                  {s.profile?.fullName || s.username}
                </button>
              ))}
            </div>
          </div>
          <AttendanceTable records={records} showConfidence />
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseDetailPage;
