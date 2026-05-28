import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    if (role === 'student') {
      navigate('/student');
    } else if (role === 'faculty') {
      navigate('/facultyprofile');
    }
  };

  return (
    <div className="main-page">
      <div className="main-container">
        <div className="title">
          <h1>IITR Attendance Portal</h1>
        </div>
        <div className="box-container">
          <div className="box" onClick={() => navigate('/loginp')}>
            <span>Faculty</span>
          </div>
          <div className="box" onClick={() => navigate('/login')}>
            <span>Students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
