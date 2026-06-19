import React, { useEffect, useState, useRef } from 'react';
import { Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { profileApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setForm({
        fullName: user.profile.fullName || '',
        enrollmentNumber: user.profile.enrollmentNumber || '',
        branch: user.profile.branch || '',
        employeeId: user.profile.employeeId || '',
        phone: user.profile.phone || '',
        year: user.profile.year || 1,
        semester: user.profile.semester || 1,
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update(form);
      await refreshUser();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFaceUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      await profileApi.registerFace(fd);
      toast.success('Face registered for AI attendance');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout title="Profile">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="card flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-2xl font-bold text-white">
            {(form.fullName || user.username).charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{form.fullName || user.username}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-attendrix-rose">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="card space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Personal information</h3>
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium capitalize text-slate-500">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                className="input-field"
                value={value}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          {saving ? (
            <LoadingSpinner label="Saving..." />
          ) : (
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Save changes
            </button>
          )}
        </form>

        {user.role === 'student' && (
          <div className="card border-2 border-attendrix-rose/20 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-900/10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  Face Enrollment Status
                  {user.hasEnrolledFace ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Enrolled</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">Pending</span>
                  )}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {user.hasEnrolledFace 
                    ? 'Your facial features are securely stored for AI attendance verification.'
                    : 'You must enroll your face to mark attendance in class.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = '/profile/enroll-face'}
              className="btn-primary mt-4"
            >
              <Camera className="h-4 w-4" />
              {user.hasEnrolledFace ? 'Re-enroll Face' : 'Start Face Enrollment'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
