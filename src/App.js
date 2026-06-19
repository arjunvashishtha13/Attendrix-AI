import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OAuthCallback from './pages/auth/OAuthCallback';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyAttendancePage from './pages/attendance/MyAttendancePage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import WebcamPage from './pages/webcam/WebcamPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrollFacePage from './pages/profile/EnrollFacePage';
import StudentsPage from './pages/students/StudentsPage';
import AdminPage from './pages/admin/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:!bg-slate-900 dark:!text-white',
              style: { borderRadius: '12px' },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute roles={['student']}>
                  <MyAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/webcam"
              element={
                <ProtectedRoute roles={['admin', 'teacher', 'student']}>
                  <WebcamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <StudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/enroll-face"
              element={
                <ProtectedRoute>
                  <EnrollFacePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
