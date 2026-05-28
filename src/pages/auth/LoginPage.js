import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back to Attendrix AI');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-black">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-attendrix-rose text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to Attendrix AI</h1>
          <p className="mt-1 text-sm text-slate-500">AI-Powered Attendance Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
            <input
              className="input-field"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="teacher"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field pr-12"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Signing in..." />
          ) : (
            <button type="submit" className="btn-primary w-full">Sign in</button>
          )}

          <p className="text-center text-sm text-slate-500">
            No account? <Link to="/register" className="font-semibold text-attendrix-rose hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-slate-400">
            Demo: teacher/teacher123 · student/student123 · admin/admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
