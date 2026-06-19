import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { courseApi } from '../../services/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', name: '', schedule: '' });

  const load = async () => {
    const { data } = await courseApi.list();
    setCourses(data.courses);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await courseApi.create(form);
      toast.success('Course created');
      setForm({ code: '', name: '', schedule: '' });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseApi.delete(id);
      toast.success('Course deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="Courses">
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          <form onSubmit={handleCreate} className="card grid gap-4 sm:grid-cols-4">
            <input className="input-field" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <input className="input-field sm:col-span-2" placeholder="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <button type="submit" className="btn-primary">
              {(!form.code && !form.name) && <Plus className="h-4 w-4" />} 
              {(!form.code && !form.name) ? 'Add' : 'Save Course'}
            </button>
          </form>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((c) => (
              <div key={c._id} className="card group hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-attendrix-rose">{c.code}</p>
                    <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{c.students?.length || 0} students enrolled</p>
                  </div>
                  <button onClick={() => handleDelete(c._id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <Link to={`/courses/${c._id}`} className="mt-4 inline-block text-sm font-semibold text-attendrix-rose hover:underline">
                  View attendance →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoursesPage;
