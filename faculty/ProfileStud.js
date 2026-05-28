import React from 'react';
import './ProfileStud.css';

function ProfileStud() {
  return (
    <div className="profile-container container-custom">
      <div className="profile-info">
        <img src="profile-pic-url" alt="Profile" className="profile-picture" />
        <h1>Student Name</h1>
      </div>
      <div className="profile-details">
        <p>Enrollment Number: 123456</p>
        <p>Semester: 5</p>
        <p>Year: 2024</p>
        <p>Email ID: student@example.com</p>
        <p>Branch: Computer Science</p>
      </div>
    </div>
  );
}

export default ProfileStud;
