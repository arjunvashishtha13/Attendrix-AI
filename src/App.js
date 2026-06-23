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
import VerificationCenterPage from './pages/analytics/VerificationCenterPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import WebcamPage from './pages/webcam/WebcamPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrollFacePage from './pages/profile/EnrollFacePage';
import StudentsPage from './pages/students/StudentsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import DepartmentManagementPage from './pages/admin/DepartmentManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

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
              path="/verification-center"
              element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <VerificationCenterPage />
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
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute roles={['admin']}>
                  <DepartmentManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute roles={['admin']}>
                  {/* Reuse CoursesPage with Admin props or leave as placeholder for now */}
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verification"
              element={
                <ProtectedRoute roles={['admin']}>
                  {/* VerificationCenterPage already handles admin role */}
                  <VerificationCenterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminSettingsPage />
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
