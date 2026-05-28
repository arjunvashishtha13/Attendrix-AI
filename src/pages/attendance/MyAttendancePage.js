import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { attendanceApi } from '../../services/api';

const MyAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    attendanceApi.mine().then(({ data }) => {
      setRecords(data.records);
      setLoading(false);
    });
  }, []);

  const byCourse = records.reduce((acc, r) => {
    const code = r.course?.code || 'Unknown';
    if (!acc[code]) acc[code] = { course: r.course, records: [] };
    acc[code].records.push(r);
    return acc;
  }, {});

  return (
    <DashboardLayout title="My Attendance">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          {Object.entries(byCourse).map(([code, { course, records: recs }]) => {
            const present = recs.filter((r) => r.status === 'present').length;
            const pct = Math.round((present / (course?.totalSessions || 30)) * 100);
            return (
              <div key={code}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{course?.name}</h3>
                    <p className="text-sm text-slate-500">{code} · {pct}% attendance</p>
                  </div>
                  <button
                    className="text-sm font-semibold text-attendrix-rose hover:underline"
                    onClick={() => navigate('/dashboard')}
                  >
                    View analytics
                  </button>
                </div>
                <AttendanceTable records={recs} showConfidence />
              </div>
            );
          })}
          {!records.length && <AttendanceTable records={[]} />}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyAttendancePage;
