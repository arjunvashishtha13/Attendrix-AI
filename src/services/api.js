import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('attendrix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error(
          'Cannot reach Attendrix API. Start the backend: cd backend && npm run dev (port 5000)'
        )
      );
    }
    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  enrollFace: (data) => api.post('/auth/enroll-face', data),
};

export const profileApi = {
  get: () => api.get('/profile/me'),
  update: (data) => api.patch('/profile/me', data),
  registerFace: (formData) =>
    api.post('/profile/face', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  searchUsers: (params) => api.get('/profile/users', { params }),
};

export const courseApi = {
  list: () => api.get('/courses'),
  get: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.patch(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id, studentId) => api.post(`/courses/${id}/enroll`, { studentId }),
};

export const sessionApi = {
  create: (data) => api.post('/sessions', data),
  getActive: (courseId) => api.get(`/sessions/active/${courseId}`),
  close: (id) => api.put(`/sessions/${id}/close`),
};

export const attendanceApi = {
  mine: () => api.get('/attendance/me'),
  byCourse: (courseId) => api.get(`/attendance/course/${courseId}`),
  mark: (data) => api.post('/attendance/mark', data),
  markLive: (data) => api.post('/attendance/mark-live', data),
  remind: (data) => api.post('/attendance/remind', data),
};

export const analyticsApi = {
  dashboard: (params) => api.get('/analytics/dashboard', { params }),
  admin: () => api.get('/analytics/admin'),
  teacherDashboard: (params) => api.get('/analytics/teacher-dashboard', { params }),
  students: (params) => api.get('/analytics/students', { params }),
};

export const exportApi = {
  csvUrl: (courseId) => `${API_BASE}/export/${courseId}/csv`,
  pdfUrl: (courseId) => `${API_BASE}/export/${courseId}/pdf`,
};

export const downloadWithAuth = async (url, filename) => {
  const token = localStorage.getItem('attendrix_token');
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default api;
