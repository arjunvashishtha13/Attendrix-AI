import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { profileApi } from '../../services/api';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await profileApi.searchUsers({ role: 'student', search });
        setStudents(data.users);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <DashboardLayout title="Students">
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-11"
          placeholder="Search by name, enrollment, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {students.map((s) => (
            <div key={s._id} className="card hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 font-bold text-attendrix-rose">
                  {(s.profile?.fullName || s.username).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{s.profile?.fullName || s.username}</p>
                  <p className="text-xs text-slate-500">{s.profile?.enrollmentNumber || s.email}</p>
                  <p className="text-xs text-slate-400">{s.profile?.branch}</p>
                </div>
              </div>
            </div>
          ))}
          {!students.length && (
            <p className="col-span-full text-center text-sm text-slate-400">No students found.</p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentsPage;
