import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    fullName: '',
    enrollmentNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        profile: {
          fullName: form.fullName,
          enrollmentNumber: form.enrollmentNumber,
        },
      });
      toast.success('Account created — welcome to Attendrix AI');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-attendrix-rose text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="card grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Role</label>
            <select
              className="input-field"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          {['username', 'email', 'fullName', 'enrollmentNumber'].map((field) => (
            <div key={field} className={field === 'email' ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                className="input-field"
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={['username', 'email', 'password'].includes(field)}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {loading ? (
            <div className="sm:col-span-2"><LoadingSpinner label="Creating account..." /></div>
          ) : (
            <button type="submit" className="btn-primary sm:col-span-2 w-full">Create account</button>
          )}
          <p className="sm:col-span-2 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-attendrix-rose hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
