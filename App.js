import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentsPage from './pages/StudentsPage';
import ViewAttendance from './pages/ViewAttendance';
import CourseDetails from './pages/CourseDetails';
import Profile from './faculty/Profile';
import ApplyAttendance from './faculty/ApplyAttendance';
import ManageCourses from './faculty/ManageCourses';
import StudentSearch from './faculty/StudentSearch';
import LoginPageP from './faculty/LoginPageP';
import ProfileStud from "./faculty/ProfileStud";
import ViewAttendanceP from "./faculty/ViewAttendanceP";
import CourseAttendance from "./faculty/CourseAttendance";
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <button
          className="theme-toggle-button"
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/viewattendance" element={<ViewAttendance />} />
          <Route path="/course-details" element={<CourseDetails />} />
          <Route path="/" element={<ViewAttendance />}/>
          <Route path="/facultyprofile" element={<Profile />} />
          <Route path="/applyattendance" element={<ApplyAttendance />} />
          <Route path="/courses" element={<ManageCourses />} />
          <Route path="/search" element={<StudentSearch />} />
          <Route path="/loginp" element={<LoginPageP />} />
          <Route path="/studentprofile/:studentId" element={<ProfileStud />} />
          <Route path="/faculty/viewattendanceP" element={<ViewAttendanceP />} />
          <Route path="/courses/:courseCode" element={<CourseAttendance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
